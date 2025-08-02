import { describe, it, expect, beforeAll } from 'vitest'

interface WeatherResponse {
	location: {
		latitude: number
		longitude: number
		city: string
	}
	current: {
		time: string
		temperature: number
		weatherCode: number
		icon: string
		description: string
	}
	daily: Array<{
		time: string
		day: string
		maxTemp: number
		minTemp: number
		weatherCode: number
		icon: string
		description: string
	}>
}

describe('Weather API Tests', () => {
	const baseUrl = 'http://localhost:3001'

	// Helper function to check if server is ready
	async function waitForServer(maxAttempts = 10, delay = 1000) {
		for (let i = 0; i < maxAttempts; i++) {
			try {
				// Use AbortController for better compatibility
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 5000)

				const response = await fetch(baseUrl, {
					method: 'HEAD',
					signal: controller.signal,
				})

				clearTimeout(timeoutId)

				if (response.ok) {
					console.log(`API test: Server is ready after ${i + 1} attempts`)
					return true
				}
			} catch {
				console.log(
					`API test: Attempt ${i + 1}/${maxAttempts}: Server not ready, waiting...`,
				)
				await new Promise(resolve => setTimeout(resolve, delay))
			}
		}
		throw new Error(
			'Server did not become ready within the expected time for API tests',
		)
	}

	beforeAll(async () => {
		// Wait for server to be ready with retry logic
		await waitForServer()
	}, 30000) // 30 second timeout for server startup

	describe('Default Weather Endpoint', () => {
		it('should return weather data for default location (London)', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			expect(response.status).toBe(200)
			expect(response.headers.get('content-type')).toContain('application/json')

			const data: WeatherResponse = await response.json()

			// Check structure
			expect(data).toHaveProperty('location')
			expect(data).toHaveProperty('current')
			expect(data).toHaveProperty('daily')

			// Check location
			expect(data.location).toHaveProperty('latitude')
			expect(data.location).toHaveProperty('longitude')
			expect(data.location).toHaveProperty('city')
			expect(typeof data.location.city).toBe('string')
			expect(data.location.city.length).toBeGreaterThan(0)

			// Check current weather
			expect(data.current).toHaveProperty('time')
			expect(data.current).toHaveProperty('temperature')
			expect(data.current).toHaveProperty('weatherCode')
			expect(data.current).toHaveProperty('icon')
			expect(data.current).toHaveProperty('description')

			expect(typeof data.current.temperature).toBe('number')
			expect(typeof data.current.weatherCode).toBe('number')
			expect(data.current.icon).toMatch(/^meteocons:/)

			// Check daily data
			expect(Array.isArray(data.daily)).toBe(true)
			expect(data.daily.length).toBeGreaterThan(0)
			expect(data.daily.length).toBeLessThanOrEqual(3) // Max 3 days

			data.daily.forEach(day => {
				expect(day).toHaveProperty('time')
				expect(day).toHaveProperty('day')
				expect(day).toHaveProperty('maxTemp')
				expect(day).toHaveProperty('minTemp')
				expect(day).toHaveProperty('weatherCode')
				expect(day).toHaveProperty('icon')
				expect(day).toHaveProperty('description')
				expect(typeof day.maxTemp).toBe('number')
				expect(typeof day.minTemp).toBe('number')
				expect(day.maxTemp).toBeGreaterThanOrEqual(day.minTemp)
				expect(day.icon).toMatch(/^meteocons:/)
				expect(typeof day.day).toBe('string')
			})
		})
	})

	describe('Custom Location Weather', () => {
		const locations = [
			{ name: 'New York', lat: 40.7128, lon: -74.006 },
			{ name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
			{ name: 'London', lat: 51.5074, lon: -0.1278 },
		]

		it.each(locations)(
			'should return weather data for $name',
			async ({ lat, lon }) => {
				const response = await fetch(
					`${baseUrl}/api/weather.json?lat=${lat}&lon=${lon}`,
				)
				expect(response.status).toBe(200)

				const data: WeatherResponse = await response.json()

				expect(data.location.latitude).toBeCloseTo(lat, 1)
				expect(data.location.longitude).toBeCloseTo(lon, 1)
				expect(data.location.city).toBeTruthy()
				expect(data.location.city.length).toBeGreaterThan(0)
			},
		)
	})

	describe('Weather Code to Icon Mapping', () => {
		it('should map weather codes to valid meteocons icons', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			// Check current weather icon
			expect(data.current.icon).toMatch(/^meteocons:[\w-]+$/)
			expect(data.current.description).toBeTruthy()
			expect(data.current.description.length).toBeGreaterThan(0)

			// Check daily icons
			data.daily.forEach(day => {
				expect(day.icon).toMatch(/^meteocons:[\w-]+$/)
				expect(day.description).toBeTruthy()
				expect(day.description.length).toBeGreaterThan(0)
			})
		})

		it('should have consistent weather codes and descriptions', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			// Current weather consistency
			expect(data.current.weatherCode).toBeGreaterThanOrEqual(0)
			expect(data.current.weatherCode).toBeLessThanOrEqual(99)
			expect(data.current.description.length).toBeGreaterThan(0)

			// Daily weather consistency
			data.daily.forEach(day => {
				expect(day.weatherCode).toBeGreaterThanOrEqual(0)
				expect(day.weatherCode).toBeLessThanOrEqual(99)
				expect(day.description.length).toBeGreaterThan(0)
			})
		})
	})

	describe('Error Handling', () => {
		it('should handle missing coordinates gracefully', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			// Should default to London and still work
			expect(response.status).toBe(200)
			const data: WeatherResponse = await response.json()
			expect(data).toHaveProperty('current')
			expect(data).toHaveProperty('daily')
			expect(data.location.city).toBeTruthy()
		})

		it('should return a 400 error for invalid coordinates', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=invalid&lon=invalid`,
			)
			expect(response.status).toBe(400)
			const data = await response.json()
			expect(data).toHaveProperty('error')
		})

		it('should return a 400 error for extreme coordinates', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=1000&lon=1000`,
			)
			expect(response.status).toBe(400)
			const data = await response.json()
			expect(data).toHaveProperty('error')
		})
	})

	describe('Response Performance', () => {
		it('should respond within reasonable time', async () => {
			const startTime = Date.now()
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const endTime = Date.now()

			expect(response.status).toBe(200)
			expect(endTime - startTime).toBeLessThan(5000) // 5 seconds max
		})

		it('should handle concurrent requests', async () => {
			const locations = [
				{ lat: 40.7128, lon: -74.006 }, // New York
				{ lat: 51.5074, lon: -0.1278 }, // London
			]

			const requests = locations.map(({ lat, lon }) =>
				fetch(`${baseUrl}/api/weather.json?lat=${lat}&lon=${lon}`),
			)

			const responses = await Promise.all(requests)

			responses.forEach(response => {
				expect(response.status).toBe(200)
			})
		}, 10000) // 10 second timeout
	})

	describe('Data Validation', () => {
		it('should return valid temperature ranges', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			// Reasonable temperature range (-60°C to 60°C)
			expect(data.current.temperature).toBeGreaterThan(-60)
			expect(data.current.temperature).toBeLessThan(60)

			data.daily.forEach(day => {
				expect(day.maxTemp).toBeGreaterThan(-60)
				expect(day.maxTemp).toBeLessThan(60)
				expect(day.minTemp).toBeGreaterThan(-60)
				expect(day.minTemp).toBeLessThan(60)
			})
		})

		it('should return valid timestamps', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			const currentTime = new Date(data.current.time)
			expect(currentTime.getTime()).not.toBeNaN()

			data.daily.forEach(day => {
				const dayTime = new Date(day.time)
				expect(dayTime.getTime()).not.toBeNaN()
			})
		})

		it('should return valid coordinates', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			// Valid latitude: -90 to 90
			expect(data.location.latitude).toBeGreaterThanOrEqual(-90)
			expect(data.location.latitude).toBeLessThanOrEqual(90)

			// Valid longitude: -180 to 180
			expect(data.location.longitude).toBeGreaterThanOrEqual(-180)
			expect(data.location.longitude).toBeLessThanOrEqual(180)
		})
	})
})
