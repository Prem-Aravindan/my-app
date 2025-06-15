#!/usr/bin/env powershell

Write-Host "🚀 Building AI Filter App with Native Modules..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "app.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📱 Building for Android with screen recording capabilities..." -ForegroundColor Cyan

try {
    # Prebuild to generate native folders
    Write-Host "🔧 Running expo prebuild..." -ForegroundColor Yellow
    npx expo prebuild --clean

    # Build for Android
    Write-Host "🤖 Building Android app..." -ForegroundColor Yellow
    npx expo run:android

    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "📲 The app should now be running on your Android device/emulator with native screen recording support." -ForegroundColor Green
}
catch {
    Write-Host "❌ Build failed: $_" -ForegroundColor Red
    Write-Host "💡 Make sure you have:" -ForegroundColor Yellow
    Write-Host "   • Android Studio installed" -ForegroundColor Yellow
    Write-Host "   • Android SDK configured" -ForegroundColor Yellow
    Write-Host "   • USB debugging enabled on your device" -ForegroundColor Yellow
    Write-Host "   • Device connected or emulator running" -ForegroundColor Yellow
    exit 1
}
