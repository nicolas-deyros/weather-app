window.switchToUnit=function(i){try{console.log(`Switching to ${i} units`);const n=document.querySelector(".temp-toggle .celsius"),o=document.querySelector(".temp-toggle .fahrenheit");i==="celsius"?(n?.classList.remove("bg-white/20"),n?.classList.add("bg-white/40"),o?.classList.remove("bg-white/40"),o?.classList.add("bg-white/20")):(o?.classList.remove("bg-white/20"),o?.classList.add("bg-white/40"),n?.classList.remove("bg-white/40"),n?.classList.add("bg-white/20"));const t=document.getElementById("currentTemp");if(t){const a=parseFloat(t.getAttribute("data-temp-c")||"0");if(!isNaN(a))if(i==="celsius")t.textContent=`${a}°C`;else{const s=Math.round(a*9/5+32);t.textContent=`${s}°F`}}document.querySelectorAll(".daily-temp-max[data-temp-c], .daily-temp-min[data-temp-c]").forEach(a=>{const s=parseFloat(a.getAttribute("data-temp-c")||"0");if(!isNaN(s))if(i==="celsius")a.textContent=`${s}°C`;else{const r=Math.round(s*9/5+32);a.textContent=`${r}°F`}}),localStorage.setItem("temperatureUnit",i)}catch(n){console.error("Error switching temperature unit:",n)}};document.addEventListener("DOMContentLoaded",function(){const i=localStorage.getItem("temperatureUnit")||"celsius";window.switchToUnit&&window.switchToUnit(i),document.querySelectorAll('a[href*="lat="]').forEach(o=>{o.addEventListener("click",function(t){const e=t.currentTarget;e.style.transform="scale(0.95)",e.style.opacity="0.7";const a=document.createElement("div");a.style.cssText=`
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
            `,a.textContent="🌍 Loading weather...",document.body.appendChild(a)})})});window.loadWeather=async function(i,n,o){try{const t=document.querySelector(".weather-container");t&&(t.innerHTML=`
              <div class="max-w-lg mx-auto bg-white/20 backdrop-blur-md rounded-xl p-8 text-center mb-8">
                <div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-white text-lg">Loading ${o} weather...</p>
                <p class="text-white/70 text-sm mt-2">Fetching current conditions</p>
              </div>
            `);const e=document.getElementById("currentCity");e&&(e.textContent=`Loading ${o}...`);const a=document.getElementById("currentCoords");a&&(a.textContent=`${i}, ${n}`);const s=await fetch(`/api/weather.json?lat=${i}&lon=${n}`),r=await s.json();if(s.ok){u(r);const c=document.getElementById("currentCity");c&&(c.textContent=r.location.city)}else d(`Failed to load weather data: ${s.status}`)}catch(t){d(`Network error: ${t instanceof Error?t.message:String(t)}`)}};window.loadWeatherFromInputs=function(){const i=document.getElementById("manualLat"),n=document.getElementById("manualLon"),o=i?.value,t=n?.value;if(!o||!t){alert("Please enter both latitude and longitude");return}window.loadWeather(parseFloat(o),parseFloat(t),"Custom Location")};function m(i,n=!1){const o=n?"text-8xl":"text-4xl";let t="☁️",e="";switch(i){case"meteocons:clear-day-fill":t="☀️",e="animate-bounce";break;case"meteocons:clear-night-fill":t="🌙",e="animate-pulse";break;case"meteocons:partly-cloudy-day-fill":t="⛅",e="animate-partly-cloudy";break;case"meteocons:partly-cloudy-night-fill":t="🌙",e="animate-partly-cloudy-slow";break;case"meteocons:cloudy-fill":case"meteocons:overcast-fill":t="☁️",e="animate-pulse";break;case"meteocons:rain-fill":t="🌧️",e="animate-rain-drop";break;case"meteocons:drizzle-fill":t="🌦️",e="animate-rain-drop";break;case"meteocons:thunderstorms-fill":case"meteocons:thunderstorms-day-rain-fill":case"meteocons:thunderstorms-night-rain-fill":t="⛈️",e="animate-thunder-pulse";break;case"meteocons:snow-fill":t="🌨️",e="animate-snow-float";break;case"meteocons:sleet-fill":t="🌨️",e="animate-snow-fast";break;case"meteocons:hail-fill":t="🌨️",e="animate-hail-bounce";break;case"meteocons:fog-fill":t="🌫️",e="animate-fog-swirl";break;case"meteocons:wind-fill":t="💨",e="animate-wind-sway";break;case"meteocons:tornado-fill":t="🌪️",e="animate-spin";break;default:t="☁️",e="animate-pulse";break}return`<span class="${o} ${e} inline-block hover:scale-110 transition-all duration-300 cursor-pointer" title="${i}">${t}</span>`}function l(i,n="w-10 h-10 text-white"){const o=n.includes("w-32")||n.includes("h-32");return m(i,o)}function u(i){const n=document.querySelector(".weather-container");if(!n)return;const o=i.daily.slice(0,3).map((e,a)=>`
          <div class="bg-white/10 rounded-lg p-4 text-center opacity-0" 
               style="animation: fadeIn 0.5s ease-out ${.2+a*.1}s forwards;">
            <div class="text-xs text-white/70 mb-3 font-medium">
              ${e.day}
            </div>
            <div class="flex justify-center mb-3">
              ${l(e.icon,"w-10 h-10 text-white")}
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
        `).join("");n.innerHTML=`
          <div class="max-w-lg mx-auto bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-xl mb-8 opacity-0 animate-fade-in"
               style="animation: fadeIn 0.5s ease-out forwards;">
            
            <div class="text-center mb-6">
              <h2 class="text-3xl font-bold text-white mb-2">
                📍 ${i.location.city}
              </h2>
              <p class="text-white/80 text-sm">
                ${i.location.latitude.toFixed(4)}°, ${i.location.longitude.toFixed(4)}°
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
                ${l(i.current.icon,"w-32 h-32 text-white drop-shadow-lg")}
              </div>
              <div class="text-7xl font-bold text-white mb-2 drop-shadow-md" id="currentTemp" data-temp-c="${i.current.temperature}">
                ${i.current.temperature}°C
              </div>
              <div class="text-2xl text-white/90 font-medium">
                ${i.current.description}
              </div>
              <div class="text-sm text-white/70 mt-3">
                Updated: ${new Date(i.current.time).toLocaleString()}
              </div>

            </div>

            
            <div>
              <h3 class="text-xl font-semibold text-white mb-6 text-center">Next 3 Days</h3>
              <div class="grid grid-cols-3 gap-3" id="dailyForecast">
                ${o}
              </div>
            </div>
          </div>
        `;const t=localStorage.getItem("temperatureUnit")||"celsius";window.switchToUnit&&window.switchToUnit(t)}function d(i){const n=document.querySelector(".weather-container");n&&(n.innerHTML=`
          <div class="max-w-lg mx-auto bg-red-500/20 backdrop-blur-md rounded-xl p-6 text-center mb-8">
            <div class="text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-bold text-white mb-2">Error Loading Weather</h2>
            <p class="text-red-100">${i}</p>
            <p class="text-red-200 text-sm mt-2">Try selecting a different location.</p>
          </div>
        `)}
