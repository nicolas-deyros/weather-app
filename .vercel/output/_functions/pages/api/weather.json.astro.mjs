export { renderers } from '../../renderers.mjs';

const prerender = false;
const weatherCodeToIcon = {
  0: { icon: "meteocons:clear-day-fill", description: "Clear sky" },
  1: {
    icon: "meteocons:partly-cloudy-day-fill",
    description: "Mainly clear"
  },
  2: {
    icon: "meteocons:partly-cloudy-day-fill",
    description: "Partly cloudy"
  },
  3: { icon: "meteocons:overcast-fill", description: "Overcast" },
  45: { icon: "meteocons:fog-fill", description: "Fog" },
  48: { icon: "meteocons:fog-fill", description: "Depositing rime fog" },
  51: { icon: "meteocons:drizzle-fill", description: "Light drizzle" },
  53: { icon: "meteocons:drizzle-fill", description: "Moderate drizzle" },
  55: { icon: "meteocons:drizzle-fill", description: "Dense drizzle" },
  56: { icon: "meteocons:sleet-fill", description: "Light freezing drizzle" },
  57: { icon: "meteocons:sleet-fill", description: "Dense freezing drizzle" },
  61: { icon: "meteocons:rain-fill", description: "Slight rain" },
  63: { icon: "meteocons:rain-fill", description: "Moderate rain" },
  65: { icon: "meteocons:rain-fill", description: "Heavy rain" },
  66: { icon: "meteocons:sleet-fill", description: "Light freezing rain" },
  67: { icon: "meteocons:sleet-fill", description: "Heavy freezing rain" },
  71: { icon: "meteocons:snow-fill", description: "Slight snow fall" },
  73: { icon: "meteocons:snow-fill", description: "Moderate snow fall" },
  75: { icon: "meteocons:snow-fill", description: "Heavy snow fall" },
  77: { icon: "meteocons:snow-fill", description: "Snow grains" },
  80: { icon: "meteocons:rain-fill", description: "Slight rain showers" },
  81: { icon: "meteocons:rain-fill", description: "Moderate rain showers" },
  82: { icon: "meteocons:rain-fill", description: "Violent rain showers" },
  85: { icon: "meteocons:snow-fill", description: "Slight snow showers" },
  86: { icon: "meteocons:snow-fill", description: "Heavy snow showers" },
  95: { icon: "meteocons:thunderstorms-fill", description: "Thunderstorm" },
  96: {
    icon: "meteocons:thunderstorms-rain-fill",
    description: "Thunderstorm with slight hail"
  },
  99: {
    icon: "meteocons:thunderstorms-rain-fill",
    description: "Thunderstorm with heavy hail"
  }
};
function findClosestCity(latitude, longitude) {
  const majorCities = [
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Toronto", lat: 43.6532, lon: -79.3832 },
    { name: "Madrid", lat: 40.4168, lon: -3.7038 },
    { name: "Berlin", lat: 52.52, lon: 13.405 },
    { name: "Rome", lat: 41.9028, lon: 12.4964 },
    { name: "Barcelona", lat: 41.3851, lon: 2.1734 },
    { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
    { name: "Chicago", lat: 41.8781, lon: -87.6298 },
    { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
    { name: "Miami", lat: 25.7617, lon: -80.1918 }
  ];
  let closestCity = "Unknown Location";
  let minDistance = Infinity;
  for (const city of majorCities) {
    const distance = Math.sqrt(
      Math.pow(latitude - city.lat, 2) + Math.pow(longitude - city.lon, 2)
    );
    if (distance < minDistance && distance < 1) {
      minDistance = distance;
      closestCity = city.name;
    }
  }
  return closestCity;
}
const GET = async ({ url }) => {
  try {
    const latParam = url.searchParams.get("lat") || "51.5074";
    const lonParam = url.searchParams.get("lon") || "-0.1278";
    const latitude = parseFloat(latParam);
    const longitude = parseFloat(lonParam);
    if (isNaN(latitude) || isNaN(longitude)) {
      return new Response(
        JSON.stringify({
          error: "Invalid coordinates",
          message: "Latitude and longitude must be valid numbers"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return new Response(
        JSON.stringify({
          error: "Invalid coordinate range",
          message: "Latitude must be between -90 and 90, longitude between -180 and 180"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
    apiUrl.searchParams.set("latitude", latitude.toString());
    apiUrl.searchParams.set("longitude", longitude.toString());
    apiUrl.searchParams.set("current", "temperature_2m,weather_code");
    apiUrl.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,weather_code"
    );
    apiUrl.searchParams.set("timezone", "auto");
    apiUrl.searchParams.set("forecast_days", "4");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1e4);
    let response;
    let data;
    try {
      response = await fetch(apiUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "WeatherApp/1.0"
        }
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Weather API fetch error:", fetchError);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return new Response(
          JSON.stringify({
            error: "Request timeout",
            message: "Weather API request timed out"
          }),
          {
            status: 504,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
      return new Response(
        JSON.stringify({
          error: "Network error",
          message: "Failed to connect to weather service"
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    if (!response.ok) {
      console.error(
        `Weather API HTTP error: ${response.status} ${response.statusText}`
      );
      return new Response(
        JSON.stringify({
          error: "Weather service error",
          message: `Weather API returned status ${response.status}`
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Weather API JSON parse error:", jsonError);
      return new Response(
        JSON.stringify({
          error: "Invalid response",
          message: "Weather API returned invalid data"
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    if (!data || typeof data !== "object" || !data.current || !data.daily) {
      console.error("Invalid weather data structure:", data);
      return new Response(
        JSON.stringify({
          error: "Invalid data structure",
          message: "Weather API returned malformed data"
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    let cityName = "Unknown Location";
    try {
      console.log(
        `Attempting reverse geocoding for lat=${latitude}, lon=${longitude}`
      );
      const geocodeController = new AbortController();
      const geocodeTimeoutId = setTimeout(() => geocodeController.abort(), 5e3);
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=10`,
        {
          signal: geocodeController.signal,
          headers: {
            "User-Agent": "WeatherApp/1.0 (weather-app@example.com)",
            Accept: "application/json"
          }
        }
      );
      clearTimeout(geocodeTimeoutId);
      console.log(`Geocoding response status: ${geocodeResponse.status}`);
      if (geocodeResponse.ok) {
        const geocodeText = await geocodeResponse.text();
        console.log("Raw geocoding response:", geocodeText);
        try {
          const geocodeData = JSON.parse(geocodeText);
          console.log(
            "Parsed geocoding data:",
            JSON.stringify(geocodeData, null, 2)
          );
          cityName = geocodeData.address?.city || geocodeData.address?.town || geocodeData.address?.village || geocodeData.address?.municipality || geocodeData.address?.county || geocodeData.address?.state || geocodeData.display_name?.split(",")[0]?.trim() || "Unknown Location";
          console.log(`Resolved city name: ${cityName}`);
        } catch (parseError) {
          console.error("Failed to parse geocoding response:", parseError);
          cityName = findClosestCity(latitude, longitude);
          if (cityName === "Unknown Location") {
            cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
          }
        }
      } else {
        console.error(`Geocoding API error: ${geocodeResponse.status}`);
        cityName = findClosestCity(latitude, longitude);
        if (cityName === "Unknown Location") {
          cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        }
      }
    } catch (geocodeError) {
      console.warn("Reverse geocoding failed:", geocodeError);
      cityName = findClosestCity(latitude, longitude);
      if (cityName === "Unknown Location") {
        cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }
    }
    const currentWeatherCode = data.current?.weather_code ?? 0;
    const currentTemp = data.current?.temperature_2m ?? 0;
    const currentWeather = weatherCodeToIcon[currentWeatherCode] || {
      icon: "meteocons:clear-day-fill",
      description: "Unknown"
    };
    const dailyForecast = [];
    if (data.daily?.time && Array.isArray(data.daily.time) && data.daily.time.length > 1) {
      const dailyData = data.daily.time.slice(1, 4).map((time, index) => {
        const dataIndex = index + 1;
        const weatherCode = data.daily.weather_code?.[dataIndex] ?? 0;
        const maxTemp = data.daily.temperature_2m_max?.[dataIndex] ?? 0;
        const minTemp = data.daily.temperature_2m_min?.[dataIndex] ?? 0;
        const weather = weatherCodeToIcon[weatherCode] || {
          icon: "meteocons:clear-day-fill",
          description: "Unknown"
        };
        const date = new Date(time);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        return {
          date: time,
          day: dayName,
          maxTemp: Math.round(maxTemp),
          minTemp: Math.round(minTemp),
          weatherCode,
          icon: weather.icon,
          description: weather.description
        };
      });
      dailyForecast.push(...dailyData);
    }
    while (dailyForecast.length < 3) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + dailyForecast.length + 1);
      dailyForecast.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        maxTemp: Math.round(currentTemp + Math.random() * 5 - 2.5),
        // Fallback with slight variation
        minTemp: Math.round(currentTemp - Math.random() * 5 - 2.5),
        weatherCode: currentWeatherCode,
        icon: currentWeather.icon,
        description: currentWeather.description
      });
    }
    const weatherData = {
      location: {
        latitude: data.latitude ?? latitude,
        longitude: data.longitude ?? longitude,
        city: cityName
      },
      current: {
        time: data.current?.time ?? (/* @__PURE__ */ new Date()).toISOString(),
        temperature: Math.round(currentTemp),
        weatherCode: currentWeatherCode,
        icon: currentWeather.icon,
        description: currentWeather.description
      },
      daily: dailyForecast
    };
    return new Response(JSON.stringify(weatherData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
        // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error("Weather API error:", error);
    const errorResponse = {
      error: "Failed to fetch weather data",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
