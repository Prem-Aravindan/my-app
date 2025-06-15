import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export const LiveDetectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [url, setUrl] = useState('https://picsum.photos/800/600');
  const [currentUrl, setCurrentUrl] = useState('https://picsum.photos/800/600');
  const [isDetecting, setIsDetecting] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [detectedContent, setDetectedContent] = useState<Array<{
    id: string;
    type: 'image' | 'video' | 'text';
    isAI: boolean;
    confidence: number;
    position: { x: number; y: number };
  }>>([]);
  
  const webViewRef = useRef<WebView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startDetection = () => {
    setIsDetecting(true);
    
    // Simulate real-time detection with mock data
    const mockDetections = [
      { id: '1', type: 'image' as const, isAI: true, confidence: 87, position: { x: 100, y: 200 } },
      { id: '2', type: 'image' as const, isAI: false, confidence: 94, position: { x: 250, y: 350 } },
      { id: '3', type: 'text' as const, isAI: true, confidence: 73, position: { x: 80, y: 500 } },
    ];
    
    // Add detections gradually to simulate real-time analysis
    mockDetections.forEach((detection, index) => {
      setTimeout(() => {
        setDetectedContent(prev => [...prev, detection]);
      }, (index + 1) * 2000);
    });

    // Start pulsing animation for active detection
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setDetectedContent([]);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const navigateToUrl = () => {
    setCurrentUrl(url);
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'navigate', url }));
    }
  };

  const renderDetectionBadge = (detection: typeof detectedContent[0]) => (
    <View
      key={detection.id}
      style={[
        styles.detectionBadge,
        {
          left: detection.position.x,
          top: detection.position.y,
          backgroundColor: detection.isAI ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)',
        },
      ]}
    >
      <Text style={styles.badgeEmoji}>
        {detection.isAI ? '🤖' : '👤'}
      </Text>
      <Text style={styles.badgeText}>
        {detection.confidence}%
      </Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>      {showDemo ? (
        <View style={styles.demoIntro}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.demoContent}>
            <Text style={styles.demoTitle}>🚀 Live AI Detection Demo</Text>
            <Text style={styles.demoSubtitle}>
              Experience real-time AI content detection as you browse
            </Text>
            
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔍</Text>
                <Text style={styles.featureText}>Real-time analysis of images and text</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🤖</Text>
                <Text style={styles.featureText}>AI-generated content detection</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📊</Text>
                <Text style={styles.featureText}>Confidence scores and explanations</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>⚡</Text>
                <Text style={styles.featureText}>Instant overlay badges</Text>
              </View>
            </View>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Demo Limitations</Text>
              <Text style={styles.warningText}>
                This is a proof-of-concept demo. Real cross-app overlays would require:
              </Text>
              <Text style={styles.warningPoint}>• System-level permissions</Text>
              <Text style={styles.warningPoint}>• Advanced screen capture APIs</Text>
              <Text style={styles.warningPoint}>• Custom native modules</Text>
            </View>
            
            <TouchableOpacity
              style={styles.startDemoButton}
              onPress={() => setShowDemo(false)}
            >
              <Text style={styles.startDemoText}>🎮 Start Demo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
        <View style={styles.urlBar}>
          <TextInput
            style={styles.urlInput}
            value={url}
            onChangeText={setUrl}
            placeholder="Enter website URL..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            onSubmitEditing={navigateToUrl}
          />
          <TouchableOpacity style={styles.goButton} onPress={navigateToUrl}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.controls}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.detectionButton,
                { backgroundColor: isDetecting ? '#ef4444' : '#22c55e' }
              ]}
              onPress={isDetecting ? stopDetection : startDetection}
            >
              <Text style={styles.detectionButtonText}>
                {isDetecting ? '⏹️ Stop Detection' : '🔍 Start Detection'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.statusText}>
            {isDetecting 
              ? `🔴 Live Detection Active (${detectedContent.length} items detected)`
              : '⚪ Detection Inactive'
            }
          </Text>
        </View>
      </View>

      {/* Web Content Area */}
      <View style={styles.webContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webView}
          onLoadStart={() => console.log('Loading started')}
          onLoadEnd={() => console.log('Loading finished')}
          onError={(error: any) => {
            Alert.alert('Error', 'Failed to load website. Please check the URL.');
            console.error('WebView error:', error);
          }}
        />
        
        {/* Detection Overlays */}
        {isDetecting && detectedContent.map(renderDetectionBadge)}
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <Text style={styles.infoText}>
          💡 This demo simulates AI content detection overlays on web content
        </Text>        <Text style={styles.warningText}>
          Note: Real cross-app overlays require system-level permissions
        </Text>
      </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  urlBar: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  urlInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 12,
  },
  goButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  goButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  controls: {
    alignItems: 'center',
  },
  detectionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  detectionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  detectionBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000,
  },
  badgeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },  warningText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },  demoIntro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  demoTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  demoSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featureList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    fontWeight: '500',
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  warningPoint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
    marginTop: 4,
  },
  startDemoButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startDemoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
