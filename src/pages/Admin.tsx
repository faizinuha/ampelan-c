
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Bell, 
  BarChart3, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Notification } from '@/types/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    target_audience: 'all'
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeNotifications: 0,
    totalNotifications: 0
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
      
      // Update stats
      const totalUsers = data?.length || 0;
      const totalAdmins = data?.filter(p => p.role === 'admin').length || 0;
      setStats(prev => ({ ...prev, totalUsers, totalAdmins }));
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      
      // Update stats
      const activeNotifications = data?.filter(n => n.is_active).length || 0;
      const totalNotifications = data?.length || 0;
      setStats(prev => ({ ...prev, activeNotifications, totalNotifications }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchNotifications();
  }, []);

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "Harap isi judul dan pesan notifikasi",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          target_audience: newNotification.target_audience,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Notifikasi berhasil dibuat dan dikirim",
      });

      setNewNotification({ title: '', message: '', type: 'info', target_audience: 'all' });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Gagal membuat notifikasi",
        variant: "destructive",
      });
    }
  };

  const toggleNotificationStatus = async (notificationId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_active: !currentStatus })
        .eq('id', notificationId);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: `Notifikasi berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate notifikasi",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const statsCards = [
    { title: 'Total Pengguna', value: stats.totalUsers.toString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Administrator', value: stats.totalAdmins.toString(), icon: Settings, color: 'bg-purple-100 text-purple-600' },
    { title: 'Notifikasi Aktif', value: stats.activeNotifications.toString(), icon: Bell, color: 'bg-green-100 text-green-600' },
    { title: 'Total Notifikasi', value: stats.totalNotifications.toString(), icon: BarChart3, color: 'bg-yellow-100 text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-green-600" />
            Dashboard Admin
          </h1>
          <p className="text-gray-600 mt-2">Kelola sistem dan layanan Desa Ampelan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Pengguna Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profiles.slice(0, 5).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {getInitials(profile.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile.full_name}</p>
                            <p className="text-sm text-gray-600">{profile.phone || 'No phone'}</p>
                          </div>
                        </div>
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role === 'admin' ? 'Admin' : 'Warga'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifikasi Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.target_audience}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={notification.is_active ? 'default' : 'secondary'}>
                            {notification.is_active ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile.full_name}</p>
                          <p className="text-sm text-gray-600">{profile.phone || 'Tidak ada nomor telepon'}</p>
                          <p className="text-sm text-gray-600">{profile.address || 'Tidak ada alamat'}</p>
                          <p className="text-xs text-gray-500">Bergabung: {new Date(profile.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role === 'admin' ? 'Admin' : 'Warga'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buat Notifikasi Baru</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notif-title">Judul</Label>
                  <Input
                    id="notif-title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    placeholder="Masukkan judul notifikasi"
                  />
                </div>
                <div>
                  <Label htmlFor="notif-message">Pesan</Label>
                  <Textarea
                    id="notif-message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    placeholder="Masukkan pesan notifikasi"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notif-type">Tipe</Label>
                    <select
                      id="notif-type"
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="notif-audience">Target</Label>
                    <select
                      id="notif-audience"
                      value={newNotification.target_audience}
                      onChange={(e) => setNewNotification({...newNotification, target_audience: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">Semua</option>
                      <option value="user">Warga</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleCreateNotification} className="bg-green-600 hover:bg-green-700">
                  <Bell className="w-4 h-4 mr-2" />
                  Kirim Notifikasi
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kelola Notifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant="outline">{notification.type}</Badge>
                          <Badge variant="outline">{notification.target_audience}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={notification.is_active ? 'default' : 'secondary'}>
                          {notification.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleNotificationStatus(notification.id, notification.is_active)}
                        >
                          {notification.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="site-name">Nama Situs</Label>
                      <Input id="site-name" defaultValue="Desa Ampelan" />
                    </div>
                    <div>
                      <Label htmlFor="admin-email">Email Admin</Label>
                      <Input id="admin-email" defaultValue="admin@ampelan.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="site-description">Deskripsi Situs</Label>
                    <Textarea
                      id="site-description"
                      defaultValue="Portal resmi Desa Ampelan untuk pelayanan masyarakat"
                      rows={3}
                    />
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Simpan Pengaturan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
