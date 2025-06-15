<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Filter Mobile App - Copilot Instructions

## Project Overview
This is a cross-platform mobile application built with React Native and Expo that allows users to upload content (text, images, audio, video) and check whether it's AI-generated or not.

## Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Hooks

## Code Style Guidelines
- Use functional components with TypeScript
- Prefer React hooks over class components
- Follow the existing folder structure: `src/screens`, `src/components`, `src/utils`, `src/services`
- Use async/await for asynchronous operations
- Implement proper error handling with try-catch blocks
- Use proper TypeScript types and interfaces
- Follow the ESLint and Prettier configurations

## Key Features to Implement
1. **Authentication**: Email/password login via Supabase Auth
2. **Media Upload**: Support for images, audio, video, and text
3. **AI Detection**: Simulate AI content detection with confidence levels
4. **Results Sharing**: Allow users to share detection results
5. **Navigation**: Bottom tabs with Home, Upload, and Results screens

## Supabase Integration Notes
- Use environment variables for Supabase configuration
- Implement proper file upload to Supabase Storage
- Store detection metadata in PostgreSQL
- Handle authentication state management

## Development Notes
- Test on both iOS and Android platforms
- Use Expo managed workflow for easier development
- Implement proper loading states and error handling
- Add proper TypeScript types for all components and services
