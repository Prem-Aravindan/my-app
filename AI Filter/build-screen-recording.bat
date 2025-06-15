@echo off
REM AI Filter - Build Script for Screen Recording Implementation (Windows)
REM This script builds the app with screen recording capabilities

echo 🚀 Building AI Filter with Screen Recording...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the AI Filter directory.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Clean previous builds
echo 🧹 Cleaning previous builds...
call npx expo run:android --clear 2>nul
call npx expo run:ios --clear 2>nul

REM Generate native code (prebuild)
echo ⚙️ Generating native code...
call npm run prebuild

REM Build for Android
echo 🤖 Building for Android...
call npm run android
if %errorlevel% equ 0 (
    echo ✅ Android build successful!
) else (
    echo ❌ Android build failed. Check logs above.
)

echo 🎉 Build process completed!
echo.
echo Next steps:
echo 1. Open the app and navigate to the 'Screen' tab
echo 2. Tap 'Request Permissions' to grant screen recording access
echo 3. Tap 'Start Screen Stream' to begin capturing
echo 4. Monitor the real-time frame preview
echo.
echo For production deployment, see SCREEN_RECORDING_README.md

pause
