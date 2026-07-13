import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { 
  Radio, 
  Sparkles, 
  Flame, 
  Calendar, 
  Plus, 
  Send, 
  Trash2, 
  Pin, 
  Heart, 
  Share2, 
  Image as ImageIcon, 
  Video, 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  Search,
  Filter,
  X,
  Play,
  Maximize2,
  BellRing,
  MessageSquare,
  ThumbsUp,
  Globe,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';

interface AnnouncementsPageProps {
  setActivePage?: (page: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ setActivePage }) => {
  const { lang, t } = useLanguage();
  const { user, canAccessAdmin } = useAuth();
  const { 
    announcements, 
    notifications, 
    createAnnouncement, 
    deleteAnnouncement, 
    togglePinAnnouncement, 
    likeAnnouncement,
    commentAnnouncement,
    shareAnnouncementCount,
    likeComment
  } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAdminPublishOpen, setIsAdminPublishOpen] = useState(false);
  const [highlightedTargetId, setHighlightedTargetId] = useState<string | null>(null);
  const [targetNotification, setTargetNotification] = useState<any | null>(null);
  
  // Facebook Feed interactive comment drawer states
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const targetId = localStorage.getItem('mgj_target_item_id') || localStorage.getItem('mgj_target_announcement_id');
    const notifId = localStorage.getItem('mgj_target_notification_id');

    if (notifId && notifications) {
      const foundNotif = notifications.find(n => n.id === notifId);
      if (foundNotif) {
        setTargetNotification(foundNotif);
      }
    }

    if (targetId) {
      setHighlightedTargetId(targetId);
      setTimeout(() => {
        const elem = document.getElementById(`announcement-${targetId}`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [announcements, notifications]);

  // Form states for Admin publishing
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [category, setCategory] = useState<'prophetic' | 'event' | 'general' | 'urgent'>('prophetic');
  const [pinned, setPinned] = useState(true);
  
  // Media states
  const [mediaSourceType, setMediaSourceType] = useState<'file' | 'url'>('file');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaDataUrl, setMediaDataUrl] = useState<string>('');
  const [mediaTypeDetected, setMediaTypeDetected] = useState<'image' | 'video' | 'none'>('none');
  const [isUploading, setIsUploading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  // Handle local image/video file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const isVideo = file.type.startsWith('video/');
    setMediaTypeDetected(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaDataUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Convert youtube URL to embed url if needed
  const getEmbedOrCleanUrl = (url: string): { url: string; isYoutube: boolean } => {
    if (!url) return { url: '', isYoutube: false };
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return { url: `https://www.youtube.com/embed/${videoId}`, isYoutube: true };
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return { url: `https://www.youtube.com/embed/${videoId}`, isYoutube: true };
    }
    if (url.includes('youtube.com/embed/')) {
      return { url, isYoutube: true };
    }
    return { url, isYoutube: false };
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFr || !contentFr) return;

    let finalMediaUrl = '';
    let finalMediaType: 'image' | 'video' | 'none' = 'none';

    if (mediaSourceType === 'file' && mediaDataUrl) {
      finalMediaUrl = mediaDataUrl;
      finalMediaType = mediaTypeDetected;
    } else if (mediaSourceType === 'url' && mediaUrlInput) {
      const processed = getEmbedOrCleanUrl(mediaUrlInput);
      finalMediaUrl = processed.url;
      finalMediaType = processed.isYoutube || mediaUrlInput.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image';
    }

    createAnnouncement({
      titleFr,
      titleEn: titleEn || titleFr,
      contentFr,
      contentEn: contentEn || contentFr,
      category,
      mediaUrl: finalMediaUrl || undefined,
      mediaType: finalMediaType,
      authorName: user?.fullName || 'Admin MGJ',
      authorRole: user?.ministryPosition ? `${user.ministryPosition} • Admin MGJ` : 'Administration & Secrétariat Général',
      pinned
    });

    // Reset form
    setTitleFr('');
    setTitleEn('');
    setContentFr('');
    setContentEn('');
    setMediaDataUrl('');
    setMediaUrlInput('');
    setMediaTypeDetected('none');
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsAdminPublishOpen(false);
    }, 2000);
  };

  const handleShareAnnouncement = (ann: any) => {
    shareAnnouncementCount(ann.id);
    const title = lang === 'fr' ? ann.titleFr : ann.titleEn;
    const content = lang === 'fr' ? ann.contentFr : ann.contentEn;
    if (navigator.share) {
      navigator.share({
        title,
        text: `${title}\n\n${content}\n\n— MGJ Monde`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(lang === 'fr' ? 'Annonce copiée pour partage ! (+1 au compteur de partages)' : 'Announcement copied to share! (+1 to share count)');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const matchesCategory = 
      filterCategory === 'all' ? true :
      filterCategory === 'pinned' ? a.pinned :
      a.category === filterCategory;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      a.titleFr.toLowerCase().includes(query) ||
      a.titleEn.toLowerCase().includes(query) ||
      a.contentFr.toLowerCase().includes(query) ||
      a.contentEn.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b2f0c] via-[var(--bg-secondary)] to-[#1e1435] p-6 sm:p-10 border border-[var(--accent-gold)]/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--accent-gold)]/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[var(--accent-gold)]/40 text-[11px] font-black uppercase tracking-widest text-[var(--accent-gold)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{lang === 'fr' ? 'Centre de Notifications & Révélations' : 'Notifications & Revelations Center'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
              {lang === 'fr' ? 'Annonces & Directives Prophétiques' : 'Prophetic Announcements & Directives'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'fr' 
                ? 'Restez connectés en temps réel avec le Révérend Réussite Ngoie Mandaku et la direction nationale MGJ. Veillées de feu, conventions KZI, et urgences prophétiques.'
                : 'Stay connected in real time with Rev. Réussite Ngoie Mandaku and the national MGJ leadership. Prayer vigils, KZI conventions, and prophetic directives.'}
            </p>
          </div>

          {canAccessAdmin && (
            <button
              onClick={() => setIsAdminPublishOpen(!isAdminPublishOpen)}
              className="btn-gold px-6 py-4 rounded-2xl shadow-2xl font-black text-sm flex items-center justify-center gap-2.5 shrink-0 hover:scale-105 transition-all self-start md:self-center"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>{isAdminPublishOpen ? (lang === 'fr' ? 'Fermer Panel' : 'Close Panel') : (lang === 'fr' ? 'Publier une Annonce' : 'Publish Announcement')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Quick Publish Drawer/Card right inside page */}
      {canAccessAdmin && isAdminPublishOpen && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-[var(--accent-gold)] shadow-2xl bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-card)] space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-glass pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black font-outfit text-[var(--text-primary)]">
                  {lang === 'fr' ? 'Diffusion Officielle vers Tous les Vases MGJ' : 'Official Broadcast to All MGJ Members'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {lang === 'fr' ? 'Le message et les médias joints seront envoyés instantanément à tous les connectés.' : 'Message and attached media will be pushed instantly to all connected users.'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsAdminPublishOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {publishSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-white">{lang === 'fr' ? 'Annonce Publiée avec Succès !' : 'Announcement Published Successfully!'}</h4>
              <p className="text-sm text-emerald-300 font-medium">
                {lang === 'fr' ? 'Votre annonce est désormais visible par tous les membres et une notification push a été générée.' : 'Your announcement is now live across all member feeds.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePublishSubmit} className="space-y-6">
              
              {/* Category selector */}
              <div>
                <label className="block text-xs font-black uppercase text-[var(--text-secondary)] mb-2">
                  {lang === 'fr' ? 'Catégorie Prophétique' : 'Prophetic Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCategory('prophetic')}
                    className={`p-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all ${category === 'prophetic' ? 'bg-red-600 text-white border-red-500 shadow-lg scale-105' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>🔥 Prophétique / Feu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('event')}
                    className={`p-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all ${category === 'event' ? 'bg-[var(--accent-gold)] text-slate-950 border-amber-400 shadow-lg scale-105' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>⭐ Convention KZI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('urgent')}
                    className={`p-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all ${category === 'urgent' ? 'bg-amber-600 text-white border-amber-500 shadow-lg scale-105' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    <Radio className="w-4 h-4 animate-ping" />
                    <span>🔴 Alerte Direct</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('general')}
                    className={`p-3 rounded-xl text-xs font-black border flex items-center justify-center gap-2 transition-all ${category === 'general' ? 'bg-[var(--accent-olive)] text-white border-emerald-500 shadow-lg scale-105' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>📢 Annonce Générale</span>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">
                    {lang === 'fr' ? 'Titre Principal (Français) *' : 'Title (French) *'}
                  </label>
                  <input
                    type="text"
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    placeholder="Ex: VEILLÉE DE PRIÈIRE & ONCTION : Joël 2:28"
                    className="input-field py-3 text-sm font-bold w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">
                    {lang === 'fr' ? 'Titre (Anglais - Optionnel)' : 'Title (English) *'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Ex: PRAYER VIGIL & ANOINTING: Joel 2:28"
                    className="input-field py-3 text-sm font-bold w-full"
                  />
                </div>
              </div>

              {/* Body Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">
                    {lang === 'fr' ? 'Message / Directive (Français) *' : 'Message Content (French) *'}
                  </label>
                  <textarea
                    rows={4}
                    value={contentFr}
                    onChange={(e) => setContentFr(e.target.value)}
                    placeholder="Écrivez ici l'orientation pastorale complète, l'heure du direct, ou les détails de la convention..."
                    className="input-field py-3 text-sm w-full resize-none leading-relaxed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">
                    {lang === 'fr' ? 'Message (Anglais - Optionnel)' : 'Message Content (English)'}
                  </label>
                  <textarea
                    rows={4}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="English translation of the directive..."
                    className="input-field py-3 text-sm w-full resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Support Media Upload / URL Section */}
              <div className="p-5 rounded-2xl bg-[var(--bg-primary)]/70 border border-glass space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Joindre Image ou Vidéo d\'Appui' : 'Attach Support Image or Video'}</span>
                  </h4>
                  <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-glass">
                    <button
                      type="button"
                      onClick={() => setMediaSourceType('file')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${mediaSourceType === 'file' ? 'bg-[var(--accent-gold)] text-slate-950' : 'text-[var(--text-secondary)]'}`}
                    >
                      📁 {lang === 'fr' ? 'Télécharger Fichier' : 'Upload File'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaSourceType('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${mediaSourceType === 'url' ? 'bg-[var(--accent-gold)] text-slate-950' : 'text-[var(--text-secondary)]'}`}
                    >
                      🔗 {lang === 'fr' ? 'Lien YouTube / Web' : 'Web / YouTube URL'}
                    </button>
                  </div>
                </div>

                {mediaSourceType === 'file' ? (
                  <div className="border-2 border-dashed border-[var(--accent-gold)]/40 rounded-2xl p-6 text-center bg-black/20 hover:border-[var(--accent-gold)] transition-colors relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center mx-auto">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        {mediaDataUrl 
                          ? (lang === 'fr' ? '✅ Fichier média prêt pour diffusion' : '✅ Media file ready for broadcast')
                          : (lang === 'fr' ? 'Cliquez ou glissez une Image (Affiche) ou une Vidéo (Clip MP4)' : 'Click or drop an Image (Poster) or Video (MP4 Clip)')}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Support : JPG, PNG, WEBP, MP4, WEBM
                      </span>
                    </div>

                    {mediaDataUrl && (
                      <div className="mt-4 pt-4 border-t border-glass flex items-center justify-center gap-4">
                        {mediaTypeDetected === 'image' ? (
                          <img src={mediaDataUrl} alt="Preview" className="h-28 rounded-xl object-cover border border-glass shadow-md" />
                        ) : (
                          <video src={mediaDataUrl} controls className="h-28 rounded-xl max-w-xs border border-glass" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMediaDataUrl(''); setMediaTypeDetected('none'); }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500 hover:text-white transition-colors"
                        >
                          Supprimer le média
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={mediaUrlInput}
                      onChange={(e) => setMediaUrlInput(e.target.value)}
                      placeholder="Ex: https://www.youtube.com/watch?v=... ou URL directe d'image"
                      className="input-field py-3 text-xs w-full font-mono"
                    />
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      {lang === 'fr' ? 'Astuce : Les liens YouTube sont automatiquement convertis en lecteur vidéo haute définition.' : 'Tip: YouTube links are automatically converted into HD video players.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Pin option */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-glass">
                <div className="flex items-center gap-2.5">
                  <Pin className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {lang === 'fr' ? 'Épingler au sommet du fil d\'actualité prophétique' : 'Pin to top of prophetic feed'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-5 h-5 rounded accent-[var(--accent-gold)] cursor-pointer"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="btn-gold w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              >
                <Send className="w-5 h-5" />
                <span>{isUploading ? 'Téléchargement...' : (lang === 'fr' ? 'Diffuser et Pousser l\'Annonce à Tous' : 'Broadcast and Push Announcement to All')}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher une annonce, un mot de prophétie, un verset...' : 'Search an announcement, prophecy, or verse...'}
            className="input-field pl-11 py-3 text-xs sm:text-sm w-full rounded-2xl"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${filterCategory === 'all' ? 'bg-[var(--accent-gold)] text-slate-950 shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white border border-glass'}`}
          >
            {lang === 'fr' ? 'Toutes (' + announcements.length + ')' : 'All (' + announcements.length + ')'}
          </button>
          <button
            onClick={() => setFilterCategory('pinned')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${filterCategory === 'pinned' ? 'bg-[var(--accent-gold)] text-slate-950 shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white border border-glass'}`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? '📌 Épinglées' : '📌 Pinned'}</span>
          </button>
          <button
            onClick={() => setFilterCategory('prophetic')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${filterCategory === 'prophetic' ? 'bg-red-600 text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white border border-glass'}`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'fr' ? '🔥 Prophétique' : '🔥 Prophetic'}</span>
          </button>
          <button
            onClick={() => setFilterCategory('event')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${filterCategory === 'event' ? 'bg-amber-600 text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white border border-glass'}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? '⭐ KZI 2026' : '⭐ KZI 2026'}</span>
          </button>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-6">
        
        {/* If user clicked a Notification title on Dashboard, display it prominently here! */}
        {targetNotification && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 ring-4 ring-emerald-500/50 shadow-2xl relative overflow-hidden bg-gradient-to-br from-emerald-950/60 via-[var(--bg-secondary)] to-[var(--bg-tertiary)] animate-slide-down">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shadow-lg">
                  <BellRing className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                    <span>🔔 Notification Officielle (Sélectionnée)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-outfit text-white mt-1">
                    {lang === 'fr' ? targetNotification.titleFr : targetNotification.titleEn}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setTargetNotification(null);
                  localStorage.removeItem('mgj_target_notification_id');
                  localStorage.removeItem('mgj_target_item_id');
                }}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/70 text-slate-400 hover:text-white transition-colors"
                title="Fermer cette notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed border-t border-white/10 pt-4">
              {lang === 'fr' ? targetNotification.messageFr : targetNotification.messageEn}
            </p>
          </div>
        )}

        {filteredAnnouncements.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Aucune annonce trouvée' : 'No announcements found'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              {lang === 'fr' ? 'Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.' : 'Try adjusting your search query or picking a different category tab.'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-slate-950 font-bold text-xs"
            >
              {lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </button>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isVideoUrl = ann.mediaType === 'video' || (ann.mediaUrl && (ann.mediaUrl.includes('youtube.com') || ann.mediaUrl.includes('youtu.be')));
            const youtubeProcessed = ann.mediaUrl ? (
              ann.mediaUrl.includes('youtube.com/watch?v=') ? `https://www.youtube.com/embed/${ann.mediaUrl.split('v=')[1]?.split('&')[0]}` :
              ann.mediaUrl.includes('youtu.be/') ? `https://www.youtube.com/embed/${ann.mediaUrl.split('youtu.be/')[1]?.split('?')[0]}` :
              ann.mediaUrl
            ) : '';

            const isTargeted = highlightedTargetId === ann.id;

            const totalCommentsCount = ann.comments?.length || 0;
            const totalLikesCount = (ann.likesCount || 0) + (ann.comments?.reduce((acc, c) => acc + (c.likes || 0), 0) || 0);
            const totalSharesCount = ann.sharesCount || 0;
            const isOpenComment = openCommentPostId === ann.id || totalCommentsCount > 0;

            return (
              <div
                key={ann.id}
                id={`announcement-${ann.id}`}
                className={`rounded-3xl border-2 transition-all duration-300 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#182334]/95 via-[var(--bg-secondary)]/98 to-[#111926]/98 ${
                  isTargeted
                    ? 'border-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/60 shadow-[0_0_40px_rgba(245,158,11,0.5)] scale-[1.01]'
                    : ann.pinned 
                    ? 'border-[var(--accent-gold)]/70 shadow-[var(--accent-gold)]/15' 
                    : 'border-white/10 hover:border-[var(--accent-gold)]/40'
                }`}
              >
                {ann.pinned && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-[var(--accent-gold)] text-slate-950 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg z-20">
                    <Pin className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{lang === 'fr' ? 'Directive Épinglée' : 'Pinned Directive'}</span>
                  </div>
                )}

                {/* Facebook Feed Card Header */}
                <div className="p-5 sm:p-7 pb-3">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      {/* Circular Profile Avatar */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[var(--accent-gold)] via-amber-500 to-amber-700 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg ring-2 ring-[var(--accent-gold)]/60 shrink-0 relative">
                        {ann.authorName ? ann.authorName[0].toUpperCase() : 'R'}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow ring-2 ring-slate-900" title="Compte Officiel Vérifié">
                          <CheckCircle className="w-3.5 h-3.5 fill-blue-500 stroke-white stroke-[2.5]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center flex-wrap gap-1.5">
                          <h4 className="font-black font-outfit text-base sm:text-lg text-white tracking-tight hover:underline cursor-pointer">
                            {ann.authorName || 'Admin MGJ'}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider">
                            <span>Officiel MGJ</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                          <span>{ann.authorRole || 'Administration & Secrétariat Général'}</span>
                          <span>•</span>
                          <span>{new Date(ann.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span title="Publication Publique" className="inline-flex items-center">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 z-10">
                      {canAccessAdmin ? (
                        <>
                          <button
                            onClick={() => togglePinAnnouncement(ann.id)}
                            title="Épingler/Désépingler"
                            className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 transition-colors"
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAnnouncement(ann.id)}
                            title="Supprimer l'annonce"
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors" title="Options de la publication">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Pill inside card */}
                  <div className="mb-3">
                    {ann.category === 'prophetic' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-extrabold shadow-sm">
                        <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                        <span>{lang === 'fr' ? 'Révélation Prophétique • Joël 2:28' : 'Prophetic Revelation • Joel 2:28'}</span>
                      </span>
                    )}
                    {ann.category === 'event' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{lang === 'fr' ? 'Événement Officiel KZI 2026' : 'Official KZI 2026 Event'}</span>
                      </span>
                    )}
                    {ann.category === 'urgent' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-extrabold shadow-sm">
                        <Radio className="w-3.5 h-3.5 animate-ping text-red-400" />
                        <span>{lang === 'fr' ? 'Alerte Direct & Intercession' : 'Live Broadcast Alert'}</span>
                      </span>
                    )}
                  </div>

                  {/* Post Title & Body */}
                  <h3 className="text-xl sm:text-2xl font-black font-outfit text-white mb-2 leading-snug">
                    {lang === 'fr' ? ann.titleFr : ann.titleEn}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-wrap mb-4">
                    {lang === 'fr' ? ann.contentFr : ann.contentEn}
                  </p>
                </div>

                {/* Facebook-Style Full-Bleed Media Attachment */}
                {ann.mediaUrl && (
                  <div className="mx-5 sm:mx-7 mb-4 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl relative group">
                    {isVideoUrl || ann.mediaType === 'video' ? (
                      youtubeProcessed && youtubeProcessed.includes('youtube.com/embed') ? (
                        <div className="relative w-full pb-[56.25%]">
                          <iframe
                            src={youtubeProcessed}
                            title="Annonce Video MGJ"
                            className="absolute top-0 left-0 w-full h-full rounded-2xl border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <video
                          src={ann.mediaUrl}
                          controls
                          className="w-full rounded-2xl max-h-[500px] bg-black object-contain"
                        />
                      )
                    ) : (
                      <div className="relative cursor-pointer" onClick={() => setSelectedImageModal(ann.mediaUrl || null)}>
                        <img
                          src={ann.mediaUrl}
                          alt={ann.titleFr}
                          className="w-full max-h-[520px] object-cover rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/20 shadow-xl">
                            <Maximize2 className="w-4 h-4 text-[var(--accent-gold)]" />
                            <span>{lang === 'fr' ? 'Agrandir l\'image' : 'Expand Image'}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Facebook Reactions & Stats Bar */}
                <div className="px-5 sm:px-7">
                  <div className="flex items-center justify-between py-2 text-xs text-slate-400 font-semibold border-b border-white/10">
                    <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => likeAnnouncement(ann.id)}>
                      {/* Reaction Bubbles */}
                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-xs shadow ring-2 ring-slate-900">
                          👍
                        </span>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-red-400 text-white text-xs shadow ring-2 ring-slate-900">
                          ❤️
                        </span>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-[var(--accent-gold)] text-slate-950 text-xs shadow ring-2 ring-slate-900">
                          🙏
                        </span>
                      </div>
                      <span className="text-slate-300 font-bold">{totalLikesCount}</span>
                      <span className="hidden sm:inline">{lang === 'fr' ? 'J\'aime et Amen' : 'Likes and Amen'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setOpenCommentPostId(openCommentPostId === ann.id ? null : ann.id)}
                        className="hover:underline hover:text-white transition-colors"
                      >
                        <span>{totalCommentsCount}</span> {lang === 'fr' ? (totalCommentsCount <= 1 ? 'commentaire' : 'commentaires') : (totalCommentsCount === 1 ? 'comment' : 'comments')}
                      </button>
                      <button 
                        onClick={() => handleShareAnnouncement(ann)}
                        className="hover:underline hover:text-white transition-colors"
                      >
                        <span>{totalSharesCount}</span> {lang === 'fr' ? (totalSharesCount <= 1 ? 'partage' : 'partages') : (totalSharesCount === 1 ? 'share' : 'shares')}
                      </button>
                    </div>
                  </div>

                  {/* Facebook 3-Button Action Bar (Like, Comment, Share) */}
                  <div className="grid grid-cols-3 gap-1 py-1.5 my-1 border-b border-white/10">
                    
                    {/* 1. Like / Amen Button */}
                    <button
                      onClick={() => likeAnnouncement(ann.id)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-300 hover:text-[var(--accent-gold)] font-bold text-xs sm:text-sm transition-all group"
                    >
                      <ThumbsUp className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 group-hover:scale-110 transition-transform stroke-[2.5]" />
                      <span>{lang === 'fr' ? 'J\'aime' : 'Like'}</span>
                    </button>

                    {/* 2. Comment Button */}
                    <button
                      onClick={() => setOpenCommentPostId(openCommentPostId === ann.id ? null : ann.id)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white/10 active:scale-95 font-bold text-xs sm:text-sm transition-all ${
                        openCommentPostId === ann.id ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-emerald-400'
                      }`}
                    >
                      <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 stroke-[2.5]" />
                      <span>{lang === 'fr' ? 'Commenter' : 'Comment'}</span>
                    </button>

                    {/* 3. Share Button */}
                    <button
                      onClick={() => handleShareAnnouncement(ann)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-300 hover:text-blue-400 font-bold text-xs sm:text-sm transition-all group"
                    >
                      <Share2 className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-12 transition-transform stroke-[2.5]" />
                      <span>{lang === 'fr' ? 'Partager' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Facebook Comment Section (Comments List & Submission Bar) */}
                {isOpenComment && (
                  <div className="bg-black/40 px-5 sm:px-7 py-5 space-y-4 border-t border-white/5 animate-fade-in">
                    
                    {/* List of real comments */}
                    {ann.comments && ann.comments.length > 0 ? (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {ann.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-3 group/item">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 text-white font-black text-xs flex items-center justify-center shrink-0 shadow mt-0.5">
                              {comment.authorAvatar || 'F'}
                            </div>
                            <div className="flex-1">
                              <div className="bg-[#1e2a3d]/90 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-md">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-extrabold text-xs sm:text-sm text-amber-300">
                                    {comment.authorName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {new Date(comment.createdAt).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-100 mt-1 leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>

                              {/* Comment sub-actions (Like, Reply, Timestamp) */}
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 px-3 mt-1">
                                <button
                                  onClick={() => likeComment(ann.id, comment.id)}
                                  className="hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1"
                                >
                                  <span>{lang === 'fr' ? 'J\'aime' : 'Like'}</span>
                                  {comment.likes && comment.likes > 0 ? (
                                    <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-[10px]">
                                      {comment.likes}
                                    </span>
                                  ) : null}
                                </button>
                                <button 
                                  onClick={() => {
                                    setCommentInputs(prev => ({ ...prev, [ann.id]: `@${comment.authorName} ` }));
                                  }}
                                  className="hover:text-white transition-colors"
                                >
                                  {lang === 'fr' ? 'Répondre' : 'Reply'}
                                </button>
                                <span className="text-slate-500 font-normal">
                                  {new Date(comment.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-2">
                        {lang === 'fr' ? 'Aucun commentaire pour le moment. Soyez le premier à commenter et bénir cette publication !' : 'No comments yet. Be the first to comment and bless this post!'}
                      </p>
                    )}

                    {/* Instant Comment Submission Box */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const text = commentInputs[ann.id];
                        if (text && text.trim()) {
                          commentAnnouncement(ann.id, text, user?.fullName || (lang === 'fr' ? 'Membre Connecté' : 'Connected Member'));
                          setCommentInputs(prev => ({ ...prev, [ann.id]: '' }));
                        }
                      }}
                      className="flex items-center gap-3 pt-2"
                    >
                      <div className="w-9 h-9 rounded-full bg-[var(--accent-gold)] text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow">
                        {user?.fullName ? user.fullName[0].toUpperCase() : 'M'}
                      </div>
                      <div className="flex-1 relative flex items-center">
                        <input
                          type="text"
                          value={commentInputs[ann.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [ann.id]: e.target.value }))}
                          placeholder={lang === 'fr' ? 'Écrivez un commentaire public...' : 'Write a public comment...'}
                          className="w-full bg-[#141d2b] border border-white/15 focus:border-[var(--accent-gold)] rounded-full py-2.5 pl-4 pr-12 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
                        />
                        <button
                          type="submit"
                          disabled={!commentInputs[ann.id]?.trim()}
                          className="absolute right-1.5 p-2 rounded-full bg-[var(--accent-gold)] hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 disabled:text-slate-500 transition-all active:scale-95 shadow"
                          title="Envoyer le commentaire"
                        >
                          <Send className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </form>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal for Image */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImageModal} alt="Expanded Media" className="max-h-[85vh] w-auto rounded-2xl shadow-2xl border border-white/20" />
          </div>
        </div>
      )}

    </div>
  );
};
