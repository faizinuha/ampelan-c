
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

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
  };

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

  const handleSettingChange = async (key: keyof NotificationPreferences, value: boolean) => {
    // Special handling for push notifications
    if (key === 'push_notifications' && value === true) {
      if (!('Notification' in window)) {
        toast({
          title: "Tidak Didukung",
          description: "Browser Anda tidak mendukung notifikasi push",
          variant: "destructive",
        });
        return;
      }

      // Check current permission
      if (Notification.permission === 'denied') {
        toast({
          title: "Notifikasi Diblokir",
          description: isMobile() 
            ? "Buka pengaturan browser dan aktifkan notifikasi untuk situs ini"
            : "Klik ikon gembok di address bar dan aktifkan notifikasi",
          variant: "destructive",
        });
        return;
      }

      // Request permission if not granted
      if (Notification.permission !== 'granted') {
        try {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            toast({
              title: "Izin Diperlukan",
              description: "Notifikasi push memerlukan izin dari browser",
              variant: "destructive",
            });
            return;
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          toast({
            title: "Error",
            description: "Gagal meminta izin notifikasi. Silakan coba lagi",
            variant: "destructive",
          });
          return;
        }
      }
    }

    const newSettings = { ...settings, [key]: value };
    await updateNotificationSettings(newSettings);
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

  const testPushNotification = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Tidak Didukung",
        description: "Browser Anda tidak mendukung notifikasi push",
        variant: "destructive",
      });
      return;
    }

    if (Notification.permission !== 'granted') {
      toast({
        title: "Izin Diperlukan",
        description: "Aktifkan notifikasi push terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      const notification = new Notification("Test Notifikasi Push 🔔", {
        body: "Ini adalah test notifikasi push dari Desa Ampelan",
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-push-notification',
        requireInteraction: isMobile(),
        vibrate: isMobile() ? [200, 100, 200] : undefined,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds on desktop
      if (!isMobile()) {
        setTimeout(() => notification.close(), 5000);
      }

      toast({
        title: "Test Notifikasi Push Dikirim!",
        description: "Periksa notifikasi yang muncul",
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim test notifikasi push",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    isLoading,
    handleSettingChange,
    testEmailNotification,
    testPushNotification,
  };
};
