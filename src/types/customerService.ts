
export interface Message {
  id: string;
  message: string;
  sender_type: 'user' | 'agent' | 'bot';
  created_at: string;
  user_id?: string;
}

export interface DatabaseMessage {
  id: string;
  message: string;
  sender_type: string;
  created_at: string;
  user_id: string;
  updated_at: string;
}
