
export interface DocumentSubmission {
  id: string;
  user_id: string;
  document_type: string;
  purpose: string;
  status: string | null;
  admin_notes?: string | null;
  created_at: string | null;
  updated_at: string | null;
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
