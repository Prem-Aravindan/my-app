import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[size]];

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push(styles[variant]);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any[] = [styles.text, styles[`${size}Text`]];

    if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else {
      baseStyle.push(styles.primaryText);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle()]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'secondary' ? '#007AFF' : '#FFFFFF'}
            style={styles.loader}
          />
        )}
        <Text style={getTextStyle()}>{loading ? 'Loading...' : title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // Sizes
  small: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    minHeight: 52,
  },
  large: {
    paddingHorizontal: 36,
    paddingVertical: 18,
    minHeight: 60,
  },

  // Text sizes
  smallText: {
    fontSize: 15,
  },
  mediumText: {
    fontSize: 17,
  },
  largeText: {
    fontSize: 19,
  },

  // Variants
  primary: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text colors
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
