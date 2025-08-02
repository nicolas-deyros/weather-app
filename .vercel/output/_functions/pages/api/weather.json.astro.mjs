export { renderers } from '../../renderers.mjs'

const prerender = false
const weatherCodeToIcon = {
	0: { icon: 'meteocons:clear-day-fill', description: 'Clear sky' },
	1: {
		icon: 'meteocons:partly-cloudy-day-fill',
		description: 'Mainly clear',
	},
	2: {
		icon: 'meteocons:partly-cloudy-day-fill',
		description: 'Partly cloudy',
	},
	3: { icon: 'meteocons:overcast-fill', description: 'Overcast' },
	45: { icon: 'meteocons:fog-fill', description: 'Fog' },
	48: { icon: 'meteocons:fog-fill', description: 'Depositing rime fog' },
	51: { icon: 'meteocons:drizzle-fill', description: 'Light drizzle' },
	53: { icon: 'meteocons:drizzle-fill', description: 'Moderate drizzle' },
	55: { icon: 'meteocons:drizzle-fill', description: 'Dense drizzle' },
	56: { icon: 'meteocons:sleet-fill', description: 'Light freezing drizzle' },
	57: { icon: 'meteocons:sleet-fill', description: 'Dense freezing drizzle' },
	61: { icon: 'meteocons:rain-fill', description: 'Slight rain' },
	63: { icon: 'meteocons:rain-fill', description: 'Moderate rain' },
	65: { icon: 'meteocons:rain-fill', description: 'Heavy rain' },
	66: { icon: 'meteocons:sleet-fill', description: 'Light freezing rain' },
	67: { icon: 'meteocons:sleet-fill', description: 'Heavy freezing rain' },
	71: { icon: 'meteocons:snow-fill', description: 'Slight snow fall' },
	73: { icon: 'meteocons:snow-fill', description: 'Moderate snow fall' },
	75: { icon: 'meteocons:snow-fill', description: 'Heavy snow fall' },
	77: { icon: 'meteocons:snow-fill', description: 'Snow grains' },
	80: { icon: 'meteocons:rain-fill', description: 'Slight rain showers' },
	81: { icon: 'meteocons:rain-fill', description: 'Moderate rain showers' },
	82: { icon: 'meteocons:rain-fill', description: 'Violent rain showers' },
	85: { icon: 'meteocons:snow-fill', description: 'Slight snow showers' },
	86: { icon: 'meteocons:snow-fill', description: 'Heavy snow showers' },
	95: { icon: 'meteocons:thunderstorms-fill', description: 'Thunderstorm' },
	96: {
		icon: 'meteocons:thunderstorms-rain-fill',
		description: 'Thunderstorm with slight hail',
	},
	99: {
		icon: 'meteocons:thunderstorms-rain-fill',
		description: 'Thunderstorm with heavy hail',
	},
}
const GET = async ({ url }) => {
	console.log('Weather API called with params:', url.searchParams.toString())
	try {
		const latParam = url.searchParams.get('lat') || '51.5074'
		const lonParam = url.searchParams.get('lon') || '-0.1278'
		console.log(`Parsing coordinates: lat=${latParam}, lon=${lonParam}`)
		const latitude = parseFloat(latParam)
		const longitude = parseFloat(lonParam)
		if (isNaN(latitude) || isNaN(longitude)) {
			console.error('Invalid coordinates received')
			return new Response(
				JSON.stringify({
					error: 'Invalid coordinates',
					message: 'Latitude and longitude must be valid numbers',
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
		if (
			latitude < -90 ||
			latitude > 90 ||
			longitude < -180 ||
			longitude > 180
		) {
			console.error('Coordinates out of range')
			return new Response(
				JSON.stringify({
					error: 'Invalid coordinate range',
					message: 'Coordinates out of valid range',
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
		console.log(`Valid coordinates: ${latitude}, ${longitude}`)
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`
		console.log('Fetching weather data from:', weatherUrl)
		let weatherResponse
		try {
			weatherResponse = await fetch(weatherUrl, {
				headers: { 'User-Agent': 'WeatherApp/1.0' },
			})
		} catch (fetchError) {
			console.error('Weather fetch failed:', fetchError)
			return new Response(
				JSON.stringify({
					error: 'Network error',
					message: 'Failed to fetch weather data',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
		if (!weatherResponse.ok) {
			console.error(`Weather API error: ${weatherResponse.status}`)
			return new Response(
				JSON.stringify({
					error: 'Weather service error',
					message: `Weather API returned ${weatherResponse.status}`,
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
		let weatherData
		try {
			weatherData = await weatherResponse.json()
			console.log('Weather data received successfully')
		} catch (parseError) {
			console.error('Failed to parse weather response:', parseError)
			return new Response(
				JSON.stringify({
					error: 'Invalid response',
					message: 'Weather API returned invalid data',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
		if (!weatherData?.current || !weatherData?.daily) {
			console.error('Missing essential weather data')
			return new Response(
				JSON.stringify({
					error: 'Incomplete data',
					message: 'Weather API returned incomplete data',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}
		console.log('Processing weather data...')
		let cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
		try {
			const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
			const geocodeResponse = await fetch(geocodeUrl, {
				headers: {
					'User-Agent': 'WeatherApp/1.0',
					Accept: 'application/json',
				},
			})
			if (geocodeResponse.ok) {
				const geocodeData = await geocodeResponse.json()
				const extractedCity =
					geocodeData.address?.city ||
					geocodeData.address?.town ||
					geocodeData.address?.village ||
					geocodeData.display_name?.split(',')[0]?.trim()
				if (extractedCity) {
					cityName = extractedCity
				}
			}
		} catch {
			console.warn('Geocoding failed, using coordinates as city name')
		}
		const currentWeatherCode = weatherData.current?.weather_code ?? 0
		const currentTemp = weatherData.current?.temperature_2m ?? 0
		const currentWeather = weatherCodeToIcon[currentWeatherCode] || {
			icon: 'meteocons:clear-day-fill',
			description: 'Unknown',
		}
		const dailyForecast = []
		try {
			if (weatherData.daily?.time && Array.isArray(weatherData.daily.time)) {
				for (let i = 1; i < Math.min(4, weatherData.daily.time.length); i++) {
					const time = weatherData.daily.time[i]
					const weatherCode = weatherData.daily.weather_code?.[i] ?? 0
					const maxTemp =
						weatherData.daily.temperature_2m_max?.[i] ?? currentTemp
					const minTemp =
						weatherData.daily.temperature_2m_min?.[i] ?? currentTemp
					const weather = weatherCodeToIcon[weatherCode] || {
						icon: 'meteocons:clear-day-fill',
						description: 'Unknown',
					}
					const date = new Date(time)
					const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
					dailyForecast.push({
						date: time,
						day: dayName,
						maxTemp: Math.round(maxTemp),
						minTemp: Math.round(minTemp),
						weatherCode,
						icon: weather.icon,
						description: weather.description,
					})
				}
			}
		} catch (dailyError) {
			console.error('Error processing daily forecast:', dailyError)
		}
		while (dailyForecast.length < 3) {
			const futureDate = /* @__PURE__ */ new Date()
			futureDate.setDate(futureDate.getDate() + dailyForecast.length + 1)
			dailyForecast.push({
				date: futureDate.toISOString().split('T')[0],
				day: futureDate.toLocaleDateString('en-US', { weekday: 'short' }),
				maxTemp: Math.round(currentTemp + 2),
				minTemp: Math.round(currentTemp - 2),
				weatherCode: currentWeatherCode,
				icon: currentWeather.icon,
				description: currentWeather.description,
			})
		}
		const finalResponse = {
			location: {
				latitude: weatherData.latitude ?? latitude,
				longitude: weatherData.longitude ?? longitude,
				city: cityName,
			},
			current: {
				time:
					weatherData.current?.time ?? /* @__PURE__ */ new Date().toISOString(),
				temperature: Math.round(currentTemp),
				weatherCode: currentWeatherCode,
				icon: currentWeather.icon,
				description: currentWeather.description,
			},
			daily: dailyForecast,
		}
		console.log('Returning successful response')
		return new Response(JSON.stringify(finalResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
			},
		})
	} catch (error) {
		console.error('Unexpected error in weather API:', error)
		const errorResponse = {
			error: 'Server error',
			message:
				error instanceof Error ? error.message : 'An unexpected error occurred',
			timestamp: /* @__PURE__ */ new Date().toISOString(),
		}
		return new Response(JSON.stringify(errorResponse), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}

const _page = /*#__PURE__*/ Object.freeze(
	/*#__PURE__*/ Object.defineProperty(
		{
			__proto__: null,
			GET,
			prerender,
		},
		Symbol.toStringTag,
		{ value: 'Module' },
	),
)

const page = () => _page

export { page }
