# 🚀 AI Filter - Quick Start

## ⚡ Immediate Setup (2 minutes)

### 1. Install Dependencies
```bash
cd "AI Filter"
npm install
```

### 2. Start Development Server
**Windows:**
```bash
start-server.bat
```

**macOS/Linux:**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Manual start:**
```bash
npm start
```

### 3. Run on Device (New Terminal)
**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
npm run ios
```

## 📱 Test Screen Recording

1. Open app → Navigate to **"Screen"** tab
2. Tap **"Request Permissions"** → Grant access
3. Tap **"Start Screen Stream"** → See live frames
4. **Success!** Screen recording is working

## 🎯 Key Features Working

✅ **Cross-platform screen capture** (Android MediaProjection + iOS ReplayKit)  
✅ **Real-time frame processing** (224x224 for AI models)  
✅ **Permission handling** (native dialogs)  
✅ **Live preview** (base64 frames)  
✅ **Background processing** (Android foreground service)  

## 🛠️ If Something Goes Wrong

**Clear cache and restart:**
```bash
npx expo r -c
npm start
```

**Reinstall everything:**
```bash
rm -rf node_modules
npm install
npm start
```

**Still having issues?** Check `BUILD_AND_RUN_GUIDE.md` for detailed troubleshooting.

## 🎉 You're Ready!

Your screen recording implementation is **complete and working**. The app will capture screen frames at 2fps and provide them as base64-encoded 224x224 images perfect for AI detection.

**Next:** Connect the `latestFrame.base64` output to your AI detection service!
