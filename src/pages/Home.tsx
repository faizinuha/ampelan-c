
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const latestNews = [
    {
      id: 1,
      title: 'Musyawarah Desa Tentang Pembangunan Jalan',
      date: '2025-06-15',
      excerpt: 'Akan dilaksanakan musyawarah desa untuk membahas rencana pembangunan jalan di RT 03/RW 02.',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Program Bantuan Sembako',
      date: '2025-06-10',
      excerpt: 'Distribusi bantuan sembako untuk keluarga kurang mampu akan dimulai minggu depan.',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Gotong Royong Pembersihan Sungai',
      date: '2025-06-08',
      excerpt: 'Kegiatan gotong royong pembersihan sungai diikuti oleh 150 warga desa dengan antusias.',
      image: '/placeholder.svg'
    }
  ];

  const services = [
    {
      title: 'Surat Keterangan',
      description: 'Pengurusan berbagai surat keterangan resmi',
      icon: '📄'
    },
    {
      title: 'Surat Domisili',
      description: 'Surat keterangan tempat tinggal',
      icon: '🏠'
    },
    {
      title: 'Surat Usaha',
      description: 'Surat keterangan usaha untuk UMKM',
      icon: '💼'
    },
    {
      title: 'Bantuan Sosial',
      description: 'Informasi dan pendaftaran bantuan',
      icon: '🤝'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Selamat Datang di Desa Ampelan
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Portal resmi Desa Ampelan - Melayani dengan sepenuh hati untuk kemajuan desa dan kesejahteraan masyarakat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 text-green-800 hover:bg-yellow-400 font-semibold">
                Layanan Online
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                Tentang Desa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">2,543</h3>
              <p className="text-gray-600">Jumlah Penduduk</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">12</h3>
              <p className="text-gray-600">RT/RW</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">25</h3>
              <p className="text-gray-600">Kegiatan/Bulan</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">150+</h3>
              <p className="text-gray-600">Layanan Online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Desa
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai layanan administrasi dan kemasyarakatan untuk memudahkan warga desa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Berita & Kegiatan Terbaru
              </h2>
              <p className="text-lg text-gray-600">
                Informasi terkini seputar kegiatan dan pengumuman desa
              </p>
            </div>
            <Link to="/news">
              <Button variant="outline">Lihat Semua</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Foto Kegiatan</span>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{news.excerpt}</p>
                  <Button variant="link" className="p-0 mt-2 text-green-600 hover:text-green-700">
                    Baca selengkapnya →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bergabunglah dengan Komunitas Digital Desa Ampelan
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Daftarkan diri Anda untuk mendapatkan akses ke layanan online dan informasi terbaru dari desa
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-yellow-500 text-green-800 hover:bg-yellow-400 font-semibold">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
