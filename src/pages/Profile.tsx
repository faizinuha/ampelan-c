
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, FileText, Bell, Camera, Upload, BookOpen } from 'lucide-react';
import SubmissionsList from '@/components/SubmissionsList';
import DocumentSubmissionForm from '@/components/DocumentSubmissionForm';
import NewsManagement from '@/components/NewsManagement';

const Profile = () => {
  const { user, profile, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    rt_rw: '',
    occupation: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        rt_rw: profile.rt_rw || '',
        occupation: profile.occupation || ''
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await updateProfile(formData);
    
    if (success) {
      toast({
        title: "Berhasil!",
        description: "Profil berhasil diperbarui",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Gagal memperbarui profil",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate image upload
      const reader = new FileReader();
      reader.onload = () => {
        toast({
          title: "Berhasil!",
          description: "Foto profil berhasil diupload",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Village scenery" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Profil Saya</h1>
            <p className="text-xl md:text-2xl opacity-90">Kelola informasi dan konten Anda</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="submissions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Pengajuan
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Kelola Berita
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifikasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl bg-green-600 text-white">
                        {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="profile-upload" className="absolute bottom-0 right-1/4 cursor-pointer">
                      <div className="bg-green-600 hover:bg-green-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <CardTitle className="text-2xl">{profile?.full_name || 'Pengguna'}</CardTitle>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                    {user.role === 'admin' ? 'Admin Desa' : 'Warga'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Member sejak</p>
                    <p className="font-semibold">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <DocumentSubmissionForm 
                      trigger={
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <FileText className="w-4 h-4 mr-2" />
                          Ajukan Dokumen Baru
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Informasi Pribadi</CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Batal' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                          id="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Alamat Lengkap</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                        rows={3}
                        placeholder="Masukkan alamat lengkap..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rt_rw">RT/RW</Label>
                        <Input
                          id="rt_rw"
                          type="text"
                          value={formData.rt_rw}
                          onChange={(e) => setFormData({ ...formData, rt_rw: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="RT 01/RW 02"
                        />
                      </div>
                      <div>
                        <Label htmlFor="occupation">Pekerjaan</Label>
                        <Input
                          id="occupation"
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                          placeholder="Pekerjaan utama..."
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Batal
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                          Simpan Perubahan
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsList isAdmin={false} />
          </TabsContent>

          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Notifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada notifikasi</h3>
                  <p className="text-gray-500">Notifikasi akan muncul di sini ketika ada update terbaru.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
