export { renderers } from '../../renderers.mjs';

const prerender = false;
const weatherCodeToIcon = {
  0: { icon: "meteocons:clear-day-fill", description: "Clear sky" },
  1: {
    icon: "meteocons:partly-cloudy-day-fill",
    description: "Mainly clear"
  },
  61: { icon: "meteocons:rain-fill", description: "Rain" },
  71: { icon: "meteocons:snow-fill", description: "Snow" },
  95: { icon: "meteocons:thunderstorms-fill", description: "Thunderstorm" }
};
const GET = async ({ url }) => {
  try {
    const latitude = parseFloat(url.searchParams.get("lat") || "51.5074");
    const longitude = parseFloat(url.searchParams.get("lon") || "-0.1278");
    const cityName = url.searchParams.get("city") || "London";
    if (isNaN(latitude) || isNaN(longitude)) {
      return new Response(JSON.stringify({ error: "Invalid coordinates" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      return new Response(JSON.stringify({ error: "Weather API failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
    const weatherData = await weatherResponse.json();
    const response = {
      location: { latitude, longitude, city: cityName },
      current: {
        temperature: Math.round(weatherData.current?.temperature_2m || 20),
        weatherCode: weatherData.current?.weather_code || 0,
        icon: weatherCodeToIcon[weatherData.current?.weather_code || 0]?.icon || "meteocons:clear-day-fill",
        description: weatherCodeToIcon[weatherData.current?.weather_code || 0]?.description || "Clear"
      },
      daily: [
        {
          day: "Tomorrow",
          maxTemp: Math.round(weatherData.daily?.temperature_2m_max?.[1] || 22),
          minTemp: Math.round(weatherData.daily?.temperature_2m_min?.[1] || 15),
          icon: weatherCodeToIcon[weatherData.daily?.weather_code?.[1] || 0]?.icon || "meteocons:clear-day-fill"
        },
        {
          day: "Day 2",
          maxTemp: Math.round(weatherData.daily?.temperature_2m_max?.[2] || 21),
          minTemp: Math.round(weatherData.daily?.temperature_2m_min?.[2] || 14),
          icon: weatherCodeToIcon[weatherData.daily?.weather_code?.[2] || 0]?.icon || "meteocons:partly-cloudy-day-fill"
        }
      ]
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const runtime = "edge";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender,
	runtime
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
