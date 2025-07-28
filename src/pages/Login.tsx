
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Loader2, TreePine, Mountain, Wheat } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, oauthLogin, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in - but wait for auth loading to complete
  useEffect(() => {
    // Only redirect if we're not loading and user is confirmed to be logged in
    if (!isLoading && user) {
      console.log('User already logged in, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Harap isi email dan password",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Navigation will be handled by useEffect after user state changes
        console.log('Login successful, waiting for redirect');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'facebook') {
        toast({
          title: "Info",
          description: "Login Facebook belum tersedia. Gunakan Google atau email.",
          variant: "default",
        });
        return;
      }
      
      const success = await oauthLogin(provider);
      
      if (success) {
        toast({
          title: "Memproses...",
          description: `Mengarahkan ke ${provider} untuk login`,
        });
      }
    } catch (error) {
      console.error('OAuth error:', error);
      toast({
        title: "Error",
        description: `Gagal login menggunakan ${provider}`,
        variant: "destructive",
      });
    }
  };

  const isDisabled = isLoading || isSubmitting;

  // Show loading state during auth initialization
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Rural Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Rural landscape with mountains" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/70 via-green-700/60 to-amber-800/70"></div>
        </div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <TreePine className="h-8 w-8 animate-pulse mr-2" />
              <Loader2 className="h-8 w-8 animate-spin" />
              <Wheat className="h-8 w-8 animate-pulse ml-2" />
            </div>
            <p className="text-lg font-medium">Memuat halaman desa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Rural Background with Parallax Effect */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Rural landscape with mountains and sunlight" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/70 via-green-700/60 to-amber-800/70"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-green-400/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/25 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Village Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl relative">
              <LogIn className="h-10 w-10 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <TreePine className="h-3 w-3 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-4xl font-bold text-white drop-shadow-lg">
              Selamat Datang Kembali
            </h2>
            <p className="mt-2 text-lg text-amber-100 drop-shadow-md">
              Masuk ke Portal Desa Ampelan
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4 text-amber-200">
              <Mountain className="h-5 w-5" />
              <span className="text-sm">Desa yang Asri dan Sejahtera</span>
              <Wheat className="h-5 w-5" />
            </div>
          </div>

          {/* Login Card with Rural Design */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative overflow-hidden">
            {/* Card decorative header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-amber-500 to-green-500"></div>
            
            <CardHeader className="relative">
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                <TreePine className="h-6 w-6 text-green-600" />
                <span>Masuk ke Akun</span>
                <Wheat className="h-6 w-6 text-amber-600" />
              </CardTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-amber-500 mx-auto mt-2 rounded-full"></div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2 text-gray-700 font-medium">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="h-12 border-2 border-green-200 focus:border-green-500 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500"
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2 text-gray-700 font-medium">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Password</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="h-12 border-2 border-green-200 focus:border-green-500 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500"
                    disabled={isDisabled}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  disabled={isDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Masuk ke Desa
                    </>
                  )}
                </Button>
              </form>

              {/* Divider with Rural Elements */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 flex items-center space-x-2">
                    <TreePine className="h-4 w-4 text-green-500" />
                    <span>Atau masuk dengan</span>
                    <Wheat className="h-4 w-4 text-amber-500" />
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleOAuthLogin('google')}
                  className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  disabled={isDisabled}
                  aria-label="Login dengan Google"
                >
                  <FaGoogle className="mr-2 h-5 w-5" />
                  Google
                </Button>

                <Button
                  onClick={() => handleOAuthLogin('facebook')}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  disabled={isDisabled}
                  aria-label="Login dengan Facebook"
                >
                  <FaFacebook className="mr-2 h-5 w-5" />
                  Facebook
                </Button>
              </div>

              {/* Registration Link */}
              <div className="text-center pt-4 border-t border-amber-200">
                <p className="text-gray-600 mb-2">
                  Belum menjadi warga desa digital?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  <span>Daftar sebagai Warga Desa</span>
                  <TreePine className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="text-center text-amber-100 text-sm">
            <p className="flex items-center justify-center space-x-2">
              <Mountain className="h-4 w-4" />
              <span>Desa Ampelan - Digitalisasi untuk Kemajuan Bersama</span>
              <Wheat className="h-4 w-4" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
