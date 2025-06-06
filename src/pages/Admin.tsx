import NotificationManagement from '@/components/NotificationManagement';
import SubmissionsList from '@/components/SubmissionsList';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { BarChart3, Bell, Calendar, FileText, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeNotifications: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalNews: 0,
    totalActivities: 4, // Set to sample data count as fallback
  });
  const [users, setUsers] = useState<Profile[]>([]);
  useEffect(() => {
    fetchStats();
    fetchUsers();
    // Fetch stats and users when component mounts

    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const fetchStats = async () => {
    try {
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: notificationCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: submissionCount } = await supabase
        .from('document_submissions')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('document_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: newsCount } = await supabase
        .from('news_posts')
        .select('*', { count: 'exact', head: true });

      // Get activities count using direct table query
      let activitiesCount = 4; // Sample data count
      try {
        const { count: dbActivitiesCount } = await supabase
          .from('activities')
          .select('*', { count: 'exact', head: true });

        if (dbActivitiesCount !== null) {
          activitiesCount += dbActivitiesCount;
        }
      } catch (error) {
        console.log('Activities table not ready yet, using sample count');
      }

      setStats({
        totalUsers: userCount || 0,
        activeNotifications: notificationCount || 0,
        totalSubmissions: submissionCount || 0,
        pendingSubmissions: pendingCount || 0,
        totalNews: newsCount || 0,
        totalActivities: activitiesCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, address, role, created_at, updated_at')
        .or('role.eq.admin,role.eq.user')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedUsers: Profile[] =
        data
          ?.filter((user) => user.role === 'admin' || user.role === 'user')
          .map((user) => ({
            ...user,
            role: user.role as 'admin' | 'user',
            updated_at: user.updated_at ?? '',
          })) || [];

      setUsers(typedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Gagal memuat pengguna',
        description: 'Terjadi kesalahan saat mengambil data pengguna.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Village scenery"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Panel Admin Desa Ampelan
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Kelola sistem informasi desa dengan mudah
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Pengguna
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Pengajuan
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Kegiatan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Pengguna
                  </CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <p className="text-blue-100 text-sm">Warga terdaftar</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Notifikasi Aktif
                  </CardTitle>
                  <Bell className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.activeNotifications}
                  </div>
                  <p className="text-green-100 text-sm">Pengumuman aktif</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Pengajuan
                  </CardTitle>
                  <FileText className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.totalSubmissions}
                  </div>
                  <p className="text-purple-100 text-sm">Dokumen diajukan</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Review
                  </CardTitle>
                  <FileText className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.pendingSubmissions}
                  </div>
                  <p className="text-orange-100 text-sm">
                    Menunggu persetujuan
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Berita
                  </CardTitle>
                  <FileText className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalNews}</div>
                  <p className="text-indigo-100 text-sm">Artikel dipublikasi</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Kegiatan
                  </CardTitle>
                  <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.totalActivities}
                  </div>
                  <p className="text-pink-100 text-sm">
                    Kegiatan terdokumentasi
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Village Activities Gallery */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Kegiatan Desa Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Musyawarah Desa"
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Musyawarah Desa</h3>
                      <p className="text-sm opacity-90">
                        Pembahasan program desa
                      </p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Gotong Royong"
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Gotong Royong</h3>
                      <p className="text-sm opacity-90">Kerja bakti mingguan</p>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Festival Desa"
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">Festival Desa</h3>
                      <p className="text-sm opacity-90">Perayaan tahunan</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Daftar Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Bergabung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-green-50/50">
                        <TableCell className="font-medium">
                          {user.full_name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === 'admin' ? 'default' : 'secondary'
                            }
                          >
                            {user.role === 'admin' ? 'Admin' : 'Warga'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.address || '-'}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString(
                            'id-ID'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationManagement />
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <SubmissionsList isAdmin={true} />
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Kelola Kegiatan Desa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Kegiatan desa dapat diupload oleh semua pengguna di halaman
                  Kegiatan. Admin dapat melihat semua kegiatan yang telah
                  diupload di sini.
                </p>
                <div className="text-center">
                  <a
                    href="/activities"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Lihat Halaman Kegiatan
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
