import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import ScreenStreamManager from '../modules/ScreenStreamModule';

const TestScreen: React.FC = () => {
  const [moduleAvailable, setModuleAvailable] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    checkModuleAvailability();
  }, []);

  const checkModuleAvailability = () => {
    const available =
      ScreenStreamManager !== null && ScreenStreamManager !== undefined;
    setModuleAvailable(available);

    if (available) {
      addTestResult('✅ ScreenStreamModule loaded successfully');
    } else {
      addTestResult('❌ ScreenStreamModule not available');
    }
  };

  const addTestResult = (result: string) => {
    setTestResults((prev) => [...prev, result]);
  };

  const testPermissions = async () => {
    try {
      addTestResult('🔄 Testing permission request...');
      const granted = await ScreenStreamManager.requestPermissions();
      addTestResult(
        granted ? '✅ Permissions granted' : '❌ Permissions denied'
      );
    } catch (error) {
      addTestResult(`❌ Permission test failed: ${error}`);
    }
  };

  const testStreamingStatus = async () => {
    try {
      addTestResult('🔄 Testing streaming status...');
      const isStreaming = await ScreenStreamManager.isStreaming();
      addTestResult(
        `ℹ️ Streaming status: ${isStreaming ? 'Active' : 'Inactive'}`
      );
    } catch (error) {
      addTestResult(`❌ Status test failed: ${error}`);
    }
  };

  const testFrameCount = async () => {
    try {
      addTestResult('🔄 Testing frame count...');
      const count = await ScreenStreamManager.getFrameCount();
      addTestResult(`ℹ️ Frame count: ${count}`);
    } catch (error) {
      addTestResult(`❌ Frame count test failed: ${error}`);
    }
  };

  const runAllTests = async () => {
    setTestResults(['🚀 Starting native module tests...']);
    checkModuleAvailability();
    await testStreamingStatus();
    await testFrameCount();
    addTestResult('✅ All tests completed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Native Module Test</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: moduleAvailable === true ? '#22c55e' : '#ef4444',
            },
          ]}
        >
          <Text style={styles.statusText}>
            {moduleAvailable === null
              ? 'Testing...'
              : moduleAvailable
                ? 'Module Available'
                : 'Module Not Found'}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Button title="Run All Tests" onPress={runAllTests} variant="primary" />
        <Button
          title="Test Permissions"
          onPress={testPermissions}
          variant="secondary"
        />
      </View>

      <View style={styles.results}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  controls: {
    gap: 15,
    marginBottom: 30,
  },
  results: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  resultText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
});

export default TestScreen;
