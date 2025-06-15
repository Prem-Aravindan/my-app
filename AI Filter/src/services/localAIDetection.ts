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
   */  static async checkHealth(): Promise<HealthResponse> {
    try {
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
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error(
        error instanceof Error 
          ? `API health check failed: ${error.message}`
          : 'API health check failed: Unknown error'
      );
    }
  }/**
   * Detect if an image is AI-generated using image URI
   */
  static async detectImage(imageUri: string): Promise<DetectionResponse> {
    try {
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
    } catch (error) {
      console.error('Image detection error:', error);
      throw new Error(
        error instanceof Error 
          ? `Image detection failed: ${error.message}`
          : 'Image detection failed: Unknown error'
      );
    }
  }  /**
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
