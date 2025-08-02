window.switchToUnit = function (o) {
	try {
		console.log(`Switching to ${o} units`)
		const r = document.getElementById('temp-toggle-checkbox')
		r && (r.checked = o === 'fahrenheit')
		const i = document.getElementById('currentTemp')
		if (i) {
			const e = parseFloat(i.getAttribute('data-temp-c') || '0')
			if (!isNaN(e))
				if (o === 'celsius') i.textContent = `${e}°C`
				else {
					const n = Math.round((e * 9) / 5 + 32)
					i.textContent = `${n}°F`
				}
		}
		;(document.querySelectorAll('.daily-temp [data-temp-c]').forEach(e => {
			const n = parseFloat(e.getAttribute('data-temp-c') || '0')
			if (!isNaN(n))
				if (o === 'celsius') e.textContent = `${n}°C`
				else {
					const a = Math.round((n * 9) / 5 + 32)
					e.textContent = `${a}°F`
				}
		}),
			localStorage.setItem('temperatureUnit', o))
	} catch (r) {
		console.error('Error switching temperature unit:', r)
	}
}
document.addEventListener('DOMContentLoaded', function () {
	const o = localStorage.getItem('temperatureUnit') || 'celsius'
	window.switchToUnit && window.switchToUnit(o)
	const r = document.getElementById('temp-toggle-checkbox')
	;(r &&
		r.addEventListener('change', function () {
			const e = this.checked ? 'fahrenheit' : 'celsius'
			window.switchToUnit && window.switchToUnit(e)
		}),
		document.querySelectorAll('button[id^="loc-"]').forEach(e => {
			e.addEventListener('click', function (n) {
				const a = n.currentTarget,
					c = a.dataset.lat,
					l = a.dataset.lon,
					m = a.dataset.city
				c && l && m && window.loadWeather(parseFloat(c), parseFloat(l), m)
			})
		}),
		document.querySelectorAll('a[href*="lat="]').forEach(e => {
			e.addEventListener('click', function (n) {
				const a = n.currentTarget
				;((a.style.transform = 'scale(0.95)'), (a.style.opacity = '0.7'))
				const c = document.createElement('div')
				;((c.style.cssText = `
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
            `),
					(c.textContent = '🌍 Loading weather...'),
					document.body.appendChild(c))
			})
		}))
})
window.loadWeather = async function (o, r, i) {
	try {
		const t = document.querySelector('.weather-container')
		t &&
			(t.innerHTML = `
              <div class="max-w-lg mx-auto bg-white/20 backdrop-blur-md rounded-xl p-8 text-center mb-8">
                <div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-white text-lg">Loading ${i} weather...</p>
                <p class="text-white/70 text-sm mt-2">Fetching current conditions</p>
              </div>
            `)
		const e = document.getElementById('currentCity')
		e && (e.textContent = `Loading ${i}...`)
		const n = document.getElementById('currentCoords')
		n && (n.textContent = `${o}, ${r}`)
		const a = new AbortController(),
			c = setTimeout(() => a.abort(), 15e3),
			l = await fetch(`/api/weather.json?lat=${o}&lon=${r}`, {
				signal: a.signal,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
		clearTimeout(c)
		const m = l.headers.get('content-type')
		if (!m || !m.includes('application/json')) {
			const s = await l.text()
			throw (
				console.error('Non-JSON response:', s),
				new Error(
					`Server returned ${m || 'unknown content type'} instead of JSON`,
				)
			)
		}
		const f = await l.text()
		let d
		try {
			d = JSON.parse(f)
		} catch (s) {
			throw (
				console.error('JSON parse error:', s),
				console.error('Response text:', f),
				new Error(
					`Invalid JSON response: ${s instanceof Error ? s.message : 'Parse error'}`,
				)
			)
		}
		if (l.ok && d && !d.error) {
			h(d)
			const s = document.getElementById('currentCity')
			s && (s.textContent = d.location?.city || i)
		} else {
			const s = d?.message || d?.error || `HTTP ${l.status}`
			;(console.error('API error:', s), u(`Failed to load weather data: ${s}`))
		}
	} catch (t) {
		;(console.error('Weather load error:', t),
			t instanceof Error
				? t.name === 'AbortError'
					? u('Request timeout - please try again')
					: u(`Network error: ${t.message}`)
				: u(`Unexpected error: ${String(t)}`))
	}
}
window.loadWeatherFromInputs = function () {
	const o = document.getElementById('manualLat'),
		r = document.getElementById('manualLon'),
		i = o?.value,
		t = r?.value
	if (!i || !t) {
		alert('Please enter both latitude and longitude')
		return
	}
	window.loadWeather(parseFloat(i), parseFloat(t), 'Custom Location')
}
function p(o, r = !1) {
	const i = r ? 'text-8xl' : 'text-4xl'
	let t = '☁️',
		e = ''
	switch (o) {
		case 'meteocons:clear-day-fill':
			;((t = '☀️'), (e = 'animate-bounce'))
			break
		case 'meteocons:clear-night-fill':
			;((t = '🌙'), (e = 'animate-pulse'))
			break
		case 'meteocons:partly-cloudy-day-fill':
			;((t = '⛅'), (e = 'animate-partly-cloudy'))
			break
		case 'meteocons:partly-cloudy-night-fill':
			;((t = '🌙'), (e = 'animate-partly-cloudy-slow'))
			break
		case 'meteocons:cloudy-fill':
		case 'meteocons:overcast-fill':
			;((t = '☁️'), (e = 'animate-pulse'))
			break
		case 'meteocons:rain-fill':
			;((t = '🌧️'), (e = 'animate-rain-drop'))
			break
		case 'meteocons:drizzle-fill':
			;((t = '🌦️'), (e = 'animate-rain-drop'))
			break
		case 'meteocons:thunderstorms-fill':
		case 'meteocons:thunderstorms-day-rain-fill':
		case 'meteocons:thunderstorms-night-rain-fill':
			;((t = '⛈️'), (e = 'animate-thunder-pulse'))
			break
		case 'meteocons:snow-fill':
			;((t = '🌨️'), (e = 'animate-snow-float'))
			break
		case 'meteocons:sleet-fill':
			;((t = '🌨️'), (e = 'animate-snow-fast'))
			break
		case 'meteocons:hail-fill':
			;((t = '🌨️'), (e = 'animate-hail-bounce'))
			break
		case 'meteocons:fog-fill':
			;((t = '🌫️'), (e = 'animate-fog-swirl'))
			break
		case 'meteocons:wind-fill':
			;((t = '💨'), (e = 'animate-wind-sway'))
			break
		case 'meteocons:tornado-fill':
			;((t = '🌪️'), (e = 'animate-spin'))
			break
		default:
			;((t = '☁️'), (e = 'animate-pulse'))
			break
	}
	return `<span class="${i} ${e} inline-block hover:scale-110 transition-all duration-300 cursor-pointer" title="${o}">${t}</span>`
}
function h(o) {
	const r = document.querySelector('.weather-container')
	if (!r) return
	const i = o.daily
		.slice(0, 3)
		.map(
			n => `
            <div class="rounded-lg bg-white/10 p-4 text-center">
              <div class="mb-3 text-xs font-medium text-white/70">
                ${n.day}
              </div>
              <div class="mb-3 flex justify-center">
                ${p(n.icon)}
              </div>
              <div class="daily-temp text-lg font-bold text-white">
                <div class="text-white" data-temp-c="${n.maxTemp}">
                  ${n.maxTemp}°C
                </div>
                <div class="text-sm text-white/70" data-temp-c="${n.minTemp}">
                  ${n.minTemp}°C
                </div>
              </div>
              <div class="mt-1 text-xs text-white/60">
                ${n.description}
              </div>
            </div>
          `,
		)
		.join('')
	r.innerHTML = `
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
                ${p(o.current.icon, !0)}
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
                ${i}
              </div>
            </div>
          </div>
        `
	const t = localStorage.getItem('temperatureUnit') || 'celsius'
	window.switchToUnit && window.switchToUnit(t)
	const e = document.getElementById('temp-toggle-checkbox')
	e &&
		e.addEventListener('change', function () {
			const n = this.checked ? 'fahrenheit' : 'celsius'
			window.switchToUnit && window.switchToUnit(n)
		})
}
function u(o) {
	const r = document.querySelector('.weather-container')
	r &&
		(r.innerHTML = `
          <div class="max-w-lg mx-auto bg-red-500/20 backdrop-blur-md rounded-xl p-6 text-center mb-8">
            <div class="text-6xl mb-4">⚠️</div>
            <h2 class="text-xl font-bold text-white mb-2">Error Loading Weather</h2>
            <p class="text-red-100">${o}</p>
            <p class="text-red-200 text-sm mt-2">Try selecting a different location.</p>
          </div>
        `)
}
