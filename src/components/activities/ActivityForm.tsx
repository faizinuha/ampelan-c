
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Upload } from 'lucide-react';
import type { Activity } from '@/types/activity';

interface ActivityFormProps {
  onUpload: (activity: Omit<Activity, 'id' | 'created_at'>) => Promise<boolean>;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onUpload }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUploading(true);
    const success = await onUpload({
      ...formData,
      uploaded_by: user.id,
      uploader_name: user.email || 'Unknown'
    });

    if (success) {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: ''
      });
    }
    setIsUploading(false);
  };

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8 text-center">
          <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Login Diperlukan</h3>
          <p className="text-gray-500">Silakan login untuk mengupload kegiatan desa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Kegiatan Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Kegiatan</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul kegiatan..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsikan kegiatan..."
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Lokasi kegiatan..."
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">URL Gambar</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isUploading}
          >
            {isUploading ? 'Mengupload...' : 'Upload Kegiatan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
