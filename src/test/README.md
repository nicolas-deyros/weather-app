# Weather App Test Suite

## Overview

This directory contains comprehensive tests for the weather application, covering both API functionality and frontend integration.

## Test Files

### 1. `api.test.ts` - API Tests

Tests the weather API endpoints including:

- **Endpoint Availability**: Basic API response and JSON format
- **Location Parameters**: Testing different city coordinates
- **Data Structure**: Validating response format and required fields
- **Weather Code Mapping**: Ensuring proper icon mapping
- **Error Handling**: Invalid coordinates and edge cases
- **Performance**: Response time and concurrent request handling

### 2. `frontend.test.ts` - Frontend Integration Tests

Tests the web interface including:

- **Page Loading**: Main page and parameterized URLs
- **Weather Data Display**: Integration with API data
- **Debug Information**: Debug section functionality
- **Interactive Elements**: Buttons and JavaScript functions
- **Icon Integration**: Astro Icon component rendering

### 3. `utils.test.ts` - Utility Functions Tests

Tests core functionality including:

- **Weather Code Mapping**: Icon and description validation
- **Data Validation**: Temperature, coordinates, weather codes
- **Mock Data**: Test data structure validation

## Running Tests

### Prerequisites

Make sure your development server is running:

```bash
npm run dev
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
# API tests only
npm test api.test.ts

# Frontend tests only
npm test frontend.test.ts

# Utility tests only
npm test utils.test.ts
```

### Run Comprehensive Test Script

For a complete test suite including manual API checks:

```bash
bash test-app.sh
```

## Test Categories

### 🔗 API Tests

- ✅ Basic endpoint functionality
- ✅ Location parameter handling (New York, London, Tokyo, Sydney, Miami)
- ✅ Response data structure validation
- ✅ Weather code to icon mapping
- ✅ Error handling for invalid inputs
- ✅ Performance and concurrent request handling

### 🎨 Frontend Tests

- ✅ Page loading with and without parameters
- ✅ Weather data integration and display
- ✅ Debug information visibility
- ✅ Interactive button functionality
- ✅ JavaScript integration

### 🛠️ Utility Tests

- ✅ Weather code mapping validation
- ✅ Data validation functions
- ✅ Mock data structure verification

### 🚀 Performance Tests

- ✅ API response time (< 5 seconds)
- ✅ Page load time (< 3 seconds)
- ✅ Concurrent request handling

## Expected Test Results

### API Response Format

```json
{
	"location": {
		"latitude": 40.710335,
		"longitude": -73.99309
	},
	"current": {
		"time": "2025-07-31T12:30",
		"temperature": 32,
		"weatherCode": 1,
		"icon": "meteocons:partly-cloudy-day-fill",
		"description": "Mainly clear"
	},
	"hourly": [
		{
			"time": "2025-07-31T13:00",
			"temperature": 33,
			"weatherCode": 1,
			"icon": "meteocons:partly-cloudy-day-fill",
			"description": "Mainly clear"
		}
	]
}
```

### Weather Icon Mapping

- `0` → `meteocons:clear-day-fill` (Clear sky)
- `1-2` → `meteocons:partly-cloudy-day-fill` (Partly cloudy)
- `3` → `meteocons:overcast-fill` (Overcast)
- `45,48` → `meteocons:fog-fill` (Fog)
- `51,53,55` → `meteocons:drizzle-fill` (Drizzle)
- `61,63,65,80,81,82` → `meteocons:rain-fill` (Rain)
- `71,73,75,77,85,86` → `meteocons:snow-fill` (Snow)
- `95` → `meteocons:thunderstorms-fill` (Thunderstorm)
- `96,99` → `meteocons:thunderstorms-rain-fill` (Thunderstorm with hail)

## Debugging Failed Tests

### Common Issues

1. **Server not running**: Ensure `npm run dev` is active
2. **API timeout**: Check Open-Meteo API availability
3. **Missing dependencies**: Run `npm install`
4. **Port conflicts**: Verify port 3000 is available

### Debug Commands

```bash
# Check API directly
curl "http://localhost:3000/api/weather.json?lat=40.7128&lon=-74.0060"

# Check main page
curl "http://localhost:3000"

# Check page with parameters
curl "http://localhost:3000/?lat=40.7128&lon=-74.0060"
```

### Test Data Validation

The tests validate that:

- Temperatures are reasonable (-100°C to 60°C)
- Weather codes are valid WMO codes (0-99)
- Coordinates are within valid ranges (lat: -90 to 90, lon: -180 to 180)
- Icons follow the `meteocons:*` pattern
- Response times are under performance thresholds

## Continuous Integration

These tests are designed to be run in CI/CD pipelines. The comprehensive test script (`test-app.sh`) provides detailed output suitable for automated testing environments.
