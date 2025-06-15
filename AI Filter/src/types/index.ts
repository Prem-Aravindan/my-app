export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UploadedMedia {
  id: string;
  user_id: string;
  file_url: string;
  file_type: 'image' | 'audio' | 'video' | 'text';
  file_name: string;
  file_size: number;
  uploaded_at: string;
}

export interface DetectionResult {
  id: string;
  media_id: string;
  is_ai_generated: boolean;
  confidence_level: number; // 0-100
  explanation: string;
  detection_method: string;
  created_at: string;
}

export interface MediaPickerOptions {
  mediaTypes: 'Images' | 'Videos' | 'All';
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Result: {
    detectionResult: DetectionResult;
    media: UploadedMedia;
  };
  Profile: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
};
