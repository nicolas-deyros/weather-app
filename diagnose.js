#!/usr/bin/env node

import fs from 'fs'

console.log('🔍 Weather App Test Diagnostics')
console.log('================================')

// Check if essential files exist
const requiredFiles = [
	'package.json',
	'src/pages/index.astro',
	'src/pages/api/weather.json.ts',
	'src/test/frontend.test.ts',
	'src/test/api.test.ts',
	'src/test/utils.test.ts',
	'vitest.config.ts',
]

console.log('\n📋 File Check:')
requiredFiles.forEach(file => {
	const exists = fs.existsSync(file)
	console.log(`  ${exists ? '✅' : '❌'} ${file}`)
})

// Check package.json scripts
console.log('\n📦 Package Scripts:')
try {
	const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
	const testScripts = Object.keys(pkg.scripts).filter(s => s.includes('test'))
	testScripts.forEach(script => {
		console.log(`  ✅ ${script}: ${pkg.scripts[script]}`)
	})
} catch {
	console.log('  ❌ Could not read package.json')
}

// Check node_modules
console.log('\n📚 Dependencies:')
const nodeModulesExists = fs.existsSync('node_modules')
console.log(`  ${nodeModulesExists ? '✅' : '❌'} node_modules exists`)

if (nodeModulesExists) {
	const vitestExists = fs.existsSync('node_modules/vitest')
	const astroExists = fs.existsSync('node_modules/astro')
	console.log(`  ${vitestExists ? '✅' : '❌'} vitest installed`)
	console.log(`  ${astroExists ? '✅' : '❌'} astro installed`)
}

// Check for common issues
console.log('\n🔧 Common Issue Check:')

// Check if server is already running on port 3001
import net from 'net'
const server = net.createServer()

server
	.listen(3001, () => {
		console.log('  ✅ Port 3001 is available')
		server.close()
	})
	.on('error', err => {
		if (err.code === 'EADDRINUSE') {
			console.log('  ⚠️  Port 3001 is already in use (server might be running)')
		} else {
			console.log('  ❌ Port check failed:', err.message)
		}
	})

// Check TypeScript config
console.log('\n🎯 TypeScript Config:')
try {
	fs.readFileSync('tsconfig.json', 'utf8')
	console.log('  ✅ tsconfig.json exists and is readable')
} catch (error) {
	console.log('  ❌ tsconfig.json issue:', error.message)
}

// Check Vitest config
console.log('\n⚡ Vitest Config:')
try {
	fs.readFileSync('vitest.config.ts', 'utf8')
	console.log('  ✅ vitest.config.ts exists and is readable')
} catch (error) {
	console.log('  ❌ vitest.config.ts issue:', error.message)
}

console.log('\n🚀 Recommendations:')
console.log('1. Run: npm install (if dependencies are missing)')
console.log('2. Start server: npm run dev (in one terminal)')
console.log('3. Run tests: npm test (in another terminal after server starts)')
console.log('4. Or use: npm run test:with-server (automatic)')
console.log(
	'\n💡 If tests fail, check the server logs and ensure the API is responding correctly.',
)
