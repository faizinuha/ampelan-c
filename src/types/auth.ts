
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string | null;
  address?: string | null;
  rt_rw?: string | null;
  occupation?: string | null;
  avatar_url?: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  isLoading: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target_audience: 'all' | 'admin' | 'user';
  created_by?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  notification_id: string;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  notification?: Notification;
}
