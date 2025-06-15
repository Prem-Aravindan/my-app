import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Animated,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { DetectionCard } from '../components/DetectionCard';
import { Button } from '../components/Button';
import { AIDetectionService } from '../services/aiDetection';
import { DetectionResult, BottomTabParamList } from '../types';

type HomeScreenNavigationProp = NavigationProp<BottomTabParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [detectionHistory, setDetectionHistory] = useState<(DetectionResult & { uploaded_media?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    loadDetectionHistory();
    
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadDetectionHistory = async () => {
    try {
      // Mock user ID for testing without authentication
      const mockUserId = 'test-user-123';
      const history = await AIDetectionService.getDetectionHistory(mockUserId);
      setDetectionHistory(history);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDetectionHistory();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading your detections...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderDetectionCard = ({ item }: { item: DetectionResult & { uploaded_media?: any } }) => (
    <DetectionCard
      result={item}
      media={item.uploaded_media || {
        id: item.media_id,
        file_type: 'image',
        file_name: 'Unknown file',
        file_size: 0,
        file_url: 'https://picsum.photos/seed/picsum/200/300',
        user_id: 'unknown',
        uploaded_at: item.created_at,
      }}
      onPress={() => {
        // Navigate to result detail screen
        console.log('Navigate to result:', item.id);
      }}
    />
  );

  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No Detections Yet</Text>
      <Text style={styles.emptyDescription}>
        Upload your first file to start detecting AI-generated content
      </Text>
      <Button
        title="Upload Your First File"
        onPress={() => {
          navigation.navigate('Upload');
        }}
        variant="primary"
        size="medium"
      />
    </Animated.View>
  );

  // Calculate stats
  const totalDetections = detectionHistory.length;
  const aiGenerated = detectionHistory.filter(item => item.is_ai_generated).length;
  const humanGenerated = totalDetections - aiGenerated;
  const avgConfidence = totalDetections > 0 
    ? Math.round(detectionHistory.reduce((sum, item) => sum + item.confidence_level, 0) / totalDetections)
    : 0;
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
      
      {/* Animated Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: slideAnim }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateX: slideAnim }] }]} />
      <Animated.View style={[styles.orb, styles.orb3, { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 50], outputRange: [0, -25] }) }] }]} />
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>AI Filter</Text>
            <Text style={styles.subtitle}>Intelligent content detection</Text>
          </View>
        </Animated.View>

        {/* Stats Overview */}
        {detectionHistory.length > 0 && (
          <Animated.View 
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalDetections}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FF6B6B' }]}>{aiGenerated}</Text>
                <Text style={styles.statLabel}>AI</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#4ECDC4' }]}>{humanGenerated}</Text>
                <Text style={styles.statLabel}>Real</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#45B7D1' }]}>{avgConfidence}%</Text>
                <Text style={styles.statLabel}>Avg Confidence</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Detection History */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {detectionHistory.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <Text style={styles.sectionTitle}>Recent Detections</Text>
              <FlatList
                data={detectionHistory}
                renderItem={renderDetectionCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#FFFFFF"
                    colors={['#6366F1']}
                  />
                }
              />
            </>          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0F',
  },
  orb: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  orb1: {
    width: 200,
    height: 200,
    backgroundColor: '#6366F1',
    top: -50,
    right: -100,
  },
  orb2: {
    width: 150,
    height: 150,
    backgroundColor: '#8B5CF6',
    bottom: 200,
    left: -75,
  },
  orb3: {
    width: 120,
    height: 120,
    backgroundColor: '#06B6D4',
    top: 300,
    right: 50,  },
  safeArea: {
    flex: 1,
  },  header: {
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.2,
  },  statsContainer: {
    marginHorizontal: 12,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textAlign: 'center',
  },  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});
