window.switchToUnit=function(o){try{const n=document.getElementById("temp-toggle-checkbox");n&&(n.checked=o==="fahrenheit");const a=document.getElementById("currentTemp");if(a){const t=parseFloat(a.getAttribute("data-temp-c")||"0");if(!isNaN(t))if(o==="celsius")a.textContent=`${t}°C`;else{const r=Math.round(t*9/5+32);a.textContent=`${r}°F`}}document.querySelectorAll(".daily-temp [data-temp-c]").forEach(t=>{const r=parseFloat(t.getAttribute("data-temp-c")||"0");if(!isNaN(r))if(o==="celsius")t.textContent=`${r}°C`;else{const m=Math.round(r*9/5+32);t.textContent=`${m}°F`}}),localStorage.setItem("temperatureUnit",o)}catch(n){console.error("Error switching temperature unit:",n)}};document.addEventListener("DOMContentLoaded",function(){const o=new URLSearchParams(window.location.search),n=o.has("lat")&&o.has("lon"),a=document.querySelector(".weather-container")?.innerHTML.includes("📍");!n&&!a&&window.loadWeather(51.5074,-.1278,"London");const e=localStorage.getItem("temperatureUnit")||"celsius";window.switchToUnit&&window.switchToUnit(e);const t=document.getElementById("temp-toggle-checkbox");t&&t.addEventListener("change",function(){const u=this.checked?"fahrenheit":"celsius";window.switchToUnit&&window.switchToUnit(u)}),document.querySelectorAll('button[id^="loc-"]').forEach(u=>{u.addEventListener("click",function(l){const c=l.currentTarget,d=c.dataset.lat,s=c.dataset.lon,i=c.dataset.city;d&&s&&i&&window.loadWeather(parseFloat(d),parseFloat(s),i)})}),document.querySelectorAll('a[href*="lat="]').forEach(u=>{u.addEventListener("click",function(l){const c=l.currentTarget;c.style.transform="scale(0.95)",c.style.opacity="0.7";const d=document.createElement("div");d.style.cssText=`
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(59, 130, 246, 0.9);
              color: white;
              padding: 12px 20px;
              border-radius: 8px;
              font-weight: bold;
              z-index: 1000;
              backdrop-filter: blur(10px);
            `,d.textContent="🌍 Loading weather...",document.body.appendChild(d)})})});window.loadWeather=async function(o,n,a){try{const e=document.querySelector(".weather-container");e&&(e.innerHTML=`
              <div class="max-w-lg mx-auto bg-white/20 backdrop-blur-md rounded-xl p-8 text-center mb-8">
                <div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-white text-lg">Loading ${a} weather...</p>
                <p class="text-white/70 text-sm mt-2">Fetching current conditions</p>
              </div>
            `);const t=document.getElementById("currentCity");t&&(t.textContent=`Loading ${a}...`);const r=document.getElementById("currentCoords");r&&(r.textContent=`${o}, ${n}`);const m=new AbortController,u=setTimeout(()=>m.abort(),15e3),l=await fetch(`/api/weather.json?lat=${o}&lon=${n}&city=${encodeURIComponent(a)}`,{signal:m.signal,headers:{Accept:"application/json","Content-Type":"application/json"}});clearTimeout(u);const c=l.headers.get("content-type");if(!c||!c.includes("application/json")){const i=await l.text();throw console.error("Non-JSON response:",i),new Error(`Server returned ${c||"unknown content type"} instead of JSON`)}const d=await l.text();let s;try{s=JSON.parse(d)}catch(i){throw console.error("JSON parse error:",i),console.error("Response text:",d),new Error(`Invalid JSON response: ${i instanceof Error?i.message:"Parse error"}`)}if(l.ok&&s&&!s.error){h(s);const i=document.getElementById("currentCity");i&&(i.textContent=s.location?.city||a)}else{let i="Unknown error";s?.message?i=typeof s.message=="string"?s.message:JSON.stringify(s.message):s?.error?i=typeof s.error=="string"?s.error:JSON.stringify(s.error):i=`HTTP ${l.status} - ${l.statusText}`,console.error("API error:",i),console.error("Full error response:",s),f(`Failed to load weather data: ${i}`)}}catch(e){console.error("Weather load error:",e),e instanceof Error?e.name==="AbortError"?f("Request timeout - please try again"):f(`Network error: ${e.message}`):f(`Unexpected error: ${String(e)}`)}};window.loadWeatherFromInputs=function(){const o=document.getElementById("manualLat"),n=document.getElementById("manualLon"),a=o?.value,e=n?.value;if(!a||!e){alert("Please enter both latitude and longitude");return}window.loadWeather(parseFloat(a),parseFloat(e),"Custom Location")};function p(o,n=!1){const a=n?"text-8xl":"text-4xl";let e="☁️",t="";switch(o){case"meteocons:clear-day-fill":e="☀️",t="animate-bounce";break;case"meteocons:clear-night-fill":e="🌙",t="animate-pulse";break;case"meteocons:partly-cloudy-day-fill":e="⛅",t="animate-partly-cloudy";break;case"meteocons:partly-cloudy-night-fill":e="🌙",t="animate-partly-cloudy-slow";break;case"meteocons:cloudy-fill":case"meteocons:overcast-fill":e="☁️",t="animate-pulse";break;case"meteocons:rain-fill":e="🌧️",t="animate-rain-drop";break;case"meteocons:drizzle-fill":e="🌦️",t="animate-rain-drop";break;case"meteocons:thunderstorms-fill":e="⛈️",t="animate-thunder-pulse";break;case"meteocons:thunderstorms-rain-fill":case"meteocons:thunderstorms-day-rain-fill":case"meteocons:thunderstorms-night-rain-fill":e="⛈️",t="animate-thunder-pulse";break;case"meteocons:snow-fill":e="🌨️",t="animate-snow-float";break;case"meteocons:sleet-fill":e="🌨️",t="animate-snow-fast";break;case"meteocons:hail-fill":e="🌨️",t="animate-hail-bounce";break;case"meteocons:fog-fill":e="🌫️",t="animate-fog-swirl";break;case"meteocons:wind-fill":e="💨",t="animate-wind-sway";break;case"meteocons:tornado-fill":e="🌪️",t="animate-spin";break;case"meteocons:partly-cloudy-fill":e="⛅",t="animate-partly-cloudy";break;case"meteocons:overcast-day-fill":case"meteocons:overcast-night-fill":e="☁️",t="animate-pulse";break;case"meteocons:rain-heavy-fill":e="🌧️",t="animate-rain-drop";break;case"meteocons:thunderstorms-day-fill":case"meteocons:thunderstorms-night-fill":e="⛈️",t="animate-thunder-pulse";break;case"meteocons:snow-heavy-fill":e="🌨️",t="animate-snow-float";break;case"meteocons:fog-day-fill":case"meteocons:fog-night-fill":e="🌫️",t="animate-fog-swirl";break;case"meteocons:mist-fill":e="🌫️",t="animate-fog-swirl";break;case"meteocons:dust-fill":e="🌫️",t="animate-fog-swirl";break;case"meteocons:smoke-fill":e="🌫️",t="animate-fog-swirl";break;case"meteocons:haze-fill":e="🌫️",t="animate-fog-swirl";break;case"meteocons:extreme-fill":e="🌪️",t="animate-spin";break;case"meteocons:hurricane-fill":e="🌀",t="animate-spin";break;case"meteocons:windy-fill":case"meteocons:wind-strong-fill":e="💨",t="animate-wind-sway";break;default:o.includes("clear")&&o.includes("day")?(e="☀️",t="animate-bounce"):o.includes("clear")&&o.includes("night")?(e="🌙",t="animate-pulse"):o.includes("partly-cloudy")||o.includes("partial")?(e="⛅",t="animate-partly-cloudy"):o.includes("rain")||o.includes("drizzle")?(e="🌧️",t="animate-rain-drop"):o.includes("thunder")||o.includes("storm")?(e="⛈️",t="animate-thunder-pulse"):o.includes("snow")?(e="🌨️",t="animate-snow-float"):o.includes("sleet")||o.includes("hail")?(e="🌨️",t="animate-hail-bounce"):o.includes("fog")||o.includes("mist")||o.includes("haze")?(e="🌫️",t="animate-fog-swirl"):o.includes("wind")?(e="💨",t="animate-wind-sway"):o.includes("tornado")||o.includes("hurricane")||o.includes("extreme")?(e="🌪️",t="animate-spin"):o.includes("cloudy")||o.includes("overcast")?(e="☁️",t="animate-pulse"):(e="☁️",t="animate-pulse",console.warn(`Unknown weather icon: ${o}, using default fallback`));break}return`<span class="${a} ${t} inline-block hover:scale-110 transition-all duration-300 cursor-pointer" title="${o}">${e}</span>`}function h(o){const n=document.querySelector(".weather-container");if(!n)return;const a=o.daily.slice(0,3).map(r=>`
            <div class="rounded-lg bg-white/10 p-4 text-center">
              <div class="mb-3 text-xs font-medium text-white/70">
                ${r.day}
              </div>
              <div class="mb-3 flex justify-center">
                ${p(r.icon)}
              </div>
              <div class="daily-temp text-lg font-bold text-white">
                <div class="text-white" data-temp-c="${r.maxTemp}">
                  ${r.maxTemp}°C
                </div>
                <div class="text-sm text-white/70" data-temp-c="${r.minTemp}">
                  ${r.minTemp}°C
                </div>
              </div>
              <div class="mt-1 text-xs text-white/60">
                ${r.description}
              </div>
            </div>
          `).join("");n.innerHTML=`
          <div class="mx-auto mb-8 max-w-lg rounded-xl bg-white/20 p-8 shadow-xl backdrop-blur-md lg:mx-0 lg:max-w-none">
            
            <div class="mb-6 text-center">
              <h2 class="mb-2 text-3xl font-bold text-white">
                📍 ${o.location.city}
              </h2>
              <p class="text-sm text-white/80">
                ${o.location.latitude.toFixed(4)}°, ${o.location.longitude.toFixed(4)}°
              </p>
            </div>

            
            <div class="mb-6 flex justify-center">
              <label
                id="temp-toggle"
                for="temp-toggle-checkbox"
                class="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  value=""
                  id="temp-toggle-checkbox"
                  class="peer sr-only"
                />
                <div class="peer relative h-10 w-20 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm peer-checked:bg-white/30 peer-focus:ring-4 peer-focus:ring-white/20 peer-focus:outline-none before:absolute before:top-[4px] before:left-[4px] before:flex before:h-8 before:w-8 before:items-center before:justify-center before:rounded-full before:border before:border-white/40 before:bg-white/90 before:text-sm before:font-semibold before:text-blue-600 before:shadow-lg before:transition-all before:duration-300 before:content-['°C'] peer-checked:before:translate-x-10 peer-checked:before:opacity-0 after:absolute after:top-[4px] after:left-[4px] after:flex after:h-8 after:w-8 after:items-center after:justify-center after:rounded-full after:border after:border-white/40 after:bg-white/90 after:text-sm after:font-semibold after:text-orange-600 after:opacity-0 after:shadow-lg after:transition-all after:duration-300 after:content-['°F'] peer-checked:after:translate-x-10 peer-checked:after:opacity-100"></div>
              </label>
            </div>

            
            <div class="mb-8 text-center">
              <div class="mb-6 flex justify-center">
                ${p(o.current.icon,!0)}
              </div>
              <div class="mb-2 text-7xl font-bold text-white drop-shadow-md" id="currentTemp" data-temp-c="${o.current.temperature}">
                ${o.current.temperature}°C
              </div>
              <div class="text-2xl font-medium text-white/90">
                ${o.current.description}
              </div>
              <div class="mt-3 text-sm text-white/70">
                Updated: ${new Date(o.current.time).toLocaleString()}
              </div>
            </div>

            
            <div>
              <h3 class="mb-6 text-center text-xl font-semibold text-white">Next 3 Days</h3>
              <div class="grid grid-cols-3 gap-3" id="dailyForecast">
                ${a}
              </div>
            </div>
          </div>
        `;const e=localStorage.getItem("temperatureUnit")||"celsius";window.switchToUnit&&window.switchToUnit(e);const t=document.getElementById("temp-toggle-checkbox");t&&t.addEventListener("change",function(){const r=this.checked?"fahrenheit":"celsius";window.switchToUnit&&window.switchToUnit(r)})}function f(o){const n=document.querySelector(".weather-container");n&&(n.innerHTML=`
          <div class="max-w-lg mx-auto bg-red-500/20 backdrop-blur-md rounded-xl p-6 text-center mb-8">
            <div class="text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-bold text-white mb-2">Error Loading Weather</h2>
            <p class="text-red-100">${o}</p>
            <p class="text-red-200 text-sm mt-2">Try selecting a different location.</p>
          </div>
        `)}
