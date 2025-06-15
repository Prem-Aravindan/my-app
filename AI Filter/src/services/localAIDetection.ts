import { Platform } from 'react-native';

// API Configuration
const getApiBaseUrl = () => {
  // For Android emulator, use 10.0.2.2 instead of localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

// Type definitions
export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_type: string;
  input_size?: [number, number];
}

export interface DetectionResponse {
  prediction: 'AI-generated' | 'Real';
  confidence: number;
  raw_scores: {
    ai_generated: number;
    real: number;
  };
}

export interface ErrorResponse {
  detail: string;
}

export class LocalAIDetectionService {
  /**
   * Check if the AI detection API is healthy and ready
   */ static async checkHealth(): Promise<HealthResponse> {
    console.log('🏥 LocalAIDetectionService.checkHealth called');
    console.log('🌐 Checking health at:', `${API_BASE_URL}/health`);

    try {
      // FOR TESTING: Return mock health response
      if (__DEV__) {
        console.log('🧪 DEV MODE: Using mock health response');
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const mockHealth: HealthResponse = {
          status: 'healthy',
          model_loaded: true,
          model_type: 'mock_ai_detector_v1.0',
          input_size: [224, 224],
        };

        console.log('✅ Mock health check result:', mockHealth);
        return mockHealth;
      }

      // Real health check (commented out for testing)
      /*
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Health check response:', data); // Debug logging
      return data as HealthResponse;
      */

      // Fallback mock health
      const mockHealth: HealthResponse = {
        status: 'healthy',
        model_loaded: true,
        model_type: 'fallback_mock_detector',
        input_size: [224, 224],
      };

      return mockHealth;
    } catch (error) {
      console.error('❌ Health check error:', error);

      // Return mock health even on error for testing
      const mockHealth: HealthResponse = {
        status: 'healthy',
        model_loaded: true,
        model_type: 'error_fallback_mock',
        input_size: [224, 224],
      };

      console.log('🔄 Returning mock health after error:', mockHealth);
      return mockHealth;
    }
  }
  /**
   * Detect if an image is AI-generated using image URI
   */ static async detectImage(imageUri: string): Promise<DetectionResponse> {
    console.log(
      '🔍 LocalAIDetectionService.detectImage called with:',
      imageUri
    );

    try {
      // FOR TESTING: Return mock response without actual API call
      console.log('🎯 TESTING MODE: Bypassing actual AI detection');
      console.log('📄 Image URI:', imageUri);
      console.log('🤖 Simulating AI detection process...');

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const aiScore = Math.random() * 0.4 + 0.6; // Random score between 0.6-1.0
      const realScore = 1 - aiScore;
      const prediction = aiScore > realScore ? 'AI-generated' : 'Real';

      const mockResponse: DetectionResponse = {
        prediction,
        confidence: Math.max(aiScore, realScore),
        raw_scores: {
          ai_generated: aiScore,
          real: realScore,
        },
      };

      console.log('✅ Mock detection result:', mockResponse);
      return mockResponse;

      /* REAL IMPLEMENTATION (COMMENTED OUT FOR TESTING):
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Get file extension from URI
      const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        type: mimeType,
        name: `image.${fileExtension}`,
      } as any);

      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          `Detection failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data as DetectionResponse;
      */
    } catch (error) {
      console.error('❌ Image detection error:', error);
      throw new Error(
        error instanceof Error
          ? `Image detection failed: ${error.message}`
          : 'Image detection failed: Unknown error'
      );
    }
  } /**
   * Detect if an image is AI-generated using file object
   */
  static async detectImageFromFile(file: {
    uri: string;
    type?: string;
    name?: string;
  }): Promise<DetectionResponse> {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || 'image.jpg',
      } as any);

      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            `Detection failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data as DetectionResponse;
    } catch (error) {
      console.error('File detection error:', error);
      throw new Error(
        error instanceof Error
          ? `File detection failed: ${error.message}`
          : 'File detection failed: Unknown error'
      );
    }
  }

  /**
   * Format confidence as percentage
   */
  static formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(1)}%`;
  }

  /**
   * Get color based on prediction
   */
  static getPredictionColor(prediction: 'AI-generated' | 'Real'): string {
    return prediction === 'AI-generated' ? '#FF6B6B' : '#51CF66';
  }

  /**
   * Get icon based on prediction
   */
  static getPredictionIcon(prediction: 'AI-generated' | 'Real'): string {
    return prediction === 'AI-generated' ? '🤖' : '✅';
  }
}
