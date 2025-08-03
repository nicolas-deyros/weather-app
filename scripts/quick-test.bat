@echo off
echo Testing Weather App...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the dev server in background
echo Starting development server...
start /B npm run dev

REM Wait for server to start
echo Waiting for server to start...
timeout /t 10 /nobreak >nul

REM Run the tests
echo Running tests...
npm test

REM The server will keep running - user can manually stop it if needed
echo.
echo Tests completed. The dev server is still running.
echo You can stop it by closing the Node.js process or pressing Ctrl+C in the server terminal.
