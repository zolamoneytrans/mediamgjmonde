import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { AuthModal } from './components/auth/AuthModal';
import { PwaInstallPopup } from './components/common/PwaInstallPopup';

import { DashboardPage } from './pages/DashboardPage';
import { LiveStreamingPage } from './pages/LiveStreamingPage';
import { ConventionKziPage } from './pages/ConventionKziPage';
import { ShopPage } from './pages/ShopPage';
import { DonationsPage } from './pages/DonationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SmartWelcomePage } from './pages/SmartWelcomePage';
import { AboutMgjPage } from './pages/AboutMgjPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ContactsPage } from './pages/ContactsPage';
import { MediasPage } from './pages/MediasPage';

const AppContent: React.FC = () => {
  const { user, canAccessAdmin } = useAuth();
  const [activePage, setActivePage] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/login') || path.startsWith('/signin')) return 'login';
    if (path.startsWith('/signup') || path.startsWith('/register')) return 'signup';
    if (path.startsWith('/about') || path.startsWith('/vision')) return 'about';
    if (path.startsWith('/announcements') || path.startsWith('/annonces')) return 'announcements';
    if (path.startsWith('/contacts') || path.startsWith('/contact')) return 'contacts';
    if (path.startsWith('/medias') || path.startsWith('/media')) return 'medias';
    return 'home';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/admin')) setActivePage('admin');
      else if (path.startsWith('/login') || path.startsWith('/signin')) setActivePage('login');
      else if (path.startsWith('/signup') || path.startsWith('/register')) setActivePage('signup');
      else if (path.startsWith('/about') || path.startsWith('/vision')) setActivePage('about');
      else if (path.startsWith('/announcements') || path.startsWith('/annonces')) setActivePage('announcements');
      else if (path.startsWith('/contacts') || path.startsWith('/contact')) setActivePage('contacts');
      else if (path.startsWith('/medias') || path.startsWith('/media')) setActivePage('medias');
      else setActivePage('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    let targetPath = '/';
    if (activePage === 'admin') targetPath = '/admin';
    else if (activePage === 'login') targetPath = '/login';
    else if (activePage === 'signup') targetPath = '/signup';
    else if (activePage === 'about') targetPath = '/about';
    else if (activePage === 'announcements') targetPath = '/announcements';
    else if (activePage === 'contacts') targetPath = '/contacts';
    else if (activePage === 'medias') targetPath = '/medias';
    else if (activePage !== 'home') targetPath = `/${activePage}`;

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
      setCurrentPath(targetPath);
    }
  }, [activePage]);

  if (activePage === 'admin') {
    return (
      <AdminDashboardPage 
        onNavigateToPublic={() => {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
          setCurrentPath('/');
          setActivePage('home');
        }} 
      />
    );
  }

  if (activePage === 'login') {
    return <LoginPage setActivePage={setActivePage} />;
  }

  if (activePage === 'signup') {
    return <SignupPage setActivePage={setActivePage} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return user ? (
          <DashboardPage setActivePage={setActivePage} onOpenAuth={() => setIsAuthModalOpen(true)} />
        ) : (
          <SmartWelcomePage setActivePage={setActivePage} />
        );
      case 'live':
        return <LiveStreamingPage />;
      case 'medias':
        return <MediasPage />;
      case 'kzi':
        return <ConventionKziPage />;
      case 'shop':
        return <ShopPage />;
      case 'donations':
        return <DonationsPage />;
      case 'about':
        return <AboutMgjPage setActivePage={setActivePage} />;
      case 'announcements':
        return <AnnouncementsPage setActivePage={setActivePage} />;
      case 'contacts':
        return <ContactsPage setActivePage={setActivePage} />;
      case 'profile':
        return user ? <ProfilePage /> : <LoginPage setActivePage={setActivePage} />;
      case 'notifications':
        return user ? <NotificationsPage setActivePage={setActivePage} /> : <LoginPage setActivePage={setActivePage} />;
      case 'admin':
        return (canAccessAdmin || user?.role === 'admin') ? <AdminDashboardPage /> : <DashboardPage setActivePage={setActivePage} onOpenAuth={() => setIsAuthModalOpen(true)} />;
      case 'login':
        return <LoginPage setActivePage={setActivePage} />;
      case 'signup':
        return <SignupPage setActivePage={setActivePage} />;
      default:
        return user ? (
          <DashboardPage setActivePage={setActivePage} onOpenAuth={() => setIsAuthModalOpen(true)} />
        ) : (
          <SmartWelcomePage setActivePage={setActivePage} />
        );
    }
  };

  const showNav = Boolean(user);

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 ${showNav ? 'pb-20 lg:pb-0' : ''}`}>
      
      {/* Top Glass Header */}
      <Header 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      {/* Main Container with Sidebar + Content Area */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        
        {/* Desktop Sidebar Navigation (Hidden when on welcome page or mobile) */}
        {showNav && (
          <DesktopSidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onOpenAuth={() => setIsAuthModalOpen(true)} 
          />
        )}

        {/* Dynamic Page Rendering Area */}
        <main className={`flex-1 w-full min-h-[calc(100vh-69px)] ${showNav ? 'lg:pl-[280px]' : ''}`}>
          {renderPage()}
        </main>

      </div>

      {/* Global Application Copyright Footer */}
      <footer className={`w-full py-4 px-4 text-center border-t border-glass bg-[var(--bg-secondary)]/30 text-xs text-[var(--text-secondary)] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 ${showNav ? 'lg:pl-[280px]' : ''}`}>
        <span>(c) Swazi Appli Lab sarl 2026 • Ministères Génération Joël (MGJ Monde) • Joël 2:28</span>
        <span className="hidden sm:inline opacity-30">•</span>
        <a href="/confidentialite.html" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-gold)] hover:underline font-semibold transition-colors">
          Politique de Confidentialité
        </a>
      </footer>

      {/* Mobile Bottom Navigation (Hidden when on welcome page or desktop) */}
      {showNav && (
        <MobileBottomNav 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenAuth={() => setIsAuthModalOpen(true)} 
        />
      )}

      {/* Automatic PWA Mobile Install Bottom Banner */}
      <PwaInstallPopup />

      {/* 6-Field Authentication & Registration Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppDataProvider>
            <AppContent />
          </AppDataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
