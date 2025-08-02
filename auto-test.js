#!/usr/bin/env node

import { spawn } from 'child_process'
import http from 'http'
import { promisify } from 'util'
import process from 'process'

const sleep = promisify(setTimeout)

console.log('🌤️  Weather App Automatic Test Runner')
console.log('=====================================')

// Function to check if server is running
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

// Function to wait for server with retry logic
async function waitForServer(maxAttempts = 30) {
	console.log('⏳ Waiting for server to be ready...')

	for (let i = 1; i <= maxAttempts; i++) {
		const isReady = await checkServer()
		if (isReady) {
			console.log('✅ Server is ready!')
			return true
		}
		process.stdout.write(`\r   Checking server... attempt ${i}/${maxAttempts}`)
		await sleep(1000)
	}

	console.log('\n❌ Server failed to start within 30 seconds')
	return false
}

async function main() {
	let serverProcess = null

	try {
		// Check if server is already running
		console.log('🔍 Checking if server is already running...')
		const serverAlreadyRunning = await checkServer()

		if (!serverAlreadyRunning) {
			console.log('🚀 Starting development server...')

			// Start server
			serverProcess = spawn('npm', ['run', 'dev'], {
				stdio: ['pipe', 'pipe', 'pipe'],
				shell: true,
				detached: false,
			})

			// Log server output for debugging
			serverProcess.stdout.on('data', data => {
				const output = data.toString()
				if (output.includes('ready in') || output.includes('Local')) {
					console.log('📡', output.trim())
				}
			})

			serverProcess.stderr.on('data', data => {
				console.log('🔧', data.toString().trim())
			})

			// Wait for server to be ready
			const serverReady = await waitForServer()

			if (!serverReady) {
				console.log('❌ Could not start server, tests aborted')
				process.exit(1)
			}
		} else {
			console.log('✅ Server is already running')
		}

		console.log('\n🧪 Running tests...')
		console.log('===================')

		// Run tests
		const testProcess = spawn('npm', ['test'], {
			stdio: 'inherit',
			shell: true,
		})

		testProcess.on('close', code => {
			console.log(`\n📊 Tests completed with exit code: ${code}`)

			if (code === 0) {
				console.log('✅ All tests passed!')
			} else {
				console.log('❌ Some tests failed')
				console.log('\n🔍 Troubleshooting:')
				console.log('1. Check server logs above')
				console.log('2. Verify API endpoints are working')
				console.log('3. Try running tests individually:')
				console.log('   - npm run test:utils (no server needed)')
				console.log('   - npm run test:api (needs server)')
				console.log('   - npm run test:frontend (needs server)')
			}

			// Clean up and exit
			cleanup()
			process.exit(code)
		})

		testProcess.on('error', error => {
			console.error('❌ Failed to run tests:', error.message)
			cleanup()
			process.exit(1)
		})
	} catch (error) {
		console.error('❌ Error:', error.message)
		cleanup()
		process.exit(1)
	}

	function cleanup() {
		if (serverProcess && !serverProcess.killed) {
			console.log('🛑 Stopping development server...')
			serverProcess.kill('SIGTERM')

			// Force kill after 3 seconds
			setTimeout(() => {
				if (!serverProcess.killed) {
					serverProcess.kill('SIGKILL')
				}
			}, 3000)
		}
	}

	// Handle process termination
	process.on('SIGINT', () => {
		console.log('\n🛑 Received interrupt signal, cleaning up...')
		cleanup()
		process.exit(1)
	})

	process.on('SIGTERM', () => {
		console.log('\n🛑 Received termination signal, cleaning up...')
		cleanup()
		process.exit(1)
	})
}

main().catch(error => {
	console.error('❌ Fatal error:', error)
	process.exit(1)
})
