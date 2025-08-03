#!/usr/bin/env node

import { spawn } from 'child_process'
import fs from 'fs'
import http from 'http'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

console.log('🧪 Running comprehensive test check...')
console.log('=====================================\n')

// First, run diagnostics
console.log('🔍 Running diagnostics...')
try {
	// Check basic file structure
	const requiredFiles = [
		'package.json',
		'src/pages/index.astro',
		'src/pages/api/weather.json.ts',
		'src/test/frontend.test.ts',
		'src/test/api.test.ts',
		'src/test/utils.test.ts',
	]

	let allFilesExist = true
	requiredFiles.forEach(file => {
		const fullPath = path.resolve(projectRoot, file)
		const exists = fs.existsSync(fullPath)
		console.log(`  ${exists ? '✅' : '❌'} ${file}`)
		if (!exists) allFilesExist = false
	})

	if (!allFilesExist) {
		console.log('❌ Missing required files. Cannot proceed.')
		process.exit(1)
	}

	console.log('✅ All required files present\n')
} catch (error) {
	console.log('❌ Diagnostic check failed:', error.message)
	process.exit(1)
}

// Check if server is running
function checkServer() {
	return new Promise(resolve => {
		const req = http.request(
			{
				hostname: 'localhost',
				port: 3001,
				method: 'HEAD',
				timeout: 3000,
			},
			res => {
				resolve(res.statusCode === 200)
			},
		)

		req.on('error', () => resolve(false))
		req.on('timeout', () => resolve(false))
		req.end()
	})
}

console.log('🌐 Checking server status...')
const serverRunning = await checkServer()
console.log(
	`  ${serverRunning ? '✅' : '⚠️'} Server on port 3001: ${serverRunning ? 'Running' : 'Not running'}`,
)

if (!serverRunning) {
	console.log('⚠️  Note: Tests requiring server connection may fail\n')
} else {
	console.log('✅ Server is ready for tests\n')
}

// Run tests
console.log('🧪 Running npm test...')
console.log('===========================================\n')

const testProcess = spawn('npm', ['test'], {
	stdio: 'inherit',
	shell: true,
	cwd: projectRoot,
})

testProcess.on('close', code => {
	console.log(`\n📊 Test process finished with exit code: ${code}`)

	if (code === 0) {
		console.log('✅ All tests passed!')
	} else {
		console.log('❌ Tests failed. Check output above for details.')
		console.log('\n🔍 Common solutions:')
		console.log('1. Start server: npm run dev (in another terminal)')
		console.log('2. Or use: npm run test:with-server (automatic)')
		console.log('3. Install deps: npm install')
		console.log('4. Clear cache: rm -rf node_modules && npm install')
	}

	process.exit(code)
})

testProcess.on('error', error => {
	console.error('❌ Failed to start test process:', error.message)
	process.exit(1)
})
