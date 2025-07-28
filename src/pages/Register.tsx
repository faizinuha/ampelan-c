
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, User, UserPlus, TreePine, Mountain, Wheat, Home } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      console.log('User already logged in, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Nama lengkap wajib diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Error',
        description: 'Email wajib diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.password) {
      toast({
        title: 'Error',
        description: 'Password wajib diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Konfirmasi password wajib diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Password dan konfirmasi password tidak sama',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password minimal 6 karakter',
        variant: 'destructive',
      });
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Error',
        description: 'Format email tidak valid',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await register(
        formData.email,
        formData.password,
        formData.name
      );

      if (success) {
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        // Tidak perlu toast lagi di sini, sudah dihandle di AuthContext
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
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
            src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Rural landscape with sheep running on green field" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-800/70 via-green-700/60 to-amber-800/70"></div>
        </div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Home className="h-8 w-8 animate-pulse mr-2" />
              <Loader2 className="h-8 w-8 animate-spin" />
              <TreePine className="h-8 w-8 animate-pulse ml-2" />
            </div>
            <p className="text-lg font-medium">Menyiapkan pendaftaran warga...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Rural Background with Different Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Rural landscape with sheep running on green field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/70 via-green-700/60 to-amber-800/70"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-10 w-28 h-28 bg-amber-400/25 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-16 w-20 h-20 bg-green-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-yellow-300/20 rounded-full blur-md animate-pulse delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Village Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl relative">
              <UserPlus className="h-10 w-10 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <Home className="h-3 w-3 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-4xl font-bold text-white drop-shadow-lg">
              Bergabung dengan Desa
            </h2>
            <p className="mt-2 text-lg text-green-100 drop-shadow-md">
              Daftar sebagai Warga Digital Desa Ampelan
            </p>
            <div className="flex items-center justify-center mt-4 space-x-4 text-green-200">
              <TreePine className="h-5 w-5" />
              <span className="text-sm">Bersama Membangun Desa Maju</span>
              <Wheat className="h-5 w-5" />
            </div>
          </div>

          {/* Registration Card with Rural Design */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative overflow-hidden">
            {/* Card decorative header */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-amber-500 to-green-500"></div>
            
            <CardHeader className="relative">
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                <Home className="h-6 w-6 text-green-600" />
                <span>Daftar Warga Baru</span>
                <TreePine className="h-6 w-6 text-green-600" />
              </CardTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-amber-500 mx-auto mt-2 rounded-full"></div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2 text-gray-700 font-medium">
                    <User className="w-4 h-4 text-green-600" />
                    <span>Nama Lengkap</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="h-12 border-2 border-green-200 focus:border-green-500 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500"
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2 text-gray-700 font-medium">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className="h-12 border-2 border-green-200 focus:border-green-500 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500"
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center space-x-2 text-gray-700 font-medium">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Konfirmasi Password</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password Anda"
                    className="h-12 border-2 border-green-200 focus:border-green-500 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500"
                    disabled={isDisabled}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  disabled={isDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Daftar sebagai Warga Desa
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-green-200">
                <p className="text-gray-600 mb-2">
                  Sudah menjadi warga desa digital?
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  <span>Masuk ke Akun Anda</span>
                  <Mountain className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="text-center text-green-100 text-sm">
            <p className="flex items-center justify-center space-x-2">
              <TreePine className="h-4 w-4" />
              <span>Desa Ampelan - Menyambut Warga Baru dengan Hangat</span>
              <Home className="h-4 w-4" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
