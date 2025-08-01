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
	hourly: Array<{
		time: string
		temperature: number
		weatherCode: number
		icon: string
		description: string
	}>
}

describe('Weather API Tests', () => {
	const baseUrl = 'http://localhost:3000'

	beforeAll(async () => {
		// Wait a moment for server to be ready
		await new Promise(resolve => setTimeout(resolve, 1000))
	})

	describe('Default Weather Endpoint', () => {
		it('should return weather data for default location (London)', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			expect(response.status).toBe(200)
			expect(response.headers.get('content-type')).toContain('application/json')

			const data: WeatherResponse = await response.json()

			// Check structure
			expect(data).toHaveProperty('location')
			expect(data).toHaveProperty('current')
			expect(data).toHaveProperty('hourly')

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

			// Check hourly data
			expect(Array.isArray(data.hourly)).toBe(true)
			expect(data.hourly.length).toBeGreaterThan(0)

			data.hourly.forEach(hour => {
				expect(hour).toHaveProperty('time')
				expect(hour).toHaveProperty('temperature')
				expect(hour).toHaveProperty('weatherCode')
				expect(hour).toHaveProperty('icon')
				expect(hour).toHaveProperty('description')
				expect(typeof hour.temperature).toBe('number')
				expect(hour.icon).toMatch(/^meteocons:/)
			})
		})
	})

	describe('Custom Location Weather', () => {
		it('should return weather data for New York', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=40.7128&lon=-74.0060`,
			)
			expect(response.status).toBe(200)

			const data: WeatherResponse = await response.json()

			expect(data.location.latitude).toBeCloseTo(40.7128, 1)
			expect(data.location.longitude).toBeCloseTo(-74.006, 1)
			expect(data.location.city).toBeTruthy()
			expect(data.location.city.length).toBeGreaterThan(0)
		})

		it('should return weather data for Tokyo', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=35.6762&lon=139.6503`,
			)
			expect(response.status).toBe(200)

			const data: WeatherResponse = await response.json()

			expect(data.location.latitude).toBeCloseTo(35.6762, 1)
			expect(data.location.longitude).toBeCloseTo(139.6503, 1)
			expect(data.location.city).toBeTruthy()
		})

		it('should return weather data for London', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=51.5074&lon=-0.1278`,
			)
			expect(response.status).toBe(200)

			const data: WeatherResponse = await response.json()

			expect(data.location.latitude).toBeCloseTo(51.5074, 1)
			expect(data.location.longitude).toBeCloseTo(-0.1278, 1)
			expect(data.location.city).toBeTruthy()
		})
	})

	describe('Weather Code to Icon Mapping', () => {
		it('should map weather codes to valid meteocons icons', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			// Check current weather icon
			expect(data.current.icon).toMatch(/^meteocons:[\w-]+$/)
			expect(data.current.description).toBeTruthy()
			expect(data.current.description.length).toBeGreaterThan(0)

			// Check hourly icons
			data.hourly.forEach(hour => {
				expect(hour.icon).toMatch(/^meteocons:[\w-]+$/)
				expect(hour.description).toBeTruthy()
				expect(hour.description.length).toBeGreaterThan(0)
			})
		})

		it('should have consistent weather codes and descriptions', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			// Current weather consistency
			expect(data.current.weatherCode).toBeGreaterThanOrEqual(0)
			expect(data.current.weatherCode).toBeLessThanOrEqual(99)
			expect(data.current.description.length).toBeGreaterThan(0)

			// Hourly weather consistency
			data.hourly.forEach(hour => {
				expect(hour.weatherCode).toBeGreaterThanOrEqual(0)
				expect(hour.weatherCode).toBeLessThanOrEqual(99)
				expect(hour.description.length).toBeGreaterThan(0)
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
			expect(data).toHaveProperty('hourly')
			expect(data.location.city).toBeTruthy()
		})

		it('should handle invalid coordinates', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=invalid&lon=invalid`,
			)
			// Should either return error or default to London
			if (response.status === 200) {
				const data: WeatherResponse = await response.json()
				expect(data).toHaveProperty('current')
				expect(data).toHaveProperty('hourly')
			} else {
				expect(response.status).toBeGreaterThanOrEqual(400)
			}
		})

		it('should handle extreme coordinates', async () => {
			const response = await fetch(
				`${baseUrl}/api/weather.json?lat=1000&lon=1000`,
			)
			// Should either return error or handle gracefully
			if (response.status === 200) {
				const data: WeatherResponse = await response.json()
				expect(data).toHaveProperty('current')
			} else {
				expect(response.status).toBeGreaterThanOrEqual(400)
			}
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

			data.hourly.forEach(hour => {
				expect(hour.temperature).toBeGreaterThan(-60)
				expect(hour.temperature).toBeLessThan(60)
			})
		})

		it('should return valid timestamps', async () => {
			const response = await fetch(`${baseUrl}/api/weather.json`)
			const data: WeatherResponse = await response.json()

			const currentTime = new Date(data.current.time)
			expect(currentTime.getTime()).not.toBeNaN()

			data.hourly.forEach(hour => {
				const hourTime = new Date(hour.time)
				expect(hourTime.getTime()).not.toBeNaN()
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
