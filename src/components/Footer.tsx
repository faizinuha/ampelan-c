
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tentang Desa */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400">Desa Ampelan</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              Portal resmi Desa Ampelan yang melayani masyarakat dengan sepenuh hati untuk kemajuan desa dan kesejahteraan bersama.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-green-300 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-green-300 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-green-300 hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Layanan */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-green-100 hover:text-yellow-400 transition-colors">Surat Keterangan</Link></li>
              <li><Link to="/" className="text-green-100 hover:text-yellow-400 transition-colors">Surat Domisili</Link></li>
              <li><Link to="/" className="text-green-100 hover:text-yellow-400 transition-colors">Surat Usaha</Link></li>
              <li><Link to="/" className="text-green-100 hover:text-yellow-400 transition-colors">Bantuan Sosial</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400">Kontak</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-green-100">Jl. Desa Ampelan No. 123, Kecamatan ABC</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-green-100">+62 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-green-100">info@ampelan.desa.id</span>
              </div>
            </div>
          </div>

          {/* Jam Pelayanan */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400">Jam Pelayanan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div className="text-green-100">
                  <p>Senin - Jumat</p>
                  <p>08:00 - 16:00 WIB</p>
                  <p className="mt-2">Sabtu</p>
                  <p>08:00 - 12:00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-200 text-sm">
              © 2025 Desa Ampelan. Semua hak dilindungi undang-undang.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/" className="text-green-200 hover:text-yellow-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link to="/" className="text-green-200 hover:text-yellow-400 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
