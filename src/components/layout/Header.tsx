import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert, 
  Download,
  Tv,
  Menu,
  X,
  Home,
  Calendar,
  ShoppingBag,
  HeartHandshake,
  BookOpen,
  BellRing,
  PhoneCall,
  Video
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, activePage, setActivePage }) => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout, toggleRole, canAccessAdmin } = useAuth();
  const { notifications, announcements } = useAppData();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaInstall, setShowPwaInstall] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: Array<{ id: string; label: string; icon: any; badge?: number }> = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'announcements', label: lang === 'fr' ? 'Annonces' : 'Alerts', icon: BellRing, badge: announcements?.filter(a => a.pinned).length },
    { id: 'contacts', label: lang === 'fr' ? 'Contacts' : 'Contacts', icon: PhoneCall },
    { id: 'about', label: lang === 'fr' ? 'Vision MGJ' : 'About MGJ', icon: BookOpen },
    { id: 'live', label: t('nav.live'), icon: Tv },
    { id: 'medias', label: lang === 'fr' ? 'Médias' : 'Media', icon: Video },
    { id: 'kzi', label: t('nav.kzi'), icon: Calendar },
    { id: 'shop', label: t('nav.shop'), icon: ShoppingBag },
    { id: 'donations', label: t('nav.donations'), icon: HeartHandshake }
  ];

  useEffect(() => {
    const handleOpenDrawer = () => setIsMobileDrawerOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-mobile-drawer', handleOpenDrawer);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    localStorage.setItem('mediamondemjg_pwa_popup_dismissed_v2', 'false');
    window.dispatchEvent(new Event('show-pwa-popup'));
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPwaInstall(false);
        }
        setDeferredPrompt(null);
      } catch (e) {}
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-glass px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Brand / Logo + Mobile Drawer Menu Button (Only when user is logged in) */}
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-[var(--text-primary)] flex items-center justify-center shadow-sm"
              title="Ouvrir le menu de navigation"
            >
              <Menu className="w-5 h-5 text-[var(--accent-olive)]" />
            </button>
          )}

          <div 
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
              setActivePage('home');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img 
              src="/logo.png" 
              alt="MediaMGJ Monde Logo" 
              className="w-8 sm:w-10 h-8 sm:h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-outfit font-black text-base sm:text-xl tracking-tight text-[var(--text-primary)] leading-none">
                MediaMonde<span className="gradient-text-olive">MJG</span>
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mt-0.5">
                Génération Joël 2:28
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* PWA Install Button */}
          <button
            onClick={handleInstallClick}
            title={t('header.installPWA')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-orange)] to-[#c2410c] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span>{t('header.installPWA')}</span>
          </button>

          {/* Language Toggle (FR / EN) - Hidden on small mobile (accessible in drawer) */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-xs font-extrabold tracking-wider transition-all"
            title="Switch Language FR / EN"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--accent-olive)]" />
            <span className={lang === 'fr' ? 'text-[var(--accent-olive)] font-black' : 'text-[var(--text-secondary)]'}>FR</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className={lang === 'en' ? 'text-[var(--accent-olive)] font-black' : 'text-[var(--text-secondary)]'}>EN</span>
          </button>

          {/* Dark / White Mode Toggle - Hidden on small mobile (accessible in drawer) */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-[var(--text-primary)] items-center gap-1.5 transition-all"
            title={theme === 'dark' ? 'Switch to White mode' : 'Switch to Dark mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="hidden md:inline text-xs font-bold">White Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="hidden md:inline text-xs font-bold">Dark Mode</span>
              </>
            )}
          </button>

          {/* Admin Portal Shortcut (Only visible on desktop/tablet when logged in as Admin) */}
          {(canAccessAdmin || user?.role === 'admin' || user?.role === 'superadmin') && (
            <button
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-black items-center gap-1.5 transition-all border bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30 shadow-md"
              title="Accéder au Portail Administration (/admin)"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse text-amber-400" />
              <span className="hidden md:inline">Portail Admin</span>
            </button>
          )}

          {/* Notifications Bell (Only when logged in) */}
          {user && (
            <button
              onClick={() => setActivePage('notifications')}
              className={`relative p-2 rounded-xl border transition-all ${
                activePage === 'notifications'
                  ? 'bg-[var(--accent-olive)] text-white border-[var(--accent-olive)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-glass hover:bg-[var(--bg-secondary)]'
              }`}
              title={t('nav.notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth Trigger */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setActivePage('profile')}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all ${
                  activePage === 'profile'
                    ? 'bg-[var(--accent-olive)] text-white border-[var(--accent-olive)] shadow-md'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-glass hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--accent-gold)] to-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <span className="text-xs font-bold hidden sm:inline max-w-[110px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setActivePage('home');
                }}
                title={t('header.logout')}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setActivePage('login');
                }}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-xs font-bold text-[var(--text-primary)] transition-all hover:scale-105"
              >
                <span>{lang === 'fr' ? 'Connexion' : 'Sign In'}</span>
              </button>

              <button
                onClick={() => {
                  window.history.pushState({}, '', '/signup');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setActivePage('signup');
                }}
                className="hidden sm:flex btn-gold py-1.5 px-2.5 sm:px-3.5 text-xs font-bold rounded-xl items-center gap-1 sm:gap-1.5 shadow-md hover:scale-105 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 hidden sm:inline" />
                <span>{lang === 'fr' ? 'S\'inscrire' : 'Sign Up'}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Complete Slide-out Left Navigation Drawer for Mobile (< lg) - Rendered via Portal */}
      {isMobileDrawerOpen && Boolean(user) && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileDrawerOpen(false)} 
          />

          {/* Drawer Content */}
          <div className="relative z-[99999] w-[280px] sm:w-[320px] bg-[var(--bg-secondary)] border-r border-glass h-full flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-right">
            
            {/* Top Bar */}
            <div className="p-4 border-b border-glass flex items-center justify-between">
              <div 
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setActivePage('home');
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="flex flex-col">
                  <span className="font-outfit font-black text-base tracking-tight text-[var(--text-primary)] leading-none">
                    MediaMonde<span className="gradient-text-olive">MJG</span>
                  </span>
                  <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mt-0.5">
                    Génération Joël 2:28
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] border border-glass text-[var(--text-secondary)] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 p-4 space-y-1 overflow-y-auto">
              <div className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)] px-3 py-1 mb-1">
                {t('sidebar.sanctuaries')}
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      setActivePage(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[var(--accent-olive)] text-white shadow-md' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--accent-orange)] text-white text-[10px] font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Account / User section in drawer */}
              <div className="pt-4 mt-4 border-t border-glass">
                <div className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)] px-3 py-1 mb-1">
                  {t('sidebar.account')}
                </div>
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setActivePage('profile');
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'profile' 
                      ? 'bg-[var(--accent-gold)] text-white shadow-md' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t('nav.profile')}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setActivePage('notifications');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all mt-1 ${
                    activePage === 'notifications' 
                      ? 'bg-[var(--accent-olive)] text-white shadow-md' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4" />
                    <span>{t('nav.notifications')}</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {(canAccessAdmin || user.role === 'admin' || user.role === 'superadmin') && (
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      window.history.pushState({}, '', '/admin');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all mt-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 shadow-sm"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Portail Administration (/admin)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Controls inside Drawer */}
            <div className="p-4 border-t border-glass bg-[var(--bg-primary)]/50 space-y-3">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  handleInstallClick();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
              >
                <Download className="w-4 h-4 animate-bounce" />
                <span>📲 Télécharger & Installer l'App Mobile</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleLanguage}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--accent-olive)]" />
                  <span>{lang === 'fr' ? 'FR (Français)' : 'EN (English)'}</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={async () => {
                  setIsMobileDrawerOpen(false);
                  await logout();
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setActivePage('home');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('header.logout')}</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </header>
  );
};
