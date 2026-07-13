import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { 
  Home, 
  Tv, 
  Calendar, 
  ShoppingBag, 
  HeartHandshake, 
  User, 
  Bell, 
  ShieldAlert, 
  ExternalLink,
  Flame,
  Award,
  BookOpen,
  BellRing,
  PhoneCall,
  Video
} from 'lucide-react';

interface DesktopSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenAuth: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ activePage, setActivePage, onOpenAuth }) => {
  const { t, lang } = useLanguage();
  const { user, canAccessAdmin } = useAuth();
  const { cart, notifications, announcements } = useAppData();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const mainLinks = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'announcements', label: lang === 'fr' ? 'Annonces & Directives' : 'Announcements & Alerts', icon: BellRing, count: announcements?.filter(a => a.pinned).length },
    { id: 'contacts', label: lang === 'fr' ? 'Contacts & Permanence' : 'MGJ Contacts & Office', icon: PhoneCall },
    { id: 'about', label: lang === 'fr' ? 'Vision MGJ' : 'About MGJ', icon: BookOpen, badgeText: 'M.G.J', badgeColor: 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30' },
    { id: 'live', label: t('nav.live'), icon: Tv, badgeText: 'LIVE', badgeColor: 'badge-live animate-pulse' },
    { id: 'medias', label: lang === 'fr' ? 'Médias & Vidéos' : 'Media Hub', icon: Video, badgeText: 'VOD', badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { id: 'kzi', label: t('nav.kzi'), icon: Calendar },
    { id: 'shop', label: t('nav.shop'), icon: ShoppingBag, count: cartCount },
    { id: 'donations', label: t('nav.donations'), icon: HeartHandshake }
  ];

  const personalLinks = [
    { id: 'profile', label: t('nav.profile'), icon: User },
    { id: 'notifications', label: t('nav.notifications'), icon: Bell, count: unreadCount }
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed top-[69px] bottom-0 left-0 w-[280px] glass-panel border-r border-glass p-4 overflow-y-auto z-30">
      
      {/* Spiritual Manna / Quick Anointing Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-glass mb-6 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold font-outfit uppercase tracking-wider text-[var(--accent-gold)]">
            {lang === 'fr' ? 'Verset Prophétique' : 'Prophetic Scripture'}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
          « Après cela, je répandrai mon esprit sur toute chair... » <strong className="text-[var(--text-primary)]">Joël 2:28</strong>
        </p>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1 mb-6">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">
          {lang === 'fr' ? 'Navigation Principale' : 'Main Menu'}
        </div>
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-[var(--accent-olive)] to-[#48631c] text-white shadow-lg shadow-[var(--accent-olive-glow)] font-bold' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--accent-olive)]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badgeText && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${item.badgeColor}`}>
                  {item.badgeText}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-orange)] text-white text-xs font-black">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Personal & Member Links */}
      <div className="space-y-1 mb-6">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">
          {lang === 'fr' ? 'Espace Membre' : 'Member Sanctuary'}
        </div>
        {personalLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => user ? setActivePage(item.id) : onOpenAuth()}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-[var(--accent-olive)] to-[#48631c] text-white shadow-lg font-bold' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--accent-gold)]'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-black animate-pulse">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Link if Role = Admin */}
        {(canAccessAdmin || user?.role === 'admin' || user?.role === 'superadmin') && (
          <button
            onClick={() => {
              window.history.pushState({}, '', '/admin');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 animate-pulse text-amber-400" />
              <span>Portail Admin (/admin)</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider">
              VIP
            </span>
          </button>
        )}
      </div>

      {/* Official Social Links Direct Shortcuts */}
      <div className="mt-auto pt-4 border-t border-glass space-y-2">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-1">
          {lang === 'fr' ? 'Réseaux Officiels' : 'Official Channels'}
        </div>
        <button 
          onClick={() => {
            localStorage.setItem('mgj_active_social', 'facebook');
            window.dispatchEvent(new CustomEvent('mgj-open-social', { detail: 'facebook' }));
            setActivePage('live');
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
        >
          <span>Facebook @mediamgjmonde</span>
          <Tv className="w-3.5 h-3.5 text-blue-400" />
        </button>
        <button 
          onClick={() => {
            localStorage.setItem('mgj_active_social', 'youtube');
            window.dispatchEvent(new CustomEvent('mgj-open-social', { detail: 'youtube' }));
            setActivePage('live');
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span>YouTube MGJ 4157</span>
          <Tv className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>

    </aside>
  );
};
