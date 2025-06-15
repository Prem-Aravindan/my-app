import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { Button } from '../components/Button';

export const ProfileScreen: React.FC = () => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationComplete(true);
    });
  }, []);

  const handleGetStarted = () => {
    // Pulse animation for button press
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    console.log('Get started with AI detection!');
  };

  const handleLearnMore = () => {
    console.log('Learn more about AI detection');
  };  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
      
      {/* Animated Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: slideAnim }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateX: slideAnim }] }]} />
      <Animated.View style={[styles.orb, styles.orb3, { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 30], outputRange: [0, -15] }) }] }]} />
      
      <View style={styles.safeContent}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
        <View style={styles.profileHeader}>
          <Animated.View 
            style={[
              styles.avatar,
              animationComplete && {
                transform: [
                  {
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image 
              source={require('../../assets/bot.png')} 
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Text style={styles.welcomeTitle}>Welcome to AI Filter!</Text>
          <Text style={styles.welcomeSubtitle}>
            Your AI content detection companion
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureItem 
            icon="🔍" 
            title="Smart Detection"
            description="Advanced AI algorithms to detect generated content"
            delay={200}
          />
          <FeatureItem 
            icon="📊" 
            title="Confidence Scores"
            description="Get detailed confidence levels for each analysis"
            delay={400}
          />
          <FeatureItem 
            icon="🚀" 
            title="Fast & Secure"
            description="Quick processing with your privacy protected"
            delay={600}
          />
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="🎯 Start Detecting"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
          />
          
          <View style={styles.spacing} />
          
          <Button
            title="📚 Learn More"
            onPress={handleLearnMore}
            variant="secondary"
            size="medium"
          />
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>About AI Filter</Text>
          <Text style={styles.appInfoText}>
            AI Filter helps you detect AI-generated content with advanced 
            machine learning algorithms. Upload images, videos, audio, or 
            text to get instant analysis with confidence scores.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>        </View>        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, delay }) => {
  const itemFadeAnim = useState(new Animated.Value(0))[0];
  const itemSlideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(itemSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, [delay]);

  return (
    <Animated.View 
      style={[
        styles.featureItem,
        {
          opacity: itemFadeAnim,
          transform: [{ translateY: itemSlideAnim }],
        },
      ]}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
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
    width: 280,
    height: 280,
    backgroundColor: '#6366F1',
    top: -70,
    right: -140,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#8B5CF6',
    bottom: 120,
    left: -100,
  },
  orb3: {
    width: 160,
    height: 160,
    backgroundColor: '#06B6D4',
    top: '35%',
    right: '15%',
  },  safeArea: {
    flex: 1,
  },  safeContent: {
    flex: 1,
    paddingTop: 20,
  },content: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },  profileHeader: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },  avatarImage: {
    width: 40,
    height: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    alignSelf: 'flex-start',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  featureDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
    fontWeight: '500',
  },  actionButtons: {
    marginBottom: 20,
  },
  spacing: {
    height: 12,
  },
  appInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },  appInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  appInfoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  version: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontWeight: '600',
  },
});
