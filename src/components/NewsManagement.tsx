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
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NewsPost } from '@/types/submissions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const NewsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newsData, setNewsData] = useState<NewsPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newNews, setNewNews] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image_url: '',
    is_published: true
  });

  const categories = [
    'Musyawarah',
    'Bantuan',
    'Gotong Royong',
    'Pembangunan',
    'Kesehatan',
    'Pendidikan',
    'Olahraga',
    'Budaya',
    'Umum'
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsData(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Gagal memuat berita",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      // Try to upload to storage bucket
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Fallback: return a placeholder URL or use the preview
        return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Return placeholder image if upload fails
      return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
  };

  const sendNotification = async (title: string, message: string) => {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("Browser tidak mendukung notifikasi");
      return;
    }

    // Request permission if needed
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Izin notifikasi ditolak");
        return;
      }
    }

    // Send notification if permission granted
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const createNews = async () => {
    try {
      let imageUrl = newNews.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('news_posts')
        .insert([{
          title: newNews.title,
          excerpt: newNews.excerpt,
          content: newNews.content,
          category: newNews.category,
          image_url: imageUrl,
          is_published: newNews.is_published,
          author_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Berita berhasil dibuat",
      });

      // Send web push notification
      await sendNotification(
        "Berita Baru Diterbitkan!",
        `${newNews.title} - ${newNews.excerpt.substring(0, 50)}...`
      );

      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error creating news:', error);
      toast({
        title: "Error",
        description: "Gagal membuat berita. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const updateNews = async () => {
    if (!editingNews) return;
    
    try {
      let imageUrl = editingNews.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('news_posts')
        .update({
          title: newNews.title,
          excerpt: newNews.excerpt,
          content: newNews.content,
          category: newNews.category,
          image_url: imageUrl,
          is_published: newNews.is_published,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingNews.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Berita berhasil diperbarui",
      });

      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error updating news:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui berita",
        variant: "destructive",
      });
    }
  };

  const deleteNews = async (news: NewsPost) => {
    try {
      const { error } = await supabase
        .from('news_posts')
        .delete()
        .eq('id', news.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Berita berhasil dihapus",
      });

      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus berita",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (news: NewsPost) => {
    try {
      const { error } = await supabase
        .from('news_posts')
        .update({ is_published: !news.is_published })
        .eq('id', news.id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: `Berita berhasil ${!news.is_published ? 'dipublikasikan' : 'disembunyikan'}`,
      });

      fetchNews();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Error",
        description: "Gagal mengubah status publikasi",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewNews({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image_url: '',
      is_published: true
    });
    setEditingNews(null);
    setImageFile(null);
    setImagePreview('');
    setIsDialogOpen(false);
  };

  const startEdit = (news: NewsPost) => {
    setEditingNews(news);
    setNewNews({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category,
      image_url: news.image_url || '',
      is_published: news.is_published
    });
    setImagePreview(news.image_url || '');
    setIsDialogOpen(true);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Kelola Berita & Kegiatan</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Berita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    placeholder="Masukkan judul berita..."
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select onValueChange={(value) => setNewNews({ ...newNews, category: value })} value={newNews.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="excerpt">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    value={newNews.excerpt}
                    onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                    placeholder="Masukkan ringkasan berita..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Konten</Label>
                  <Textarea
                    id="content"
                    value={newNews.content}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                    placeholder="Masukkan konten lengkap berita..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Gambar</Label>
                  <div className="space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {!imageFile && (
                      <Input
                        placeholder="Atau masukkan URL gambar..."
                        value={newNews.image_url}
                        onChange={(e) => {
                          setNewNews({ ...newNews, image_url: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                      />
                    )}
                    {imagePreview && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={newNews.is_published}
                    onCheckedChange={(checked) => setNewNews({ ...newNews, is_published: checked })}
                  />
                  <Label htmlFor="published">Publikasikan</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={editingNews ? updateNews : createNews} className="bg-green-600 hover:bg-green-700">
                    {editingNews ? 'Perbarui' : 'Simpan'}
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
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsData.map((news) => (
              <TableRow key={news.id} className="hover:bg-green-50/50">
                <TableCell className="font-medium">{news.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{news.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={news.is_published ? 'default' : 'outline'}>
                    {news.is_published ? 'Dipublikasikan' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(news.created_at).toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(news)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublishStatus(news)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNews(news)}
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

export default NewsManagement;
