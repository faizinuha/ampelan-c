import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import NotificationCenter from '@/components/NotificationCenter';
import NotificationPermission from '@/components/NotificationPermission';
import CustomerService from '@/components/CustomerService';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* Hanya tampil jika bukan halaman login/register */}
      {!isAuthPage && (
        <>
          <NotificationCenter />
          <NotificationPermission />
          <CustomerService />
        </>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer hanya untuk halaman umum */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
