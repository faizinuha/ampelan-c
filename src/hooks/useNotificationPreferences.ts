
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { NotificationPreferences } from '@/types/notifications';

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationPreferences>({
    email_news: true,
    email_activities: true,
    email_announcements: true,
    push_notifications: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotificationSettings();
    }
  }, [user]);

  const fetchNotificationSettings = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching notification settings for user:', user.id);
      
      const { data, error } = await (supabase as any)
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Fetched data:', data);
      console.log('Error:', error);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification settings:', error);
        return;
      }

      if (data) {
        setSettings({
          email_news: data.email_news ?? true,
          email_activities: data.email_activities ?? true,
          email_announcements: data.email_announcements ?? true,
          push_notifications: data.push_notifications ?? false,
        });
        console.log('Settings updated:', data);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const updateNotificationSettings = async (newSettings: NotificationPreferences) => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('Updating notification settings:', newSettings);
      
      const { error } = await (supabase as any)
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }

      setSettings(newSettings);
      console.log('Settings saved successfully');
      
      toast({
        title: "Berhasil!",
        description: "Pengaturan notifikasi telah disimpan",
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan notifikasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationPreferences, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    updateNotificationSettings(newSettings);
  };

  const testEmailNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('Sending test notification');
      
      const { error } = await supabase.from('notifications').insert({
        title: 'Test Notifikasi Email',
        message: 'Ini adalah test notifikasi email untuk memastikan sistem berfungsi dengan baik.',
        type: 'info',
        target_audience: 'user',
        created_by: null,
        is_active: true
      });

      if (error) {
        console.error('Error inserting notification:', error);
        throw error;
      }

      console.log('Test notification sent successfully');

      toast({
        title: "Test Notifikasi Dikirim!",
        description: "Silakan cek email Anda dalam beberapa menit",
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim test notifikasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    isLoading,
    handleSettingChange,
    testEmailNotification,
  };
};
