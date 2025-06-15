import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ScreenStreamDemoScreen } from '../screens/ScreenStreamDemoScreen';

const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}> = ({ name, color, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Ionicons name={name} size={24} color={color} />
  </View>
);

const TabLabel: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Text style={[styles.tabLabel, { color }]}>{label}</Text>
);

export const AppNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Upload':
                iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
                break;
              case 'Screen':
                iconName = focused ? 'tv' : 'tv-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'help-outline';
            }

            return <TabIcon name={iconName} color={color} focused={focused} />;
          },
          tabBarLabel: ({ color }) => (
            <TabLabel label={route.name} color={color} />
          ),
          tabBarStyle: [
            styles.tabBar,
            {
              height: 90 + insets.bottom,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ],
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              tint="dark"
              style={StyleSheet.absoluteFillObject}
            />
          ),          tabBarActiveTintColor: '#4ECDC4',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        })}      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Upload" component={UploadScreen} />
        <Tab.Screen name="Screen" component={ScreenStreamDemoScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    height: 90,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tabIconFocused: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
