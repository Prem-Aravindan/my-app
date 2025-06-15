# AI Filter App - Troubleshooting Guide

## Issue 1: Image Analysis Error

### Problem
The "Analyze Image" functionality returns an error when processing images.

### Possible Causes & Solutions

1. **Backend Server Not Running**
   - Check if the Python backend server is running on port 8000
   - Run: `python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

2. **Network Configuration Issues**
   - For Android emulator, the app tries to connect to `http://10.0.2.2:8000`
   - For iOS simulator, it uses `http://localhost:8000`
   - Ensure your backend is accessible on these addresses

3. **File Upload Issues**
   - Make sure the selected file is a valid image (JPEG/PNG)
   - Check file permissions and accessibility

4. **API Endpoint Issues**
   - Verify the `/detect` endpoint is working
   - Test with: `curl -X GET http://localhost:8000/health`

### Debug Steps
1. Check React Native logs: `npx react-native log-android`
2. Test API health: Open `http://localhost:8000/health` in browser
3. Check if the image file can be accessed

---

## Issue 2: App Crashes After Screen Share Permission

### Problem
The app closes abruptly after granting screen sharing permission.

### Root Causes & Solutions

1. **Missing Permissions in AndroidManifest.xml**
   - Added `android.permission.MEDIA_PROJECTION` permission
   - This permission is required for screen capture on Android

2. **Promise Handling Issues**
   - Fixed inconsistent promise resolution in `requestPermissions` method
   - Now properly uses `createPermissionResult` instead of `createResult`

3. **Activity Result Handling**
   - The native module needs to properly handle the permission result
   - Added proper error handling in the permission callback

### Changes Made

1. **AndroidManifest.xml**: Added MEDIA_PROJECTION permission
2. **ScreenStreamModule.kt**: Fixed promise resolution consistency
3. **Error Handling**: Improved error handling in permission requests

### Testing Screen Share
1. Build the app: `npm run android`
2. Navigate to "Screen" tab
3. Tap "Request Permission"
4. Grant screen capture permission
5. The app should now stay open and show permission granted status

---

## Additional Debugging Commands

### Check App Logs
```bash
# Android logs
npx react-native log-android

# Or use adb directly
adb logcat *:E | grep -i "aifilter\|screenstre"
```

### Backend Health Check
```bash
# Test API health
curl -X GET http://localhost:8000/health

# Test with sample image
curl -X POST -F "file=@/path/to/image.jpg" http://localhost:8000/detect
```

### Rebuild Clean
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

---

## Expected Behavior After Fixes

1. **Image Analysis**: Should successfully analyze images and show AI detection results
2. **Screen Share**: Should request permission, stay open after granting, and allow screen capture
3. **No Crashes**: App should remain stable during both operations
