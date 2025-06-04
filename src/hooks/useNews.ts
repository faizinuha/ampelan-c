
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  author: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

export const useNews = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample news data as fallback
  const sampleNews: NewsPost[] = [
    {
      id: 'sample-1',
      title: 'Musyawarah Desa Tentang Pembangunan Jalan',
      content: 'Akan dilaksanakan musyawarah desa untuk membahas rencana pembangunan jalan di RT 03/RW 02. Seluruh warga diharapkan dapat hadir untuk memberikan masukan dan saran.',
      excerpt: 'Akan dilaksanakan musyawarah desa untuk membahas rencana pembangunan jalan di RT 03/RW 02.',
      image_url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'admin',
      author_name: 'Admin Desa',
      created_at: '2025-06-15T08:00:00Z',
      updated_at: '2025-06-15T08:00:00Z',
      is_published: true
    },
    {
      id: 'sample-2',
      title: 'Program Bantuan Sembako',
      content: 'Distribusi bantuan sembako untuk keluarga kurang mampu akan dimulai minggu depan. Pendaftaran dapat dilakukan di kantor desa.',
      excerpt: 'Distribusi bantuan sembako untuk keluarga kurang mampu akan dimulai minggu depan.',
      image_url: 'https://images.unsplash.com/photo-1606788075761-9c3e1c7c7b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'admin',
      author_name: 'Admin Desa',
      created_at: '2025-06-10T08:00:00Z',
      updated_at: '2025-06-10T08:00:00Z',
      is_published: true
    },
    {
      id: 'sample-3',
      title: 'Gotong Royong Pembersihan Sungai',
      content: 'Kegiatan gotong royong pembersihan sungai diikuti oleh 150 warga desa dengan antusias. Kegiatan ini rutin dilakukan setiap bulan.',
      excerpt: 'Kegiatan gotong royong pembersihan sungai diikuti oleh 150 warga desa dengan antusias.',
      image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: 'admin',
      author_name: 'Admin Desa',
      created_at: '2025-06-08T08:00:00Z',
      updated_at: '2025-06-08T08:00:00Z',
      is_published: true
    }
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from database
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Database error, using sample data:', error);
        setNews(sampleNews);
      } else {
        // Combine real data with sample data
        const dbNews = data || [];
        const allNews = [...dbNews, ...sampleNews];
        setNews(allNews);
      }
    } catch (error) {
      console.log('Error fetching news, using sample data:', error);
      setNews(sampleNews);
    } finally {
      setLoading(false);
    }
  };

  const getLatestNews = (limit: number = 3) => {
    return news.slice(0, limit);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    fetchNews,
    getLatestNews
  };
};
