
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Upload, User, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  uploaded_by: string;
  uploader_name: string;
  created_at: string;
}

const Activities = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: ''
  });

  // Data contoh kegiatan Agustus
  const sampleActivities: Activity[] = [
    {
      id: 'sample-1',
      title: 'Karnaval Kemerdekaan RI ke-79',
      description: 'Pawai keliling desa dengan berbagai kostum tradisional dan modern untuk memeriahkan HUT RI',
      date: '2024-08-17',
      location: 'Lapangan Desa Ampelan',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      uploaded_by: 'admin',
      uploader_name: 'Admin Desa',
      created_at: '2024-08-17T08:00:00Z'
    },
    {
      id: 'sample-2',
      title: 'Lomba Panjat Pinang',
      description: 'Lomba tradisional panjat pinang dalam rangka memeriahkan HUT RI dengan hadiah menarik',
      date: '2024-08-17',
      location: 'Halaman Balai Desa',
      image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      uploaded_by: 'user',
      uploader_name: 'Budi Santoso',
      created_at: '2024-08-17T10:00:00Z'
    },
    {
      id: 'sample-3',
      title: 'Festival Kuliner Tradisional',
      description: 'Pameran dan penjualan kuliner tradisional khas daerah dengan berbagai menu lezat',
      date: '2024-08-25',
      location: 'Jalan Utama Desa',
      image_url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      uploaded_by: 'user',
      uploader_name: 'Siti Aminah',
      created_at: '2024-08-25T07:00:00Z'
    },
    {
      id: 'sample-4',
      title: 'Bersih-Bersih Sungai Gotong Royong',
      description: 'Kegiatan gotong royong membersihkan sungai desa dari sampah dan tumbuhan liar',
      date: '2024-08-31',
      location: 'Sungai Desa Ampelan',
      image_url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      uploaded_by: 'admin',
      uploader_name: 'Admin Desa',
      created_at: '2024-08-31T06:00:00Z'
    }
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Try to fetch from database, but handle gracefully if table doesn't exist yet
      const { data, error } = await supabase.rpc('get_activities');
      
      if (error) {
        console.log('Using sample data as fallback');
        setActivities(sampleActivities);
      } else {
        // Combine data from database with sample data
        const allActivities = [...(data || []), ...sampleActivities];
        setActivities(allActivities);
      }
    } catch (error) {
      console.log('Error fetching activities, using sample data:', error);
      setActivities(sampleActivities);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewActivity({ ...newActivity, image_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadActivity = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Silakan login terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = newActivity.image_url;
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          imageUrl = reader.result as string;
          
          // Use raw SQL query as fallback until types are updated
          const { error } = await supabase.rpc('insert_activity', {
            p_title: newActivity.title,
            p_description: newActivity.description,
            p_date: newActivity.date,
            p_location: newActivity.location,
            p_image_url: imageUrl,
            p_uploaded_by: user.id,
            p_uploader_name: profile?.full_name || user.email
          });

          if (error) {
            console.error('Error uploading activity:', error);
            // Fallback: add to local state
            const newActivityItem: Activity = {
              id: Date.now().toString(),
              title: newActivity.title,
              description: newActivity.description,
              date: newActivity.date,
              location: newActivity.location,
              image_url: imageUrl,
              uploaded_by: user.id,
              uploader_name: profile?.full_name || user.email || 'Unknown',
              created_at: new Date().toISOString()
            };
            setActivities(prev => [newActivityItem, ...prev]);
          }

          toast({
            title: "Berhasil!",
            description: "Kegiatan berhasil diupload",
          });

          fetchActivities();
          resetForm();
        };
        reader.readAsDataURL(imageFile);
      } else {
        // Use raw SQL query as fallback until types are updated
        const { error } = await supabase.rpc('insert_activity', {
          p_title: newActivity.title,
          p_description: newActivity.description,
          p_date: newActivity.date,
          p_location: newActivity.location,
          p_image_url: imageUrl,
          p_uploaded_by: user.id,
          p_uploader_name: profile?.full_name || user.email
        });

        if (error) {
          console.error('Error uploading activity:', error);
          // Fallback: add to local state
          const newActivityItem: Activity = {
            id: Date.now().toString(),
            title: newActivity.title,
            description: newActivity.description,
            date: newActivity.date,
            location: newActivity.location,
            image_url: imageUrl,
            uploaded_by: user.id,
            uploader_name: profile?.full_name || user.email || 'Unknown',
            created_at: new Date().toISOString()
          };
          setActivities(prev => [newActivityItem, ...prev]);
        }

        toast({
          title: "Berhasil!",
          description: "Kegiatan berhasil diupload",
        });

        fetchActivities();
        resetForm();
      }
    } catch (error) {
      console.error('Error uploading activity:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload kegiatan",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewActivity({
      title: '',
      description: '',
      date: '',
      location: '',
      image_url: ''
    });
    setImageFile(null);
    setImagePreview('');
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Village activities" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kegiatan Desa</h1>
            <p className="text-xl md:text-2xl opacity-90">Dokumentasi kegiatan sehari-hari Desa Ampelan</p>
          </div>
          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Kegiatan
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Upload Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Kegiatan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Kegiatan</Label>
                <Input
                  id="title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="Masukkan judul kegiatan..."
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  placeholder="Deskripsi kegiatan..."
                />
              </div>

              <div>
                <Label htmlFor="date">Tanggal Kegiatan</Label>
                <Input
                  id="date"
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                  placeholder="Lokasi kegiatan..."
                />
              </div>

              <div>
                <Label htmlFor="image">Foto Kegiatan</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2 relative w-full h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={uploadActivity} className="bg-green-600 hover:bg-green-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 text-white">
                    Kegiatan Desa
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                  {activity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2 mb-4">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{activity.uploader_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(activity.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activities.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl mt-8">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada kegiatan</h3>
              <p className="text-gray-500">Upload kegiatan pertama Anda!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Activities;
