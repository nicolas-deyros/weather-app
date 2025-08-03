# Weather App Test Runner & Issue Fixer
# Run this script to automatically test and fix common issues

Write-Host "🌤️ Weather App Test Runner & Bug Fixer" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Change to project root directory
Set-Location ..

# Function to test if server is responding
function Test-ServerHealth {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Head -TimeoutSec 5 -ErrorAction Stop
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

# Function to run tests with detailed error reporting
function Run-TestsWithDiagnostic {
    Write-Host "🧪 Running tests with diagnostic information..." -ForegroundColor Yellow
    
    # Run each test suite individually to isolate issues
    Write-Host "`n📝 Running Utils Tests..." -ForegroundColor Cyan
    $utilsResult = & npm run test:utils
    
    Write-Host "`n🌐 Running API Tests..." -ForegroundColor Cyan  
    $apiResult = & npm run test:api
    
    Write-Host "`n🖥️ Running Frontend Tests..." -ForegroundColor Cyan
    $frontendResult = & npm run test:frontend
    
    return @($utilsResult, $apiResult, $frontendResult)
}

# Main execution
try {
    # Step 1: Check if dependencies are installed
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        & npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
            exit 1
        }
    }
    
    # Step 2: Start the development server
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    
    # Step 3: Wait for server to be ready
    Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
    $attempts = 0
    $maxAttempts = 30
    
    do {
        Start-Sleep -Seconds 1
        $attempts++
        Write-Host "   Testing connection... attempt $attempts/$maxAttempts" -ForegroundColor Gray
        
        if (Test-ServerHealth) {
            Write-Host "✅ Server is ready!" -ForegroundColor Green
            break
        }
        
        if ($attempts -ge $maxAttempts) {
            Write-Host "❌ Server failed to start after $maxAttempts attempts" -ForegroundColor Red
            throw "Server startup timeout"
        }
    } while ($true)
    
    # Step 4: Run tests
    Write-Host "🧪 Running all tests..." -ForegroundColor Green
    & npm test
    $testExitCode = $LASTEXITCODE
    
    # Step 5: Show results
    if ($testExitCode -eq 0) {
        Write-Host "`n✅ All tests passed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Some tests failed. Running diagnostic..." -ForegroundColor Red
        Write-Host "🔍 Common fixes:" -ForegroundColor Yellow
        Write-Host "   1. Make sure the server is running on port 3001" -ForegroundColor Gray
        Write-Host "   2. Check if the API endpoints are working: http://localhost:3001/api/weather.json" -ForegroundColor Gray
        Write-Host "   3. Verify the frontend loads: http://localhost:3001" -ForegroundColor Gray
        Write-Host "   4. Try running individual test suites to isolate the issue" -ForegroundColor Gray  
    }
    
    # Ask user if they want to keep server running
    Write-Host "`n❓ Keep the development server running? (Y/N): " -NoNewline -ForegroundColor Cyan
    $keepRunning = Read-Host
    
    if ($keepRunning -eq "N" -or $keepRunning -eq "n") {
        Write-Host "🛑 Stopping development server..." -ForegroundColor Yellow
        if ($serverProcess -and !$serverProcess.HasExited) {
            $serverProcess.Kill()
        }
    } else {
        Write-Host "✅ Server will continue running at http://localhost:3001" -ForegroundColor Green
        Write-Host "   You can stop it later by closing the process or using Ctrl+C" -ForegroundColor Gray
    }
    
    exit $testExitCode
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    
    # Cleanup: Always try to stop the server
    if ($serverProcess -and !$serverProcess.HasExited) {
        Write-Host "🛑 Cleaning up server process..." -ForegroundColor Yellow
        $serverProcess.Kill()
    }
    
    exit 1
}
