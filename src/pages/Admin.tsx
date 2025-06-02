
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Bell, FileText, BarChart3, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Notification } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeNotifications: 0,
    totalDocuments: 0
  });
  const [users, setUsers] = useState<Profile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    target_audience: 'all' as 'all' | 'admin' | 'user'
  });

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

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const fetchStats = async () => {
    try {
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: notificationCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalUsers: userCount || 0,
        activeNotifications: notificationCount || 0,
        totalDocuments: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedUsers: Profile[] = data?.map(user => ({
        ...user,
        role: user.role as 'admin' | 'user'
      })) || [];
      
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedNotifications: Notification[] = data?.map(notification => ({
        ...notification,
        type: notification.type as 'info' | 'success' | 'warning' | 'error',
        target_audience: notification.target_audience as 'all' | 'admin' | 'user'
      })) || [];
      
      setNotifications(typedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchNotifications();
  }, []);

  const createNotification = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([newNotification]);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Notifikasi berhasil dibuat",
      });

      fetchNotifications();
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        target_audience: 'all'
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Gagal membuat notifikasi",
        variant: "destructive",
      });
    }
  };

  const toggleNotification = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_active: !notification.is_active })
        .eq('id', notification.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Status notifikasi berhasil diubah",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error toggling notification:', error);
      toast({
        title: "Error",
        description: "Gagal mengubah status notifikasi",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notification.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Notifikasi berhasil dihapus",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus notifikasi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Banner with Village Image */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Village scenery" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Panel Admin Desa Ampelan</h1>
            <p className="text-xl md:text-2xl opacity-90">Kelola sistem informasi desa dengan mudah</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Pengguna
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Dokumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <p className="text-blue-100 text-sm">Warga terdaftar</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifikasi Aktif</CardTitle>
                  <Bell className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeNotifications}</div>
                  <p className="text-green-100 text-sm">Pengumuman aktif</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
                  <FileText className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalDocuments}</div>
                  <p className="text-purple-100 text-sm">Dokumen tersimpan</p>
                </CardContent>
              </Card>
            </div>

            {/* Village Activities Gallery */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Kegiatan Desa Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Musyawarah Desa" 
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Musyawarah Desa</h3>
                      <p className="text-sm opacity-90">Pembahasan program desa</p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Gotong Royong" 
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Gotong Royong</h3>
                      <p className="text-sm opacity-90">Kerja bakti mingguan</p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Festival Desa" 
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Festival Desa</h3>
                      <p className="text-sm opacity-90">Perayaan tahunan</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Daftar Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Bergabung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-green-50/50">
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Warga'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.address || '-'}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">Kelola Notifikasi</CardTitle>
                  <Button onClick={() => {}} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> Buat Notifikasi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div>
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipe</Label>
                    <Select onValueChange={(value) => setNewNotification({ ...newNotification, type: value as 'info' | 'success' | 'warning' | 'error' })}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Sukses</SelectItem>
                        <SelectItem value="warning">Peringatan</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Select onValueChange={(value) => setNewNotification({ ...newNotification, target_audience: value as 'all' | 'admin' | 'user' })}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Pilih target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Pengguna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={createNotification} className="w-full bg-green-600 hover:bg-green-700 mb-8">
                  Buat Notifikasi
                </Button>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Daftar Notifikasi</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id} className="hover:bg-green-50/50">
                          <TableCell className="font-medium">{notification.title}</TableCell>
                          <TableCell>
                            <Badge variant={
                              notification.type === 'success' ? 'default' :
                              notification.type === 'warning' ? 'secondary' :
                              notification.type === 'error' ? 'destructive' :
                              'secondary'
                            }>
                              {notification.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{notification.target_audience}</TableCell>
                          <TableCell>
                            <Badge variant={notification.is_active ? 'default' : 'outline'}>
                              {notification.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toggleNotification(notification)}>
                                {notification.is_active ? <Trash2 className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
                                {notification.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Kelola Dokumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Fitur Segera Hadir</h3>
                  <p className="text-gray-500">Sistem manajemen dokumen sedang dalam pengembangan.</p>
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
