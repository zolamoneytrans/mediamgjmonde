import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Tv, 
  Calendar, 
  ShoppingBag, 
  HeartHandshake, 
  ExternalLink, 
  Flame, 
  Play, 
  Users, 
  Sparkles,
  ArrowRight,
  Share2,
  PhoneCall,
  BellRing,
  Radio,
  Bus,
  Plane,
  Hotel,
  MapPin,
  CheckCircle2,
  X,
  MessageSquare,
  Phone,
  Download,
  Info,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

interface DashboardPageProps {
  setActivePage: (page: string) => void;
  onOpenAuth: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActivePage, onOpenAuth }) => {
  const { t, lang } = useLanguage();
  const { user, canAccessAdmin } = useAuth();
  const { announcements, notifications } = useAppData();

  const handleTitleClick = (id: string, type: 'announcement' | 'notification') => {
    localStorage.setItem('mgj_target_item_id', id);
    localStorage.setItem('mgj_target_item_type', type);
    if (type === 'announcement') {
      localStorage.setItem('mgj_target_announcement_id', id);
    } else {
      localStorage.setItem('mgj_target_notification_id', id);
    }
    setActivePage('announcements');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [activeBookingModal, setActiveBookingModal] = useState<'bus' | 'flight' | 'accommodation' | null>(null);
  const [bookingType, setBookingType] = useState<'bus' | 'flight' | 'accommodation'>('bus');
  const [travelerName, setTravelerName] = useState(user?.fullName || '');
  const [travelerPhone, setTravelerPhone] = useState(user?.phone || '');
  const [departurePoint, setDeparturePoint] = useState('Lubumbashi -> Kolwezi (Siège Central MGJ)');
  const [passengersCount, setPassengersCount] = useState(1);
  const [travelDate, setTravelDate] = useState('2026-08-01');
  const [specialRequest, setSpecialRequest] = useState('');
  const [includeVipShuttle, setIncludeVipShuttle] = useState(true);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [bookingVoucherId, setBookingVoucherId] = useState('');

  const handleOpenBookingModal = (type: 'bus' | 'flight' | 'accommodation') => {
    setBookingType(type);
    setIsBookedSuccess(false);
    if (!travelerName && user?.fullName) setTravelerName(user.fullName);
    if (!travelerPhone && user?.phone) setTravelerPhone(user.phone);
    if (type === 'bus') setDeparturePoint('Lubumbashi -> Kolwezi (Siège Central MGJ)');
    else if (type === 'flight') setDeparturePoint('Kinshasa (FIH) -> Aéroport Kolwezi (KWZ)');
    else if (type === 'accommodation') setDeparturePoint('Hôtel Partenaire VIP (Chambre individuelle / climatisée)');
    setActiveBookingModal(type);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setBookingVoucherId(`KZI-${bookingType.toUpperCase()}-${randomCode}`);
    setIsBookedSuccess(true);
  };

  const handleDownloadBookingVoucher = () => {
    const typeLabel = bookingType === 'bus' ? 'BUS OFFICIEL MGJ' : bookingType === 'flight' ? "BILLET D'AVION & NAVETTE" : 'HÉBERGEMENT & LOGEMENT';
    const text = `=====================================================
   31ème GRANDE CONVENTION KZI 2026 - VOUCHER DE RÉSERVATION
=====================================================
Référence Voucher : ${bookingVoucherId || 'KZI-LOG-2026'}
Type de Service   : ${typeLabel}
Pèlerin / Délégué : ${travelerName || (user ? user.fullName : 'Membre MGJ')}
Téléphone / WA    : ${travelerPhone || 'Non spécifié'}
Choix / Trajet    : ${departurePoint}
${bookingType === 'flight' ? `Navette VIP KWZ   : ${includeVipShuttle ? 'OUI (Aéroport -> Site Manika Sport)' : 'NON'}\n` : ''}Nombre d'invités  : ${passengersCount} personne(s)
Date d'arrivée    : ${travelDate}
Notes particulières : ${specialRequest || 'Aucune'}

Lieu & Événement  : Kolwezi (RDC) • 02-09 Août 2026
Comité Logistique : Papa Adellard (+243 997 113 225)
Administration    : Papa Ghislain KABALE (+243 990 228 048)

« JÉSUS-CHRIST REVIENT BIENTÔT ! » Joël 2:28
=====================================================
(c) Swazi Appli Lab sarl 2026 • Logistique MGJ Monde`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Voucher_Kzi_${bookingType}_${(travelerName || 'Membre').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareVerse = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Joël 2:28 - MediaMondeMJG',
        text: '« Après cela, je répandrai mon esprit sur toute chair... » Joël 2:28. Rejoignez-nous sur l\'application officielle MediaMondeMJG !',
        url: window.location.origin
      }).catch(() => {});
    } else {
      alert(lang === 'fr' ? 'Verset copié dans votre presse-papiers !' : 'Scripture copied to clipboard!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* 1. WELCOME MESSAGE + CARD WITH "LA VISION FONDATRICE MGJ" */}
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b2f0c] via-[#2d4715] to-[#0f172a] p-6 sm:p-10 border border-[var(--accent-olive)]/40 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[var(--accent-gold)]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-[var(--accent-olive)]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'fr' ? 'Ministères Génération Joël (MGJ Monde)' : 'Generation Joel Ministries (MGJ Monde)'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
              {user ? (
                <>
                  Shalom, <span className="text-amber-400">{user.ministryPosition} {user.fullName.split(' ')[0]}</span>
                </>
              ) : (
                t('dashboard.welcome')
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'fr'
                ? 'Bienvenue sur votre plateforme officielle d\'évangélisation multimédia, d\'intercession et de préparation prophétique. Restez connectés au feu de Joël 2:28.'
                : 'Welcome to your official multimedia evangelism, intercession, and prophetic readiness platform. Stay connected to the fire of Joel 2:28.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('live')}
                className="btn-gold px-6 py-3 text-sm rounded-xl shadow-xl hover:scale-105 transition-transform"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>{t('dashboard.watchLiveNow')}</span>
              </button>
              <button
                onClick={() => setActivePage('kzi')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <span>{t('nav.kzi')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {(canAccessAdmin || user?.role === 'admin' || user?.role === 'superadmin' || user?.email === 'drnduwa@gmail.com') && (
                <button
                  onClick={() => setActivePage('admin')}
                  className="px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Portail Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: La vision fondatrice MGJ */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-tertiary)] border-[var(--accent-gold)]/50 shadow-2xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[var(--accent-gold)] flex items-center justify-center font-black shadow-md">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-outfit text-[var(--text-primary)]">
                  {t('dashboard.verseTitle')}
                </h3>
                <span className="text-xs font-black text-[var(--accent-gold)] uppercase tracking-wider">
                  {lang === 'fr' ? 'La vision fondatrice MGJ Monde' : 'The founding vision MGJ Monde'}
                </span>
              </div>
            </div>
            <button
              onClick={handleShareVerse}
              title={lang === 'fr' ? 'Partager ce verset' : 'Share verse'}
              className="p-2.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-glass text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-all shadow-md"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <blockquote className="text-base sm:text-xl font-medium italic text-[var(--text-primary)] leading-relaxed bg-black/20 p-5 rounded-2xl border-l-4 border-[var(--accent-gold)]">
            {t('dashboard.verseText')}
          </blockquote>
        </div>
      </div>

      {/* 2. FEEDS OF ANNOUNCEMENTS TITLES & NOTIFICATIONS TITLES (SENT FROM ADMIN DASHBOARD) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-[var(--accent-gold)]/60 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[var(--bg-secondary)] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-[11px] font-black uppercase tracking-wider mb-1.5">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
              <span>{lang === 'fr' ? 'FLUX EN DIRECT DU TABLEAU DE BORD ADMIN' : 'LIVE FEED FROM ADMIN DASHBOARD'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Titres des Annonces & Notifications' : 'Announcements & Notifications Titles'}
            </h2>
          </div>
          <button
            onClick={() => setActivePage('announcements')}
            className="text-xs font-black text-[var(--accent-gold)] hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>{lang === 'fr' ? 'Voir tout le flux officiel' : 'View full official feed'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
          {lang === 'fr' 
            ? 'Cliquez directement sur un titre pour accéder à la publication officielle ou à la directive pastorale correspondante.'
            : 'Click directly on any title to open its full official publication or pastoral directive.'}
        </p>

        {/* Scrollable Titles List / Cards Stack */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
          {/* Combined Announcements & Notifications sorted newest first */}
          {[
            ...announcements.map(a => ({
              id: a.id,
              title: lang === 'fr' ? a.titleFr : a.titleEn,
              snippet: lang === 'fr' ? a.contentFr : a.contentEn,
              date: a.createdAt || 'Récent',
              author: a.authorName || 'Révérend Réussite Ngoie Mandaku',
              type: 'announcement' as const,
              categoryLabel: '📢 Annonce Prophétique',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            })),
            ...notifications.map(n => ({
              id: n.id,
              title: lang === 'fr' ? n.titleFr : n.titleEn,
              snippet: lang === 'fr' ? n.messageFr : n.messageEn,
              date: n.createdAt || 'Récent',
              author: 'Secrétariat Central MGJ',
              type: 'notification' as const,
              categoryLabel: '🔔 Notification Officielle',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }))
          ].length === 0 ? (
            <div className="p-6 rounded-2xl bg-black/30 text-center text-xs font-bold text-slate-400">
              {lang === 'fr' ? 'Aucun titre d\'annonce ou de notification pour le moment.' : 'No announcement or notification titles yet.'}
            </div>
          ) : (
            [
              ...announcements.map(a => ({
                id: a.id,
                title: lang === 'fr' ? a.titleFr : a.titleEn,
                snippet: lang === 'fr' ? a.contentFr : a.contentEn,
                date: a.createdAt || 'Récent',
                author: a.authorName || 'Révérend Réussite Ngoie Mandaku',
                type: 'announcement' as const,
                categoryLabel: '📢 Annonce Prophétique',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              })),
              ...notifications.map(n => ({
                id: n.id,
                title: lang === 'fr' ? n.titleFr : n.titleEn,
                snippet: lang === 'fr' ? n.messageFr : n.messageEn,
                date: n.createdAt || 'Récent',
                author: 'Secrétariat Central MGJ',
                type: 'notification' as const,
                categoryLabel: '🔔 Notification Officielle',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }))
            ].slice(0, 8).map((item, idx) => (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => handleTitleClick(item.id, item.type)}
                className="glass-card p-4 sm:p-5 rounded-2xl bg-black/40 hover:bg-black/70 border border-glass hover:border-[var(--accent-gold)] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:scale-[1.01] shadow-md"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${item.badgeColor}`}>
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      • {item.author} ({typeof item.date === 'string' ? item.date.slice(0, 10) : 'Direct Admin'})
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-outfit text-white group-hover:text-amber-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {item.snippet}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-xs font-black text-[var(--accent-gold)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>{lang === 'fr' ? 'Ouvrir' : 'Read'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. CARDS BUTTONS TO "Annonces", "Contacts", "convention Kzi", "Boutique", "Offrandes", "Mon profil" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black font-outfit text-[var(--text-primary)]">
            {lang === 'fr' ? 'Accès Principal Aux Piliers MGJ (Cartes Boutons)' : 'Main MGJ Pillars Access (Card Buttons)'}
          </h2>
          <span className="text-xs font-extrabold text-[var(--accent-gold)]">
            {lang === 'fr' ? '6 Piliers Fondamentaux' : '6 Core Pillars'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          
          {/* Button 1: Annonces */}
          <button
            onClick={() => setActivePage('announcements')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[150px] group border-[var(--accent-gold)]/60 bg-gradient-to-br from-[var(--accent-gold)]/15 to-transparent shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black shadow-md group-hover:rotate-6 transition-transform">
              <BellRing className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-base sm:text-lg text-[var(--text-primary)] group-hover:text-amber-300 transition-colors">
                Annonces
              </h4>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block font-semibold">
                {lang === 'fr' ? 'Directives & Médias' : 'Directives & Media'}
              </span>
            </div>
          </button>

          {/* Button 2: Contacts */}
          <button
            onClick={() => setActivePage('contacts')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[150px] group border-emerald-500/60 bg-gradient-to-br from-emerald-500/15 to-transparent shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:rotate-6 transition-transform">
              <PhoneCall className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-base sm:text-lg text-[var(--text-primary)] group-hover:text-emerald-300 transition-colors">
                Contacts
              </h4>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block font-semibold">
                {lang === 'fr' ? 'Siège & WhatsApp' : 'HQ & WhatsApp'}
              </span>
            </div>
          </button>

          {/* Button 3: Convention Kzi */}
          <button
            onClick={() => setActivePage('kzi')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[150px] group border-amber-500/60 bg-gradient-to-br from-amber-500/15 to-transparent shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:rotate-6 transition-transform">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-base sm:text-lg text-[var(--text-primary)] group-hover:text-amber-300 transition-colors">
                Convention Kzi
              </h4>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block font-semibold">
                {lang === 'fr' ? 'Inscriptions 2026' : 'Registration 2026'}
              </span>
            </div>
          </button>

          {/* Button 4: Boutique */}
          <button
            onClick={() => setActivePage('shop')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[150px] group border-[var(--accent-gold)]/60 bg-gradient-to-br from-[var(--accent-gold)]/15 to-transparent shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black shadow-md group-hover:rotate-6 transition-transform">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-base sm:text-lg text-[var(--text-primary)] group-hover:text-amber-300 transition-colors">
                Boutique
              </h4>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block font-semibold">
                {lang === 'fr' ? 'Livres & T-shirts' : 'Books & Apparel'}
              </span>
            </div>
          </button>

          {/* Button 5: Offrandes */}
          <button
            onClick={() => setActivePage('donations')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[150px] group border-[var(--accent-orange)]/60 bg-gradient-to-br from-[var(--accent-orange)]/15 to-transparent shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-orange)] text-slate-950 flex items-center justify-center font-black shadow-md group-hover:rotate-6 transition-transform">
              <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-base sm:text-lg text-[var(--text-primary)] group-hover:text-orange-300 transition-colors">
                Offrandes
              </h4>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block font-semibold">
                {lang === 'fr' ? 'Dîmes & Soutien en ligne' : 'Tithes & Online Offerings'}
              </span>
            </div>
          </button>

          {/* Button 6: Mon profil */}
          <button
            onClick={() => user ? setActivePage('profile') : onOpenAuth()}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[150px] group border-emerald-500/60 bg-gradient-to-br from-emerald-500/15 to-transparent shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:rotate-6 transition-transform">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-base sm:text-lg text-[var(--text-primary)] group-hover:text-emerald-300 transition-colors">
                Mon profil
              </h4>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 block font-semibold">
                {lang === 'fr' ? 'Badge Membre MGJ' : 'MGJ Member Badge'}
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Social Media & Official Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-[var(--text-primary)]">
            {t('dashboard.socialTitle')}
          </h2>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {lang === 'fr' ? 'Abonnez-vous à nos chaînes' : 'Subscribe to our channels'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Facebook Widget */}
          <div className="glass-card p-6 rounded-3xl border-blue-500/30 hover:border-blue-500 transition-all flex flex-col justify-between group bg-gradient-to-br from-blue-950/20 via-[var(--bg-card)] to-[var(--bg-card)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg font-black text-2xl">
                    f
                  </div>
                  <div>
                    <h3 className="font-outfit font-extrabold text-lg text-[var(--text-primary)]">
                      Media MGJ Monde
                    </h3>
                    <span className="text-xs text-blue-400 font-bold">@mediamgjmonde</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-extrabold">
                  <Users className="w-3.5 h-3.5" />
                  <span>48.5K {lang === 'fr' ? 'fidèles' : 'followers'}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {t('dashboard.fbDesc')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  localStorage.setItem('mgj_active_social', 'facebook');
                  window.dispatchEvent(new CustomEvent('mgj-open-social', { detail: 'facebook' }));
                  setActivePage('live');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>{lang === 'fr' ? 'Ouvrir Flux Facebook' : 'Open Facebook Feed'}</span>
                <Radio className="w-4 h-4 animate-pulse" />
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('mgj_active_social', 'facebook');
                  window.dispatchEvent(new CustomEvent('mgj-open-social', { detail: 'facebook' }));
                  setActivePage('live');
                }}
                className="py-3 px-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] border border-glass text-xs font-bold text-[var(--text-primary)] transition-all"
              >
                {lang === 'fr' ? 'Voir Live & Feed FB' : 'Watch FB Live & Feed'}
              </button>
            </div>
          </div>

          {/* YouTube Widget */}
          <div className="glass-card p-6 rounded-3xl border-red-500/30 hover:border-red-500 transition-all flex flex-col justify-between group bg-gradient-to-br from-red-950/20 via-[var(--bg-card)] to-[var(--bg-card)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg font-black text-xl">
                    ▶
                  </div>
                  <div>
                    <h3 className="font-outfit font-extrabold text-lg text-[var(--text-primary)]">
                      Ministères Génération Joël
                    </h3>
                    <span className="text-xs text-red-400 font-bold">@mediaministeresgenerationj4157</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-extrabold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>26.2K {lang === 'fr' ? 'abonnés' : 'subscribers'}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {t('dashboard.ytDesc')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  localStorage.setItem('mgj_active_social', 'youtube');
                  window.dispatchEvent(new CustomEvent('mgj-open-social', { detail: 'youtube' }));
                  setActivePage('live');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>{lang === 'fr' ? 'Ouvrir Chaîne YouTube' : 'Open YouTube Channel'}</span>
                <Radio className="w-4 h-4 animate-pulse" />
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('mgj_active_social', 'youtube');
                  window.dispatchEvent(new CustomEvent('mgj-open-social', { detail: 'youtube' }));
                  setActivePage('live');
                }}
                className="py-3 px-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] border border-glass text-xs font-bold text-[var(--text-primary)] transition-all"
              >
                {lang === 'fr' ? 'Voir Live & Feed YT' : 'Watch YT Live & Feed'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Shortcuts Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-outfit text-[var(--text-primary)]">
          {t('dashboard.quickActions')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          <button
            onClick={() => setActivePage('announcements')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-[var(--accent-gold)]/40 bg-gradient-to-br from-[var(--accent-gold)]/10 to-transparent"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-amber-300 transition-colors">
                {lang === 'fr' ? 'Annonces' : 'Alerts'}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Directives MGJ' : 'Directives'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage('contacts')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-transparent"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                {lang === 'fr' ? 'Contacts' : 'Contacts'}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Appels & Siège' : 'HQ & Calls'}
              </span>
            </div>
          </button>

          <button
            onClick={() => handleOpenBookingModal('bus')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-amber-400 transition-colors">
                {lang === 'fr' ? 'Bus & Vol KZI' : 'Travel KZI'}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Réservation Kolwezi' : 'Book Kolwezi'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage('kzi')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-[var(--accent-olive)]/30"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-olive)] transition-colors">
                {t('nav.kzi')}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Inscriptions & Programme' : 'Registration & Schedule'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage('shop')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-[var(--accent-gold)]/30"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent-gold-glow)] text-[var(--accent-gold)] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                {t('nav.shop')}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Livres, T-shirts MGJ & E-Books' : 'Books, Apparel & E-Books'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage('donations')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-[var(--accent-orange)]/30"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent-orange-glow)] text-[var(--accent-orange)] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-orange)] transition-colors">
                {t('nav.donations')}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Dîmes & Offrandes en ligne' : 'Tithes & Online Offerings'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage('medias')}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-blue-500/30"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                {lang === 'fr' ? 'Médias' : 'Media Hub'}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Directs YT & FB dans l\'App' : 'In-App YT & FB Feeds'}
              </span>
            </div>
          </button>

          <button
            onClick={() => user ? setActivePage('profile') : onOpenAuth()}
            className="glass-card p-5 text-left hover:scale-105 transition-all flex flex-col justify-between min-h-[140px] group border-emerald-500/30"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                {t('nav.profile')}
              </h4>
              <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                {lang === 'fr' ? 'Carte Membre & Notes' : 'Member Badge & Notes'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Booking Modal for Grande Convention Kzi (Kolwezi) */}
      {activeBookingModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-2xl rounded-3xl border border-[var(--accent-gold)]/60 bg-gradient-to-br from-[#1b2f0c] via-[#111c08] to-[#0f172a] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-black/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
                  {bookingType === 'bus' ? <Bus className="w-6 h-6 stroke-[2.5]" /> : bookingType === 'flight' ? <Plane className="w-6 h-6 stroke-[2.5]" /> : <Hotel className="w-6 h-6 stroke-[2.5]" />}
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>Kolwezi (RDC) • 02-09 Août 2026</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black font-outfit text-white truncate">
                    {bookingType === 'bus' ? 'Réservation Bus Officiel MGJ' : bookingType === 'flight' ? 'Billet d\'Avion & Navette KWZ' : 'Hébergement & Logement Kolwezi'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveBookingModal(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service Type Tab Switcher inside Modal */}
            <div className="px-5 pt-4 flex gap-2 bg-black/20 border-b border-white/10 overflow-x-auto">
              <button
                type="button"
                onClick={() => handleOpenBookingModal('bus')}
                className={`px-4 py-2 rounded-t-xl text-xs font-black flex items-center gap-2 transition-all shrink-0 ${
                  bookingType === 'bus'
                    ? 'bg-amber-500 text-slate-950 shadow-lg border-t-2 border-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>🚌 Bus Officiel</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenBookingModal('flight')}
                className={`px-4 py-2 rounded-t-xl text-xs font-black flex items-center gap-2 transition-all shrink-0 ${
                  bookingType === 'flight'
                    ? 'bg-blue-500 text-slate-950 shadow-lg border-t-2 border-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>✈️ Avion & Navette</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenBookingModal('accommodation')}
                className={`px-4 py-2 rounded-t-xl text-xs font-black flex items-center gap-2 transition-all shrink-0 ${
                  bookingType === 'accommodation'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg border-t-2 border-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Hotel className="w-3.5 h-3.5" />
                <span>🏨 Logement Kolwezi</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              {!isBookedSuccess ? (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {bookingType === 'bus' && 'Les caravanes partent 24h à 48h avant l\'ouverture de la Grande Convention. Place garantie en bus tout confort climatisé.'}
                      {bookingType === 'flight' && 'Indiquez votre ville de départ. Le comité organise l\'accueil VIP dès votre atterrissage à l\'Aéroport National de Kolwezi (KWZ).'}
                      {bookingType === 'accommodation' && 'Nos hôtels partenaires à Kolwezi et résidences MGJ garantissent la sécurité et la proximité avec le site Manika Sport.'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Nom complet du pèlerin / délégué :</label>
                      <input
                        type="text"
                        required
                        value={travelerName}
                        onChange={(e) => setTravelerName(e.target.value)}
                        placeholder="Ex: Pasteur Jean-Marc Ngoie"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-glass text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Téléphone / WhatsApp pour contact :</label>
                      <input
                        type="text"
                        required
                        value={travelerPhone}
                        onChange={(e) => setTravelerPhone(e.target.value)}
                        placeholder="Ex: +243 990 000 000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-glass text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {bookingType === 'bus' && 'Ville & Point de départ du Bus :'}
                      {bookingType === 'flight' && 'Aéroport de départ vers Kolwezi (KWZ) :'}
                      {bookingType === 'accommodation' && 'Type d\'hébergement souhaité à Kolwezi :'}
                    </label>
                    <select
                      value={departurePoint}
                      onChange={(e) => setDeparturePoint(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-glass text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-medium"
                    >
                      {bookingType === 'bus' ? (
                        <>
                          <option value="Lubumbashi -> Kolwezi (Siège Central MGJ)">Lubumbashi -&gt; Kolwezi (Siège Central MGJ)</option>
                          <option value="Likasi -> Kolwezi (Caravane Secteur Likasi)">Likasi -&gt; Kolwezi (Caravane Secteur Likasi)</option>
                          <option value="Kasumbalesa -> Kolwezi (Frontière / Zambie)">Kasumbalesa -&gt; Kolwezi (Frontière / Zambie)</option>
                          <option value="Kinshasa -> Kolwezi (Caravane & Liaison spéciale)">Kinshasa -&gt; Kolwezi (Caravane &amp; Liaison spéciale)</option>
                          <option value="Autre ville en RDC (Préciser dans les notes)">Autre ville en RDC (Préciser dans les notes)</option>
                        </>
                      ) : bookingType === 'flight' ? (
                        <>
                          <option value="Kinshasa N'djili (FIH) -> Kolwezi (KWZ)">Kinshasa N'djili (FIH) -&gt; Kolwezi (KWZ)</option>
                          <option value="Goma (GOM) -> Kolwezi (KWZ)">Goma (GOM) -&gt; Kolwezi (KWZ)</option>
                          <option value="Lubumbashi (FBM) -> Kolwezi (KWZ)">Lubumbashi (FBM) -&gt; Kolwezi (KWZ)</option>
                          <option value="Johannesburg (JNB) -> Kolwezi (KWZ)">Johannesburg (JNB) -&gt; Kolwezi (KWZ)</option>
                          <option value="Lusaka (LUN) -> Kolwezi (KWZ)">Lusaka (LUN) -&gt; Kolwezi (KWZ)</option>
                          <option value="Autre vol international / Charter -> Kolwezi">Autre vol international / Charter -&gt; Kolwezi</option>
                        </>
                      ) : (
                        <>
                          <option value="Hôtel Partenaire VIP (Chambre individuelle / climatisée / Wi-Fi)">Hôtel Partenaire VIP (Chambre individuelle / climatisée / Wi-Fi)</option>
                          <option value="Hôtel Standard / Appartement meublé (Chambre double 2-3 personnes)">Hôtel Standard / Appartement meublé (Chambre double 2-3 personnes)</option>
                          <option value="Centre d'Accueil Officiel MGJ (Dortoir intercesseurs & délégations)">Centre d'Accueil Officiel MGJ (Dortoir intercesseurs &amp; délégations)</option>
                          <option value="Logement chez un frère/sœur hôte à Kolwezi">Logement chez un frère/sœur hôte à Kolwezi</option>
                        </>
                      )}
                    </select>
                  </div>

                  {bookingType === 'flight' && (
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeVipShuttle}
                        onChange={(e) => setIncludeVipShuttle(e.target.checked)}
                        className="w-4 h-4 accent-blue-500 rounded"
                      />
                      <span className="text-xs text-white font-medium">
                        ✅ Inclure la navette VIP de l'Aéroport National de Kolwezi (KWZ) vers le site Manika Sport / Hôtel
                      </span>
                    </label>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Nombre de personnes / sièges :</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={passengersCount}
                        onChange={(e) => setPassengersCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-glass text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Date d'arrivée prévue à Kolwezi :</label>
                      <select
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-glass text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-medium"
                      >
                        <option value="2026-08-01 (Veille de la Convention)">01 Août 2026 (Veille de la Convention)</option>
                        <option value="2026-08-02 (Jour 1 - Ouverture solennelle)">02 Août 2026 (Jour 1 - Ouverture solennelle)</option>
                        <option value="2026-08-03 (Jour 2)">03 Août 2026 (Jour 2)</option>
                        <option value="2026-08-04 (Jour 3)">04 Août 2026 (Jour 3)</option>
                        <option value="2026-08-05 (Jour 4)">05 Août 2026 (Jour 4)</option>
                        <option value="2026-08-06 (Jour 5)">06 Août 2026 (Jour 5)</option>
                        <option value="2026-08-07 (Jour 6)">07 Août 2026 (Jour 6)</option>
                        <option value="2026-08-08 (Jour 7)">08 Août 2026 (Jour 7)</option>
                        <option value="2026-08-09 (Jour 8 - Grande Clôture)">09 Août 2026 (Jour 8 - Grande Clôture)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Notes & demandes spéciales (Optionnel) :</label>
                    <textarea
                      rows={2}
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="Ex: Demande de chambre en rez-de-chaussée, arrivée tardive, besoins spécifiques..."
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-glass text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveBookingModal(null)}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
                    >
                      <span>Valider ma demande de réservation KZI</span>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                    <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl sm:text-2xl font-black font-outfit text-white">
                      🎉 Demande de Réservation Enregistrée !
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      Votre demande (<strong className="text-amber-400">{bookingVoucherId}</strong>) a été préparée pour le comité logistique. Vous pouvez maintenant la transmettre via WhatsApp ou télécharger votre voucher.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/15 text-left space-y-2 max-w-md mx-auto text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1.5 text-slate-300">
                      <span>Service :</span>
                      <strong className="text-amber-300 uppercase">{bookingType}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5 text-slate-300">
                      <span>Délégué :</span>
                      <strong className="text-white">{travelerName || 'Membre MGJ'}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5 text-slate-300">
                      <span>Trajet / Option :</span>
                      <strong className="text-white text-right max-w-[200px] truncate">{departurePoint}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Date d'arrivée :</span>
                      <strong className="text-emerald-400">{travelDate}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/243997113225?text=${encodeURIComponent(`Shalom Papa Adellard (Logistique KZI 2026),\n\nJe vous confirme ma demande de réservation [Réf: ${bookingVoucherId}]:\n\n- Type : ${bookingType.toUpperCase()}\n- Pèlerin : ${travelerName}\n- Contact : ${travelerPhone}\n- Option : ${departurePoint}\n- Personnes : ${passengersCount}\n- Arrivée : ${travelDate}\n${specialRequest ? `- Notes : ${specialRequest}\n` : ''}\nMerci de confirmer ma prise en charge pour Kolwezi !`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Confirmer par WhatsApp (Papa Adellard)</span>
                    </a>
                    
                    <button
                      type="button"
                      onClick={handleDownloadBookingVoucher}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[var(--accent-gold)] hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Télécharger mon Voucher (.txt)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveBookingModal(null)}
                    className="text-xs text-slate-400 hover:text-white font-bold underline pt-2 block mx-auto"
                  >
                    Fermer et retourner au tableau de bord
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer Contacts */}
            <div className="p-3 sm:p-4 bg-black/50 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>Logistique KZI : <strong>+243 997 113 225</strong> (Papa Adellard)</span>
              <span>Admin : <strong>+243 990 228 048</strong> (Papa Ghislain)</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
