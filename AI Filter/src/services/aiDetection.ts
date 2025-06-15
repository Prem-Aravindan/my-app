import { supabase, TABLES } from './supabase';
import { DetectionResult, UploadedMedia } from '../types';

export class AIDetectionService {
  // Simulate AI detection - replace with actual AI service integration
  static async detectAIContent(
    media: UploadedMedia
  ): Promise<DetectionResult | null> {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock detection logic based on file type
      const mockResult = this.generateMockDetection(media);

      // For development/testing with mock user, return mock result without database operations
      if (media.user_id === 'test-user-123') {
        return {
          id: `result-${Date.now()}`,
          media_id: media.id,
          is_ai_generated: mockResult.isAI,
          confidence_level: mockResult.confidence,
          explanation: mockResult.explanation,
          detection_method: 'mock_detector_v1.0',
          created_at: new Date().toISOString(),
        } as DetectionResult;
      }

      // Save result to database
      const { data, error } = await supabase
        .from(TABLES.DETECTION_RESULTS)
        .insert({
          media_id: media.id,
          is_ai_generated: mockResult.isAI,
          confidence_level: mockResult.confidence,
          explanation: mockResult.explanation,
          detection_method: 'mock_detector_v1.0',
        })
        .select()
        .single();

      if (error) throw error;

      return data as DetectionResult;
    } catch (error) {
      console.error('AI Detection error:', error);
      // Return mock result if database operations fail
      const mockResult = this.generateMockDetection(media);
      return {
        id: `result-${Date.now()}`,
        media_id: media.id,
        is_ai_generated: mockResult.isAI,
        confidence_level: mockResult.confidence,
        explanation: mockResult.explanation,
        detection_method: 'mock_detector_v1.0',
        created_at: new Date().toISOString(),
      } as DetectionResult;
    }
  }

  private static generateMockDetection(media: UploadedMedia) {
    // Generate realistic mock data based on file type
    const random = Math.random();

    let isAI: boolean;
    let confidence: number;
    let explanation: string;

    switch (media.file_type) {
      case 'image':
        isAI = random > 0.6;
        confidence = Math.floor(random * 40) + 60; // 60-100%
        explanation = isAI
          ? `Detected artificial patterns in pixel structure and lighting inconsistencies typical of AI-generated images.`
          : `Natural image characteristics detected. Consistent lighting, realistic shadows, and authentic metadata.`;
        break;

      case 'video':
        isAI = random > 0.7;
        confidence = Math.floor(random * 35) + 65; // 65-100%
        explanation = isAI
          ? `Identified temporal inconsistencies and unnatural motion patterns characteristic of deepfake technology.`
          : `Authentic video detected. Consistent frame-to-frame continuity and natural motion blur.`;
        break;

      case 'audio':
        isAI = random > 0.5;
        confidence = Math.floor(random * 30) + 70; // 70-100%
        explanation = isAI
          ? `Voice synthesis artifacts detected in frequency patterns and prosody analysis.`
          : `Human speech patterns confirmed. Natural vocal tract resonance and breathing detected.`;
        break;

      case 'text':
        isAI = random > 0.4;
        confidence = Math.floor(random * 25) + 75; // 75-100%
        explanation = isAI
          ? `Statistical language model patterns detected. Unusual token distributions and repetitive structures.`
          : `Human writing style confirmed. Natural linguistic variations and authentic thought patterns.`;
        break;

      default:
        isAI = false;
        confidence = 50;
        explanation =
          'Unable to determine content authenticity for this file type.';
    }

    return { isAI, confidence, explanation };
  }
  static async getDetectionHistory(
    userId: string
  ): Promise<(DetectionResult & { uploaded_media?: any })[]> {
    try {
      // For development/testing without proper database schema, return mock data
      if (userId === 'test-user-123') {
        return this.getMockDetectionHistory();
      }

      const { data, error } = await supabase
        .from(TABLES.DETECTION_RESULTS)
        .select(
          `
          *,
          uploaded_media!inner(*)
        `
        )
        .eq('uploaded_media.user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (DetectionResult & { uploaded_media: any })[];
    } catch (error) {
      console.error('Get detection history error:', error);
      // Return mock data if database query fails
      return this.getMockDetectionHistory();
    }
  }
  private static getMockDetectionHistory(): DetectionResult[] {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

    return [
      {
        id: 'mock-1',
        media_id: 'media-1',
        is_ai_generated: true,
        confidence_level: 87,
        explanation:
          'Detected artificial patterns in pixel structure and lighting inconsistencies. The image shows telltale signs of diffusion model generation including smooth gradients and unnatural texture blending.',
        detection_method: 'DeepDetect AI v2.1',
        created_at: now.toISOString(),
        uploaded_media: {
          id: 'media-1',
          user_id: 'test-user-123',
          file_url: 'https://picsum.photos/seed/ai1/300/400',
          file_type: 'image',
          file_name: 'ai_portrait.jpg',
          file_size: 245760,
          uploaded_at: now.toISOString(),
        },
      },
      {
        id: 'mock-2',
        media_id: 'media-2',
        is_ai_generated: false,
        confidence_level: 92,
        explanation:
          'Natural image characteristics detected. Consistent lighting, realistic shadows, and authentic EXIF metadata. Camera noise patterns match expected sensor behavior.',
        detection_method: 'DeepDetect AI v2.1',
        created_at: oneHourAgo.toISOString(),
        uploaded_media: {
          id: 'media-2',
          user_id: 'test-user-123',
          file_url: 'https://picsum.photos/seed/real1/300/400',
          file_type: 'image',
          file_name: 'vacation_photo.jpg',
          file_size: 189440,
          uploaded_at: oneHourAgo.toISOString(),
        },
      },
      {
        id: 'mock-3',
        media_id: 'media-3',
        is_ai_generated: true,
        confidence_level: 73,
        explanation:
          'AI-generated artwork detected. Neural network artifacts visible in fine details and color transitions. Synthetic texture patterns consistent with StyleGAN architecture.',
        detection_method: 'DeepDetect AI v2.1',
        created_at: oneDayAgo.toISOString(),
        uploaded_media: {
          id: 'media-3',
          user_id: 'test-user-123',
          file_url: 'https://picsum.photos/seed/ai2/300/400',
          file_type: 'image',
          file_name: 'digital_art.png',
          file_size: 312320,
          uploaded_at: oneDayAgo.toISOString(),
        },
      },
      {
        id: 'mock-4',
        media_id: 'media-4',
        is_ai_generated: false,
        confidence_level: 95,
        explanation:
          'Authentic photograph confirmed. Natural chromatic aberration, proper depth of field, and organic composition. All metadata validates genuine camera capture.',
        detection_method: 'DeepDetect AI v2.1',
        created_at: twoDaysAgo.toISOString(),
        uploaded_media: {
          id: 'media-4',
          user_id: 'test-user-123',
          file_url: 'https://picsum.photos/seed/real2/300/400',
          file_type: 'image',
          file_name: 'landscape.jpg',
          file_size: 456789,
          uploaded_at: twoDaysAgo.toISOString(),
        },
      },
      {
        id: 'mock-5',
        media_id: 'media-5',
        is_ai_generated: true,
        confidence_level: 65,
        explanation:
          'Moderate confidence AI detection. Some artificial patterns detected but mixed with natural elements. Possible AI-enhanced or partially synthetic content.',
        detection_method: 'DeepDetect AI v2.1',
        created_at: threeDaysAgo.toISOString(),
        uploaded_media: {
          id: 'media-5',
          user_id: 'test-user-123',
          file_url: 'https://picsum.photos/seed/mixed1/300/400',
          file_type: 'image',
          file_name: 'enhanced_photo.jpg',
          file_size: 234567,
          uploaded_at: threeDaysAgo.toISOString(),
        },
      },
    ] as (DetectionResult & { uploaded_media: any })[];
  }
}
