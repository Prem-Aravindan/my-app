#!/bin/bash

# AI Filter - Build Script for Screen Recording Implementation
# This script builds the app with screen recording capabilities

echo "🚀 Building AI Filter with Screen Recording..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the AI Filter directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# iOS specific setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Setting up iOS dependencies..."
    cd ios
    pod install
    cd ..
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npx expo run:android --clear 2>/dev/null || true
npx expo run:ios --clear 2>/dev/null || true

# Generate native code (prebuild)
echo "⚙️ Generating native code..."
npm run prebuild

# Build for Android
echo "🤖 Building for Android..."
if npm run android; then
    echo "✅ Android build successful!"
else
    echo "❌ Android build failed. Check logs above."
fi

# Build for iOS (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Building for iOS..."
    if npm run ios; then
        echo "✅ iOS build successful!"
    else
        echo "❌ iOS build failed. Check logs above."
    fi
else
    echo "⚠️  iOS build skipped (macOS required)"
fi

echo "🎉 Build process completed!"
echo ""
echo "Next steps:"
echo "1. Open the app and navigate to the 'Screen' tab"
echo "2. Tap 'Request Permissions' to grant screen recording access"
echo "3. Tap 'Start Screen Stream' to begin capturing"
echo "4. Monitor the real-time frame preview"
echo ""
echo "For production deployment, see SCREEN_RECORDING_README.md"
