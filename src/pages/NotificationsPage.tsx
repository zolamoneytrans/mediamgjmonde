import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppData } from '../context/AppDataContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Radio, 
  Sparkles, 
  Trash2,
  CheckCheck
} from 'lucide-react';

interface NotificationsPageProps {
  setActivePage: (page: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setActivePage }) => {
  const { t, lang } = useLanguage();
  const { notifications, markNotificationRead } = useAppData();

  const [filter, setFilter] = useState<'all' | 'urgent' | 'event' | 'general'>('all');

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  const getIcon = (type: string) => {
    if (type === 'urgent') return <Radio className="w-5 h-5 text-red-500 animate-pulse" />;
    if (type === 'event') return <Calendar className="w-5 h-5 text-[var(--accent-gold)]" />;
    return <Sparkles className="w-5 h-5 text-[var(--accent-olive)]" />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-olive mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span className="text-xs font-black uppercase tracking-wider">{lang === 'fr' ? 'Centre de Messages' : 'Message Center'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-[var(--text-primary)]">
            {t('notifications.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1">
            {t('notifications.subtitle')}
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-center"
        >
          <CheckCheck className="w-4 h-4 text-[var(--accent-olive)]" />
          <span>{t('notifications.markAllRead')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'all'
              ? 'bg-[var(--accent-olive)] text-white shadow-md'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          {lang === 'fr' ? 'Toutes' : 'All'} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'urgent'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          {lang === 'fr' ? 'Urgentes & Live' : 'Urgent & Live'}
        </button>
        <button
          onClick={() => setFilter('event')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'event'
              ? 'bg-[var(--accent-gold)] text-white shadow-md'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          {lang === 'fr' ? 'Événements Kzi' : 'Events Kzi'}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border-glass text-sm text-[var(--text-secondary)]">
            {t('notifications.empty')}
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`glass-card p-6 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start justify-between gap-4 ${
                n.read
                  ? 'bg-[var(--bg-secondary)]/50 border-glass opacity-80'
                  : 'bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)] border-[var(--accent-olive)]/60 shadow-lg scale-[1.01]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${n.type === 'urgent' ? 'bg-red-500/15' : 'bg-[var(--bg-primary)] border border-glass'}`}>
                  {getIcon(n.type)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse shrink-0" />
                    )}
                    <h3 className="font-outfit font-extrabold text-base sm:text-lg text-[var(--text-primary)]">
                      {lang === 'fr' ? n.titleFr : n.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {lang === 'fr' ? n.bodyFr : n.bodyEn}
                  </p>
                  <span className="text-[11px] font-bold text-[var(--text-muted)] block pt-1">
                    {new Date(n.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {n.type === 'urgent' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePage('live'); }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all"
                  >
                    {lang === 'fr' ? 'Ouvrir Direct' : 'Watch Live'}
                  </button>
                )}
                {n.type === 'event' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePage('kzi'); }}
                    className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] hover:bg-amber-600 text-white text-xs font-black shadow-md transition-all"
                  >
                    {lang === 'fr' ? 'Voir Convention' : 'View Convention'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
