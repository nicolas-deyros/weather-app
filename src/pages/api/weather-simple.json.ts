export const prerender = false

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
	console.log(
		'Simple weather API called with params:',
		url.searchParams.toString(),
	)

	try {
		// Get coordinates from query parameters, default to London
		const latParam = url.searchParams.get('lat') || '51.5074'
		const lonParam = url.searchParams.get('lon') || '-0.1278'
		const cityParam = url.searchParams.get('city') // Optional city name from frontend

		console.log(`Parsing coordinates: lat=${latParam}, lon=${lonParam}`)

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

		// Build the Open-Meteo API URL
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`

		console.log('Fetching weather data from:', weatherUrl)

		// Simple fetch without AbortController (for testing)
		const weatherResponse = await fetch(weatherUrl, {
			headers: {
				'User-Agent': 'WeatherApp/1.0',
				Accept: 'application/json',
			},
		})

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

		const weatherData = await weatherResponse.json()
		console.log('Weather data received successfully')

		// Use provided city name or coordinates
		const cityName =
			cityParam || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`

		// Simple response
		const finalResponse = {
			location: {
				latitude,
				longitude,
				city: cityName,
			},
			current: {
				time: weatherData.current?.time ?? new Date().toISOString(),
				temperature: Math.round(weatherData.current?.temperature_2m ?? 0),
				weatherCode: weatherData.current?.weather_code ?? 0,
			},
			status: 'simplified version working',
		}

		console.log('Returning successful response for city:', cityName)
		return new Response(JSON.stringify(finalResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
			},
		})
	} catch (error) {
		console.error('Unexpected error in simple weather API:', error)

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
