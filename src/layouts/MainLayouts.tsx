import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import NotificationCenter from '@/components/NotificationCenter';
import NotificationPermission from '@/components/NotificationPermission';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';
import FloatingChatButton from '@/components/FloatingChatButton';
import WelcomeNotification from '@/components/WelcomeNotification';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isChatPage = location.pathname === '/customer-service';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      {/* Welcome notification */}
      {!isAuthPage && !isChatPage && <WelcomeNotification />}

      {/* Hanya tampil jika bukan halaman login/register/chat */}
      {!isAuthPage && !isChatPage && (
        <>
          <NotificationCenter />
          <NotificationPermission />
        </>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating chat button - hanya tampil jika bukan halaman chat atau auth */}
      {!isAuthPage && !isChatPage && <FloatingChatButton />}

      {/* Footer hanya untuk halaman umum, tidak untuk chat */}
      {!isAuthPage && !isChatPage && <Footer />}
    </div>
  );
};

export default MainLayout;
