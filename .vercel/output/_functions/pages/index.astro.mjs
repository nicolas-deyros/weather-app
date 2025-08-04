import { e as createComponent, m as maybeRenderHead, l as renderComponent, r as renderTemplate, n as renderScript, f as createAstro, k as renderHead, h as addAttribute } from '../chunks/astro/server_BfDUqbC0.mjs';
import 'kleur/colors';
/* empty css                                 */
import { $ as $$Icon } from '../chunks/Icon_C4ZQ9kPa.mjs';
export { renderers } from '../renderers.mjs';

const $$Location = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="mx-auto mb-8 max-w-4xl lg:mx-0 lg:max-w-none"> <h2 class="mb-6 flex items-center-safe justify-center-safe gap-2 text-2xl font-bold text-white"> ${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:world-map" })}Try Different Locations
</h2> <div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-2"> <button id="loc-ny" data-lat="40.7128" data-lon="-74.0060" data-city="New York" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl"> ${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:american-football" })} </div> <div class="font-semibold">New York</div> </button> <button id="loc-tokyo" data-lat="35.6762" data-lon="139.6503" data-city="Tokyo" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl">${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:sushi" })}</div> <div class="font-semibold">Tokyo</div> </button> <button id="loc-sydney" data-lat="-33.8688" data-lon="151.2093" data-city="Sydney" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl">${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:boomerang" })}</div> <div class="font-semibold">Sydney</div> </button> <button id="loc-paris" data-lat="48.8566" data-lon="2.3522" data-city="Paris" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl">${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:croissant" })}</div> <div class="font-semibold">Paris</div> </button> <button id="loc-ba" data-lat="-34.5997" data-lon="-58.4416" data-city="Buenos Aires" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl">${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:mate" })}</div> <div class="font-semibold">Buenos Aires</div> </button> <button id="loc-rio" data-lat="-23.5475" data-lon="-46.6361" data-city="Rio de Janeiro" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl">${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:flag-brazil" })}</div> <div class="font-semibold">Brazil</div> </button> <button id="loc-sa" data-lat="-30.559482" data-lon="22.937" data-city="South Africa" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl"> ${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:globe-showing-europe-africa" })} </div> <div class="font-semibold">South Africa</div> </button> <button id="loc-hk" data-lat="35.8617" data-lon="104.1954" data-city="Hong Kong" class="flex cursor-pointer flex-col items-center gap-2 rounded-lg bg-white/20 p-4 text-center text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"> <div class="text-2xl">${renderComponent($$result, "Icon", $$Icon, { "name": "twemoji:panda" })}</div> <div class="font-semibold">Hong Kong</div> </button> </div> </div>`;
}, "C:/Users/ndeyros/dev/weather-app/src/components/page/Location.astro", void 0);

const $$LocationSearch = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="mb-8 rounded-2xl bg-white/10 p-6 backdrop-blur-lg"> <div class="flex flex-col space-y-4"> <!-- Search Input and Geolocation Button --> <div class="flex gap-3"> <div class="relative flex-1"> <input type="text" id="locationSearch" placeholder="Search for a city (e.g., New York, London, Tokyo...)" class="w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 pr-12 text-white placeholder-blue-200 focus:border-white/60 focus:ring-2 focus:ring-white/20 focus:outline-none"> <button id="searchButton" class="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700" title="Search location"> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </button> </div> <!-- Geolocation Button --> <button id="geolocationButton" class="flex flex-shrink-0 items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700" title="Use current location"> ${renderComponent($$result, "Icon", $$Icon, { "name": "nrk:geo", "size": 20 })} </button> </div> <!-- Loading State --> <div id="loadingState" class="hidden text-center"> <div class="flex items-center justify-center space-x-2 text-blue-200"> <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div> <span>Searching...</span> </div> </div> <!-- Error Message --> <div id="errorMessage" class="hidden rounded-lg border border-red-500/30 bg-red-500/20 p-3"> <p class="text-sm text-red-200"></p> </div> <!-- Location Result --> <div id="locationResult" class="hidden rounded-lg border border-blue-500/30 bg-blue-500/20 p-4"> <h4 class="mb-2 font-semibold text-white">Location Found:</h4> <div class="space-y-1 text-sm text-blue-100"> <div><strong>City:</strong> <span id="resultCity">-</span></div> <div><strong>Country:</strong> <span id="resultCountry">-</span></div> <div><strong>Latitude:</strong> <span id="resultLat">-</span></div> <div><strong>Longitude:</strong> <span id="resultLon">-</span></div> </div> <button id="useLocationButton" class="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
Get Weather for This Location
</button> </div> </div> </div> ${renderScript($$result, "C:/Users/ndeyros/dev/weather-app/src/components/page/LocationSearch.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ndeyros/dev/weather-app/src/components/page/LocationSearch.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lat = Astro2.url.searchParams.get("lat");
  const lon = Astro2.url.searchParams.get("lon");
  let weatherData = null;
  let error = null;
  if (lat && lon) {
    try {
      const apiUrl = new URL("/api/weather.json", Astro2.url.origin);
      apiUrl.searchParams.set("lat", lat);
      apiUrl.searchParams.set("lon", lon);
      const response = await fetch(apiUrl.href);
      if (response.ok) {
        const responseText = await response.text();
        try {
          weatherData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse weather response:", parseError);
          console.error("Response text:", responseText);
          error = `Invalid response format: ${parseError instanceof Error ? parseError.message : "JSON parse error"}`;
        }
      } else {
        try {
          const errorData = await response.json();
          error = `API Error (${response.status}): ${errorData.message || errorData.error || "Unknown error"}`;
        } catch {
          error = `API Error: HTTP ${response.status} ${response.statusText}`;
        }
      }
    } catch (e) {
      console.error("Weather fetch error:", e);
      error = `Network Error: ${e instanceof Error ? e.message : "Connection failed"}`;
    }
  }
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><!-- Animated SVG favicon for modern browsers --><link rel="icon" type="image/svg+xml" href="/favicon-animated.svg"><!-- Add these meta tags for better favicon support --><link rel="apple-touch-icon" sizes="180x180" href="/favicon-animated.svg"><link rel="manifest" href="/site.webmanifest"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Weather App</title>${renderHead()}</head> <body class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"> <div class="container mx-auto px-4 py-8"> <!-- Header --> <div class="mb-8 text-center"> <h1 class="mb-2 flex items-center-safe justify-center-safe text-5xl font-bold text-white">
Weather ${renderComponent($$result, "Icon", $$Icon, { "name": "meteocons:horizon-fill", "class": "h-24 w-24" })} App
</h1> <p class="text-white/80">Real-time weather data from Open-Meteo API</p> </div> <!-- Desktop: Two-column layout, Mobile: Single column --> <div class="grid grid-cols-1 gap-8 lg:grid-cols-2"> <!-- Left Column: Search and Location Buttons --> <div class="space-y-8"> <!-- Location Search Component --> <div class="mx-auto max-w-lg lg:mx-0 lg:max-w-none"> ${renderComponent($$result, "LocationSearch", $$LocationSearch, {})} </div> <!-- Quick Location Test Buttons --> <div class="mx-auto max-w-lg lg:mx-0 lg:max-w-none"> ${renderComponent($$result, "Location", $$Location, {})} </div> </div> <!-- Right Column: Weather Display --> <div class="weather-container"> ${error ? renderTemplate`<div class="mx-auto mb-8 max-w-lg rounded-xl bg-red-500/20 p-6 text-center backdrop-blur-md lg:mx-0 lg:max-w-none"> <div class="mb-4 text-6xl">⚠️</div> <h2 class="mb-2 text-xl font-bold text-white">
Error Loading Weather
</h2> <p class="text-red-100">${error}</p> <p class="mt-2 text-sm text-red-200">
Try refreshing the page or selecting a different location.
</p> </div>` : weatherData ? renderTemplate`<div class="mx-auto mb-8 max-w-lg rounded-xl bg-white/20 p-8 shadow-xl backdrop-blur-md lg:mx-0 lg:max-w-none"> <div class="mb-6 text-center"> <h2 class="mb-2 text-3xl font-bold text-white">
📍 ${weatherData.location.city} </h2> <p class="text-sm text-white/80"> ${weatherData.location.latitude.toFixed(4)}°,${" "} ${weatherData.location.longitude.toFixed(4)}°
</p> </div> <div class="mb-6 flex justify-center"> <label id="temp-toggle" for="temp-toggle-checkbox" class="relative inline-flex cursor-pointer items-center"> <input type="checkbox" value="" id="temp-toggle-checkbox" class="peer sr-only"> <div class="peer relative h-10 w-20 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm peer-checked:bg-white/30 peer-focus:ring-4 peer-focus:ring-white/20 peer-focus:outline-none before:absolute before:top-[4px] before:left-[4px] before:flex before:h-8 before:w-8 before:items-center before:justify-center before:rounded-full before:border before:border-white/40 before:bg-white/90 before:text-sm before:font-semibold before:text-blue-600 before:shadow-lg before:transition-all before:duration-300 before:content-['°C'] peer-checked:before:translate-x-10 peer-checked:before:opacity-0 after:absolute after:top-[4px] after:left-[4px] after:flex after:h-8 after:w-8 after:items-center after:justify-center after:rounded-full after:border after:border-white/40 after:bg-white/90 after:text-sm after:font-semibold after:text-orange-600 after:opacity-0 after:shadow-lg after:transition-all after:duration-300 after:content-['°F'] peer-checked:after:translate-x-10 peer-checked:after:opacity-100"></div> </label> </div> <div class="mb-8 text-center"> <div class="mb-6 flex justify-center"> ${renderComponent($$result, "Icon", $$Icon, { "name": weatherData.current.icon, "class": "h-32 w-32 text-white drop-shadow-lg" })} </div> <div class="mb-2 text-7xl font-bold text-white drop-shadow-md" id="currentTemp"${addAttribute(weatherData.current.temperature, "data-temp-c")}> ${weatherData.current.temperature}°C
</div> <div class="text-2xl font-medium text-white/90"> ${weatherData.current.description} </div> <div class="mt-3 text-sm text-white/70">
Updated:${" "} ${new Date(weatherData.current.time).toLocaleString()} </div> </div> <div> <h3 class="mb-6 text-center text-xl font-semibold text-white">
Next 3 Days
</h3> <div class="grid grid-cols-3 gap-3" id="dailyForecast">  ${weatherData.daily.map((day) => renderTemplate`<div class="rounded-lg bg-white/10 p-4 text-center"> <div class="mb-3 text-xs font-medium text-white/70"> ${day.day} </div> <div class="mb-3 flex justify-center"> ${renderComponent($$result, "Icon", $$Icon, { "name": day.icon, "class": "h-10 w-10 text-white" })} </div> <div class="daily-temp text-lg font-bold text-white"> <div class="text-white"${addAttribute(day.maxTemp, "data-temp-c")}> ${day.maxTemp}°C
</div> <div class="text-sm text-white/70"${addAttribute(day.minTemp, "data-temp-c")}> ${day.minTemp}°C
</div> </div> <div class="mt-1 text-xs text-white/60"> ${day.description} </div> </div>`)} </div> </div> </div>` : renderTemplate`<div class="mx-auto mb-8 max-w-lg rounded-xl bg-white/20 p-8 text-center backdrop-blur-md lg:mx-0"> <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div> <p class="text-lg text-white">Loading weather data...</p> <p class="mt-2 text-sm text-white/70">
Fetching current conditions
</p> </div>`} </div> </div> </div> ${renderScript($$result, "C:/Users/ndeyros/dev/weather-app/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/ndeyros/dev/weather-app/src/pages/index.astro", void 0);

const $$file = "C:/Users/ndeyros/dev/weather-app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
