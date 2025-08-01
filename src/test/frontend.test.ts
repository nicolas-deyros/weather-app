import { describe, it, expect, beforeAll } from 'vitest'

describe('Frontend Integration Tests', () => {
	const baseUrl = 'http://localhost:3000'

	beforeAll(async () => {
		// Wait for server to be ready
		await new Promise(resolve => setTimeout(resolve, 1000))
	})

	describe('Page Loading Tests', () => {
		it('should load the main page successfully', async () => {
			const response = await fetch(baseUrl)
			expect(response.status).toBe(200)
			expect(response.headers.get('content-type')).toContain('text/html')
		})

		it('should contain essential HTML structure', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for essential page elements
			expect(html).toContain('Weather App')
			expect(html).toContain('<!DOCTYPE html>')
			expect(html).toContain('<html')
			expect(html).toContain('<head>')
			// In development mode, Vite may minify HTML, so check for body class instead
			expect(html).toMatch(/<body[^>]*class="min-h-screen/)
		})

		it('should include Tailwind CSS', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Should contain Tailwind classes and styles
			expect(html).toContain('bg-gradient-to-br')
			expect(html).toContain('backdrop-blur')
			expect(html).toContain('rounded-xl')
		})
	})

	describe('Weather Display Integration', () => {
		it('should display weather container', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for weather container
			expect(html).toContain('weather-container')
			expect(html).toContain('London')
		})

		it('should include location search component', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for LocationSearch component elements that are always present
			expect(html).toContain('id="geolocationButton"')
			expect(html).toContain('title="Use current location"')
			expect(html).toContain('Search for a city')
		})

		it('should display temperature unit toggle', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for temperature toggle buttons
			expect(html).toContain('°C')
			expect(html).toContain('°F')
			expect(html).toContain('switchToUnit')
		})
	})

	describe('JavaScript Integration', () => {
		it('should include location selection buttons with onclick handlers', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for city buttons with onclick handlers
			expect(html).toContain('New York')
			expect(html).toContain('Tokyo')
			expect(html).toContain('Sydney')
			expect(html).toContain('Paris')
			expect(html).toContain('onclick="loadWeather')
		})

		it('should include script modules for JavaScript functionality', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for script modules
			expect(html).toContain('<script type="module"')
			expect(html).toContain('/src/pages/index.astro?astro&type=script')
		})

		it('should include meteocons weather icons', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for weather icons
			expect(html).toContain('meteocons:')
			expect(html).toContain('data-icon="meteocons:')
		})
	})

	describe('Responsive Design', () => {
		it('should include responsive CSS classes', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for responsive classes
			expect(html).toContain('grid-cols-')
			expect(html).toContain('max-w-')
			expect(html).toContain('container')
		})

		it('should have mobile-friendly meta tags', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for mobile viewport
			expect(html).toContain('viewport')
			expect(html).toContain('width=device-width')
		})
	})

	describe('Component Integration', () => {
		it('should integrate LocationSearch component', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for search functionality elements
			expect(html).toContain('locationSearch')
			expect(html).toContain('searchButton')
			expect(html).toContain('geolocationButton')
		})

		it('should display weather data structure', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for weather data display elements
			expect(html).toContain('currentTemp')
			expect(html).toContain('hourlyForecast')
			expect(html).toContain('London')
		})
	})

	describe('Weather Data Display', () => {
		it('should show current weather information', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for current weather display
			expect(html).toContain('°C') // Temperature display
			expect(html).toContain('Weather Code:') // Debug info
			// Check for some weather description text (flexible since weather changes)
			const hasWeatherDescription = html.includes('Overcast') || 
				html.includes('Clear') || 
				html.includes('Cloudy') || 
				html.includes('Rain') || 
				html.includes('Sunny') ||
				html.includes('Partly') ||
				html.includes('Slight')
			expect(hasWeatherDescription).toBe(true)
		})

		it('should display hourly forecast', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for hourly forecast
			expect(html).toContain('Next 6 Hours')
			expect(html).toContain('12:00 AM')
			expect(html).toContain('hourly-temp')
		})
	})

	describe('Interactive Elements', () => {
		it('should include interactive buttons with proper handlers', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for interactive elements
			expect(html).toContain(
				'onclick="loadWeather(40.7128, -74.0060, \'New York\')"',
			)
			expect(html).toContain('onclick="switchToUnit(\'celsius\')"')
			expect(html).toContain('onclick="switchToUnit(\'fahrenheit\')"')
		})

		it('should include form elements for search', async () => {
			const response = await fetch(baseUrl)
			const html = await response.text()

			// Check for search form elements
			expect(html).toContain('input type="text" id="locationSearch"')
			expect(html).toContain('button id="searchButton"')
			expect(html).toContain('button id="geolocationButton"')
		})
	})
})
