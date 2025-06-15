import { useState, useEffect, useCallback, useRef } from 'react';
import ScreenStreamManager, { FrameData } from './ScreenStreamModule';

export interface UseScreenStreamOptions {
  intervalMs?: number;
  autoStart?: boolean;
  maxFrameBuffer?: number;
}

export interface UseScreenStreamReturn {
  // Current state
  isStreaming: boolean;
  isSupported: boolean;
  hasPermission: boolean;
  latestFrame: FrameData | null;
  frameBuffer: FrameData[];
  frameCount: number;
  error: string | null;
  
  // Actions
  startStream: () => Promise<boolean>;
  stopStream: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
  clearFrameBuffer: () => void;
  
  // Utils
  getBase64Image: () => string | null;
  getLatestFrameTimestamp: () => number | null;
}

export const useScreenStream = (options: UseScreenStreamOptions = {}): UseScreenStreamReturn => {
  const {
    intervalMs = 500,
    autoStart = false,
    maxFrameBuffer = 10
  } = options;

  // State
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [latestFrame, setLatestFrame] = useState<FrameData | null>(null);
  const [frameBuffer, setFrameBuffer] = useState<FrameData[]>([]);
  const [frameCount, setFrameCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const frameListenerRef = useRef<(() => void) | null>(null);
  const errorListenerRef = useRef<(() => void) | null>(null);
  const statusListenerRef = useRef<(() => void) | null>(null);

  // Initialize support check
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = await ScreenStreamManager.isSupported();
        setIsSupported(supported);
        
        if (!supported) {
          setError('Screen streaming not supported on this device');
        }
      } catch (err) {
        console.error('Failed to check screen stream support:', err);
        setIsSupported(false);
        setError('Failed to check device support');
      }
    };

    checkSupport();
  }, []);

  // Setup event listeners
  useEffect(() => {
    // Frame listener
    frameListenerRef.current = ScreenStreamManager.addFrameListener((frameData: FrameData) => {
      setLatestFrame(frameData);
      setFrameCount(prev => prev + 1);
      
      // Update frame buffer
      setFrameBuffer(prev => {
        const newBuffer = [frameData, ...prev];
        return newBuffer.slice(0, maxFrameBuffer);
      });
      
      // Clear any existing errors on successful frame
      setError(null);
    });

    // Error listener
    errorListenerRef.current = ScreenStreamManager.addErrorListener((errorData) => {
      setError(errorData.message);
      setIsStreaming(false);
    });

    // Status listener
    statusListenerRef.current = ScreenStreamManager.addStatusListener((status) => {
      setIsStreaming(status.isStreaming);
      setFrameCount(status.frameCount);
    });

    // Cleanup function
    return () => {
      frameListenerRef.current?.();
      errorListenerRef.current?.();
      statusListenerRef.current?.();
    };
  }, [maxFrameBuffer]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && isSupported && !isStreaming) {
      startStream();
    }
  }, [isSupported, autoStart]);

  // Request permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const result = await ScreenStreamManager.requestPermissions();
      setHasPermission(result.granted);
      
      if (!result.granted) {
        setError(result.error || 'Permissions denied');
      }
      
      return result.granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission request failed';
      setError(errorMessage);
      setHasPermission(false);
      return false;
    }
  }, []);

  // Start streaming
  const startStream = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      if (!isSupported) {
        setError('Screen streaming not supported');
        return false;
      }

      if (isStreaming) {
        setError('Stream already running');
        return false;
      }

      const result = await ScreenStreamManager.startScreenStream(intervalMs);
      
      if (result.success) {
        setIsStreaming(true);
        setHasPermission(true);
      } else {
        setError(result.error || 'Failed to start stream');
      }
      
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start stream';
      setError(errorMessage);
      setIsStreaming(false);
      return false;
    }
  }, [intervalMs, isSupported, isStreaming]);

  // Stop streaming
  const stopStream = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      
      const result = await ScreenStreamManager.stopScreenStream();
      
      if (result.success) {
        setIsStreaming(false);
      } else {
        setError('Failed to stop stream');
      }
      
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop stream';
      setError(errorMessage);
      return false;
    }
  }, []);

  // Clear frame buffer
  const clearFrameBuffer = useCallback(() => {
    setFrameBuffer([]);
    setLatestFrame(null);
    setFrameCount(0);
  }, []);

  // Get base64 image of latest frame
  const getBase64Image = useCallback((): string | null => {
    return latestFrame ? `data:image/jpeg;base64,${latestFrame.base64}` : null;
  }, [latestFrame]);

  // Get latest frame timestamp
  const getLatestFrameTimestamp = useCallback((): number | null => {
    return latestFrame?.timestamp || null;
  }, [latestFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopStream();
      }
    };
  }, []);

  return {
    // State
    isStreaming,
    isSupported,
    hasPermission,
    latestFrame,
    frameBuffer,
    frameCount,
    error,
    
    // Actions
    startStream,
    stopStream,
    requestPermissions,
    clearFrameBuffer,
    
    // Utils
    getBase64Image,
    getLatestFrameTimestamp,
  };
};
