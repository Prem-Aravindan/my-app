import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useScreenStream } from '../modules/useScreenStream';

export const ScreenStreamDemoScreen: React.FC = () => {
  const {
    isSupported,
    isStreaming,
    hasPermission,
    latestFrame,
    frameCount,
    error,
    startStream,
    stopStream,
    requestPermissions,
  } = useScreenStream();

  const [showPreview, setShowPreview] = useState(false);
  useEffect(() => {
    if (error) {
      Alert.alert('Screen Stream Error', error, [
        { text: 'OK' }
      ]);
    }
  }, [error]);

  const handleStartStream = async () => {
    if (!isSupported) {
      Alert.alert(
        'Not Supported',
        'Screen recording is not supported on this device or platform version.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          Platform.OS === 'ios' 
            ? 'Please grant screen recording permission by selecting your app from the broadcast picker.'
            : 'Please enable "Display over other apps" permission and screen capture access.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const success = await startStream();
    if (success) {
      setShowPreview(true);
    }
  };

  const handleStopStream = async () => {
    await stopStream();
    setShowPreview(false);
  };

  const getStatusColor = () => {
    if (!isSupported) return '#ef4444';
    if (isStreaming) return '#22c55e';
    if (hasPermission) return '#f59e0b';
    return '#6b7280';
  };

  const getStatusText = () => {
    if (!isSupported) return 'Not Supported';
    if (isStreaming) return 'Streaming Active';
    if (hasPermission) return 'Ready to Stream';
    return 'Permission Required';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📱 Screen Stream Demo</Text>
          <Text style={styles.subtitle}>
            AI-powered screen content detection across apps
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>{getStatusText()}</Text>
            <Text style={styles.statusDetail}>
              Platform: {Platform.OS} | Frames: {frameCount}
            </Text>
            {isStreaming && (
              <Text style={styles.streamingDetail}>
                Capturing at ~2fps • Processing 224x224px frames
              </Text>
            )}
          </View>
        </View>

        {/* Preview Card */}
        {showPreview && latestFrame && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>🖼️ Latest Frame</Text>
            <View style={styles.frameContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${latestFrame.base64}` }}
                style={styles.frameImage}
                resizeMode="contain"
              />
              <View style={styles.frameOverlay}>
                <Text style={styles.frameInfo}>
                  {latestFrame.width}x{latestFrame.height}
                </Text>
                <Text style={styles.frameTime}>
                  {new Date(latestFrame.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!isStreaming ? (
            <TouchableOpacity
              style={[styles.button, styles.startButton, !isSupported && styles.disabledButton]}
              onPress={handleStartStream}
              disabled={!isSupported}
            >
              <Text style={styles.buttonText}>
                🎬 Start Screen Stream
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStopStream}
            >
              <Text style={styles.buttonText}>
                ⏹️ Stop Stream
              </Text>
            </TouchableOpacity>
          )}

          {!hasPermission && isSupported && (
            <TouchableOpacity
              style={[styles.button, styles.permissionButton]}
              onPress={requestPermissions}
            >
              <Text style={styles.buttonText}>
                🔐 Request Permissions
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 How It Works</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>
              • <Text style={styles.infoHighlight}>Android:</Text> Uses MediaProjection API to capture screen at 480x480, then downscales to 224x224
            </Text>
            <Text style={styles.infoItem}>
              • <Text style={styles.infoHighlight}>iOS:</Text> Uses ReplayKit broadcast extension to process CVPixelBuffers in real-time
            </Text>
            <Text style={styles.infoItem}>
              • <Text style={styles.infoHighlight}>Privacy:</Text> Frames processed in-memory only, never saved to disk
            </Text>
            <Text style={styles.infoItem}>
              • <Text style={styles.infoHighlight}>Performance:</Text> Throttled to 2fps to minimize battery impact
            </Text>
          </View>
        </View>

        {/* AI Detection Pipeline Info */}
        <View style={styles.pipelineSection}>
          <Text style={styles.pipelineTitle}>🤖 AI Detection Pipeline</Text>
          <View style={styles.pipelineSteps}>
            <View style={styles.pipelineStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Screen Capture</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.pipelineStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Resize to 224x224</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.pipelineStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>CNN Pre-filter</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.pipelineStep}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>AI Detection</Text>
            </View>
          </View>
        </View>

        {/* Platform Notes */}
        <View style={styles.platformSection}>
          <Text style={styles.platformTitle}>📋 Platform Requirements</Text>
          <View style={styles.platformInfo}>
            <Text style={styles.platformItem}>
              <Text style={styles.platformLabel}>Android:</Text> API 21+ (MediaProjection)
            </Text>
            <Text style={styles.platformItem}>
              <Text style={styles.platformLabel}>iOS:</Text> iOS 11+ (ReplayKit), iOS 12+ (Broadcast Extensions)
            </Text>
            <Text style={styles.platformItem}>
              <Text style={styles.platformLabel}>Permissions:</Text> Screen recording, overlay (Android)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusDetail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  streamingDetail: {
    fontSize: 12,
    color: '#22c55e',
    marginTop: 4,
    fontWeight: '500',
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  frameContainer: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  frameImage: {
    width: '100%',
    height: 200,
  },
  frameOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    padding: 6,
  },
  frameInfo: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  frameTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  controls: {
    marginBottom: 30,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  permissionButton: {
    backgroundColor: '#f59e0b',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  infoHighlight: {
    fontWeight: '600',
    color: '#4ECDC4',
  },
  pipelineSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pipelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  pipelineSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  pipelineStep: {
    alignItems: 'center',
    flex: 1,
    minWidth: 60,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4ECDC4',
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  platformSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  platformInfo: {
    gap: 10,
  },
  platformItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  platformLabel: {
    fontWeight: '600',
    color: '#4ECDC4',
  },
});
