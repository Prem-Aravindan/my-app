# AI Filter - PowerShell Start Script
# Run this with: .\start-server.ps1

Write-Host "🚀 Starting AI Filter App..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm is not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Start the development server
Write-Host "🌟 Starting Expo development server..." -ForegroundColor Blue
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Keep this window open" -ForegroundColor Yellow
Write-Host "2. Open a new PowerShell/Terminal and run:" -ForegroundColor Yellow
Write-Host "   - npm run android (for Android)" -ForegroundColor Yellow
Write-Host "   - npm run ios (for iOS, macOS only)" -ForegroundColor Yellow
Write-Host "3. Test screen recording in the 'Screen' tab" -ForegroundColor Yellow
Write-Host ""

npm start
