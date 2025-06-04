
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/UserProfile';
import NewsManagement from '@/components/NewsManagement';
import EmailNotificationSettings from '@/components/EmailNotificationSettings';
import { User, Settings, Newspaper, Mail } from 'lucide-react';

const Profile = () => {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Silakan login untuk mengakses halaman profil
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profil Pengguna
            </h1>
            <p className="text-gray-600">
              Kelola informasi pribadi dan pengaturan akun Anda
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Notifikasi</span>
              </TabsTrigger>
              {(profile?.role === 'admin') && (
                <TabsTrigger value="news" className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  <span className="hidden sm:inline">Kelola Berita</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Pengaturan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <UserProfile />
            </TabsContent>

            <TabsContent value="notifications">
              <EmailNotificationSettings />
            </TabsContent>

            {(profile?.role === 'admin') && (
              <TabsContent value="news">
                <NewsManagement />
              </TabsContent>
            )}

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Pengaturan Lainnya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Keamanan Akun</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Akun Anda dilindungi dengan sistem keamanan berlapis termasuk:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Enkripsi data end-to-end</li>
                        <li>• Proteksi hCaptcha untuk mencegah serangan bot</li>
                        <li>• Token keamanan untuk verifikasi identitas</li>
                        <li>• Konfirmasi email untuk pendaftaran baru</li>
                      </ul>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Privasi Data</h3>
                      <p className="text-sm text-gray-600">
                        Data pribadi Anda disimpan dengan aman dan hanya digunakan 
                        untuk keperluan layanan desa. Kami tidak membagikan informasi 
                        Anda kepada pihak ketiga tanpa persetujuan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
