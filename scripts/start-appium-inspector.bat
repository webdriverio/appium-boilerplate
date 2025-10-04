@echo off
setlocal enabledelayedexpansion

REM Default port
if "%~1"=="" (
    set PORT=4723
) else (
    set PORT=%~1
)

REM 1. Start Appium server
echo 🚀 Starting Appium server on port %PORT%...

REM Check if port is already in use
netstat -an | find ":%PORT%" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ""
    echo ❌ ERROR: Port %PORT% is already in use!
    echo 💡 Try using a different port: npm run appium:inspector:win 4725
    echo 🔧 Or check what's using the port: netstat -ano | find ":%PORT%"
    echo.
    echo ⚠️  Note: Default Appium port is 4723. If using a custom port,
    echo    update the 'Remote Port' field in the Appium Inspector interface.
    exit /b 1
)

REM Start Appium server from the installed node_modules\.bin\appium.cmd and capture output
start /b node_modules\.bin\appium.cmd server --log-timestamp --relaxed-security --port %PORT% --allow-cors

echo 📱 Appium server started
echo ⏳ Waiting for Appium server to be ready...

REM 2. Wait a moment for the server to initialize
timeout /t 3 /nobreak >nul

REM 3. Check if server is responding
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:%PORT%/status' -TimeoutSec 5 -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Appium server started but may not be fully ready
    echo 🔄 Waiting a bit longer...
    timeout /t 2 /nobreak >nul
)

REM 4. Now open the Appium Inspector in default browser
echo 🌐 Opening Appium Inspector in default browser...

REM 5. Try to open in default browser
start "" "https://inspector.appiumpro.com/"

if %errorlevel% equ 0 (
    echo ✅ Opened in default browser
) else (
    echo ❌ ERROR: Could not open browser automatically
    echo 📝 Please manually open: https://inspector.appiumpro.com/
    echo 💡 Make sure you have a default browser configured
)

echo ✅ Appium Inspector should now be open in your browser!
echo 🔗 Inspector URL: https://inspector.appiumpro.com/
echo 📡 Appium Server: http://localhost:%PORT%
echo.
if not "%PORT%"=="4723" (
    echo ⚠️  IMPORTANT: You're using custom port %PORT%
    echo    Make sure to set 'Remote Port' to %PORT% in the Appium Inspector interface!
    echo.
)
echo ℹ️  Press Ctrl+C to stop Appium server and exit
echo 🔄 Keeping script running to manage Appium server...

REM Keep the script running
pause
