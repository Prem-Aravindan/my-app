import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

interface ScreenStreamModuleInterface {
  // Permission methods
  requestPermissions(): Promise<boolean>;

  // Screen capture methods
  startScreenCapture(intervalMs?: number): Promise<boolean>;
  stopScreenCapture(): Promise<void>;

  // Status methods
  isStreaming(): Promise<boolean>;
  getFrameCount(): Promise<number>;

  // Overlay methods (Android only)
  showOverlay(): Promise<boolean>;
  hideOverlay(): Promise<void>;
  updateOverlayResult(result: string, confidence: number): Promise<void>;
}

const { ScreenStreamModule } = NativeModules;

if (!ScreenStreamModule) {
  console.warn(
    'ScreenStreamModule not found. Make sure native modules are properly linked.'
  );
}

// Create event emitter for native events
const screenStreamEmitter =
  Platform.OS !== 'web' && ScreenStreamModule
    ? new NativeEventEmitter(ScreenStreamModule)
    : null;

// Event types
export interface ScreenFrameEvent {
  frameData: string; // Base64 encoded image
  frameCount: number;
  timestamp: number;
}

export interface DetectionResultEvent {
  isAIGenerated: boolean;
  confidence: number;
  explanation: string;
  timestamp: number;
}

export interface PermissionEvent {
  granted: boolean;
  message: string;
}

export interface ErrorEvent {
  error: string;
  code?: string;
}

// Event listener types
export type ScreenStreamEventMap = {
  onScreenFrame: ScreenFrameEvent;
  onDetectionResult: DetectionResultEvent;
  onPermissionResult: PermissionEvent;
  onError: ErrorEvent;
  onStreamingStatusChanged: { isStreaming: boolean };
};

// Export the native module with proper typing
export const ScreenStreamManager: ScreenStreamModuleInterface =
  ScreenStreamModule || {
    requestPermissions: () => Promise.resolve(false),
    startScreenCapture: () => Promise.resolve(false),
    stopScreenCapture: () => Promise.resolve(),
    isStreaming: () => Promise.resolve(false),
    getFrameCount: () => Promise.resolve(0),
    showOverlay: () => Promise.resolve(false),
    hideOverlay: () => Promise.resolve(),
    updateOverlayResult: () => Promise.resolve(),
  };

// Event emitter for screen capture events
export const ScreenStreamEmitter = screenStreamEmitter;

export default ScreenStreamManager;
