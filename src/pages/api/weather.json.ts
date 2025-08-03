export const prerender = false

import type { APIRoute } from 'astro'

// Weather code to icon mapping based on Open-Meteo weather codes
// https://open-meteo.com/en/docs/
const weatherCodeToIcon: Record<number, { icon: string; description: string }> =
	{
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
			icon: 'meteocons:thunderstorms-fill',
			description: 'Thunderstorm with slight hail',
		},
		99: {
			icon: 'meteocons:thunderstorms-fill',
			description: 'Thunderstorm with heavy hail',
		},
	}

interface WeatherApiResponse {
	latitude: number
	longitude: number
	current: {
		time: string
		temperature_2m: number
		weather_code: number
	}
	daily: {
		time: string[]
		temperature_2m_max: number[]
		temperature_2m_min: number[]
		weather_code: number[]
	}
}

export const GET: APIRoute = async ({ url }) => {
	try {
		// Get coordinates from query parameters with defaults
		const latParam = url.searchParams.get('lat') || '51.5074'
		const lonParam = url.searchParams.get('lon') || '-0.1278'

		// Parse and validate coordinates
		const latitude = parseFloat(latParam)
		const longitude = parseFloat(lonParam)

		if (isNaN(latitude) || isNaN(longitude)) {
			return new Response(
				JSON.stringify({
					error: 'Invalid coordinates',
					message: 'Latitude and longitude must be valid numbers',
					code: '400',
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
			return new Response(
				JSON.stringify({
					error: 'Invalid coordinate range',
					message: 'Coordinates out of valid range',
					code: '400',
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		// Simplified weather API URL
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`

		// Fetch weather data with timeout
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

		let weatherResponse: Response
		try {
			weatherResponse = await fetch(weatherUrl, {
				signal: controller.signal,
				headers: {
					'User-Agent': 'WeatherApp/1.0',
					Accept: 'application/json',
				},
			})
			clearTimeout(timeoutId)
		} catch (fetchError: unknown) {
			clearTimeout(timeoutId)
			const errorMessage =
				fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
			return new Response(
				JSON.stringify({
					error: 'Network error',
					message: `Failed to fetch weather data - ${errorMessage}`,
					code: '502',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		if (!weatherResponse.ok) {
			return new Response(
				JSON.stringify({
					error: 'Weather service error',
					message: `Weather API returned status ${weatherResponse.status}`,
					code: '502',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		let weatherData: WeatherApiResponse
		try {
			weatherData = await weatherResponse.json()
		} catch (parseError: unknown) {
			const errorMessage =
				parseError instanceof Error ? parseError.message : 'Parse error'
			return new Response(
				JSON.stringify({
					error: 'Invalid response',
					message: `Weather API returned invalid JSON data: ${errorMessage}`,
					code: '502',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		// Validate essential data
		if (!weatherData?.current || !weatherData?.daily) {
			return new Response(
				JSON.stringify({
					error: 'Incomplete data',
					message: 'Weather API returned incomplete data',
					code: '502',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		// Simplified city name - just use coordinates to avoid geocoding timeout
		const cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`

		// Process current weather
		const currentWeatherCode = weatherData.current?.weather_code ?? 0
		const currentTemp = weatherData.current?.temperature_2m ?? 0
		const currentWeather = weatherCodeToIcon[currentWeatherCode] || {
			icon: 'meteocons:overcast-fill',
			description: 'Unknown',
		}

		// Process daily forecast - simplified and safe
		const dailyForecast = []
		try {
			if (weatherData.daily?.time && Array.isArray(weatherData.daily.time)) {
				// Get next 3 days (skip today)
				for (let i = 1; i < Math.min(4, weatherData.daily.time.length); i++) {
					const time = weatherData.daily.time[i]
					const weatherCode = weatherData.daily.weather_code?.[i] ?? 0
					const maxTemp =
						weatherData.daily.temperature_2m_max?.[i] ?? currentTemp
					const minTemp =
						weatherData.daily.temperature_2m_min?.[i] ?? currentTemp

					const weather = weatherCodeToIcon[weatherCode] || {
						icon: 'meteocons:overcast-fill',
						description: 'Unknown',
					}

					// Simple date formatting
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
		} catch {
			// Continue without daily forecast - we'll create fallback data
		}

		// Ensure we have at least some forecast data
		while (dailyForecast.length < 3) {
			const futureDate = new Date()
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

		// Build final response
		const finalResponse = {
			location: {
				latitude: weatherData.latitude ?? latitude,
				longitude: weatherData.longitude ?? longitude,
				city: cityName,
			},
			current: {
				time: weatherData.current?.time ?? new Date().toISOString(),
				temperature: Math.round(currentTemp),
				weatherCode: currentWeatherCode,
				icon: currentWeather.icon,
				description: currentWeather.description,
			},
			daily: dailyForecast,
		}

		return new Response(JSON.stringify(finalResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		})
	} catch (error: unknown) {
		// Always return a valid JSON error response
		const errorMessage =
			error instanceof Error ? error.message : 'An unexpected error occurred'
		const errorResponse = {
			error: 'Server error',
			message: errorMessage,
			code: '500',
			timestamp: new Date().toISOString(),
		}

		return new Response(JSON.stringify(errorResponse), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
