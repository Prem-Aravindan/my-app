# Flutter Alternative - AI Filter

This directory contains a Flutter version of the AI Filter app for experimentation and comparison.

## Prerequisites

Before you can run the Flutter version, make sure you have:

1. **Flutter SDK** installed
   - Download from https://flutter.dev/docs/get-started/install
   - Add Flutter to your PATH

2. **Android Studio** or **VS Code** with Flutter extensions

3. **Android SDK** (for Android development)
   - Install via Android Studio

4. **Xcode** (for iOS development, macOS only)

## Getting Started

To create and run the Flutter version:

```bash
# Navigate to this directory
cd flutter_version

# Create a new Flutter project
flutter create ai_filter_flutter

# Navigate to the project
cd ai_filter_flutter

# Add dependencies
flutter pub add supabase_flutter
flutter pub add image_picker
flutter pub add file_picker
flutter pub add http

# Run the app
flutter run
```

## Project Structure

```
flutter_version/
├── ai_filter_flutter/
│   ├── lib/
│   │   ├── main.dart
│   │   ├── screens/
│   │   ├── services/
│   │   ├── widgets/
│   │   └── models/
│   ├── android/
│   ├── ios/
│   └── pubspec.yaml
```

## Key Features (To Implement)

- [ ] Supabase authentication
- [ ] Media upload (images, videos, audio, text)
- [ ] AI content detection simulation
- [ ] Results display with confidence levels
- [ ] Material Design UI
- [ ] Cross-platform compatibility

## Notes

- This Flutter version serves as an alternative implementation
- Use the same Supabase backend as the React Native version
- Follow Flutter best practices and Material Design guidelines
- Compare performance and development experience with React Native

## Commands

```bash
# Run on Android
flutter run -d android

# Run on iOS (macOS only)
flutter run -d ios

# Build APK
flutter build apk

# Build iOS (macOS only)
flutter build ios
```
