import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Button } from '../components/Button';
import { AIDetectionResults } from '../components/AIDetectionResults';
import { MediaService } from '../services/media';
import { AIDetectionService } from '../services/aiDetection';
import { LocalAIDetectionService, DetectionResponse } from '../services/localAIDetection';
import { UploadedMedia } from '../types';
import { formatFileSize, getFileTypeIcon } from '../utils/helpers';

export const UploadScreen: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const resultFadeAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad), 
        useNativeDriver: true,
      }),
    ]).start();

    // Check API health on component mount
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const health = await LocalAIDetectionService.checkHealth();
      console.log('Received health data:', health); // Debug logging
      
      // Consider API healthy if it responds successfully
      // Even in test mode, the API can still process requests
      const isHealthy = health.status === 'healthy' || health.status === 'ok' || health.status === 'running';
      setApiHealthy(isHealthy);
      
      if (!health.model_loaded && isHealthy) {
        // API is working but in test mode - this is fine for development
        console.log('API running in test mode - this is expected for development');
      } else if (!isHealthy) {
        Alert.alert(
          'AI Service Issue',
          'The AI detection service is not responding properly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiHealthy(false);
      Alert.alert(
        'API Connection Error',
        'Cannot connect to the AI detection service. Please make sure the local API server is running.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePickImage = async () => {
    try {
      const file = await MediaService.pickImage({ mediaTypes: 'All' });
      if (file) {
        setSelectedFile(file);
        // Animate file selection
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.7, duration: 200, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Pick image error:', error);
    }
  };

  const handlePickDocument = async () => {
    try {
      const file = await MediaService.pickDocument();
      if (file) {
        setSelectedFile(file);
        // Animate file selection
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.7, duration: 200, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
      console.error('Pick document error:', error);
    }
  };
  
  const handleUploadAndDetect = async () => {
    if (!selectedFile) return;

    // Check if it's an image file
    if (!selectedFile.mimeType?.startsWith('image/')) {
      Alert.alert(
        'Invalid File Type',
        'Please select an image file. The AI detection API only supports image files.',
        [{ text: 'OK' }]
      );
      return;
    }

    setDetecting(true);
    setDetectionResult(null);
    
    try {
      // Use local AI detection API directly
      const result = await LocalAIDetectionService.detectImage(selectedFile.uri);
      
      setDetectionResult(result);
      
      // Animate results appearance
      Animated.timing(resultFadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('AI Detection error:', error);
      
      Alert.alert(
        'Detection Failed',
        error instanceof Error 
          ? error.message 
          : 'Failed to analyze the image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setDetecting(false);
    }
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setDetectionResult(null);
    resultFadeAnim.setValue(0);
    // Animate clearing
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleAnalyzeAnother = () => {
    clearSelection();
  };  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
      
      {/* Animated Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: slideAnim }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateX: slideAnim }] }]} />
      
      <View style={styles.content}>
        <Animated.ScrollView 
          style={[
            styles.scrollContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          contentContainerStyle={styles.scrollContent}
        >
        <View style={styles.header}>
          <Text style={styles.title}>AI Image Detection</Text>
          <Text style={styles.subtitle}>
            Upload an image to check if it's AI-generated
          </Text>
          
          {/* API Health Indicator */}
          <View style={styles.healthIndicator}>
            <Text style={styles.healthIcon}>
              {apiHealthy === null ? '⏳' : apiHealthy ? '🟢' : '🔴'}
            </Text>
            <Text style={styles.healthText}>
              {apiHealthy === null 
                ? 'Checking API...' 
                : apiHealthy 
                  ? 'Ready' 
                  : 'Unavailable'
              }
            </Text>
          </View>
        </View>

        {!selectedFile ? (
          <View style={styles.uploadSection}>
            <View style={styles.uploadOptions}>
              <Button
                title="📱 Select from Gallery"
                onPress={handlePickImage}
                variant="primary"
                size="large"
              />
              
              <View style={styles.spacing} />
              
              <Button
                title="📄 Browse Files"
                onPress={handlePickDocument}
                variant="secondary"
                size="large"
              />
            </View>

            <View style={styles.supportedFormats}>
              <Text style={styles.formatsTitle}>Supported Image Formats</Text>
              <Text style={styles.formatsText}>
                📷 Images: JPG, JPEG, PNG, WEBP{'\n'}
                🤖 AI Detection: Powered by local AI model{'\n'}
                ⚡ Fast Analysis: Results in seconds
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Selected File</Text>
            
            <View style={styles.filePreview}>
              {selectedFile.mimeType?.startsWith('image/') && (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.fileInfo}>
                <View style={styles.fileHeader}>
                  <Text style={styles.fileIcon}>
                    {getFileTypeIcon(selectedFile.mimeType || 'unknown')}
                  </Text>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={2}>
                      {selectedFile.name || 'Unknown file'}
                    </Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(selectedFile.size || 0)}
                    </Text>
                  </View>
                </View>
                
                {selectedFile.mimeType && (
                  <Text style={styles.fileType}>
                    Type: {selectedFile.mimeType}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Button
                title="🔍 Analyze Image"
                onPress={handleUploadAndDetect}
                loading={detecting}
                variant="primary"
                size="large"
                disabled={!apiHealthy}
              />
              
              <View style={styles.spacing} />
              
              <Button
                title="Clear Selection"
                onPress={clearSelection}
                variant="secondary"
                size="medium"
                disabled={detecting}
              />
            </View>

            {detecting && (
              <ProcessingIndicator 
                uploading={false}
                detecting={detecting}
              />
            )}

            {detectionResult && (
              <AIDetectionResults
                result={detectionResult}
                onAnalyzeAnother={handleAnalyzeAnother}
                fadeAnim={resultFadeAnim}
              />
            )}
          </View>        )}
      </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ProcessingIndicator: React.FC<{ uploading: boolean; detecting: boolean }> = ({ 
  uploading, 
  detecting 
}) => {
  const pulseAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.statusContainer,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <Text style={styles.statusText}>
        {uploading ? '📤 Uploading image...' : '🤖 Analyzing with AI...'}
      </Text>
      <Text style={styles.statusSubtext}>
        {detecting ? 'Running AI detection model...' : 'This may take a few moments'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0F',
  },
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  orb1: {
    width: 250,
    height: 250,
    backgroundColor: '#6366F1',
    top: -60,
    right: -125,
  },
  orb2: {
    width: 180,
    height: 180,
    backgroundColor: '#8B5CF6',
    bottom: 150,
    left: -90,
  },  safeArea: {
    flex: 1,
  },  content: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContainer: {
    flex: 1,
  },  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  healthIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  healthText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  uploadSection: {
    alignItems: 'center',
  },
  uploadOptions: {
    width: '100%',
    marginBottom: 40,
  },
  spacing: {
    height: 16,
  },
  supportedFormats: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  formatsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  formatsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    fontWeight: '500',
  },
  previewSection: {
    width: '100%',
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  filePreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fileInfo: {
    width: '100%',
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  fileSize: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  fileType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  actionButtons: {
    marginBottom: 24,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  statusSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
