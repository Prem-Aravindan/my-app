# Screen Recording Implementation Guide

## Overview
This guide explains how to implement screen recording functionality for AI detection across social media apps using React Native with native Android (MediaProjection) and iOS (ReplayKit) implementations.

## Step 1: Eject from Expo Managed Workflow

First, we need to eject from Expo to access native code:

```bash
cd "AI Filter"
npx expo eject
```

Or alternatively, use the newer approach with development builds:

```bash
npx expo install expo-dev-client
npx expo run:android
npx expo run:ios
```

## Step 2: Install Required Dependencies

```bash
npm install react-native-permissions
cd ios && pod install
```

## Step 3: Build and Run

### Android
```bash
npx react-native run-android
```

### iOS
```bash
npx react-native run-ios
```

## Architecture Overview

### Native Modules Structure
```
android/
├── app/src/main/java/com/aifilterapp/
│   ├── ScreenStreamModule.kt
│   ├── ScreenCaptureService.kt
│   └── MainApplication.kt
ios/
├── AIFilterApp/
│   ├── ScreenStreamModule.h
│   ├── ScreenStreamModule.m
│   └── ScreenBroadcastExtension/
│       ├── SampleHandler.swift
│       └── Info.plist
```

### JavaScript Bridge
```
src/
├── modules/
│   ├── ScreenStreamModule.ts
│   └── useScreenStream.ts
```

## Implementation Details

### Android MediaProjection
- Uses `MediaProjectionManager` for screen capture intent
- Creates `VirtualDisplay` with 480px max resolution
- Converts frames to Bitmap and downscales to 224x224
- Emits frames via `RCTDeviceEventEmitter` every 500ms

### iOS ReplayKit
- Uses Broadcast Upload Extension with `RPBroadcastSampleHandler`
- Downsamples `CVPixelBuffer` to 224x224
- Encodes to JPEG (50% quality)
- Sends through React Native bridge every 500ms

### Performance Optimizations
- Throttled to max 2 FPS
- In-memory buffer only (no disk writes)
- Background capture disabled for privacy
- Automatic cleanup on app backgrounding

## Privacy & Security
- Never writes screen frames to disk
- Stops recording when app goes to background
- Clear user consent required
- Provides opt-out mechanism

## Known Limitations
1. iOS requires separate Broadcast Extension setup
2. Android requires API level 21+ (Android 5.0)
3. Some apps may block screen recording
4. Performance varies by device capabilities
5. Battery usage may be significant during continuous recording

## Troubleshooting
- Ensure all permissions are granted
- Check device compatibility (API level, iOS version)
- Verify native module linking
- Monitor memory usage during extended recording
