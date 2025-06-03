
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationPermission = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is default
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Tidak Didukung",
        description: "Browser Anda tidak mendukung notifikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Berhasil!",
          description: "Notifikasi telah diaktifkan",
        });
        
        // Send test notification
        new Notification("Notifikasi Aktif!", {
          body: "Anda akan menerima notifikasi untuk berita dan pengumuman terbaru",
          icon: '/favicon.ico'
        });
      } else {
        toast({
          title: "Ditolak",
          description: "Izin notifikasi ditolak",
          variant: "destructive",
        });
      }
      
      setShowPrompt(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Gagal meminta izin notifikasi",
        variant: "destructive",
      });
    }
  };

  if (!('Notification' in window) || !showPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Aktifkan Notifikasi</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPrompt(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Terima notifikasi untuk berita terbaru dan pengumuman penting dari Desa Ampelan
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={requestPermission}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Aktifkan
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowPrompt(false)}
            className="flex-1"
          >
            Nanti
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPermission;
