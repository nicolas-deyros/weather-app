# 🌤️ Weather App

A modern, responsive weather application built with Astro, TypeScript, and Tailwind CSS. Features emoji-based weather icons, comprehensive testing suite, and reliable automatic test runners.

![Weather App Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![Tests](https://img.shields.io/badge/Tests-42%20Passing-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Astro](https://img.shields.io/badge/Astro-v5.12.6-orange)

## ✨ Features

- 🌍 **Global Weather Data** - Get weather for any location using Open-Meteo API
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🎨 **Emoji Weather Icons** - Clean, animated emoji-based weather representations
- 🔄 **3-Day Forecasts** - Current weather plus next 3 days
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- � **Location Search** - Search for cities worldwide
- ⚡ **Fast & Lightweight** - Built with Astro for optimal performance
- 🧪 **Comprehensive Testing** - 42 tests covering utils, API, and frontend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nicolas-deyros/weather-app.git
cd weather-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see the app running.

## 🧪 Testing

The app includes a comprehensive testing suite with automatic server management:

### Run All Tests (Recommended)
```bash
# Automatically starts server and runs all tests
npm run test:auto
```

### Individual Test Suites
```bash
# API endpoint tests (requires server)
npm run test:api

# Frontend integration tests (requires server)  
npm run test:frontend

# Utility function tests (no server needed)
npm run test:utils

# Watch mode for development
npm run test:watch
```

### Test Coverage
- **42 Total Tests**: All passing ✅
- **Utils Tests**: 11 tests for weather utilities and calculations
- **API Tests**: 14 tests for weather API endpoints and error handling
- **Frontend Tests**: 17 tests for UI components and integration

## 🏗️ Project Structure

```text
weather-app/
├── src/
│   ├── components/page/          # Reusable Astro components
│   │   ├── Location.astro        # Location selector buttons
│   │   ├── LocationSearch.astro  # Search input component
│   │   └── footer.astro          # App footer
│   ├── pages/
│   │   ├── index.astro           # Main weather page
│   │   └── api/weather.json.ts   # Weather API endpoint
│   ├── styles/
│   │   └── global.css            # Global styles
│   └── test/                     # Test suites
│       ├── api.test.ts           # API endpoint tests
│       ├── frontend.test.ts      # Frontend integration tests
│       └── utils.test.ts         # Utility function tests
├── public/                       # Static assets
├── auto-test.js                  # Automatic test runner
└── package.json                  # Dependencies and scripts
```

## 🛠️ Available Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test:auto` | **Run all tests with automatic server startup** |
| `npm run test` | Run tests (requires server to be running) |
| `npm run test:api` | Run API tests only |
| `npm run test:frontend` | Run frontend tests only |
| `npm run test:utils` | Run utility tests only |
| `npm run lint` | Lint and fix code |

## 🔧 Development

### Architecture
- **Frontend**: Astro + TypeScript + Tailwind CSS
- **Weather API**: Open-Meteo API integration
- **Testing**: Vitest with custom server health checks
- **Icons**: Emoji-based weather representations with animations
- **Styling**: Tailwind CSS with responsive design

### Key Features Implementation
- **Server Health Checks**: Tests wait for server startup before running  
- **Error Handling**: Comprehensive error handling for API failures
- **TypeScript**: Full type safety with custom interfaces
- **Responsive**: Mobile-first design with Tailwind CSS
- **Performance**: Optimized with Astro's island architecture

## 📦 Dependencies

### Runtime
- `astro` - Static site generator with island architecture
- `astro-icon` - Icon components for Astro
- `tailwindcss` - Utility-first CSS framework

### Development  
- `vitest` - Fast unit testing framework
- `typescript` - Static type checking
- `eslint` - Code linting and formatting
- `husky` - Git hooks for code quality
- `commitlint` - Conventional commit message linting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run test:auto`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Weather data provided by [Open-Meteo API](https://open-meteo.com/)
- Built with [Astro](https://astro.build/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Vitest](https://vitest.dev/)

---

⭐ **Star this repository if you find it helpful!**
