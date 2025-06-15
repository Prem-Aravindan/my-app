import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import useScreenStream from '../hooks/useScreenStream';
import { Button } from '../components/Button';
import { DetectionResultEvent } from '../modules/ScreenStreamModule';

const ScreenDetectionScreen: React.FC = () => {
  const {
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
  } = useScreenStream();

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState<
    DetectionResultEvent[]
  >([]);

  // Add new detections to history
  useEffect(() => {
    if (latestDetection) {
      setDetectionHistory((prev) => [latestDetection, ...prev.slice(0, 9)]); // Keep last 10
    }
  }, [latestDetection]);

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Screen recording permission is required for AI detection. Please grant permission in the system dialog.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleStartCapture = async () => {
    if (!hasPermissions) {
      await handleRequestPermissions();
      return;
    }

    const started = await startCapture(1000); // Capture every 1 second
    if (started) {
      Alert.alert(
        'Screen Detection Started',
        'AI detection is now analyzing your screen content. You can minimize this app and browse other apps.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleStopCapture = async () => {
    await stopCapture();
    if (overlayVisible) {
      await handleHideOverlay();
    }
  };

  const handleShowOverlay = async () => {
    if (Platform.OS === 'android') {
      const shown = await showOverlay();
      setOverlayVisible(shown);
    } else {
      Alert.alert(
        'iOS Note',
        'Overlay detection indicators are integrated into the ReplayKit broadcast extension on iOS.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleHideOverlay = async () => {
    await hideOverlay();
    setOverlayVisible(false);
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#ef4444'; // High confidence AI = Red
    if (confidence >= 0.6) return '#f97316'; // Medium confidence = Orange
    if (confidence >= 0.4) return '#eab308'; // Low-medium confidence = Yellow
    return '#22c55e'; // Low confidence AI = Green (likely human)
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Live AI Detection</Text>
          <Text style={styles.subtitle}>
            Detect AI-generated content as you browse
          </Text>
        </View>

        {/* Status Card */}
        <BlurView intensity={20} tint="dark" style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Status</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: isStreaming ? '#22c55e' : '#6b7280' },
                ]}
              >
                {isStreaming ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Frames</Text>
              <Text style={styles.statusValue}>{frameCount}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Permissions</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: hasPermissions ? '#22c55e' : '#ef4444' },
                ]}
              >
                {hasPermissions ? 'Granted' : 'Required'}
              </Text>
            </View>
          </View>
        </BlurView>

        {/* Latest Frame Preview */}
        {latestFrame && (
          <BlurView intensity={20} tint="dark" style={styles.previewCard}>
            <Text style={styles.cardTitle}>Latest Capture</Text>
            <Image
              source={{ uri: `data:image/jpeg;base64,${latestFrame}` }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </BlurView>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!hasPermissions && (
            <Button
              title="Grant Permissions"
              onPress={handleRequestPermissions}
              variant="primary"
              loading={isLoading}
            />
          )}

          {hasPermissions && !isStreaming && (
            <Button
              title="Start Detection"
              onPress={handleStartCapture}
              variant="primary"
              loading={isLoading}
            />
          )}

          {isStreaming && (
            <>
              <Button
                title="Stop Detection"
                onPress={handleStopCapture}
                variant="secondary"
                loading={isLoading}
              />

              {Platform.OS === 'android' && (
                <View style={styles.overlayControls}>
                  {!overlayVisible ? (
                    <Button
                      title="Show Overlay Indicator"
                      onPress={handleShowOverlay}
                      variant="secondary"
                    />
                  ) : (
                    <Button
                      title="Hide Overlay Indicator"
                      onPress={handleHideOverlay}
                      variant="secondary"
                    />
                  )}
                </View>
              )}
            </>
          )}
        </View>

        {/* Detection History */}
        {detectionHistory.length > 0 && (
          <BlurView intensity={20} tint="dark" style={styles.historyCard}>
            <Text style={styles.cardTitle}>Detection History</Text>
            {detectionHistory.map((detection, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <View
                    style={[
                      styles.confidenceDot,
                      {
                        backgroundColor: getConfidenceColor(
                          detection.confidence
                        ),
                      },
                    ]}
                  />
                  <Text style={styles.historyTitle}>
                    {detection.isAIGenerated
                      ? 'AI Generated'
                      : 'Human Generated'}
                  </Text>
                  <Text style={styles.historyTime}>
                    {new Date(detection.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.historyConfidence}>
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </Text>
                <Text style={styles.historyExplanation}>
                  {detection.explanation}
                </Text>
              </View>
            ))}
          </BlurView>
        )}

        {/* Error Display */}
        {error && (
          <BlurView intensity={20} tint="dark" style={styles.errorCard}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </BlurView>
        )}

        {/* Instructions */}
        <BlurView intensity={20} tint="dark" style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>How It Works</Text>
          <Text style={styles.instructionText}>
            1. Grant screen recording permissions
          </Text>
          <Text style={styles.instructionText}>
            2. Start detection to begin analyzing screen content
          </Text>
          <Text style={styles.instructionText}>
            3. Browse other apps - AI content will be detected automatically
          </Text>
          <Text style={styles.instructionText}>
            4.{' '}
            {Platform.OS === 'android'
              ? 'Use overlay indicator for real-time results'
              : 'Check back here for detection results'}
          </Text>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  controls: {
    gap: 15,
    marginBottom: 30,
  },
  overlayControls: {
    marginTop: 10,
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  historyTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  historyConfidence: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 4,
  },
  historyExplanation: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  errorCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#fca5a5',
    lineHeight: 20,
  },
  instructionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default ScreenDetectionScreen;
