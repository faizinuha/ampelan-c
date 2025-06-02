
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ampelan_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@ampelan.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email: 'admin@ampelan.com',
        name: 'Admin Desa',
        role: 'admin',
        avatar: '/placeholder.svg'
      };
      setUser(adminUser);
      localStorage.setItem('ampelan_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (password === 'user123') {
      const regularUser: User = {
        id: '2',
        email,
        name: email.split('@')[0],
        role: 'user',
        avatar: '/placeholder.svg'
      };
      setUser(regularUser);
      localStorage.setItem('ampelan_user', JSON.stringify(regularUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      avatar: '/placeholder.svg'
    };
    
    setUser(newUser);
    localStorage.setItem('ampelan_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ampelan_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
