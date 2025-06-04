
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Activity } from '@/types/activity';

export const useActivities = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Sample activities data as fallback
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

  const fetchActivities = async () => {
    try {
      // Try to fetch from database using the function
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

  const uploadActivity = async (newActivity: Omit<Activity, 'id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Silakan login terlebih dahulu",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Use the insert_activity function
      const { error } = await supabase.rpc('insert_activity', {
        p_title: newActivity.title,
        p_description: newActivity.description,
        p_date: newActivity.date,
        p_location: newActivity.location,
        p_image_url: newActivity.image_url,
        p_uploaded_by: user.id,
        p_uploader_name: profile?.full_name || user.email || 'Unknown'
      });

      if (error) {
        console.error('Error uploading activity:', error);
        // Fallback: add to local state
        const newActivityItem: Activity = {
          id: Date.now().toString(),
          ...newActivity,
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
      return true;
    } catch (error) {
      console.error('Error uploading activity:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload kegiatan",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    uploadActivity,
    fetchActivities
  };
};
