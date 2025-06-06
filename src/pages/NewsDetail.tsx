
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();

  // Sample news data - in real app this would come from API/database
  const newsData = {
    id: id,
    title: 'Musyawarah Desa Tentang Pembangunan Jalan',
    content: `
      <p>Musyawarah desa akan dilaksanakan pada hari Minggu, 15 Juni 2025 di Balai Desa Ampelan. Agenda utama adalah pembahasan rencana pembangunan jalan lingkungan RT 03/RW 02 yang telah lama ditunggu-tunggu warga.</p>
      
      <p>Kegiatan ini merupakan bagian dari program pembangunan infrastruktur desa yang telah direncanakan sejak awal tahun. Partisipasi aktif dari seluruh warga sangat diharapkan untuk menyukseskan program ini.</p>
      
      <h3>Detail Musyawarah:</h3>
      <ul>
        <li>Hari/Tanggal: Minggu, 15 Juni 2025</li>
        <li>Waktu: 08.00 - 12.00 WIB</li>
        <li>Tempat: Balai Desa Ampelan</li>
        <li>Peserta: Seluruh warga RT 03/RW 02 dan perwakilan RT/RW lainnya</li>
      </ul>
      
      <p>Hasil musyawarah akan menjadi acuan dalam pelaksanaan pembangunan jalan yang diharapkan dapat meningkatkan aksesibilitas dan mobilitas warga desa.</p>
    `,
    category: 'Musyawarah',
    image_url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author_name: 'Admin Desa',
    created_at: '2025-06-15T10:00:00Z'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/news">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Berita
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <img
              src={newsData.image_url}
              alt={newsData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-600 text-white">
                {newsData.category}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {newsData.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{newsData.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(newsData.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsData.content }}
            />
          </CardContent>
        </Card>

        {/* Related News */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1606788075761-9c3e1c7c7b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Program Bantuan Sembako"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <Badge className="bg-blue-600 text-white mb-2">Bantuan</Badge>
                <h3 className="font-semibold text-gray-900 mb-2">Program Bantuan Sembako</h3>
                <p className="text-sm text-gray-600">Distribusi bantuan sembako untuk keluarga kurang mampu akan dimulai minggu depan.</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Gotong Royong Pembersihan Sungai"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <Badge className="bg-green-600 text-white mb-2">Gotong Royong</Badge>
                <h3 className="font-semibold text-gray-900 mb-2">Gotong Royong Pembersihan Sungai</h3>
                <p className="text-sm text-gray-600">Kegiatan gotong royong pembersihan sungai diikuti oleh 150 warga desa dengan antusias.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
