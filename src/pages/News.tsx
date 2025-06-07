import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NewsPost } from '@/types/submissions';

const News = () => {
  const [newsData, setNewsData] = useState<NewsPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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

  // Pre-load fake data for instant loading
  const fakeNews = useMemo(() => [
    {
      id: 'fake-1',
      title: 'Musyawarah Desa Tentang Pembangunan Jalan',
      excerpt: 'Akan dilaksanakan musyawarah desa untuk membahas rencana pembangunan jalan di RT 03/RW 02.',
      content: 'Musyawarah desa akan dilaksanakan pada hari Minggu, 15 Juni 2025 di Balai Desa Ampelan. Agenda utama adalah pembahasan rencana pembangunan jalan lingkungan RT 03/RW 02 yang telah lama ditunggu-tunggu warga.',
      category: 'Musyawarah',
      image_url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author_id: null,
      is_published: true,
      created_at: '2025-06-15T10:00:00Z',
      updated_at: '2025-06-15T10:00:00Z'
    },
    {
      id: 'fake-2',
      title: 'Program Bantuan Sembako',
      excerpt: 'Distribusi bantuan sembako untuk keluarga kurang mampu akan dimulai minggu depan.',
      content: 'Program bantuan sembako dari pemerintah desa akan didistribusikan kepada 150 keluarga kurang mampu di Desa Ampelan. Distribusi akan dilaksanakan secara bertahap mulai minggu depan.',
      category: 'Bantuan',
      image_url: 'https://images.unsplash.com/photo-1606788075761-9c3e1c7c7b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author_id: null,
      is_published: true,
      created_at: '2025-06-10T08:30:00Z',
      updated_at: '2025-06-10T08:30:00Z'
    },
    {
      id: 'fake-3',
      title: 'Gotong Royong Pembersihan Sungai',
      excerpt: 'Kegiatan gotong royong pembersihan sungai diikuti oleh 150 warga desa dengan antusias.',
      content: 'Kegiatan gotong royong pembersihan sungai yang dilaksanakan pada hari Sabtu lalu berjalan dengan sukses. Sebanyak 150 warga dari berbagai RT/RW berpartisipasi aktif membersihkan sungai yang melintasi desa.',
      category: 'Gotong Royong',
      image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author_id: null,
      is_published: true,
      created_at: '2025-06-08T16:45:00Z',
      updated_at: '2025-06-08T16:45:00Z'
    },
    {
      id: 'fake-4',
      title: 'Pelatihan Digital Marketing untuk UMKM',
      excerpt: 'Workshop digital marketing gratis untuk pelaku UMKM desa dalam rangka meningkatkan penjualan online.',
      content: 'Desa Ampelan mengadakan pelatihan digital marketing untuk para pelaku UMKM. Pelatihan ini bertujuan membantu masyarakat meningkatkan penjualan produk lokal melalui platform digital.',
      category: 'Pembangunan',
      image_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author_id: null,
      is_published: true,
      created_at: '2025-06-05T14:20:00Z',
      updated_at: '2025-06-05T14:20:00Z'
    },
    {
      id: 'fake-5',
      title: 'Posyandu Balita Bulan Juni',
      excerpt: 'Pelaksanaan posyandu balita dengan pemeriksaan kesehatan dan imunisasi gratis.',
      content: 'Posyandu balita rutin bulan Juni akan dilaksanakan di 4 titik lokasi berbeda. Semua balita diharapkan hadir untuk mendapat pemeriksaan kesehatan dan imunisasi lengkap.',
      category: 'Kesehatan',
      image_url: 'https://images.unsplash.com/photo-1581060829591-4cc88f08b6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author_id: null,
      is_published: true,
      created_at: '2025-06-03T09:15:00Z',
      updated_at: '2025-06-03T09:15:00Z'
    },
    {
      id: 'fake-6',
      title: 'Festival Budaya Desa Ampelan 2025',
      excerpt: 'Perayaan festival budaya tahunan dengan berbagai pertunjukan seni tradisional dan modern.',
      content: 'Festival Budaya Desa Ampelan 2025 akan menghadirkan pertunjukan tari tradisional, musik daerah, pameran kerajinan lokal, dan berbagai lomba menarik untuk semua usia.',
      category: 'Budaya',
      image_url: 'https://images.unsplash.com/photo-1549451371-64aa98a6f532?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author_id: null,
      is_published: true,
      created_at: '2025-06-01T18:30:00Z',
      updated_at: '2025-06-01T18:30:00Z'
    }
  ], []);

  // Optimized filtering with useMemo
  const filteredNews = useMemo(() => {
    let filtered = newsData;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(news =>
        news.title.toLowerCase().includes(search) ||
        news.excerpt.toLowerCase().includes(search)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    return filtered;
  }, [newsData, searchTerm, selectedCategory]);

  useEffect(() => {
    // Set fake data immediately for instant loading
    setNewsData(fakeNews);
    setIsLoading(false);
    
    // Then try to fetch real data in background
    fetchNewsInBackground();
  }, [fakeNews]);

  const fetchNewsInBackground = async () => {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge real data with fake data
        const allNews = [...data, ...fakeNews];
        setNewsData(allNews);
      }
    } catch (error) {
      console.log('Background fetch failed, using cached data:', error);
      // Keep using fake data if fetch fails
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="News and activities" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Berita & Kegiatan</h1>
            <p className="text-xl md:text-2xl opacity-90">Informasi terbaru dari Desa Ampelan</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Filter Section */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Grid - Optimized with better layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={news.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 text-white">
                    {news.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(news.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">{news.excerpt}</p>
                <Button
                  variant="link"
                  className="p-0 text-green-600 hover:text-green-700"
                >
                  Baca selengkapnya →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada berita ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default News;
