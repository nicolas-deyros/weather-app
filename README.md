# 🌤️ Weather App

A modern, responsive weather application built with Astro, TypeScript, and Tailwind CSS. Features comprehensive weather icons, animated displays, robust testing suite, and production-ready deployment.

![Weather App Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![Tests](https://img.shields.io/badge/Tests-40%20Passing-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Astro](https://img.shields.io/badge/Astro-v5.12.6-orange) ![Code Quality](https://img.shields.io/badge/Code%20Quality-ESLint%20%2B%20Stylelint-green)

## ✨ Features

- 🌍 **Global Weather Data** - Get weather for any location using Open-Meteo API
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🎨 **Comprehensive Weather Icons** - 18+ emoji-based weather icons with smooth animations
- 🔄 **3-Day Forecasts** - Current weather plus next 3 days
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- 🔍 **Smart Location Search** - Search for cities worldwide with autocomplete
- ⚡ **Fast & Lightweight** - Built with Astro for optimal performance
- 🧪 **Comprehensive Testing** - 40 tests covering utils, API, and frontend
- 🚀 **Production Ready** - Deployed on Vercel with zero configuration
- 📋 **Weather Icons Gallery** - Dedicated page showcasing all available weather icons

## 🎯 New Features & Improvements

### 🎨 Enhanced Weather Icons System

- **Complete Icon Collection**: 18 comprehensive weather icons covering all conditions
- **Smart Fallback System**: Advanced pattern matching for reliable icon display
- **Smooth Animations**: CSS-based animations for better user experience
- **Icons Testing Page**: Dedicated `/icons` route for testing all weather icons

### 🔧 Code Quality & Tooling

- **ESLint + TypeScript**: Enhanced linting with automatic import sorting
- **Stylelint**: CSS linting for consistent styling and Tailwind CSS support
- **Lint-staged**: Pre-commit hooks that only lint changed files for faster commits
- **Automated Testing**: Comprehensive test suite with 40 passing tests
- **Production Deployment**: Vercel integration with SSR support

### 🧪 Robust Testing Framework

- **Unit Tests**: 11 tests for weather utilities and calculations
- **API Tests**: 14 tests for weather endpoints and error handling
- **Frontend Tests**: 15 tests for UI components and integration
- **Automatic Server Management**: Tests automatically start/stop development server
- **Comprehensive Coverage**: All core functionality tested and validated

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

### 🎨 Weather Icons Gallery

Visit `http://localhost:3001/icons` to see the comprehensive weather icons gallery showcasing all 18+ weather conditions with both SVG and emoji versions.

## 🧪 Testing

The app includes a comprehensive testing suite with automatic server management:

### Run All Tests (Recommended)

```bash
# Run all tests with automatic server coordination
npm run test:all
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

# Test coverage analysis
npm run test:coverage
```

### Test Coverage

- **40 Total Tests**: All passing ✅
- **Utils Tests**: 11 tests for weather utilities and icon mappings
- **API Tests**: 14 tests for weather API endpoints and error handling
- **Frontend Tests**: 15 tests for UI components and integration
- **Automatic Server Management**: Tests handle server startup/shutdown automatically

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
│   │   ├── icons.astro           # Weather icons testing gallery
│   │   └── api/weather.json.ts   # Weather API endpoint
│   ├── styles/
│   │   └── global.css            # Global styles with animations
│   └── test/                     # Comprehensive test suites
│       ├── api.test.ts           # API endpoint tests
│       ├── frontend.test.ts      # Frontend integration tests
│       └── utils.test.ts         # Utility function tests
├── public/                       # Static assets
├── diagnose.js                   # Project health diagnostic tool
├── .stylelintrc.json            # CSS linting configuration
├── .husky/                      # Git hooks configuration
└── package.json                 # Dependencies and scripts
```

## 🛠️ Available Commands

| Command                 | Action                                          |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Start development server on port 3001           |
| `npm run build`         | Build for production                            |
| `npm run preview`       | Preview production build                        |
| `npm run test:all`      | **Run all tests with automatic server startup** |
| `npm run test`          | Run utility tests only                          |
| `npm run test:api`      | Run API tests only                              |
| `npm run test:frontend` | Run frontend tests only                         |
| `npm run test:utils`    | Run utility tests only                          |
| `npm run test:watch`    | Run tests in watch mode                         |
| `npm run test:coverage` | Run tests with coverage analysis                |
| `npm run lint`          | Lint and fix JavaScript/TypeScript/Astro files  |
| `npm run lint:css`      | Lint and fix CSS files                          |
| `npm run lint:all`      | Run all linting (JS/TS/CSS)                     |

## 🎨 Code Quality & Development

### Linting & Formatting

- **ESLint**: Comprehensive JavaScript/TypeScript/Astro linting with auto-fix
- **Stylelint**: CSS linting with Tailwind CSS support
- **Prettier**: Code formatting with Astro and Tailwind plugins
- **Import Sorting**: Automatic import organization
- **Pre-commit Hooks**: Lint-staged for efficient pre-commit validation

### Git Workflow

- **Husky**: Git hooks for code quality enforcement
- **Commitlint**: Conventional commit message validation
- **Lint-staged**: Only lint changed files for faster commits

### Project Health

- **diagnose.js**: Project health diagnostic tool for troubleshooting
- **Comprehensive Testing**: 40 tests across all application layers
- **TypeScript**: Full type safety with custom interfaces

## 🚀 Deployment

This app is configured for easy deployment on Vercel with zero configuration required.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nicolas-deyros/weather-app)

Or deploy manually:

1. **Fork this repository**
2. **Connect to Vercel**: Import your GitHub repository in Vercel
3. **Deploy**: Vercel will automatically detect Astro and deploy
4. **Environment**: No environment variables needed - uses public APIs

### Build Configuration

The project includes the Vercel adapter (`@astrojs/vercel`) which:

- Enables server-side rendering (SSR) for API routes
- Optimizes builds for Vercel's serverless functions
- Handles static asset optimization automatically
- Provides automatic preview deployments for PRs

## 🔧 Development

### Architecture & Stack

- **Frontend**: Astro v5.12.6 + TypeScript + Tailwind CSS v4.1.11
- **Weather API**: Open-Meteo API integration with comprehensive error handling
- **Testing**: Vitest with custom server health checks and 40 test coverage
- **Icons**: 18+ comprehensive weather icons with smart fallback system
- **Styling**: Tailwind CSS with custom animations and responsive design
- **Code Quality**: ESLint + Stylelint + Prettier with pre-commit hooks
- **Deployment**: Vercel adapter with SSR support

### Key Features Implementation

- **Enhanced Weather Icons**: Complete icon set with pattern matching and fallbacks
- **Smart Icon System**: Advanced createWeatherIcon function with comprehensive coverage
- **Server Health Checks**: Tests wait for server startup before running
- **Comprehensive Error Handling**: Robust error handling for API failures and edge cases
- **SSR/Client Separation**: Proper loading states and server-side rendering coordination
- **TypeScript**: Full type safety with custom interfaces and validation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance**: Optimized with Astro's island architecture and static generation

## 📦 Dependencies

### Runtime Dependencies

- **`astro`** (v5.12.6) - Static site generator with island architecture
- **`@astrojs/vercel`** (v8.2.5) - Vercel adapter for SSR deployment
- **`astro-icon`** (v1.1.5) - Icon components for Astro
- **`tailwindcss`** (v4.1.11) - Utility-first CSS framework
- **`@tailwindcss/vite`** (v4.1.11) - Tailwind CSS Vite integration

### Development Dependencies

#### Core Development

- **`vitest`** (v3.2.4) - Fast unit testing framework
- **`typescript-eslint`** (v8.38.0) - TypeScript-aware ESLint rules
- **`tsx`** (v4.20.3) - TypeScript execution engine

#### Code Quality & Linting

- **`eslint`** (v9.32.0) - JavaScript/TypeScript linting
- **`eslint-plugin-astro`** (v1.3.1) - Astro-specific ESLint rules
- **`eslint-plugin-jsx-a11y`** (v6.10.2) - Accessibility linting
- **`eslint-plugin-simple-import-sort`** (v12.1.1) - Automatic import sorting
- **`stylelint`** (v16.23.0) - CSS linting
- **`stylelint-config-standard`** (v39.0.0) - Standard CSS linting rules

#### Formatting & Git Hooks

- **`prettier`** (v3.6.2) - Code formatting
- **`prettier-plugin-astro`** (v0.14.1) - Astro formatting support
- **`prettier-plugin-tailwindcss`** (v0.6.14) - Tailwind class sorting
- **`husky`** (v9.1.7) - Git hooks management
- **`lint-staged`** (v16.1.2) - Pre-commit file linting
- **`@commitlint/cli`** + **`@commitlint/config-conventional`** - Commit message validation

#### Testing & Build Tools

- **`start-server-and-test`** (v2.0.12) - Test server coordination
- **`cross-env`** (v10.0.0) - Cross-platform environment variables

#### Icon Libraries

- **`@iconify-json/meteocons`** (v1.2.2) - Weather-specific icons
- **`@iconify-json/twemoji`** (v1.2.2) - Emoji icons
- **`@iconify-json/devicon-plain`** + **`@iconify-json/nrk`** - Additional icon sets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the linter: `npm run lint:all`
5. Run tests: `npm run test:all`
6. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Workflow

- **Code Quality**: Pre-commit hooks automatically lint and format code
- **Testing**: All PRs require passing tests (40 tests must pass)
- **Conventional Commits**: Use conventional commit format for changelog generation
- **TypeScript**: Maintain type safety across all changes

## 📈 Project Stats

- **📊 40 Tests**: Comprehensive test coverage across all layers
- **🎨 18+ Weather Icons**: Complete icon set with animations
- **⚡ Fast Performance**: Astro's static generation + island architecture
- **📱 Responsive**: Mobile-first design with Tailwind CSS
- **🔒 Type Safe**: Full TypeScript coverage with custom interfaces
- **🛠️ Production Ready**: Deployed on Vercel with zero configuration
- **✅ Code Quality**: ESLint + Stylelint + Prettier + Pre-commit hooks

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Weather data provided by [Open-Meteo API](https://open-meteo.com/)
- Built with [Astro](https://astro.build/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Vitest](https://vitest.dev/)

---

⭐ **Star this repository if you find it helpful!**
