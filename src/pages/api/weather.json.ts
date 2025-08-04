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
	console.log('Weather API called with params:', url.searchParams.toString())

	try {
		// Get coordinates from query parameters, default to London
		const latParam = url.searchParams.get('lat') || '51.5074'
		const lonParam = url.searchParams.get('lon') || '-0.1278'
		const cityParam = url.searchParams.get('city') // Optional city name from frontend

		console.log(`Parsing coordinates: lat=${latParam}, lon=${lonParam}`)
		if (cityParam) {
			console.log(`Using provided city name: ${cityParam}`)
		}

		// Validate coordinates
		const latitude = parseFloat(latParam)
		const longitude = parseFloat(lonParam)

		if (isNaN(latitude) || isNaN(longitude)) {
			console.error('Invalid coordinates received')
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
			console.error('Coordinates out of range')
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

		console.log(`Valid coordinates: ${latitude}, ${longitude}`)

		// Build the Open-Meteo API URL (simplified)
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`

		console.log('Fetching weather data from:', weatherUrl)

		// Fetch weather data with robust error handling for production
		let weatherResponse: Response
		try {
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 8000) // 8-second timeout

			weatherResponse = await fetch(weatherUrl, {
				headers: {
					'User-Agent': 'WeatherApp/1.0',
					Accept: 'application/json',
				},
				signal: controller.signal,
			})

			clearTimeout(timeoutId)
		} catch (fetchError) {
			console.error('Weather fetch failed:', fetchError)
			return new Response(
				JSON.stringify({
					error: 'Network error',
					message: 'Failed to fetch weather data from Open-Meteo API',
					code: '502',
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
					message: `Open-Meteo API returned status ${weatherResponse.status}`,
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
			console.log('Weather data received successfully')
		} catch (parseError) {
			console.error('Failed to parse weather response:', parseError)
			return new Response(
				JSON.stringify({
					error: 'Invalid response',
					message: 'Open-Meteo API returned invalid JSON data',
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
			console.error('Missing essential weather data:', {
				hasCurrentData: !!weatherData?.current,
				hasDailyData: !!weatherData?.daily,
				receivedData: weatherData,
			})
			return new Response(
				JSON.stringify({
					error: 'Incomplete data',
					message: 'Open-Meteo API returned incomplete weather data',
					code: '502',
				}),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		console.log('Processing weather data...')

		// Get city name - use provided city name if available
		let cityName =
			cityParam || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`

		// If no city name was provided, try to resolve it
		if (!cityParam) {
			// Simple city lookup for common locations
			const commonCities = [
				{ lat: 51.5074, lon: -0.1278, name: 'London' },
				{ lat: 40.7128, lon: -74.006, name: 'New York' },
				{ lat: 48.8566, lon: 2.3522, name: 'Paris' },
				{ lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
				{ lat: -33.8688, lon: 151.2093, name: 'Sydney' },
				{ lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
				{ lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
				{ lat: 41.8781, lon: -87.6298, name: 'Chicago' },
				{ lat: 52.52, lon: 13.405, name: 'Berlin' },
				{ lat: 55.7558, lon: 37.6176, name: 'Moscow' },
			]

			// Check if coordinates match a known city (within 0.1 degree tolerance)
			for (const city of commonCities) {
				if (
					Math.abs(latitude - city.lat) < 0.1 &&
					Math.abs(longitude - city.lon) < 0.1
				) {
					cityName = city.name
					console.log(`Matched known city: ${cityName}`)
					break
				}
			}

			// If no match found, try geocoding as fallback
			if (cityName === `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`) {
				try {
					console.log('Attempting to get city name via geocoding...')
					const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
					console.log('Geocoding URL:', geocodeUrl)

					const controller = new AbortController()
					const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout for geocoding

					const geocodeResponse = await fetch(geocodeUrl, {
						headers: {
							'User-Agent': 'WeatherApp/1.0',
							Accept: 'application/json',
						},
						signal: controller.signal,
					})

					clearTimeout(timeoutId)

					if (geocodeResponse.ok) {
						const geocodeData = await geocodeResponse.json()
						console.log('Geocoding response received:', geocodeData)

						const extractedCity =
							geocodeData.address?.city ||
							geocodeData.address?.town ||
							geocodeData.address?.village ||
							geocodeData.display_name?.split(',')[0]?.trim()

						if (extractedCity) {
							cityName = extractedCity
							console.log('Extracted city name:', cityName)
						} else {
							console.log(
								'No city name found in geocoding response, using coordinates',
							)
						}
					} else {
						console.warn(
							`Geocoding API returned status ${geocodeResponse.status}`,
						)
					}
				} catch (geocodeError) {
					console.warn('Geocoding failed:', geocodeError)
					// Keep the coordinate-based name - this is fine in production
				}
			}
		} else {
			console.log(`Using provided city name: ${cityName}`)
		}

		// Process current weather
		const currentWeatherCode = weatherData.current?.weather_code ?? 0
		const currentTemp = weatherData.current?.temperature_2m ?? 0
		const currentWeather = weatherCodeToIcon[currentWeatherCode] || {
			icon: 'meteocons:clear-day-fill',
			description: 'Unknown',
		}

		// Process daily forecast - simplified
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
						icon: 'meteocons:clear-day-fill',
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
		} catch (dailyError) {
			console.error('Error processing daily forecast:', dailyError)
			// Continue without daily forecast
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

		// console.log('Returning successful response')
		console.log('Returning successful response for city:', cityName)
		return new Response(JSON.stringify(finalResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
			},
		})
	} catch (error) {
		console.error('Unexpected error in weather API:', error)

		// Always return a valid JSON error response
		const errorResponse = {
			error: 'Server error',
			message:
				error instanceof Error ? error.message : 'An unexpected error occurred',
			code: '500',
			timestamp: new Date().toISOString(),
		}

		return new Response(JSON.stringify(errorResponse), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
