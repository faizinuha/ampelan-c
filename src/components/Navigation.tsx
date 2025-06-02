
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold">Desa Ampelan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-300 transition-colors">Beranda</Link>
            <Link to="/about" className="hover:text-yellow-300 transition-colors">Tentang</Link>
            <Link to="/services" className="hover:text-yellow-300 transition-colors">Layanan</Link>
            <Link to="/news" className="hover:text-yellow-300 transition-colors">Berita</Link>
            <Link to="/contact" className="hover:text-yellow-300 transition-colors">Kontak</Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.avatar || '/placeholder.svg'} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{user.name}</span>
                </div>

                {user.role === 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin')}
                    className="text-white hover:text-yellow-300"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-300"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="text-white hover:text-yellow-300"
                >
                  Masuk
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/register')}
                  className="bg-yellow-500 text-green-800 hover:bg-yellow-400"
                >
                  Daftar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-700 rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-yellow-300 transition-colors">Beranda</Link>
              <Link to="/about" className="hover:text-yellow-300 transition-colors">Tentang</Link>
              <Link to="/services" className="hover:text-yellow-300 transition-colors">Layanan</Link>
              <Link to="/news" className="hover:text-yellow-300 transition-colors">Berita</Link>
              <Link to="/contact" className="hover:text-yellow-300 transition-colors">Kontak</Link>
              
              {user ? (
                <div className="border-t border-green-600 pt-4 flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.avatar || '/placeholder.svg'} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/admin')}
                      className="text-white hover:text-yellow-300 justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-white hover:text-yellow-300 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <div className="border-t border-green-600 pt-4 flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/login')}
                    className="text-white hover:text-yellow-300 justify-start"
                  >
                    Masuk
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/register')}
                    className="bg-yellow-500 text-green-800 hover:bg-yellow-400"
                  >
                    Daftar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
