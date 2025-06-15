# 🚀 AI Filter - Build & Run Instructions

## Prerequisites

Before starting, ensure you have:

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### For Android Development
- **Android Studio** ([Download](https://developer.android.com/studio))
- **Java JDK** 11+ (included with Android Studio)
- **Android SDK** (install via Android Studio)

### For iOS Development (macOS only)
- **Xcode** 12+ ([Mac App Store](https://apps.apple.com/app/xcode/id497799835))
- **CocoaPods** (`sudo gem install cocoapods`)

## 🏁 Quick Start

### Step 1: Install Dependencies

```bash
cd "AI Filter"
npm install
```

### Step 2: Install iOS Dependencies (macOS only)

```bash
cd ios
pod install
cd ..
```

### Step 3: Start the Development Server

```bash
npm start
```

This will start the Expo development server. Keep this terminal open.

### Step 4: Run on Device/Simulator

**For Android:**
```bash
# In a new terminal
npm run android
```

**For iOS (macOS only):**
```bash
# In a new terminal  
npm run ios
```

## 📱 Testing Screen Recording

1. **Open the app** on your device/simulator
2. **Navigate to "Screen" tab** (bottom navigation)
3. **Tap "Request Permissions"** (first time only)
4. **Grant screen recording permissions:**
   - **Android:** Allow "Display over other apps" and MediaProjection access
   - **iOS:** Select your app from the broadcast picker
5. **Tap "Start Screen Stream"**
6. **View real-time frames** in the preview area

## 🛠️ Development Commands

### Available Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web (limited functionality)
npm run web

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Clean Build (if having issues)

```bash
# Clear Expo cache
npx expo r -c

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# iOS: Reinstall pods
cd ios && rm -rf Pods && pod install && cd ..
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **"Metro bundler failed to start"**
```bash
# Kill any existing Metro processes
npx expo r -c
# Or manually kill processes
pkill -f "metro" || killall node
```

#### 2. **"Module not found" errors**
```bash
# Clear cache and restart
npx expo r -c
npm start
```

#### 3. **iOS build fails**
```bash
cd ios
pod install
cd ..
npm run ios
```

#### 4. **Android build fails**
```bash
# Open Android Studio and sync project
# Or run:
cd android
./gradlew clean
cd ..
npm run android
```

#### 5. **Screen recording not working**
- **Android:** Ensure you granted "Display over other apps" permission
- **iOS:** Make sure you selected your app in the broadcast picker
- **Both:** Try restarting the app after granting permissions

### Debug Commands

```bash
# View Android logs
npx expo run:android --variant debug

# View iOS logs  
npx expo run:ios --configuration Debug

# React Native logs
npx expo logs
```

## 📦 Project Structure

```
AI Filter/
├── App.tsx                 # Main app component
├── package.json            # Dependencies and scripts
├── app.json               # Expo configuration
├── android/               # Android native code
│   └── app/src/main/java/com/aifilterapp/
│       ├── ScreenStreamModule.kt
│       └── ScreenStreamPackage.kt
├── ios/                   # iOS native code
│   └── AIFilterApp/
│       ├── ScreenStreamModule.h
│       ├── ScreenStreamModule.m
│       └── ScreenBroadcastExtension/
└── src/
    ├── components/        # Reusable UI components
    ├── screens/          # App screens
    ├── modules/          # Native module interfaces
    ├── contexts/         # React contexts
    ├── services/         # API services
    └── utils/            # Helper functions
```

## 🔧 Configuration Files

### Key Configuration Files:
- **`package.json`** - Dependencies and build scripts
- **`app.json`** - Expo/React Native configuration
- **`android/app/build.gradle`** - Android build configuration
- **`ios/Podfile`** - iOS dependencies
- **`tsconfig.json`** - TypeScript configuration

## 🎯 Next Steps

Once the app is running:

1. **Test basic functionality** - Navigate through all tabs
2. **Test screen recording** - Use the "Screen" tab to test capture
3. **Integrate AI detection** - Connect frames to your AI service
4. **Customize UI** - Modify screens and components as needed

## 💡 Tips for Development

### Performance Tips
- Use **React Native Flipper** for debugging
- Enable **Hermes** for better performance (already enabled)
- Use **development build** instead of Expo Go for native modules

### Debugging Tips
- Use **console.log()** for JavaScript debugging
- Use **native logging** for Android/iOS debugging
- Enable **remote debugging** in development menu

### Code Quality
- Run **ESLint** before committing: `npm run lint`
- Format code with **Prettier**: `npm run format`
- Use **TypeScript** for type safety

## 🔄 Continuous Development

### Recommended Workflow:
1. **Start development server:** `npm start`
2. **Run on device:** `npm run android` or `npm run ios`
3. **Make changes** to code
4. **Hot reload** will update automatically
5. **Test screen recording** functionality
6. **Commit changes** when stable

## 📞 Need Help?

If you encounter issues:

1. **Check this guide** first
2. **Clear cache** and restart: `npx expo r -c`
3. **Check native logs** for detailed error messages
4. **Verify permissions** are granted on device
5. **Restart development server** if needed

---

**Happy coding!** 🎉 Your AI Filter app with screen recording is now ready for development!
