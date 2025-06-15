import { useState, useEffect, useCallback } from 'react';
import ScreenStreamManager, {
  ScreenStreamEmitter,
  ScreenFrameEvent,
  DetectionResultEvent,
  PermissionEvent,
  ErrorEvent,
} from '../modules/ScreenStreamModule';

export interface UseScreenStreamReturn {
  // Status
  isStreaming: boolean;
  hasPermissions: boolean;
  frameCount: number;
  isLoading: boolean;
  error: string | null;

  // Latest data
  latestFrame: string | null;
  latestDetection: DetectionResultEvent | null;

  // Actions
  requestPermissions: () => Promise<boolean>;
  startCapture: (intervalMs?: number) => Promise<boolean>;
  stopCapture: () => Promise<void>;
  showOverlay: () => Promise<boolean>;
  hideOverlay: () => Promise<void>;
  updateOverlayResult: (result: string, confidence: number) => Promise<void>;
}

export const useScreenStream = (): UseScreenStreamReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestFrame, setLatestFrame] = useState<string | null>(null);
  const [latestDetection, setLatestDetection] =
    useState<DetectionResultEvent | null>(null);

  // Set up event listeners
  useEffect(() => {
    if (!ScreenStreamEmitter) return;

    const subscriptions = [
      ScreenStreamEmitter.addListener(
        'onScreenFrame',
        (event: ScreenFrameEvent) => {
          setLatestFrame(event.frameData);
          setFrameCount(event.frameCount);
        }
      ),

      ScreenStreamEmitter.addListener(
        'onDetectionResult',
        (event: DetectionResultEvent) => {
          setLatestDetection(event);
        }
      ),

      ScreenStreamEmitter.addListener(
        'onPermissionResult',
        (event: PermissionEvent) => {
          setHasPermissions(event.granted);
          if (!event.granted) {
            setError(event.message);
          }
        }
      ),

      ScreenStreamEmitter.addListener('onError', (event: ErrorEvent) => {
        setError(event.error);
        setIsLoading(false);
      }),

      ScreenStreamEmitter.addListener(
        'onStreamingStatusChanged',
        (event: { isStreaming: boolean }) => {
          setIsStreaming(event.isStreaming);
          setIsLoading(false);
        }
      ),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const granted = await ScreenStreamManager.requestPermissions();
      setHasPermissions(granted);
      setIsLoading(false);
      return granted;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to request permissions';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  const startCapture = useCallback(
    async (intervalMs: number = 500): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const started =
          await ScreenStreamManager.startScreenCapture(intervalMs);
        if (started) {
          setIsStreaming(true);
        }
        setIsLoading(false);
        return started;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to start screen capture';
        setError(errorMessage);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const stopCapture = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await ScreenStreamManager.stopScreenCapture();
      setIsStreaming(false);
      setLatestFrame(null);
      setFrameCount(0);
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to stop screen capture';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  const showOverlay = useCallback(async (): Promise<boolean> => {
    try {
      return await ScreenStreamManager.showOverlay();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to show overlay';
      setError(errorMessage);
      return false;
    }
  }, []);

  const hideOverlay = useCallback(async (): Promise<void> => {
    try {
      await ScreenStreamManager.hideOverlay();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to hide overlay';
      setError(errorMessage);
    }
  }, []);

  const updateOverlayResult = useCallback(
    async (result: string, confidence: number): Promise<void> => {
      try {
        await ScreenStreamManager.updateOverlayResult(result, confidence);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update overlay';
        setError(errorMessage);
      }
    },
    []
  );

  return {
    isStreaming,
    hasPermissions,
    frameCount,
    isLoading,
    error,
    latestFrame,
    latestDetection,
    requestPermissions,
    startCapture,
    stopCapture,
    showOverlay,
    hideOverlay,
    updateOverlayResult,
  };
};

export default useScreenStream;
