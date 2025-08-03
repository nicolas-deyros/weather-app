# PowerShell Test Runner with Error Checking
Write-Host "🧪 Running Tests with Error Checking" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $tcpListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
        $tcpListener.Start()
        $tcpListener.Stop()
        return $false # Port is free
    }
    catch {
        return $true # Port is in use
    }
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if server needs to be started
$serverRunning = Test-Port 3001
if (-not $serverRunning) {
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
    
    # Wait for server to start
    Write-Host "⏳ Waiting for server to be ready..." -ForegroundColor Yellow
    $attempts = 0
    do {
        Start-Sleep -Seconds 2
        $attempts++
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Head -TimeoutSec 5 -ErrorAction Stop
            $serverReady = $response.StatusCode -eq 200
        }
        catch {
            $serverReady = $false
        }
        Write-Host "   Attempt $attempts/15..." -ForegroundColor Gray
    } while (-not $serverReady -and $attempts -lt 15)
    
    if ($serverReady) {
        Write-Host "✅ Server is ready!" -ForegroundColor Green
    } else {
        Write-Host "❌ Server failed to start properly" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Server is already running on port 3001" -ForegroundColor Green
}

# Run the tests
Write-Host "🧪 Running tests..." -ForegroundColor Cyan
Write-Host ""

# Capture test output
$testOutput = & npm test 2>&1
$testExitCode = $LASTEXITCODE

# Display results
Write-Host $testOutput

Write-Host ""
Write-Host "📊 Test Results:" -ForegroundColor Cyan
if ($testExitCode -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Tests failed with exit code: $testExitCode" -ForegroundColor Red
    
    # Analyze common error patterns
    $outputString = $testOutput -join "`n"
    
    if ($outputString -match "ECONNREFUSED") {
        Write-Host "🔍 Connection refused error detected - server may not be running properly" -ForegroundColor Yellow
    }
    
    if ($outputString -match "timeout") {
        Write-Host "🔍 Timeout error detected - server may be slow to respond" -ForegroundColor Yellow
    }
    
    if ($outputString -match "fetch.*failed") {
        Write-Host "🔍 Fetch error detected - API endpoints may not be working" -ForegroundColor Yellow
    }
    
    if ($outputString -match "Cannot.*find.*module") {
        Write-Host "🔍 Module not found error - dependency issue" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "- If tests fail, check the server logs"
Write-Host "- Try running individual test suites: npm run test:utils, npm run test:api, npm run test:frontend"
Write-Host "- For development: npm run test:watch"
