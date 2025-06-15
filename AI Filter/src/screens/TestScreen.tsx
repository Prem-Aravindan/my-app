import React from 'react';
import { View, Text } from 'react-native';

export const TestScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
      <Text style={{ color: '#FFFFFF', fontSize: 24 }}>Test Screen</Text>
    </View>
  );
};
