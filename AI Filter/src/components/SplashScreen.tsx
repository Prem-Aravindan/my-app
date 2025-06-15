import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
}) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Title animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Subtitle animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 700);

    // Show loading dots
    setTimeout(() => {
      setShowLoading(true);
    }, 1000);

    // Complete animation
    setTimeout(() => {
      onAnimationComplete();
    }, 2500);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image
            source={require('../../assets/bot.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{ translateY: titleTranslateY }],
              opacity: titleOpacity,
            },
          ]}
        >
          AI Filter
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              transform: [{ translateY: subtitleTranslateY }],
              opacity: subtitleOpacity,
            },
          ]}
        >
          Detect AI-generated content with confidence
        </Animated.Text>

        {showLoading && <LoadingDots />}
      </View>
    </View>
  );
};

const LoadingDots: React.FC = () => {
  const dot1Opacity = useRef(new Animated.Value(0.5)).current;
  const dot2Opacity = useRef(new Animated.Value(0.5)).current;
  const dot3Opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animateDots = () => {
      const animation = Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      const animation2 = Animated.sequence([
        Animated.delay(200),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      const animation3 = Animated.sequence([
        Animated.delay(400),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      Animated.parallel([animation, animation2, animation3]).start(() => {
        animateDots();
      });
    };

    animateDots();
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.loadingDot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.loadingDot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.loadingDot, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
});
