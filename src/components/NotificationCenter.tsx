import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserNotification } from '@/types/auth';
import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        console.log('📥 Fetching notifications...');
        const { data: notificationsData, error: notifError } = await supabase
          .from('notifications')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (notifError) throw notifError;

        const { data: userNotifData, error: userNotifError } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', user.id);

        if (userNotifError) throw userNotifError;

        const combined: UserNotification[] = notificationsData?.map((notif) => {
          const userNotif = userNotifData?.find((un) => un.notification_id === notif.id);
          return {
            id: userNotif?.id || '',
            user_id: user.id,
            notification_id: notif.id,
            is_read: userNotif?.is_read || false,
            read_at: userNotif?.read_at,
            created_at: userNotif?.created_at || notif.created_at,
            notification: {
              ...notif,
              type: notif.type as 'info' | 'success' | 'warning' | 'error',
              target_audience: notif.target_audience as 'all' | 'admin' | 'user',
            },
          };
        }) || [];

        setNotifications(combined);
      } catch (error) {
        console.error('❌ Gagal ambil notifikasi:', error);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (notification: UserNotification) => {
    if (!user || notification.is_read) return;

    try {
      const { data: existing } = await supabase
        .from('user_notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('notification_id', notification.notification_id)
        .single();

      if (existing) {
        await supabase
          .from('user_notifications')
          .update({
            is_read: true,
            read_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('user_notifications').insert({
          user_id: user.id,
          notification_id: notification.notification_id,
          is_read: true,
          read_at: new Date().toISOString(),
        });
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notification.notification_id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('❌ Gagal menandai sebagai dibaca:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      for (const n of notifications.filter((n) => !n.is_read)) {
        await markAsRead(n);
      }
    } catch (error) {
      console.error('❌ Gagal menandai semua notifikasi:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:text-red-300"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed mt-2 w-80 max-w-sm z-50 md:mt-0 md:absolute top-16 md:top-auto left-4 md:left-auto right-4 md:right-0">
            <Card className="shadow-lg border-0 max-h-96 md:max-h-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifikasi</CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Tandai Semua
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Tidak ada notifikasi
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => {
                      const notif = n.notification;
                      if (!notif) return null;

                      return (
                        <div
                          key={n.notification_id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            n.is_read
                              ? 'bg-gray-50 hover:bg-gray-100'
                              : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                          }`}
                          onClick={() => markAsRead(n)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">
                                {notif.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatDate(notif.created_at)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getTypeColor(
                                    notif.type
                                  )}`}
                                >
                                  {{
                                    info: 'Info',
                                    success: 'Berhasil',
                                    warning: 'Peringatan',
                                    error: 'Error',
                                  }[notif.type]}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
