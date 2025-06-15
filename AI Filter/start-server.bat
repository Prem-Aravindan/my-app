@echo off
echo 🚀 Starting AI Filter App...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not available
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

:: Start the development server
echo 🌟 Starting Expo development server...
echo.
echo Instructions:
echo 1. Keep this window open
echo 2. Open a new terminal and run:
echo    - npm run android (for Android)
echo    - npm run ios (for iOS, macOS only)
echo 3. Test screen recording in the "Screen" tab
echo.

call npm start

pause
