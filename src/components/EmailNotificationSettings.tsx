import NotificationSwitch from '@/components/notifications/NotificationSwitch';
import TestNotificationSection from '@/components/notifications/TestNotificationSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useAuthStore } from '@/stores/useAuthStore';
import { Bell, Mail, Settings } from 'lucide-react';

const EmailNotificationSettings = () => {
  const { user } = useAuthStore();
  const {
    settings,
    isLoading,
    handleSettingChange,
    testEmailNotification,
    testPushNotification,
  } = useNotificationPreferences();

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
          <NotificationSwitch
            icon={Mail}
            title="Notifikasi Email Berita"
            description="Terima email saat ada berita baru"
            checked={settings.email_news}
            onCheckedChange={(checked) =>
              handleSettingChange('email_news', checked)
            }
            disabled={isLoading}
          />

          <NotificationSwitch
            icon={Mail}
            title="Notifikasi Email Kegiatan"
            description="Terima email saat ada kegiatan baru"
            checked={settings.email_activities}
            onCheckedChange={(checked) =>
              handleSettingChange('email_activities', checked)
            }
            disabled={isLoading}
          />

          <NotificationSwitch
            icon={Mail}
            title="Notifikasi Email Pengumuman"
            description="Terima email untuk pengumuman penting"
            checked={settings.email_announcements}
            onCheckedChange={(checked) =>
              handleSettingChange('email_announcements', checked)
            }
            disabled={isLoading}
          />

          <NotificationSwitch
            icon={Bell}
            title="Notifikasi Push Browser"
            description="Terima notifikasi langsung di browser"
            checked={settings.push_notifications}
            onCheckedChange={(checked) =>
              handleSettingChange('push_notifications', checked)
            }
            disabled={isLoading}
          />
        </div>

        <TestNotificationSection
          onTestNotification={testEmailNotification}
          onTestPushNotification={testPushNotification}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default EmailNotificationSettings;
