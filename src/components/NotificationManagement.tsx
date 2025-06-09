
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const NotificationManagement = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    target_audience: 'all' as 'all' | 'admin' | 'user'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

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
      resetForm();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Gagal membuat notifikasi",
        variant: "destructive",
      });
    }
  };

  const updateNotification = async () => {
    if (!editingNotification) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          target_audience: newNotification.target_audience,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingNotification.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Notifikasi berhasil diperbarui",
      });

      fetchNotifications();
      resetForm();
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui notifikasi",
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

  const resetForm = () => {
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      target_audience: 'all'
    });
    setEditingNotification(null);
    setIsDialogOpen(false);
  };

  const startEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      target_audience: notification.target_audience
    });
    setIsDialogOpen(true);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Kelola Notifikasi</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Notifikasi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingNotification ? 'Edit Notifikasi' : 'Tambah Notifikasi Baru'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder="Masukkan judul notifikasi..."
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipe</Label>
                  <Select onValueChange={(value) => setNewNotification({ ...newNotification, type: value as 'info' | 'success' | 'warning' | 'error' })} value={newNotification.type}>
                    <SelectTrigger>
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

                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Select onValueChange={(value) => setNewNotification({ ...newNotification, target_audience: value as 'all' | 'admin' | 'user' })} value={newNotification.target_audience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Pengguna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    placeholder="Masukkan pesan notifikasi..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={editingNotification ? updateNotification : createNotification} className="bg-green-600 hover:bg-green-700">
                    {editingNotification ? 'Perbarui' : 'Simpan'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
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
                  <Badge variant="secondary">
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
                    <Button variant="ghost" size="sm" onClick={() => startEdit(notification)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleNotification(notification)}
                      className={notification.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                    >
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NotificationManagement;
