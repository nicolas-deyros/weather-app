window.switchToUnit=function(n){try{console.log(`Switching to ${n} units`);const o=document.getElementById("temp-toggle-checkbox");o&&(o.checked=n==="fahrenheit");const i=document.getElementById("currentTemp");if(i){const e=parseFloat(i.getAttribute("data-temp-c")||"0");if(!isNaN(e))if(n==="celsius")i.textContent=`${e}°C`;else{const r=Math.round(e*9/5+32);i.textContent=`${r}°F`}}document.querySelectorAll(".daily-temp-max[data-temp-c], .daily-temp-min[data-temp-c]").forEach(e=>{const r=parseFloat(e.getAttribute("data-temp-c")||"0");if(!isNaN(r))if(n==="celsius")e.textContent=`${r}°C`;else{const a=Math.round(r*9/5+32);e.textContent=`${a}°F`}}),localStorage.setItem("temperatureUnit",n)}catch(o){console.error("Error switching temperature unit:",o)}};document.addEventListener("DOMContentLoaded",function(){const n=localStorage.getItem("temperatureUnit")||"celsius";window.switchToUnit&&window.switchToUnit(n);const o=document.getElementById("temp-toggle-checkbox");o&&o.addEventListener("change",function(){const e=this.checked?"fahrenheit":"celsius";window.switchToUnit&&window.switchToUnit(e)}),document.querySelectorAll('button[id^="loc-"]').forEach(e=>{e.addEventListener("click",function(r){const a=r.currentTarget,c=a.dataset.lat,l=a.dataset.lon,m=a.dataset.city;c&&l&&m&&window.loadWeather(parseFloat(c),parseFloat(l),m)})}),document.querySelectorAll('a[href*="lat="]').forEach(e=>{e.addEventListener("click",function(r){const a=r.currentTarget;a.style.transform="scale(0.95)",a.style.opacity="0.7";const c=document.createElement("div");c.style.cssText=`
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
            `,c.textContent="🌍 Loading weather...",document.body.appendChild(c)})})});window.loadWeather=async function(n,o,i){try{const t=document.querySelector(".weather-container");t&&(t.innerHTML=`
              <div class="max-w-lg mx-auto bg-white/20 backdrop-blur-md rounded-xl p-8 text-center mb-8">
                <div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-white text-lg">Loading ${i} weather...</p>
                <p class="text-white/70 text-sm mt-2">Fetching current conditions</p>
              </div>
            `);const e=document.getElementById("currentCity");e&&(e.textContent=`Loading ${i}...`);const r=document.getElementById("currentCoords");r&&(r.textContent=`${n}, ${o}`);const a=new AbortController,c=setTimeout(()=>a.abort(),15e3),l=await fetch(`/api/weather.json?lat=${n}&lon=${o}`,{signal:a.signal,headers:{Accept:"application/json","Content-Type":"application/json"}});clearTimeout(c);const m=l.headers.get("content-type");if(!m||!m.includes("application/json")){const s=await l.text();throw console.error("Non-JSON response:",s),new Error(`Server returned ${m||"unknown content type"} instead of JSON`)}const p=await l.text();let d;try{d=JSON.parse(p)}catch(s){throw console.error("JSON parse error:",s),console.error("Response text:",p),new Error(`Invalid JSON response: ${s instanceof Error?s.message:"Parse error"}`)}if(l.ok&&d&&!d.error){x(d);const s=document.getElementById("currentCity");s&&(s.textContent=d.location?.city||i)}else{const s=d?.message||d?.error||`HTTP ${l.status}`;console.error("API error:",s),u(`Failed to load weather data: ${s}`)}}catch(t){console.error("Weather load error:",t),t instanceof Error?t.name==="AbortError"?u("Request timeout - please try again"):u(`Network error: ${t.message}`):u(`Unexpected error: ${String(t)}`)}};window.loadWeatherFromInputs=function(){const n=document.getElementById("manualLat"),o=document.getElementById("manualLon"),i=n?.value,t=o?.value;if(!i||!t){alert("Please enter both latitude and longitude");return}window.loadWeather(parseFloat(i),parseFloat(t),"Custom Location")};function h(n,o=!1){const i=o?"text-8xl":"text-4xl";let t="☁️",e="";switch(n){case"meteocons:clear-day-fill":t="☀️",e="animate-bounce";break;case"meteocons:clear-night-fill":t="🌙",e="animate-pulse";break;case"meteocons:partly-cloudy-day-fill":t="⛅",e="animate-partly-cloudy";break;case"meteocons:partly-cloudy-night-fill":t="🌙",e="animate-partly-cloudy-slow";break;case"meteocons:cloudy-fill":case"meteocons:overcast-fill":t="☁️",e="animate-pulse";break;case"meteocons:rain-fill":t="🌧️",e="animate-rain-drop";break;case"meteocons:drizzle-fill":t="🌦️",e="animate-rain-drop";break;case"meteocons:thunderstorms-fill":case"meteocons:thunderstorms-day-rain-fill":case"meteocons:thunderstorms-night-rain-fill":t="⛈️",e="animate-thunder-pulse";break;case"meteocons:snow-fill":t="🌨️",e="animate-snow-float";break;case"meteocons:sleet-fill":t="🌨️",e="animate-snow-fast";break;case"meteocons:hail-fill":t="🌨️",e="animate-hail-bounce";break;case"meteocons:fog-fill":t="🌫️",e="animate-fog-swirl";break;case"meteocons:wind-fill":t="💨",e="animate-wind-sway";break;case"meteocons:tornado-fill":t="🌪️",e="animate-spin";break;default:t="☁️",e="animate-pulse";break}return`<span class="${i} ${e} inline-block hover:scale-110 transition-all duration-300 cursor-pointer" title="${n}">${t}</span>`}function x(n){const o=document.querySelector(".weather-container");if(!o)return;const i=n.daily.slice(0,3).map((e,r)=>`
          <div class="bg-white/10 rounded-lg p-4 text-center opacity-0" 
               style="animation: fadeIn 0.5s ease-out ${.2+r*.1}s forwards;">
            <div class="text-xs text-white/70 mb-3 font-medium">
              ${e.day}
            </div>
            <div class="flex justify-center mb-3">
              ${h(e.icon)}
            </div>
            <div class="text-lg font-bold text-white daily-temp-max" data-temp-c="${e.maxTemp}">
              ${e.maxTemp}°C
            </div>
            <div class="text-sm text-white/60 daily-temp-min" data-temp-c="${e.minTemp}">
              ${e.minTemp}°C
            </div>
            <div class="text-xs text-white/60 mt-1">
              ${e.description}
            </div>
          </div>
        `).join("");o.innerHTML=`
          <div class="max-w-lg mx-auto bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-xl mb-8 opacity-0 animate-fade-in"
               style="animation: fadeIn 0.5s ease-out forwards;">
            
            <div class="text-center mb-6">
              <h2 class="text-3xl font-bold text-white mb-2">
                📍 ${n.location.city}
              </h2>
              <p class="text-white/80 text-sm">
                ${n.location.latitude.toFixed(4)}°, ${n.location.longitude.toFixed(4)}°
              </p>
            </div>

            
            <div class="flex justify-center mb-6">
              <div class="temp-toggle bg-white/10 rounded-lg p-1 flex space-x-1">
                <button 
                  class="celsius px-3 py-1 rounded-md bg-white/40 text-white text-sm font-medium transition-all hover:bg-white/50"
                  onclick="window.switchToUnit('celsius')">
                  °C
                </button>
                <button 
                  class="fahrenheit px-3 py-1 rounded-md bg-white/20 text-white text-sm font-medium transition-all hover:bg-white/30"
                  onclick="window.switchToUnit('fahrenheit')">
                  °F
                </button>
              </div>
            </div>

            
            <div class="text-center mb-8">
              <div class="flex justify-center mb-6">
                ${h(n.current.icon,!0)}
              </div>
              <div class="text-7xl font-bold text-white mb-2 drop-shadow-md" id="currentTemp" data-temp-c="${n.current.temperature}">
                ${n.current.temperature}°C
              </div>
              <div class="text-2xl text-white/90 font-medium">
                ${n.current.description}
              </div>
              <div class="text-sm text-white/70 mt-3">
                Updated: ${new Date(n.current.time).toLocaleString()}
              </div>

            </div>

            
            <div>
              <h3 class="text-xl font-semibold text-white mb-6 text-center">Next 3 Days</h3>
              <div class="grid grid-cols-3 gap-3" id="dailyForecast">
                ${i}
              </div>
            </div>
          </div>
        `;const t=localStorage.getItem("temperatureUnit")||"celsius";window.switchToUnit&&window.switchToUnit(t)}function u(n){const o=document.querySelector(".weather-container");o&&(o.innerHTML=`
          <div class="max-w-lg mx-auto bg-red-500/20 backdrop-blur-md rounded-xl p-6 text-center mb-8">
            <div class="text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-bold text-white mb-2">Error Loading Weather</h2>
            <p class="text-red-100">${n}</p>
            <p class="text-red-200 text-sm mt-2">Try selecting a different location.</p>
          </div>
        `)}
