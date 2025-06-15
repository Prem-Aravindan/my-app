import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Button } from './Button';
import { DetectionResponse, LocalAIDetectionService } from '../services/localAIDetection';

interface AIDetectionResultsProps {
  result: DetectionResponse;
  onAnalyzeAnother: () => void;
  fadeAnim?: Animated.Value;
}

export const AIDetectionResults: React.FC<AIDetectionResultsProps> = ({
  result,
  onAnalyzeAnother,
  fadeAnim,
}) => {
  const predictionColor = LocalAIDetectionService.getPredictionColor(result.prediction);
  const predictionIcon = LocalAIDetectionService.getPredictionIcon(result.prediction);
  const confidencePercentage = LocalAIDetectionService.formatConfidence(result.confidence);

  const containerStyle = fadeAnim ? {
    opacity: fadeAnim,
    transform: [{
      translateY: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }],
  } : {};

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.resultsCard}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>{predictionIcon}</Text>
          <Text style={[styles.prediction, { color: predictionColor }]}>
            {result.prediction}
          </Text>
        </View>

        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceLabel}>Confidence Score</Text>
          <Text style={[styles.confidenceValue, { color: predictionColor }]}>
            {confidencePercentage}
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${result.confidence * 100}%`,
                  backgroundColor: predictionColor,
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.scoresSection}>
          <Text style={styles.scoresTitle}>Detailed Scores</Text>
          
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>🤖 AI-Generated</Text>
              <Text style={[styles.scoreValue, { color: '#FF6B6B' }]}>
                {LocalAIDetectionService.formatConfidence(result.raw_scores.ai_generated)}
              </Text>
            </View>
            
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>✅ Real Image</Text>
              <Text style={[styles.scoreValue, { color: '#51CF66' }]}>
                {LocalAIDetectionService.formatConfidence(result.raw_scores.real)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.explanationSection}>
          <Text style={styles.explanation}>
            {result.prediction === 'AI-generated' 
              ? 'This image appears to be artificially generated. The AI model detected patterns and characteristics commonly found in AI-generated content.'
              : 'This image appears to be authentic. The AI model detected natural patterns and characteristics typical of real photographs.'
            }
          </Text>
        </View>

        <View style={styles.actionSection}>
          <Button
            title="🔍 Analyze Another Image"
            onPress={onAnalyzeAnother}
            variant="primary"
            size="large"
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  prediction: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  confidenceSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  confidenceLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    fontWeight: '600',
  },
  confidenceValue: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -1,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  scoresSection: {
    marginBottom: 28,
  },
  scoresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  explanationSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  explanation: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionSection: {
    width: '100%',
  },
});
