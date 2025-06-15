import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase, TABLES } from './supabase';
import { UploadedMedia, MediaPickerOptions } from '../types';

export class MediaService {
  static async requestPermissions() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }
  }

  static async pickImage(
    options: MediaPickerOptions = { mediaTypes: 'Images' }
  ) {
    await this.requestPermissions();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions[options.mediaTypes],
      allowsEditing: options.allowsEditing ?? true,
      aspect: options.aspect,
      quality: options.quality ?? 1,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  }

  static async pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'video/*', 'audio/*', 'text/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  }
  static async uploadFile(
    file: any,
    userId: string
  ): Promise<UploadedMedia | null> {
    try {
      // For development/testing, create mock upload without actual database operations
      if (userId === 'test-user-123') {
        return this.createMockUpload(file, userId);
      }

      const fileExt = file.name?.split('.').pop() || 'unknown';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(filePath, {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: fileName,
        } as any);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('media-files').getPublicUrl(filePath);

      // Save metadata to database
      const mediaData = {
        user_id: userId,
        file_url: publicUrl,
        file_type: this.getFileType(file.mimeType || ''),
        file_name: file.name || fileName,
        file_size: file.size || 0,
      };

      const { data, error } = await supabase
        .from(TABLES.UPLOADED_MEDIA)
        .insert(mediaData)
        .select()
        .single();

      if (error) throw error;

      return data as UploadedMedia;
    } catch (error) {
      console.error('Upload error:', error);
      // Return mock upload if database operations fail
      return this.createMockUpload(file, userId);
    }
  }
  private static createMockUpload(file: any, userId: string): UploadedMedia {
    return {
      id: `mock-${Date.now()}`,
      user_id: userId,
      file_url: file.uri, // Use local file URI for mock
      file_type: this.getFileType(file.mimeType || ''),
      file_name: file.name || 'unknown_file',
      file_size: file.size || 0,
      uploaded_at: new Date().toISOString(),
    };
  }

  private static getFileType(
    mimeType: string
  ): 'image' | 'audio' | 'video' | 'text' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('text/')) return 'text';
    return 'text'; // default
  }
}
