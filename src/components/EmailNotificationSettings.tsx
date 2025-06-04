
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Bell, Settings } from 'lucide-react';

const EmailNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
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
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

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
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const updateNotificationSettings = async (newSettings: typeof settings) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(newSettings);
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

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    updateNotificationSettings(newSettings);
  };

  const testEmailNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('notifications').insert({
        title: 'Test Notifikasi Email',
        message: 'Ini adalah test notifikasi email untuk memastikan sistem berfungsi dengan baik.',
        type: 'info',
        target_audience: 'user',
        created_by: null,
        is_active: true
      });

      if (error) throw error;

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

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Pengaturan Notifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Notifikasi Email Berita
              </Label>
              <p className="text-sm text-gray-600">
                Terima email saat ada berita baru
              </p>
            </div>
            <Switch
              checked={settings.email_news}
              onCheckedChange={(checked) => handleSettingChange('email_news', checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Notifikasi Email Kegiatan
              </Label>
              <p className="text-sm text-gray-600">
                Terima email saat ada kegiatan baru
              </p>
            </div>
            <Switch
              checked={settings.email_activities}
              onCheckedChange={(checked) => handleSettingChange('email_activities', checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Notifikasi Email Pengumuman
              </Label>
              <p className="text-sm text-gray-600">
                Terima email untuk pengumuman penting
              </p>
            </div>
            <Switch
              checked={settings.email_announcements}
              onCheckedChange={(checked) => handleSettingChange('email_announcements', checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifikasi Push Browser
              </Label>
              <p className="text-sm text-gray-600">
                Terima notifikasi langsung di browser
              </p>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={testEmailNotification}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isLoading ? 'Mengirim...' : 'Test Notifikasi Email'}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>
            * Pastikan email Anda sudah terverifikasi untuk menerima notifikasi.
          </p>
          <p>
            * Cek folder spam jika tidak menerima email dalam 5 menit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailNotificationSettings;
