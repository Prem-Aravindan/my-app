import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

export interface FrameData {
  base64: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface ScreenStreamModule {
  startScreenStream(intervalMs?: number): Promise<{ success: boolean; error?: string }>;
  stopScreenStream(): Promise<{ success: boolean }>;
  requestPermissions(): Promise<{ granted: boolean; error?: string }>;
  isScreenStreamSupported(): Promise<boolean>;
}

const { ScreenStreamModule: NativeScreenStreamModule } = NativeModules;

if (!NativeScreenStreamModule) {
  console.warn('ScreenStreamModule not found. Make sure native modules are properly linked.');
}

class ScreenStreamManager {
  private eventEmitter: NativeEventEmitter | null = null;
  private isStreaming = false;

  constructor() {
    if (NativeScreenStreamModule) {
      this.eventEmitter = new NativeEventEmitter(NativeScreenStreamModule);
    }
  }

  async startScreenStream(intervalMs: number = 500): Promise<{ success: boolean; error?: string }> {
    try {
      if (!NativeScreenStreamModule) {
        return { success: false, error: 'Screen streaming not supported on this device' };
      }

      if (this.isStreaming) {
        return { success: false, error: 'Screen streaming already in progress' };
      }

      // Check permissions first
      const permissionResult = await this.requestPermissions();
      if (!permissionResult.granted) {
        return { success: false, error: permissionResult.error || 'Permissions not granted' };
      }

      const result = await NativeScreenStreamModule.startScreenStream(intervalMs);
      if (result.success) {
        this.isStreaming = true;
      }
      return result;    } catch (error) {
      console.error('Failed to start screen stream:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  async stopScreenStream(): Promise<{ success: boolean }> {
    try {
      if (!NativeScreenStreamModule) {
        return { success: false };
      }

      const result = await NativeScreenStreamModule.stopScreenStream();
      if (result.success) {
        this.isStreaming = false;
      }
      return result;
    } catch (error) {
      console.error('Failed to stop screen stream:', error);
      return { success: false };
    }
  }

  async requestPermissions(): Promise<{ granted: boolean; error?: string }> {
    try {
      if (!NativeScreenStreamModule) {
        return { granted: false, error: 'Screen streaming not supported' };
      }

      return await NativeScreenStreamModule.requestPermissions();    } catch (error) {
      console.error('Failed to request permissions:', error);
      return { granted: false, error: error instanceof Error ? error.message : 'Permission request failed' };
    }
  }

  async isSupported(): Promise<boolean> {
    try {
      if (!NativeScreenStreamModule) {
        return false;
      }

      return await NativeScreenStreamModule.isScreenStreamSupported();
    } catch (error) {
      console.error('Failed to check support:', error);
      return false;
    }
  }

  addFrameListener(callback: (frameData: FrameData) => void): () => void {
    if (!this.eventEmitter) {
      console.warn('Event emitter not available');
      return () => {};
    }

    const subscription = this.eventEmitter.addListener('onFrame', callback);
    return () => subscription.remove();
  }

  addErrorListener(callback: (error: { message: string; code?: string }) => void): () => void {
    if (!this.eventEmitter) {
      console.warn('Event emitter not available');
      return () => {};
    }

    const subscription = this.eventEmitter.addListener('onError', callback);
    return () => subscription.remove();
  }

  addStatusListener(callback: (status: { isStreaming: boolean; frameCount: number }) => void): () => void {
    if (!this.eventEmitter) {
      console.warn('Event emitter not available');
      return () => {};
    }

    const subscription = this.eventEmitter.addListener('onStatusChange', callback);
    return () => subscription.remove();
  }

  getStreamingStatus(): boolean {
    return this.isStreaming;
  }

  static getInstance(): ScreenStreamManager {
    if (!ScreenStreamManager.instance) {
      ScreenStreamManager.instance = new ScreenStreamManager();
    }
    return ScreenStreamManager.instance;
  }

  private static instance: ScreenStreamManager;
}

export default ScreenStreamManager.getInstance();
