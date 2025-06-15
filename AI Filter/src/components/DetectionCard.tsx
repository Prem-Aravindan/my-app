import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { DetectionResult, UploadedMedia } from '../types';
import {
  formatDate,
  getFileTypeIcon,
  getConfidenceColor,
} from '../utils/helpers';

interface DetectionCardProps {
  result: DetectionResult;
  media: UploadedMedia | null | undefined;
  onPress?: () => void;
}

export const DetectionCard: React.FC<DetectionCardProps> = ({
  result,
  media,
  onPress,
}) => {
  const confidenceColor = getConfidenceColor(result.confidence_level);
  const fileIcon = getFileTypeIcon(media?.file_type || 'image');
  const fileName = media?.file_name || 'Unknown file';
  const fileSize = media?.file_size || 0;

  // Determine prediction emoji and color
  const predictionEmoji = result.is_ai_generated ? '🤖' : '👤';
  const predictionColor = result.is_ai_generated ? '#ef4444' : '#22c55e';
  const predictionText = result.is_ai_generated ? 'AI Content' : 'Real Content';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.fileInfo}>
          <Text style={styles.fileIcon}>{fileIcon}</Text>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>
              {fileName}
            </Text>
            <Text style={styles.fileDate}>{formatDate(result.created_at)}</Text>
          </View>
        </View>
        <View
          style={[styles.predictionBadge, { backgroundColor: predictionColor }]}
        >
          {result.is_ai_generated ? (
            <Image
              source={require('../../assets/bot.png')}
              style={styles.predictionIcon}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.predictionEmoji}>👤</Text>
          )}
          <Text style={styles.predictionText}>{predictionText}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Confidence Section with Progress Bar */}
        <View style={styles.confidenceSection}>
          <View style={styles.confidenceHeader}>
            <Text style={styles.confidenceLabel}>Confidence Score</Text>
            <Text style={styles.confidenceValue}>
              {result.confidence_level}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${result.confidence_level}%`,
                  backgroundColor: confidenceColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Explanation Section */}
        <View style={styles.explanationSection}>
          <Text style={styles.explanationLabel}>Analysis:</Text>
          <Text style={styles.explanation}>{result.explanation}</Text>
        </View>
      </View>

      {media?.file_type === 'image' && media?.file_url && (
        <Image
          source={{ uri: media.file_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      {/* Detection Method Badge */}
      <View style={styles.methodBadge}>
        <Text style={styles.methodText}>📊 {result.detection_method}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  fileDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  predictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 140,
  },
  predictionEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  predictionIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  predictionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  content: {
    marginBottom: 16,
  },
  confidenceSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  confidenceValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  explanationSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  explanationLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  explanation: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    fontWeight: '500',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  methodBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  methodText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // Legacy styles for backward compatibility
  confidenceBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 12,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
