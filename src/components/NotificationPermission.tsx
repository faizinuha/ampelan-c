
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X, Smartphone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationPermission = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isMobile, setIsMobile] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
    };

    setIsMobile(checkMobile());

    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is default and not on mobile initially
      if (Notification.permission === 'default') {
        // On mobile, wait a bit before showing to ensure page is loaded
        if (checkMobile()) {
          setTimeout(() => setShowPrompt(true), 2000);
        } else {
          setShowPrompt(true);
        }
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Tidak Didukung",
        description: "Browser Anda tidak mendukung notifikasi push",
        variant: "destructive",
      });
      return;
    }

    if (permission === 'denied') {
      toast({
        title: "Notifikasi Diblokir",
        description: isMobile 
          ? "Buka pengaturan browser → Situs ini → Izin → Notifikasi → Izinkan"
          : "Klik ikon gembok di address bar dan aktifkan notifikasi",
        variant: "destructive",
      });
      return;
    }

    setIsRequesting(true);

    try {
      let result: NotificationPermission;

      if (isMobile) {
        // Mobile specific handling
        // Ensure we're in a secure context
        if (!window.isSecureContext) {
          throw new Error('Notifikasi memerlukan koneksi HTTPS');
        }

        // Request permission with user gesture
        result = await new Promise<NotificationPermission>((resolve) => {
          // Add small delay for mobile browsers
          setTimeout(async () => {
            try {
              const perm = await Notification.requestPermission();
              resolve(perm);
            } catch (error) {
              console.error('Mobile notification permission error:', error);
              resolve('denied');
            }
          }, 100);
        });
      } else {
        // Desktop handling
        result = await Notification.requestPermission();
      }

      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Berhasil!",
          description: "Notifikasi telah diaktifkan",
        });
        
        // Send test notification with mobile-specific options
        try {
          // Trigger vibration on mobile if supported
          if (isMobile && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }

          const notification = new Notification("Notifikasi Aktif! 🔔", {
            body: "Anda akan menerima notifikasi untuk berita dan pengumuman terbaru dari Desa Ampelan",
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'test-notification',
            requireInteraction: isMobile, // Keep notification visible on mobile
            silent: false,
          });

          // Auto close notification after 5 seconds on desktop
          if (!isMobile) {
            setTimeout(() => notification.close(), 5000);
          }

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (notificationError) {
          console.error('Error creating test notification:', notificationError);
          // Still show success since permission was granted
        }
        
        setShowPrompt(false);
      } else if (result === 'denied') {
        toast({
          title: "Ditolak",
          description: isMobile 
            ? "Untuk mengaktifkan nanti, buka menu browser → Pengaturan Situs → Notifikasi"
            : "Untuk mengaktifkan nanti, klik ikon gembok di address bar",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Tidak Ada Respons",
          description: "Silakan coba lagi atau periksa pengaturan browser Anda",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: isMobile 
          ? "Gagal meminta izin notifikasi. Pastikan Anda menggunakan HTTPS dan browser yang mendukung notifikasi"
          : "Gagal meminta izin notifikasi. Silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
    toast({
      title: "Pengingat",
      description: "Anda dapat mengaktifkan notifikasi kapan saja dari menu profil",
    });
  };

  if (!('Notification' in window) || !showPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-green-200 max-w-[calc(100vw-2rem)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Smartphone className="w-5 h-5 text-green-600" />
            ) : (
              <Bell className="w-5 h-5 text-green-600" />
            )}
            <CardTitle className="text-lg">
              {isMobile ? "Aktifkan Notifikasi Mobile" : "Aktifkan Notifikasi"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLater}
            disabled={isRequesting}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Terima notifikasi untuk berita terbaru dan pengumuman penting dari Desa Ampelan
        </p>
        
        {isMobile && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              Pada perangkat mobile, pastikan Anda menggunakan browser yang mendukung notifikasi dan koneksi aman (HTTPS)
            </p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-800">
              <p className="font-medium mb-1">Notifikasi sudah diblokir</p>
              <p>
                {isMobile 
                  ? "Buka menu browser → Pengaturan → Situs → Izin → Notifikasi → Izinkan"
                  : "Klik ikon gembok di address bar dan aktifkan notifikasi"
                }
              </p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={requestPermission}
            disabled={isRequesting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isRequesting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </span>
            ) : (
              "Aktifkan"
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLater}
            disabled={isRequesting}
            className="flex-1"
          >
            Nanti
          </Button>
        </div>
        
        {isMobile && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Tip: Jika gagal, coba refresh halaman dan ulangi
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPermission;
