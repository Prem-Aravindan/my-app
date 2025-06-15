# Debug Guide - Image Analysis and Screen Sharing

## Current Setup for Testing

### Image Analysis (Mock Mode)
The app is now configured to **bypass actual network calls** and return mock AI detection results for testing purposes.

**What to expect:**
1. ✅ **Image Selection**: Should work normally
2. ✅ **Analysis Process**: Shows loading state and simulates processing
3. ✅ **Mock Results**: Returns random AI detection results with proper formatting
4. ✅ **Console Logs**: Detailed logging to track the process

**Console Output You Should See:**
```
🔍 LocalAIDetectionService.detectImage called with: file://...
🎯 TESTING MODE: Bypassing actual AI detection
📄 Image URI: file://...
🤖 Simulating AI detection process...
✅ Mock detection result: {prediction: "AI-generated", confidence: 0.87, ...}
```

### Screen Sharing Improvements
Fixed permissions and error handling for screen capture functionality.

**Changes Made:**
1. ✅ Added `MEDIA_PROJECTION` permission to AndroidManifest.xml
2. ✅ Added network security config to allow HTTP traffic
3. ✅ Fixed promise resolution in ScreenStreamModule
4. ✅ Added comprehensive logging

---

## Testing Steps

### 1. Build and Run the App
```bash
npm run android
```

### 2. Test Image Analysis
1. Go to "Upload" tab
2. Select "Pick Image"
3. Choose any image file
4. Tap "Analyze Image"
5. **Check console logs** - you should see the mock detection process
6. View results display

### 3. Test Screen Sharing
1. Go to "Screen" tab  
2. Tap "Request Permission"
3. Grant screen capture permission
4. **App should NOT crash** anymore
5. Check console logs for permission handling

### 4. Monitor Console Logs
```bash
# Android logs
npx react-native log-android

# Or filter for our app
adb logcat | grep -E "(LocalAIDetection|ScreenStream|AI Filter)"
```

---

## Expected Console Output

### Image Analysis
```
🏥 LocalAIDetectionService.checkHealth called
🧪 DEV MODE: Using mock health response
✅ Mock health check result: {status: "healthy", model_loaded: true, ...}
🔍 LocalAIDetectionService.detectImage called with: file://...
🎯 TESTING MODE: Bypassing actual AI detection
📄 Image URI: file://...
🤖 Simulating AI detection process...
✅ Mock detection result: {prediction: "Real", confidence: 0.78, ...}
```

### Screen Sharing
```
📱 ScreenStreamModule: requestPermissions called
✅ Permission granted successfully
🎥 Screen capture ready to start
```

---

## Real Implementation (Ready for Later)

The actual network calls and AI model integration code is **commented out** but preserved in:
- `LocalAIDetectionService.detectImage()` - Real API call to backend
- `LocalAIDetectionService.checkHealth()` - Real health check
- Backend response format matches your `/detect` endpoint

**To enable real detection later:**
1. Uncomment the real implementation sections
2. Comment out the mock sections  
3. Ensure backend is running on port 8000

---

## Network Configuration Fixed

Added to AndroidManifest.xml:
- `android:usesCleartextTraffic="true"`
- `android:networkSecurityConfig="@xml/network_security_config"`

This allows HTTP connections to localhost/10.0.2.2 for development.

---

## Next Steps

1. **Build the app** and test both features
2. **Check console logs** to confirm processes are working
3. **Verify no crashes** on screen permission grant
4. **See mock AI results** displayed correctly

The foundation is now solid for integrating the real AI model when ready!
