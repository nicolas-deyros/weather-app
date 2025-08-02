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
    const latitude = url.searchParams.get("lat") || "51.5074";
    const longitude = url.searchParams.get("lon") || "-0.1278";
    const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
    apiUrl.searchParams.set("latitude", latitude);
    apiUrl.searchParams.set("longitude", longitude);
    apiUrl.searchParams.set("current", "temperature_2m,weather_code");
    apiUrl.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,weather_code"
    );
    apiUrl.searchParams.set("timezone", "auto");
    apiUrl.searchParams.set("forecast_days", "4");
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();
    let cityName = "Unknown Location";
    try {
      console.log(
        `Attempting reverse geocoding for lat=${latitude}, lon=${longitude}`
      );
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=10`,
        {
          headers: {
            "User-Agent": "WeatherApp/1.0 (weather-app@example.com)",
            Accept: "application/json"
          }
        }
      );
      console.log(`Geocoding response status: ${geocodeResponse.status}`);
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        console.log("Geocoding data:", JSON.stringify(geocodeData, null, 2));
        cityName = geocodeData.address?.city || geocodeData.address?.town || geocodeData.address?.village || geocodeData.address?.municipality || geocodeData.address?.county || geocodeData.address?.state || geocodeData.display_name?.split(",")[0]?.trim() || "Unknown Location";
        console.log(`Resolved city name: ${cityName}`);
      } else {
        console.error(`Geocoding API error: ${geocodeResponse.status}`);
        cityName = findClosestCity(parseFloat(latitude), parseFloat(longitude));
        if (cityName === "Unknown Location") {
          cityName = `${parseFloat(latitude).toFixed(2)}, ${parseFloat(longitude).toFixed(2)}`;
        }
      }
    } catch (geocodeError) {
      console.warn("Reverse geocoding failed:", geocodeError);
      cityName = findClosestCity(parseFloat(latitude), parseFloat(longitude));
      if (cityName === "Unknown Location") {
        cityName = `${parseFloat(latitude).toFixed(2)}, ${parseFloat(longitude).toFixed(2)}`;
      }
    }
    const currentWeatherCode = data.current.weather_code;
    const currentWeather = weatherCodeToIcon[currentWeatherCode] || {
      icon: "meteocons:clear-day-fill",
      description: "Unknown"
    };
    const dailyForecast = data.daily.time.slice(1).map((time, index) => {
      const dataIndex = index + 1;
      const weatherCode = data.daily.weather_code[dataIndex];
      const weather = weatherCodeToIcon[weatherCode] || {
        icon: "meteocons:clear-day-fill",
        description: "Unknown"
      };
      const date = new Date(time);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        time,
        day: dayName,
        maxTemp: Math.round(data.daily.temperature_2m_max[dataIndex]),
        minTemp: Math.round(data.daily.temperature_2m_min[dataIndex]),
        weatherCode,
        icon: weather.icon,
        description: weather.description
      };
    });
    const weatherData = {
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        city: cityName
      },
      current: {
        time: data.current.time,
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: currentWeatherCode,
        icon: currentWeather.icon,
        description: currentWeather.description
      },
      daily: dailyForecast
    };
    return new Response(JSON.stringify(weatherData), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch weather data",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
