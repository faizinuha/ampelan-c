
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, MapPin, Users, Target, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentSubmissionForm from '@/components/DocumentSubmissionForm';
import { useNews } from '@/hooks/useNews';

const Home = () => {
  const { getLatestNews, loading } = useNews();
  const latestNews = getLatestNews(3);

  const services = [
    {
      title: 'Surat Keterangan',
      description:
        'Pengurusan berbagai surat keterangan resmi untuk keperluan administrasi',
      icon: '📄',
      image:
        'https://images.unsplash.com/photo-1554774853-719586f82d77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      badge: 'Populer',
      type: 'Surat Keterangan'
    },
    {
      title: 'Surat Domisili',
      description:
        'Surat keterangan tempat tinggal untuk keperluan identitas resmi',
      icon: '🏠',
      image:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      badge: 'Cepat',
      type: 'Surat Domisili'
    },
    {
      title: 'Surat Usaha',
      description: 'Surat keterangan usaha untuk UMKM dan pengembangan bisnis',
      icon: '💼',
      image:
        'https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      badge: 'UMKM',
      type: 'Surat Usaha'
    },
    {
      title: 'Bantuan Sosial',
      description: 'Informasi dan pendaftaran bantuan untuk masyarakat',
      icon: '🤝',
      image:
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      badge: 'Prioritas',
      type: 'Surat Keterangan'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section dengan background foto yang menarik */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Beautiful Indonesian village landscape with mountains" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-green-700/85 to-green-800/95"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/15 rounded-full blur-lg"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Selamat Datang di Desa Ampelan
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95 drop-shadow-md">
              Portal resmi Desa Ampelan - Melayani dengan sepenuh hati untuk kemajuan desa dan kesejahteraan masyarakat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DocumentSubmissionForm 
                trigger={
                  <Button size="lg" className="bg-yellow-500 text-green-800 hover:bg-yellow-400 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Layanan Online
                  </Button>
                }
              />
              <Link to="/profile">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  Profil Saya
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Pemuda Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Youth background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visi & Misi Pemuda Desa Ampelan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bersama membangun desa dengan semangat inovasi dan kebersamaan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Visi */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-600">Visi</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-gray-700 leading-relaxed">
                  Menjadi generasi pemuda yang inovatif, mandiri, dan berkarakter dalam membangun Desa Ampelan yang maju, sejahtera, dan berkelanjutan.
                </p>
              </CardContent>
            </Card>

            {/* Misi 1 */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-green-600">Misi</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-gray-700 leading-relaxed">
                  Mengembangkan potensi pemuda melalui pendidikan, pelatihan, dan pemberdayaan ekonomi kreatif untuk meningkatkan kesejahteraan masyarakat.
                </p>
              </CardContent>
            </Card>

            {/* Misi 2 */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-orange-600">Aksi</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-gray-700 leading-relaxed">
                  Melestarikan budaya lokal sambil mengadopsi teknologi modern untuk menciptakan inovasi yang bermanfaat bagi kemajuan desa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">2,543</h3>
              <p className="text-gray-600">Jumlah Penduduk</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">04/02</h3>
              <p className="text-gray-600">RT/RW</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">25</h3>
              <p className="text-gray-600">Kegiatan/Bulan</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">25+</h3>
              <p className="text-gray-600">Layanan Online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Desa
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai layanan administrasi dan kemasyarakatan untuk memudahkan
              warga desa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-green-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                      {service.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-2xl p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    {service.icon}
                  </div>
                </div>
                <CardHeader className="relative">
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-600 text-sm text-center mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-center">
                    <DocumentSubmissionForm 
                      documentType={service.type}
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Ajukan Sekarang →
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Berita & Kegiatan Terbaru
              </h2>
              <p className="text-lg text-gray-600">
                Informasi terkini seputar kegiatan dan pengumuman desa
              </p>
            </div>
            <Link to="/news">
              <Button variant="outline">
                Lihat Semua
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 animate-pulse"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <Card
                  key={news.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={news.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                        {news.author_name.charAt(0)}
                      </div>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded text-white font-semibold shadow">
                        Berita
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-sm bg-green-600 px-2 py-1 rounded">
                        {new Date(news.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                      {news.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{news.excerpt}</p>
                    <Link to={`/news/${news.id}`}>
                      <Button
                        variant="link"
                        className="p-0 mt-2 text-green-600 hover:text-green-700"
                      >
                        Baca selengkapnya →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Village community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-600/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bergabunglah dengan Komunitas Digital Desa Ampelan
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Daftarkan diri Anda untuk mendapatkan akses ke layanan online dan
            informasi terbaru dari desa
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-yellow-500 text-green-800 hover:bg-yellow-400 font-semibold"
            >
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
