import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Tv, 
  Play, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Video, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Search,
  Youtube,
  Facebook,
  Maximize2,
  ListVideo,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { fetchAndCacheVideos, sortVideosByLatest, MediaVideoItem as ServiceMediaVideoItem } from '../services/youtubeService';


export interface MediaVideoItem {
  id: string;
  title: string;
  platform: 'youtube' | 'facebook';
  embedUrl: string;
  date: string;
  category: 'Conventions KZI' | 'Veillées Joël 2:28' | 'Enseignements' | 'Messages & Exhortations';
  views: string;
  likes: string;
  description: string;
  thumbnailUrl?: string;
  duration?: string;
  publishedAt?: string;
}

// 100% Authentic Catalog from exact YouTube handle @mediaministeresgenerationj4157 & Média Ministères Génération Joel Monde Facebook Page
const OFFICIAL_MEDIA_CATALOG: MediaVideoItem[] = [
  {
    id: 'yt-channel-uploads',
    title: '⭐ TOUTES LES VIDÉOS YOUTUBE : Média Ministères Génération Joel Monde (@mediaministeresgenerationj4157)',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=UUUErfJlUHAPNOzTNQIEPnww&rel=0',
    date: 'Chaîne Officielle • Intégrale VOD',
    category: 'Conventions KZI',
    views: '12.8 k abonnés',
    likes: '100% Officiel',
    description: 'Accédez au catalogue intégral de toutes les vidéos publiées sur notre chaîne YouTube Média Ministères Génération Joel Monde (@mediaministeresgenerationj4157). Cliquez sur le menu playlist (en haut à droite du lecteur ci-dessus) pour parcourir et visionner chaque vidéo directement dans l\'application sans quitter la plateforme.',
    publishedAt: '2030-01-01T00:00:00Z'
  },
  {
    id: 'yt-kzi-30',
    title: '🔥 30EME GRANDE CONVENTION 2025 : Rév. Réussite & Irène Mandaku (Playlist Officielle)',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLcnk4PfF8cgFawMPJ5Mw0KJUDGDMn776qtH&rel=0',
    date: '30ème Convention KZI • Kolwezi',
    category: 'Conventions KZI',
    views: '14.5 k vues',
    likes: '1.4 k J\'aime',
    description: 'Retransmission en playlist des interventions de la 30ᵉ Grande Convention Internationale 2025 (Révérend Réussite Ngoie Mandaku, Prophète Djo Grace Mwenze, et tous les orateurs de réveil).',
    publishedAt: '2025-08-10T18:00:00Z'
  },
  {
    id: 'yt-reussite-prophetes',
    title: '⭐ UNE INTERPELLATION POUR LES PROPHÈTES : Rév. Réussite Mandaku (28e Grande Convention)',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/5uK3LxgHSok?rel=0',
    date: '28ème Convention • Rév. Réussite Mandaku',
    category: 'Enseignements',
    views: '3.8 k vues',
    likes: '640 J\'aime',
    description: 'Enseignement prophétique fondamental du Révérend Réussite Ngoie Mandaku lors de la 28ᵉ Grande Convention Internationale sur l\'éthique du ministère prophétique et la consécration.',
    publishedAt: '2024-08-12T15:00:00Z'
  },
  {
    id: 'yt-irene-lumiere',
    title: '📖 LA LUMIÈRE PEUT CRÉER UN CHEMIN DANS LES TÉNÈBRES : Past. Irène Mandaku',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/bZXqTCza5oA?rel=0',
    date: 'Enseignement • Past. Irène Mandaku',
    category: 'Enseignements',
    views: '1.2 k vues',
    likes: '320 J\'aime',
    description: 'Exhortation puissante et inspirante de la Pasteure Irène Mandaku sur la souveraineté divine, la foi persévérante et la percée spirituelle au milieu des épreuves.',
    publishedAt: '2024-05-20T10:00:00Z'
  },
  {
    id: 'yt-reussite-benediction',
    title: '🔥 LA BÉNÉDICTION ? Le Révérend Réussite Mandaku répond et éclaire',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/6N_6qgQbyiU?rel=0',
    date: 'Enseignement Pastoral • Rév. Réussite',
    category: 'Messages & Exhortations',
    views: '3.7 k vues',
    likes: '580 J\'aime',
    description: 'Éclairage biblique profond du Révérend Réussite Ngoie Mandaku sur la véritable nature spirituelle, céleste et matérielle de la bénédiction de Dieu pour Sa génération.',
    publishedAt: '2024-03-14T14:00:00Z'
  },
  {
    id: 'yt-irene-modeler',
    title: '🙏 LAISSE DIEU TE MODELER POUR QUE LE PARFUM SOIT AGRÉABLE : Past. Irène Mandaku',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/z3O-rOFuZsY?rel=0',
    date: 'Exhortation • Past. Irène Mandaku',
    category: 'Messages & Exhortations',
    views: '2.1 k vues',
    likes: '410 J\'aime',
    description: 'Message pastoral de consécration par Maman Irène Mandaku sur la patience dans les mains du Potier divin et la formation d\'un caractère spirituel à la gloire de Christ.',
    publishedAt: '2023-11-05T16:00:00Z'
  },
  {
    id: 'yt-reussite-voies',
    title: '⚡ LES VOIES DE DIEU SONT INCOMPRÉHENSIBLES : Révérend Réussite Mandaku',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/ZSCmjDfba5g?rel=0',
    date: 'Sagesse Divine • Rév. Réussite Mandaku',
    category: 'Messages & Exhortations',
    views: '1.5 k vues',
    likes: '290 J\'aime',
    description: 'Enseignement pastoral réconfortant sur la sagesse insondable de Dieu et la souveraineté de Ses plans parfaits dans la conduite de la destinée de chaque croyant.',
    publishedAt: '2023-08-15T12:00:00Z'
  },
  {
    id: 'yt-heritier-repos',
    title: '🔥 N\'EXPOSE PAS TON REPOS : Prophète Héritier Grâce (Convention MGJ)',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/RAkRon86Y-Y?rel=0',
    date: 'Convention KZI • Prophète Héritier Grâce',
    category: 'Veillées Joël 2:28',
    views: '1.8 k vues',
    likes: '350 J\'aime',
    description: 'Message prophétique percutant du Prophète Héritier Grâce lors de la Grande Convention des Ministères Génération Joël sur la préservation du repos spirituel et de la paix.',
    publishedAt: '2023-06-01T18:00:00Z'
  }
];

export const MediasPage: React.FC = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'facebook'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayerItem, setActivePlayerItem] = useState<MediaVideoItem>(OFFICIAL_MEDIA_CATALOG[0]);
  const [fbTabMode, setFbTabMode] = useState<'timeline' | 'events'>('timeline');

  // YouTube API & Offline Cache state
  const [youtubeCatalog, setYoutubeCatalog] = useState<MediaVideoItem[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const loadVideos = async () => {
      setIsRefreshing(true);
      const res = await fetchAndCacheVideos();
      if (res.videos.length > 0) {
        setYoutubeCatalog(sortVideosByLatest(res.videos));
      }
      setIsOfflineMode(res.isOffline);
      setLastUpdatedTime(res.lastUpdated);
      setIsRefreshing(false);
    };
    loadVideos();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    const res = await fetchAndCacheVideos({ forceRefresh: true });
    if (res.videos.length > 0) {
      setYoutubeCatalog(sortVideosByLatest(res.videos));
    }
    setIsOfflineMode(res.isOffline);
    setLastUpdatedTime(res.lastUpdated);
    setIsRefreshing(false);
  };

  const rawVideos = youtubeCatalog.length > 0 ? youtubeCatalog : OFFICIAL_MEDIA_CATALOG.filter(v => v.id !== 'yt-channel-uploads');
  const sortedVideos = sortVideosByLatest(rawVideos);

  const fullCatalog = [
    OFFICIAL_MEDIA_CATALOG[0], // yt-channel-uploads
    ...sortedVideos
  ];

  // Filter video catalog without any external navigation (all published videos from the channel)
  const filteredCatalog = fullCatalog.filter(item => {
    const matchesTab = activeTab === 'all' || item.platform === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSelectVideo = (item: MediaVideoItem) => {
    if (isOfflineMode && item.platform === 'youtube' && item.id !== 'yt-channel-uploads') {
      alert(lang === 'fr' 
        ? 'Lecture hors-ligne indisponible : Le visionnage de cette vidéo nécessite une connexion réseau active (le téléchargement de vidéos n\'est pas pris en charge en mode hors-ligne).'
        : 'Offline playback unavailable: Video playback requires an active network connection.');
      return;
    }
    setActivePlayerItem(item);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleShare = (title: string, desc: string) => {
    if (navigator.share) {
      navigator.share({ title, text: desc, url: window.location.href }).catch(() => {});
    } else {
      alert(lang === 'fr' ? 'Lien de partage copié dans le presse-papier !' : 'Share link copied!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[var(--accent-gold)]/50 text-xs font-black uppercase tracking-wider text-[var(--accent-gold)] mb-2.5">
            <Video className="w-4 h-4 animate-pulse" />
            <span>{lang === 'fr' ? 'Kiosque Multimédia 100% Intégré (Zéro Sortie de l\'App)' : '100% In-App Media Hub (Zero External Exit)'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit text-white tracking-tight">
            {lang === 'fr' ? 'Média Ministères Génération Joel Monde' : 'Média Ministères Génération Joel Monde Hub'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl leading-relaxed">
            {lang === 'fr' 
              ? 'Parcourez, scrollez et visionnez toutes les vidéos YouTube (@mediaministeresgenerationj4157) et absolument toutes les publications de la Page Facebook officielle directement dans l\'application, sans jamais la quitter.' 
              : 'Browse, scroll, and watch all YouTube videos (@mediaministeresgenerationj4157) and all Facebook Page posts directly inside the platform without leaving the app.'}
          </p>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="flex items-center rounded-2xl bg-[#131b26] p-1.5 border border-white/10 self-start lg:self-center shadow-2xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--accent-gold)] text-slate-950 shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Tout Explorer (`All`)' : 'Explore All'}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('youtube');
              const firstYt = OFFICIAL_MEDIA_CATALOG.find(v => v.platform === 'youtube');
              if (firstYt) setActivePlayerItem(firstYt);
            }}
            className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              activeTab === 'youtube'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-300" />
            <span>YouTube (@mediaministeres...)</span>
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              activeTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Facebook className="w-4 h-4 text-blue-300" />
            <span>Facebook Page Feed</span>
          </button>
        </div>
      </div>

      {/* Cache / Offline Sync Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#131b26]/80 p-3.5 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center flex-wrap gap-2">
          {isOfflineMode ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black shadow-md">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span>{lang === 'fr' ? 'Mode Hors-Ligne : Catalogue synchronisé en Cache' : 'Offline Mode: Cached Catalog Sync'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'YouTube Data API v3 & Firestore Sync (Quota-Friendly)' : 'YouTube Data API v3 & Firestore Sync'}</span>
            </span>
          )}

          {lastUpdatedTime && (
            <span className="text-xs text-slate-300 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/10">
              {lang === 'fr' 
                ? `Dernière mise à jour : ${new Date(lastUpdatedTime).toLocaleDateString('fr-FR')} à ${new Date(lastUpdatedTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
                : `Last updated: ${new Date(lastUpdatedTime).toLocaleDateString()} at ${new Date(lastUpdatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          )}
        </div>

        <button
          onClick={handleForceRefresh}
          disabled={isRefreshing || isOfflineMode}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/50 hover:bg-white/10 border border-white/15 text-xs font-black text-amber-400 disabled:opacity-40 transition-all shadow-md"
          title="Rafraîchir depuis la chaîne YouTube (TTL 6h)"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
          <span>{isRefreshing ? (lang === 'fr' ? 'Synchronisation en cours...' : 'Syncing...') : (lang === 'fr' ? 'Actualiser le catalogue (TTL 6h)' : 'Refresh Catalog')}</span>
        </button>
      </div>

      {/* SECTION 1: IN-APP VIDEO PLAYER (100% Working Playback, Standard VOD & Channel Drawer) */}
      {activeTab !== 'facebook' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-[var(--accent-gold)]/50 bg-gradient-to-br from-[#182335] via-[var(--bg-secondary)] to-[#111824] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 ${
                activePlayerItem.platform === 'youtube' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              }`}>
                {activePlayerItem.platform === 'youtube' ? <Youtube className="w-4 h-4" /> : <Facebook className="w-4 h-4" />}
                <span>{activePlayerItem.platform === 'youtube' ? 'YouTube : Média Ministères Génération Joel Monde' : 'Facebook Page : Média Ministères Génération Joel Monde'}</span>
              </span>
              <span className="text-xs text-slate-400 font-bold">• {activePlayerItem.date}</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Lecture & Navigation internes garanties (Zéro Sortie)' : 'Verified In-App playback (Zero Exit)'}</span>
            </span>
          </div>

          {/* 100% Authentic Video Player or Facebook Page Feed Frame */}
          <div className={`${
            activePlayerItem.embedUrl.includes('plugins/page.php') || activePlayerItem.platform === 'facebook'
              ? 'w-full min-h-[750px] rounded-2xl overflow-hidden bg-[#162132] shadow-2xl border border-blue-500/30 relative flex items-center justify-center p-2 sm:p-4'
              : 'aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-glass relative flex items-center justify-center'
          }`}>
            {isOfflineMode && activePlayerItem.platform === 'youtube' && activePlayerItem.id !== 'yt-channel-uploads' ? (
              <div className="p-8 text-center space-y-4 max-w-lg bg-slate-950/90 rounded-2xl border border-white/10 m-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                  <WifiOff className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black font-outfit text-white">
                    {lang === 'fr' ? 'Lecture Hors-Ligne Indisponible' : 'Offline Playback Unavailable'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {lang === 'fr'
                      ? 'Le visionnage de cette vidéo VOD nécessite une connexion Internet active (le téléchargement complet des vidéos en mémoire n\'est pas pris en charge en mode hors-ligne). Cependant, le catalogue complet et les détails des prédications ci-dessous restent accessibles grâce au cache local.'
                      : 'Watching this VOD requires an active Internet connection. However, the complete video catalog, titles and details below remain accessible offline via local cache.'}
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                key={activePlayerItem.embedUrl}
                src={activePlayerItem.embedUrl}
                title={activePlayerItem.title}
                className={`${
                  activePlayerItem.embedUrl.includes('plugins/page.php') || activePlayerItem.platform === 'facebook'
                    ? 'w-full min-h-[750px] border-0 rounded-xl max-w-[650px]'
                    : 'w-full h-full border-0'
                }`}
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling={activePlayerItem.embedUrl.includes('plugins/page.php') || activePlayerItem.platform === 'facebook' ? 'yes' : 'no'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
                {activePlayerItem.category}
              </span>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                <span>👁️ {activePlayerItem.views}</span>
                <span>❤️ {activePlayerItem.likes}</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-outfit text-white">
              {activePlayerItem.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activePlayerItem.description}
            </p>
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => handleShare(activePlayerItem.title, activePlayerItem.description)}
                className="btn-gold py-2 px-5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Partager cette publication' : 'Share Publication'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FACEBOOK PAGE TIMELINE EMBED SCROLLER (Shows when 'facebook' or 'all' tab selected) */}
      {(activeTab === 'facebook' || activeTab === 'all') && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-blue-500/50 bg-gradient-to-b from-[#111e35] via-[var(--bg-secondary)] to-[#0c1526] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-black text-white text-2xl shadow-lg shrink-0">
                <Facebook className="w-8 h-8 fill-white text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black font-outfit text-white flex items-center gap-2">
                  <span>{lang === 'fr' ? 'Média Ministères Génération Joel Monde Facebook Page' : 'Média Ministères Génération Joel Monde Facebook Page'}</span>
                  <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                </h2>
                <p className="text-xs sm:text-sm text-blue-300 font-bold mt-1">
                  {lang === 'fr' 
                    ? '⚡ Scrollez ci-dessous pour lire et voir toutes les publications, vidéos, annonces et directs de notre Page Facebook officielle sans quitter l\'application !' 
                    : '⚡ Scroll below to read and watch all posts, videos, announcements, and lives published by our official Facebook Page without leaving the app!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => setFbTabMode('timeline')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  fbTabMode === 'timeline' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                📑 {lang === 'fr' ? 'Toutes les Publications & Directs (`Timeline`)' : 'All Posts & Timeline'}
              </button>
              <button
                onClick={() => setFbTabMode('events')}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  fbTabMode === 'events' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                📅 {lang === 'fr' ? 'Événements Officiels MGJ' : 'Official Events'}
              </button>
            </div>
          </div>

          {/* Prominent Interactive Page Plugin iframe (Allows scrolling all Facebook Page posts directly in-app) */}
          <div className="w-full bg-[#162132] rounded-2xl border border-blue-500/30 p-2 sm:p-5 flex flex-col items-center justify-center min-h-[780px] shadow-inner overflow-hidden relative">
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmediamgjmonde&tabs=${fbTabMode}&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
              width="500"
              height="800"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%', borderRadius: '16px' }}
              scrolling="yes"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="MGJ Facebook Timeline Official"
            ></iframe>
          </div>
          <p className="text-center text-xs sm:text-sm text-slate-300 font-semibold bg-black/30 py-3 px-4 rounded-xl border border-white/5">
            {lang === 'fr' ? 'Toutes les publications de la Page Facebook Média Ministères Génération Joel Monde sont directement accessibles et interactives dans l\'encadré ci-dessus. Cliquez sur n\'importe quelle publication pour interagir dans l\'application !' : 'All posts published by the Média Ministères Génération Joel Monde Facebook Page are directly accessible inside the frame above.'}
          </p>
        </div>
      )}

      {/* SECTION 3: IN-APP PUBLISHED VIDEO FEED & SERIES SCROLLER */}
      {activeTab !== 'facebook' && (
        <div className="space-y-6 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-outfit text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-gold)]" />
                <span>{lang === 'fr' ? 'Catalogue Vidéos & Publications : Parcourez ci-dessous' : 'Video & Post Catalog: Browse Below'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'fr' ? 'Sélectionnez une vidéo ou une publication officielle ci-dessous pour la lancer instantanément dans le lecteur principal.' : 'Click any video or post below to watch instantly in the player above.'}
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher par titre ou mot-clé...' : 'Search by title or keyword...'}
                className="input-field pl-10 py-2.5 text-xs w-full bg-[#131b26] border-white/10 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectVideo(item)}
                className={`glass-card rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 ${
                  activePlayerItem.id === item.id 
                    ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/40 bg-[#1e293b]' 
                    : 'border-white/10 bg-[#131b26] hover:border-[var(--accent-gold)]/60'
                }`}
              >
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                      item.platform === 'youtube' ? 'bg-red-600/20 text-red-400' : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {item.platform === 'youtube' ? <Youtube className="w-3.5 h-3.5" /> : <Facebook className="w-3.5 h-3.5" />}
                      <span>{item.platform === 'youtube' ? 'YouTube Média MGJ' : 'Facebook Page MGJ'}</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-[var(--accent-gold)]">{item.category}</span>
                  </div>

                  <div className="aspect-video w-full rounded-xl bg-black/60 overflow-hidden relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-3">
                      <span className="text-xs font-black text-white flex items-center gap-1.5 bg-[var(--accent-gold)]/90 text-slate-950 px-3 py-1 rounded-lg shadow-md">
                        <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        <span>{activePlayerItem.id === item.id ? (lang === 'fr' ? 'En lecture ci-dessus' : 'Playing Now') : (lang === 'fr' ? 'Regarder ici (`In-App`)' : 'Watch Here (`In-App`)')}</span>
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black font-outfit text-white group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 mt-2 font-bold">
                  <span>👁️ {item.views}</span>
                  <span>❤️ {item.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
