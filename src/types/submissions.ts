
export interface DocumentSubmission {
  id: string;
  user_id: string;
  document_type: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  author_id?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
