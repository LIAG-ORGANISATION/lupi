export type AppRole = 'guardian' | 'professional';
export type AccessStatus = 'pending' | 'approved' | 'revoked';

export interface DogOwnerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfile {
  id: string;
  full_name: string;
  email: string;
  profession: string;
  zone: string;
  bio?: string;
  specializations?: string[];
  certifications?: string[];
  languages?: string[];
  hourly_rate?: number;
  phone?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dog {
  id: string;
  owner_id: string;
  name: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  photo_url?: string;
  dna_results?: any;
  questionnaire_data?: any;
  created_at: string;
  updated_at: string;
}

export interface DogProfessionalAccess {
  id: string;
  dog_id: string;
  professional_id: string;
  status: AccessStatus;
  granted_at?: string;
  revoked_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  dog_id?: string;
  subject?: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface SharedDocument {
  id: string;
  dog_id: string;
  professional_id?: string;
  title: string;
  file_url: string;
  file_type?: string;
  shared_by: string;
  created_at: string;
}
