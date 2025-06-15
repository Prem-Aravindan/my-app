# Screen Streaming with Background Processing and Overlay

## Overview

The AI Filter app now supports **background screen capture** with **real-time AI detection** and an **overlay notification system**. When screen recording starts, the app:

1. **Stays alive in the background** using a foreground service
2. **Shows a system overlay** at the top of the screen
3. **Continuously analyzes** screen content for AI-generated material
4. **Updates the overlay** with real-time detection results

## Architecture

### Components

1. **ScreenCaptureService** (Android Foreground Service)
   - Keeps the app running in the background
   - Shows persistent notification
   - Prevents the app from being killed by the system

2. **OverlayManager** (System Overlay Window)
   - Creates a floating window on top of all apps
   - Shows AI detection results in real-time
   - Updates every time a new frame is analyzed

3. **ScreenStreamModule** (Native Module)
   - Captures screen frames using MediaProjection
   - Processes frames and simulates AI detection
   - Manages the lifecycle of service and overlay

4. **useScreenStream** (React Hook)
   - Provides React Native interface
   - Handles permission management
   - Manages state and events

## Permissions Required

### 1. Screen Capture Permission
- **When**: Required before starting screen recording
- **What**: Allows capturing screen content
- **How**: System dialog appears when `requestPermissions()` is called

### 2. Overlay Permission
- **When**: Optional but recommended for best experience
- **What**: Allows showing overlay on top of other apps
- **How**: Takes user to Settings to grant permission

### 3. Foreground Service Permission
- **When**: Automatically granted (declared in manifest)
- **What**: Allows running background service
- **How**: No user interaction needed

## User Experience Flow

### Step 1: Permission Setup
```typescript
// Request screen capture permission
const screenGranted = await requestPermissions();

// Request overlay permission (optional)
const overlayGranted = await requestOverlayPermission();
```

### Step 2: Start Background Processing
```typescript
// Start screen streaming with overlay
const success = await startStream();
```

**What happens:**
- ✅ Foreground service starts (app stays alive)
- ✅ System overlay appears at top of screen
- ✅ Screen capture begins
- ✅ AI detection starts processing frames
- ✅ User can navigate away from the app

### Step 3: Real-time Detection
- **Every 500ms**: New screen frame is captured
- **AI Analysis**: Frame is analyzed for AI content (currently mocked)
- **Overlay Update**: Results displayed in floating overlay
- **Background Processing**: Continues even when app is not visible

### Step 4: Stop Processing
```typescript
// Stop screen streaming
const success = await stopStream();
```

**What happens:**
- ✅ Screen capture stops
- ✅ Overlay disappears
- ✅ Foreground service stops
- ✅ App returns to normal state

## Technical Implementation

### Overlay Display Format
The overlay shows:
- **🤖 AI-generated (85%)** - When AI content is detected
- **✅ Real (92%)** - When content appears authentic
- **❓ Uncertain (67%)** - When detection is unclear

### Background Service Notification
Shows persistent notification:
- **Title**: "AI Filter Active"
- **Text**: "Analyzing screen content for AI detection"
- **Actions**: Tap to return to app

### Frame Processing Pipeline
1. **Capture**: Screen frame captured at 480x480 resolution
2. **Resize**: Scaled down to 224x224 for AI processing
3. **Encode**: Converted to Base64 for transfer
4. **Analyze**: AI detection performed (currently mocked)
5. **Display**: Results shown in overlay
6. **Emit**: Data sent to React Native layer

## Mock AI Detection

Currently, the AI detection is **simulated** for testing purposes:

```kotlin
private fun simulateAIDetection(): MockDetection {
    val random = Math.random()
    return when {
        random < 0.3 -> MockDetection("AI-generated", 0.85 + random * 0.15)
        random < 0.7 -> MockDetection("Real", 0.80 + random * 0.20)
        else -> MockDetection("Uncertain", 0.50 + random * 0.30)
    }
}
```

**Future Integration**: Replace this with actual AI model calls or API requests.

## Console Logging

Comprehensive logging tracks the entire process:

```
🚀 Starting streaming internal...
🔄 Foreground service started
🎯 Overlay shown
📷 ImageReader created: 480x480
🖥️ VirtualDisplay created
⏰ Frame capture timer started
📸 Frame captured: 480x480
🎯 Frame processed #1: 224x224 -> 2048 chars
🤖 AI Detection: Real (78%)
📡 Emitting frame data to React Native
```

## Error Handling

The system gracefully handles:
- **Permission Denied**: Shows appropriate error messages
- **Device Not Supported**: Detects and reports unsupported devices
- **Service Failures**: Safely stops and cleans up resources
- **Overlay Issues**: Falls back to notification-only mode

## Testing the Feature

1. **Build the app**: `npm run android`
2. **Navigate to Screen tab**
3. **Request permissions** (both screen and overlay)
4. **Start detection** and minimize the app
5. **Check overlay** appears at top of screen
6. **Watch real-time results** update in overlay
7. **Verify app stays alive** in background

## Future Enhancements

1. **Real AI Integration**: Replace mock with actual model
2. **Result Storage**: Save detection history
3. **Alert System**: Notify on high AI confidence
4. **Settings Panel**: Configure detection sensitivity
5. **Statistics**: Show detection analytics
