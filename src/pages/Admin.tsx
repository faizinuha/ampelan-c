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
      
      // Type cast the data to ensure it matches our Profile interface
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
      
      // Type cast the data to ensure it matches our Notification interface
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-gray-600 mt-2">Kelola pengguna, notifikasi, dan lainnya</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Pengguna
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Dokumen
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Notifikasi Aktif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeNotifications}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Dokumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Bergabung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Warga'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Kelola Notifikasi</CardTitle>
                  <Button onClick={() => {}}><Plus className="w-4 h-4 mr-2" /> Buat Notifikasi</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipe</Label>
                    <Select onValueChange={(value) => setNewNotification({ ...newNotification, type: value as 'info' | 'success' | 'warning' | 'error' })}>
                      <SelectTrigger className="w-full">
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Select onValueChange={(value) => setNewNotification({ ...newNotification, target_audience: value as 'all' | 'admin' | 'user' })}>
                      <SelectTrigger className="w-full">
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
                <Button onClick={createNotification} className="w-full">Buat Notifikasi</Button>

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
                        <TableRow key={notification.id}>
                          <TableCell>{notification.title}</TableCell>
                          <TableCell>
                            <Badge variant={
                              notification.type === 'success' ? 'success' :
                              notification.type === 'warning' ? 'warning' :
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
            <Card>
              <CardHeader>
                <CardTitle>Kelola Dokumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Fitur ini belum tersedia.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
