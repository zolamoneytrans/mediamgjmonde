import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { 
  Home, 
  Tv, 
  ShoppingBag, 
  User, 
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activePage, setActivePage, onOpenAuth }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { cart } = useAppData();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItemsLeft = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'live', label: t('nav.live'), icon: Tv }
  ];

  const navItemsRight = [
    { id: 'shop', label: t('nav.shop'), icon: ShoppingBag, badge: cartCount }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-glass px-2 py-2 backdrop-blur-2xl">
      <div className="grid grid-cols-5 items-center justify-around max-w-lg mx-auto">
        {navItemsLeft.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-[var(--accent-olive)] font-bold scale-105' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[var(--accent-olive-glow)]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 max-w-[64px] truncate leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Central Menu Drawer Trigger Button */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-drawer'))}
          className="flex flex-col items-center justify-center py-1 rounded-xl transition-all relative text-[var(--accent-olive)] hover:scale-105"
        >
          <div className="p-1.5 rounded-xl bg-[var(--accent-olive)]/20 border border-[var(--accent-olive)]/40 shadow-sm">
            <Menu className="w-5 h-5 stroke-[2.5] text-[var(--accent-olive)]" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-tight">Menu</span>
        </button>

        {navItemsRight.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-[var(--accent-olive)] font-bold scale-105' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[var(--accent-olive-glow)]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 max-w-[64px] truncate leading-tight">
                {item.label}
              </span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-[var(--accent-orange)] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 5th Slot: Profile / Auth */}
        <button
          onClick={() => user ? setActivePage('profile') : onOpenAuth()}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            activePage === 'profile' 
              ? 'text-[var(--accent-gold)] font-bold scale-105' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activePage === 'profile' ? 'bg-amber-500/20' : ''}`}>
            <User className={`w-5 h-5 ${activePage === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">{t('nav.profile')}</span>
        </button>
      </div>
    </nav>
  );
};
