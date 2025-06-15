import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export const ScreenDetectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<Array<{
    timestamp: number;
    type: 'image' | 'text' | 'video';
    isAI: boolean;
    confidence: number;
    description: string;
  }>>([]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnalyzing) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start scanning animation
      Animated.loop(
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.stopAnimation();
      scanAnim.stopAnimation();
      pulseAnim.setValue(1);
      scanAnim.setValue(0);
    }
  }, [isAnalyzing]);  const requestScreenRecordingPermission = async () => {
    try {
      // Request media library permissions first
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      
      if (mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Media library access is required to save screen recordings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Note: expo-screen-capture doesn't support actual recording yet
      // It's mainly for preventing screenshots
      Alert.alert(
        '📱 Screen Recording Demo',
        'This demonstrates the permission flow for screen recording. In a full implementation, this would use native modules like ReplayKit (iOS) or MediaProjection (Android).',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start Demo', 
            onPress: () => startScreenRecording()
          }
        ]
      );
      
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert(
        'Permission Error',
        'Failed to request screen recording permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  const requestAndroidPermissions = () => {
    // On Android, we'd need to request SYSTEM_ALERT_WINDOW permission
    // This would typically involve opening settings
    Alert.alert(
      'Android Permissions Required',
      'Please enable "Display over other apps" permission in the next screen, then return to the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => {
            // This would open Android settings for overlay permission
            // Linking.openSettings() or specific intent
            startScreenRecording();
          }
        }
      ]
    );
  };  const startScreenRecording = async () => {
    try {
      setIsRecording(true);
      setIsAnalyzing(true);
      
      // Prevent screenshots during sensitive detection (optional security feature)
      await ScreenCapture.preventScreenCaptureAsync();
      
      // Start simulated AI analysis
      simulateRealtimeDetection();
      
      Alert.alert(
        '🔴 AI Detection Started',
        'Demo: AI detection simulation is now running. In a real implementation, this would analyze screen content in real-time using native recording APIs.',
        [
          { 
            text: 'Continue', 
            onPress: () => console.log('Detection started successfully')
          }
        ]
      );
      
    } catch (error) {
      console.error('Failed to start detection:', error);
      setIsRecording(false);
      setIsAnalyzing(false);
      
      Alert.alert(
        'Detection Failed',
        'Failed to start AI detection demo.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopScreenRecording = async () => {
    try {
      setIsRecording(false);
      setIsAnalyzing(false);
      
      // Re-allow screenshots
      await ScreenCapture.allowScreenCaptureAsync();
      
      Alert.alert(
        '⏹️ AI Detection Stopped',
        'Demo: AI detection simulation has been stopped. Screen capture prevention has been disabled.',
        [
          { text: 'OK' },
          {
            text: 'View Results',
            onPress: () => console.log('Show detection summary')
          }
        ]
      );
      
    } catch (error) {
      console.error('Failed to stop detection:', error);
      setIsRecording(false);
      setIsAnalyzing(false);
      
      Alert.alert(
        'Stop Detection Failed',
        'There was an issue stopping the AI detection.',
        [{ text: 'OK' }]
      );
    }
  };
  const simulateRealtimeDetection = () => {
    // Simulate detecting content every few seconds
    const detectionInterval = setInterval(() => {
      if (!isRecording) {
        clearInterval(detectionInterval);
        return;
      }
      
      // Generate mock detection results
      const mockDetections = [
        {
          timestamp: Date.now(),
          type: 'image' as const,
          isAI: Math.random() > 0.5,
          confidence: Math.floor(Math.random() * 40) + 60,
          description: 'Profile picture detected'
        },
        {
          timestamp: Date.now(),
          type: 'text' as const,
          isAI: Math.random() > 0.6,
          confidence: Math.floor(Math.random() * 30) + 70,
          description: 'Social media post content'
        },
        {
          timestamp: Date.now(),
          type: 'image' as const,
          isAI: Math.random() > 0.4,
          confidence: Math.floor(Math.random() * 35) + 65,
          description: 'Story/feed image'
        }
      ];
      
      const randomDetection = mockDetections[Math.floor(Math.random() * mockDetections.length)];
      
      setDetectionResults(prev => [randomDetection, ...prev.slice(0, 9)]); // Keep last 10 results
      
      // Show notification-style alert for high-confidence AI detection
      if (randomDetection.isAI && randomDetection.confidence > 80) {
        // In a real app, this would be a system notification or overlay
        console.log(`🤖 AI Content Detected: ${randomDetection.confidence}% confidence`);
      }
      
    }, 3000); // Check every 3 seconds
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>🔍 Screen AI Detection</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Animated.View 
            style={[
              styles.statusIcon,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={styles.statusEmoji}>
              {isRecording ? '🔴' : '⚪'}
            </Text>
          </Animated.View>
          
          <Text style={styles.statusTitle}>
            {isRecording ? 'Screen Detection Active' : 'Screen Detection Inactive'}
          </Text>
          
          <Text style={styles.statusDescription}>
            {isRecording 
              ? 'AI is analyzing your screen content in real-time'
              : 'Start screen detection to analyze content across all apps'
            }
          </Text>

          {isAnalyzing && (
            <Animated.View 
              style={[
                styles.scanLine,
                {
                  transform: [{
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 50]
                    })
                  }]
                }
              ]}
            />
          )}
        </View>

        {/* Control Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: isRecording ? '#ef4444' : '#22c55e' }
          ]}
          onPress={isRecording ? stopScreenRecording : requestScreenRecordingPermission}
        >
          <Text style={styles.controlButtonText}>
            {isRecording ? '⏹️ Stop Detection' : '🚀 Start Screen Detection'}
          </Text>
        </TouchableOpacity>

        {/* Detection Results */}
        {detectionResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Recent Detections</Text>
            {detectionResults.map((result, index) => (
              <View key={`${result.timestamp}-${index}`} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultEmoji}>
                    {result.isAI ? '🤖' : '👤'}
                  </Text>
                  <Text style={styles.resultType}>{result.type.toUpperCase()}</Text>
                  <Text style={styles.resultTime}>{formatTime(result.timestamp)}</Text>
                </View>
                <Text style={styles.resultDescription}>{result.description}</Text>
                <View style={[
                  styles.confidenceBadge,
                  { backgroundColor: result.isAI ? '#ef4444' : '#22c55e' }
                ]}>
                  <Text style={styles.confidenceText}>
                    {result.isAI ? 'AI' : 'Real'} - {result.confidence}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Demo Implementation</Text>
          <Text style={styles.infoText}>
            • Simulates real-time AI detection{'\n'}
            • Shows permission request flow{'\n'}
            • Demonstrates detection results UI{'\n'}
            • Uses Expo screen capture prevention{'\n'}
            • Ready for native recording integration
          </Text>
          
          <View style={styles.implementationNote}>
            <Text style={styles.noteTitle}>🚀 Production Implementation</Text>
            <Text style={styles.noteText}>
              For real screen recording, integrate native modules:{'\n'}
              • iOS: ReplayKit framework{'\n'}
              • Android: MediaProjection API{'\n'}
              • Process frames for AI analysis{'\n'}
              • Show system overlay notifications
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusEmoji: {
    fontSize: 48,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#6366F1',
    opacity: 0.8,
  },
  controlButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  resultType: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 12,
    textTransform: 'uppercase',
  },
  resultTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 'auto',
  },
  resultDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  implementationNote: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 6,
  },
  noteText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
});
