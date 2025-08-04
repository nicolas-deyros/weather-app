export const prerender = false

import type { APIRoute } from 'astro'

// Weather code mapping for Open-Meteo WMO codes
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
		61: { icon: 'meteocons:rain-fill', description: 'Slight rain' },
		63: { icon: 'meteocons:rain-fill', description: 'Moderate rain' },
		65: { icon: 'meteocons:rain-fill', description: 'Heavy rain' },
		71: { icon: 'meteocons:snow-fill', description: 'Slight snow' },
		73: { icon: 'meteocons:snow-fill', description: 'Moderate snow' },
		75: { icon: 'meteocons:snow-fill', description: 'Heavy snow' },
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

export const GET: APIRoute = async ({ url }) => {
	try {
		// Basic setup - get coordinates with simple defaults
		const latitude = parseFloat(url.searchParams.get('lat') || '51.5074')
		const longitude = parseFloat(url.searchParams.get('lon') || '-0.1278')
		const cityName = url.searchParams.get('city') || 'London'

		// Validate basics
		if (isNaN(latitude) || isNaN(longitude)) {
			return new Response(JSON.stringify({ error: 'Invalid coordinates' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		// Build weather URL - simplified
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`

		// Fetch weather data with basic error handling
		const weatherResponse = await fetch(weatherUrl)

		if (!weatherResponse.ok) {
			return new Response(JSON.stringify({ error: 'Weather API failed' }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const weatherData = await weatherResponse.json()

		// Check if we got valid weather data
		if (
			!weatherData.current ||
			weatherData.current.temperature_2m === undefined
		) {
			return new Response(
				JSON.stringify({ error: 'No weather data available' }),
				{
					status: 502,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		// Basic response structure using real API data
		const response = {
			location: { latitude, longitude, city: cityName },
			current: {
				temperature: Math.round(weatherData.current.temperature_2m),
				weatherCode: weatherData.current.weather_code,
				icon:
					weatherCodeToIcon[weatherData.current.weather_code]?.icon ||
					'meteocons:clear-day-fill',
				description:
					weatherCodeToIcon[weatherData.current.weather_code]?.description ||
					'Clear',
			},
			daily: [
				{
					day: 'Tomorrow',
					maxTemp: Math.round(
						weatherData.daily?.temperature_2m_max?.[1] ||
							weatherData.daily?.temperature_2m_max?.[0] ||
							0,
					),
					minTemp: Math.round(
						weatherData.daily?.temperature_2m_min?.[1] ||
							weatherData.daily?.temperature_2m_min?.[0] ||
							0,
					),
					icon:
						weatherCodeToIcon[
							weatherData.daily?.weather_code?.[1] ||
								weatherData.daily?.weather_code?.[0] ||
								0
						]?.icon || 'meteocons:clear-day-fill',
				},
				{
					day: 'Day 2',
					maxTemp: Math.round(
						weatherData.daily?.temperature_2m_max?.[2] ||
							weatherData.daily?.temperature_2m_max?.[0] ||
							0,
					),
					minTemp: Math.round(
						weatherData.daily?.temperature_2m_min?.[2] ||
							weatherData.daily?.temperature_2m_min?.[0] ||
							0,
					),
					icon:
						weatherCodeToIcon[
							weatherData.daily?.weather_code?.[2] ||
								weatherData.daily?.weather_code?.[0] ||
								0
						]?.icon || 'meteocons:partly-cloudy-day-fill',
				},
			],
		}

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch {
		return new Response(JSON.stringify({ error: 'Server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
