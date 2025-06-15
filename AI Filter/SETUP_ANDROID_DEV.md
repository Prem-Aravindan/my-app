# Android Development Setup Guide

## Prerequisites for Building Native Android Apps

### 1. Install Java Development Kit (JDK)
- Download and install JDK 17 or later from: https://adoptium.net/
- After installation, verify with: `java -version`
- Set JAVA_HOME environment variable to JDK installation path

### 2. Install Android Studio
- Download from: https://developer.android.com/studio
- During installation, make sure to install:
  - Android SDK
  - Android SDK Platform-Tools
  - Android Virtual Device (AVD) for emulator

### 3. Set Environment Variables
Add these to your system environment variables:
- `ANDROID_HOME` = path to Android SDK (usually `%LOCALAPPDATA%\Android\Sdk`)
- `JAVA_HOME` = path to JDK installation
- Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\tools`

### 4. Create Android Virtual Device (AVD)
- Open Android Studio
- Go to Tools → AVD Manager
- Create a new virtual device (recommend Pixel 4 API 30+)
- Start the emulator

### 5. Verify Setup
```powershell
java -version
adb devices
```

## Alternative Testing Options

If you can't set up the full Android development environment right now, you can still test the app functionality:

### Option 1: Test with Expo Go (Limited)
- Install Expo Go on your physical Android device
- Scan the QR code from the development server
- Note: Native screen capture won't work, but other features will

### Option 2: Use the Web Version
```powershell
npm run web
```
- Tests React components and UI logic
- Screen capture will use mock data

### Option 3: iOS Simulator (if on Mac)
```bash
npm run ios
```

## Building After Setup
Once you have Java and Android Studio installed:

1. Start Android emulator
2. Run the development server: `npm start`
3. Build and run: `npm run android`

The app should install on the emulator and you can test the native screen capture functionality.
