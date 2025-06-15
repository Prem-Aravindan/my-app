# AI Filter Mobile App

A cross-platform mobile application that detects AI-generated content in images, videos, audio, and text files with confidence scoring and detailed explanations.

## 🚀 Features

- **Multi-format Support**: Upload images, videos, audio files, and text documents
- **AI Detection**: Advanced algorithms to detect AI-generated content
- **Confidence Scoring**: Get percentage-based confidence levels for each detection
- **Detailed Explanations**: Understand why content was flagged as AI-generated
- **User Authentication**: Secure account system with email/password
- **Upload History**: Track and review all your previous detections
- **Cross-platform**: Works on iOS, Android, and Web

## 🛠 Tech Stack

### React Native Version (Primary)
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Hooks

### Flutter Version (Alternative)
- **Frontend**: Flutter
- **Backend**: Supabase
- **Language**: Dart

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-filter-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 🗄️ Database Setup

### Supabase Tables

The app requires these tables in your Supabase database:

```sql
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded media table
CREATE TABLE uploaded_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('image', 'video', 'audio', 'text')),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detection results table
CREATE TABLE detection_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES uploaded_media(id) ON DELETE CASCADE,
  is_ai_generated BOOLEAN NOT NULL,
  confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
  explanation TEXT,
  detection_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

Create a storage bucket named `media-files` in your Supabase project for file uploads.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── DetectionCard.tsx
│   └── AppNavigator.tsx
├── screens/            # App screens
│   ├── HomeScreen.tsx
│   ├── UploadScreen.tsx
│   └── ProfileScreen.tsx
├── services/           # API and business logic
│   ├── supabase.ts
│   ├── auth.ts
│   ├── media.ts
│   └── aiDetection.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Helper functions
    └── helpers.ts
```

## 🎨 UI/UX Design

- **Design System**: iOS-inspired design with clean, modern aesthetics
- **Colors**: Primary blue (#007AFF), semantic colors for status indicators
- **Typography**: System fonts with proper hierarchy
- **Components**: Reusable components following design consistency
- **Navigation**: Bottom tab navigation with intuitive icons

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

### Code Style

- Use functional components with TypeScript
- Follow ESLint and Prettier configurations
- Implement proper error handling
- Use async/await for asynchronous operations
- Add proper TypeScript types for all functions

## 🧪 Testing

Currently uses mock AI detection. To integrate real AI detection:

1. Replace `AIDetectionService.generateMockDetection()` with actual API calls
2. Add API keys for your chosen AI detection service
3. Update the detection logic in `src/services/aiDetection.ts`

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for production**
   ```bash
   # iOS
   eas build --platform ios
   
   # Android
   eas build --platform android
   ```

### App Store Submission

Follow Expo's guides for submitting to:
- [Apple App Store](https://docs.expo.dev/submit/ios/)
- [Google Play Store](https://docs.expo.dev/submit/android/)

## 🐛 Known Issues

- Tab icons may not display properly on web (React Native limitation)
- File upload progress indicators could be improved
- Offline functionality not yet implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- Supabase for the backend infrastructure
- React Navigation for smooth navigation experience
- Community contributors and testers
