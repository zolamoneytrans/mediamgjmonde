import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Tv, 
  Calendar, 
  HeartHandshake, 
  ShoppingBag, 
  ArrowRight, 
  Award, 
  Flame, 
  Users, 
  CheckCircle2, 
  Globe, 
  Play, 
  BellRing,
  BookOpen
} from 'lucide-react';

interface SmartWelcomePageProps {
  setActivePage: (page: string) => void;
}

export const SmartWelcomePage: React.FC<SmartWelcomePageProps> = ({ setActivePage }) => {
  const { t, lang } = useLanguage();

  const navigateToLogin = () => {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
    setActivePage('login');
  };

  const navigateToSignup = () => {
    window.history.pushState({}, '', '/signup');
    window.dispatchEvent(new PopStateEvent('popstate'));
    setActivePage('signup');
  };

  const benefits = [
    {
      icon: QrCode,
      color: 'from-amber-500 to-yellow-600 text-amber-300',
      bgColor: 'bg-amber-500/15 border-amber-500/30',
      titleFr: 'Carte Membre & Badge QR KZI',
      titleEn: 'QR Member Card & KZI Badge',
      descFr: 'Obtenez votre carte numérique officielle avec QR code unique pour un accès prioritaire et sécurisé aux conventions.',
      descEn: 'Get your official digital card with a unique QR code for priority access to conventions & services.'
    },
    {
      icon: Tv,
      color: 'from-emerald-500 to-teal-600 text-emerald-300',
      bgColor: 'bg-emerald-500/15 border-emerald-500/30',
      titleFr: 'Streaming Direct & Intercession',
      titleEn: 'Live Streaming & Intercession',
      descFr: 'Participez aux cultes en direct avec chat prophétique réservé aux membres, requêtes de prière et louanges.',
      descEn: 'Join live services with member-only prophetic chat, prayer requests, and worship gatherings.'
    },
    {
      icon: HeartHandshake,
      color: 'from-purple-500 to-pink-600 text-purple-300',
      bgColor: 'bg-purple-500/15 border-purple-500/30',
      titleFr: 'Suivi des Dîmes & Offrandes',
      titleEn: 'Tithes & Offerings History',
      descFr: 'Enregistrez et consultez en toute confidentialité l\'historique de vos libéralités, semences prophétiques et vœux.',
      descEn: 'Confidential tracking of all your financial offerings, prophetic seeds, tithes, and special vows.'
    },
    {
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600 text-blue-300',
      bgColor: 'bg-blue-500/15 border-blue-500/30',
      titleFr: 'Boutique & Ressources MGJ',
      titleEn: 'MGJ Shop & Resources',
      descFr: 'Accédez aux prédications exclusives en audio/vidéo, livres spirituels et articles officiels Génération Joël.',
      descEn: 'Access exclusive audio/video sermons, spiritual literature, and official Generation Joel items.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden pb-16">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[var(--accent-olive)]/15 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent-gold)]/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[30%] w-[500px] h-[500px] rounded-full bg-[var(--accent-orange)]/10 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
        
        {/* Prophetic Announcement Banner */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--accent-olive)]/20 via-[var(--accent-gold)]/20 to-[var(--accent-olive)]/20 border border-[var(--accent-gold)]/40 shadow-lg backdrop-blur-md animate-fade-in">
            <Flame className="w-4 h-4 text-[var(--accent-gold)] animate-bounce" />
            <span className="text-xs sm:text-sm font-black font-outfit uppercase tracking-wider text-[var(--text-primary)]">
              {lang === 'fr' ? 'Joël 2:28 • L\'Onction de la Fin des Temps' : 'Joel 2:28 • End-Time Prophetic Anointing'}
            </span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="relative inline-block group">
            <div className="absolute -inset-3 bg-gradient-to-r from-[var(--accent-olive)] via-[var(--accent-gold)] to-emerald-600 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
            <img 
              src="/logo.png" 
              alt="MediaMGJ Monde Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10 mx-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" 
            />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit tracking-tight text-[var(--text-primary)] leading-tight">
            Bienvenue dans le <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--accent-olive)] via-[var(--accent-gold)] to-amber-300 bg-clip-text text-transparent">
              Sanctuaire Numérique MGJ
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
            {lang === 'fr'
              ? 'L\'application officielle des Ministères Génération Joël (MGJ Monde). Pour accéder à votre tableau de bord personnel, vos cultes en direct et votre badge QR, veuillez vous authentifier.'
              : 'The official digital sanctuary of Generation Joel Ministries (MGJ Monde). Please sign in to access your personal dashboard, live streams, and digital QR badge.'}
          </p>

          {/* Smart Live & Status Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{lang === 'fr' ? 'Direct Streaming HD & Culte 24/7' : 'Live HD Streaming & Service 24/7'}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? '31ème Grande Convention KZI : 02 - 09 Août 2026' : '31st Grand KZI Convention: Aug 02-09, 2026'}</span>
            </div>
          </div>
        </div>

        {/* Vision MGJ Official Presentation Spotlight Banner */}
        <div className="mt-8 max-w-3xl mx-auto">
          <button
            onClick={() => setActivePage('about')}
            className="w-full text-left p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--accent-gold)]/20 via-amber-500/15 to-[var(--accent-olive)]/20 border-2 border-[var(--accent-gold)]/60 hover:border-[var(--accent-gold)] shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group backdrop-blur-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-gold)]/15 rounded-full blur-2xl pointer-events-none group-hover:bg-[var(--accent-gold)]/25 transition-all" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-gold)] to-amber-600 flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-7 h-7 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-[var(--accent-gold)]/40 text-[10px] font-black uppercase tracking-widest text-[var(--accent-gold)] mb-1">
                    <Flame className="w-3 h-3 animate-pulse" />
                    <span>{lang === 'fr' ? 'Révélation & Mandat Céleste' : 'Heavenly Mandate & Vision'}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black font-outfit text-[var(--text-primary)] group-hover:text-amber-300 transition-colors">
                    {lang === 'fr' ? 'Découvrir la Vision M.G.J • À Propos de l\'Œuvre' : 'Discover the M.G.J Vision • About the Ministry'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-xl mt-0.5 leading-relaxed">
                    {lang === 'fr' 
                      ? 'Fondée en Juillet 1994 • Révérend Réussite Ngoie Mandaku • Les 4 Piliers de l\'Onction prophétique' 
                      : 'Founded in July 1994 • Rev. Réussite Ngoie Mandaku • The 4 Prophetic Pillars of Anointing'}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-[var(--accent-gold)] text-slate-950 font-black text-xs font-outfit flex items-center gap-2 shrink-0 self-end sm:self-center shadow-lg group-hover:bg-amber-400 transition-colors">
                <span>{lang === 'fr' ? 'Lire la Vision' : 'Read Vision'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Primary Call-to-Action Gateway Card */}
        <div className="mt-10 max-w-3xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-[var(--accent-gold)]/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[var(--bg-secondary)]/90 to-[var(--bg-tertiary)]/90 backdrop-blur-2xl">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--accent-olive)]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] text-xs font-black uppercase tracking-widest border border-[var(--accent-olive)]/30">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Authentification Requise pour le Tableau de Bord' : 'Sign In Required for Dashboard Access'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Accédez à votre Espace Privé Membre' : 'Access Your Private Member Portal'}
            </h3>

            <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
              {lang === 'fr'
                ? 'Votre tableau de bord réunit vos privilèges Kzi, votre historique d\'offrandes, vos notifications ministérielles et votre carte membre numérique unique.'
                : 'Your dashboard gathers your Kzi privileges, financial offering records, ministry notifications, and unique digital member card.'}
            </p>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl mx-auto">
              
              {/* Login Button */}
              <button
                onClick={navigateToLogin}
                className="group py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--accent-olive)] to-[#375215] hover:from-[#3e5e18] hover:to-[#2b4010] text-white font-black font-outfit text-base shadow-xl shadow-[var(--accent-olive)]/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/10"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
                <span>{lang === 'fr' ? 'Se Connecter' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
              </button>

              {/* Signup Button */}
              <button
                onClick={navigateToSignup}
                className="group py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[var(--accent-gold)] to-amber-600 hover:opacity-95 text-slate-950 font-black font-outfit text-base shadow-xl shadow-amber-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-amber-300/30"
              >
                <Sparkles className="w-5 h-5 text-slate-950 shrink-0" />
                <span>{lang === 'fr' ? 'S\'inscrire (Carte QR)' : 'Sign Up (QR Card)'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
              </button>
            </div>

            {/* Explore as Guest Option */}
            <div className="pt-4 border-t border-glass">
              <span className="text-xs text-[var(--text-secondary)] mr-2">
                {lang === 'fr' ? 'Ou découvrez le sanctuaire public :' : 'Or explore the public sanctuary:'}
              </span>
              <button
                onClick={() => setActivePage('live')}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--accent-olive)] hover:underline mt-2 sm:mt-0"
              >
                <Play className="w-3.5 h-3.5 fill-[var(--accent-olive)]" />
                <span>{lang === 'fr' ? 'Direct Streaming sans compte' : 'Watch Live Stream as Guest'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Member Benefits Grid */}
        <div className="mt-16 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Pourquoi créer votre compte membre ?' : 'Why Create Your Member Account?'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              {lang === 'fr' ? 'Des outils puissants conçus pour la famille Génération Joël à travers le monde' : 'Powerful tools designed for the Generation Joel family across the globe'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div 
                  key={idx}
                  className={`p-6 rounded-3xl border ${b.bgColor} backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 flex items-start gap-4 shadow-lg`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${b.color} flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base sm:text-lg font-black font-outfit text-[var(--text-primary)]">
                      {lang === 'fr' ? b.titleFr : b.titleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {lang === 'fr' ? b.descFr : b.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scripture Quote Footer Section */}
        <div className="mt-16 max-w-4xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-glass shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent" />
          <Award className="w-10 h-10 text-[var(--accent-gold)] mx-auto mb-3 animate-pulse" />
          <blockquote className="text-sm sm:text-base font-medium italic text-[var(--text-primary)] leading-relaxed max-w-2xl mx-auto">
            « {lang === 'fr' 
              ? 'Après cela, je répandrai mon esprit sur toute chair; vos fils et vos filles prophétiseront, vos vieillards auront des songes, et vos jeunes gens des visions.' 
              : 'And it shall come to pass afterward, that I will pour out my spirit upon all flesh; your sons and your daughters shall prophesy...'} »
          </blockquote>
          <p className="mt-2 text-xs font-black tracking-widest uppercase text-[var(--accent-gold)]">
            Joël 2:28 • Ministères Génération Joël (MGJ Monde)
          </p>
        </div>

        {/* Copyright Foot */}
        <footer className="mt-12 py-6 text-center border-t border-glass text-xs font-bold text-[var(--text-secondary)]">
          <p className="font-outfit tracking-wide text-[var(--text-primary)]">
            (c) Swazi Appli Lab sarl 2026 • Tous droits réservés / All rights reserved
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">
            31ème Grande Convention Internationale KZI 2026 • Kolwezi (02 au 09 Août 2026)
          </p>
        </footer>

      </div>
    </div>
  );
};

export default SmartWelcomePage;
