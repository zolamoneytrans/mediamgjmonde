import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { MinistryPosition } from '../types/user';
import { 
  User, 
  Phone, 
  MapPin, 
  Award, 
  Save, 
  FileText, 
  Download, 
  Calendar, 
  HeartHandshake, 
  CheckCircle2, 
  QrCode, 
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
  Camera,
  Flame
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user, updateProfileData, canAccessAdmin } = useAuth();
  const { sermonNotes, deleteSermonNote, isUserRegisteredKzi, donations, orders } = useAppData();

  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'passes' | 'history'>('info');

  // Edit form state
  const [fullName, setFullName] = useState(user ? user.fullName : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [ministryPosition, setMinistryPosition] = useState<MinistryPosition>(user ? user.ministryPosition : 'Membre');
  const [city, setCity] = useState(user ? user.city : '');
  const [country, setCountry] = useState(user ? user.country : '');
  const [sector, setSector] = useState(user?.sector || '');
  const [idCardNumber, setIdCardNumber] = useState(user?.idCardNumber || 'ID-RDC-08942189-X');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || user?.avatarUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 animate-slide-up">
        <div className="w-16 h-16 rounded-3xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-outfit text-[var(--text-primary)]">
          {lang === 'fr' ? 'Connexion requise pour voir votre profil' : 'Login required to view profile'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {lang === 'fr' 
            ? 'Veuillez vous connecter ou vous inscrire en haut à droite pour accéder à votre Carte de Membre et vos informations.' 
            : 'Please sign in or register in the header to access your Member Badge and details.'}
        </p>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      fullName,
      phone,
      ministryPosition,
      city,
      country,
      sector,
      idCardNumber,
      profilePhoto
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadMemberCard = () => {
    const element = document.createElement("a");
    const cardText = `=========================================\n CARTE DE MEMBRE OFFICIELLE - MGJ MONDE\n=========================================\nNom : ${user.fullName}\nPoste : ${user.ministryPosition}\nID N° / Pièce d'Identité : ${user.idCardNumber || idCardNumber || 'ID-RDC-08942189-X'}\nSecteur MGJ : ${user.sector || 'Secteur Central'}\nTéléphone : ${user.phone}\nVille / Pays : ${user.city}, ${user.country}\nID Badge : ${user.memberId}\nRôle : ${user.role.toUpperCase()}\n\n« Après cela, je répandrai mon esprit sur toute chair... » Joël 2:28\n=========================================`;
    const file = new Blob([cardText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Carte_Membre_MGJ_${user.fullName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const positions: MinistryPosition[] = [
    'Pasteur',
    'Modérateur',
    'Chantre / Intercesseur',
    'Leader de Jeunesse',
    'Evangéliste',
    'Membre'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Digital Member Card Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#112108] via-[#2d4715] to-[#1e130c] p-6 sm:p-10 border border-[var(--accent-gold)]/50 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full md:w-auto">
            {/* Avatar Photo Container */}
            <div className="relative group shrink-0">
              {user.profilePhoto || user.avatarUrl ? (
                <img
                  src={user.profilePhoto || user.avatarUrl}
                  alt={user.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--accent-gold)] object-cover shadow-2xl bg-black/40"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--accent-gold)]/40 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-[var(--accent-gold)] shadow-xl">
                  <User className="w-10 h-10 mb-0.5" />
                  <span className="text-[9px] font-bold text-slate-300 uppercase">Photo</span>
                </div>
              )}
              <button
                onClick={() => setActiveTab('info')}
                className="absolute bottom-1 right-1 p-2 rounded-full bg-[var(--accent-gold)] text-slate-950 shadow-lg hover:scale-110 transition-transform"
                title={lang === 'fr' ? 'Modifier photo de profil' : 'Change photo'}
              >
                <Camera className="w-4 h-4 font-black" />
              </button>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-[var(--accent-gold)] text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                  <span>Badge : {user.memberId}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>ID N° : {user.idCardNumber || idCardNumber || 'ID-RDC-08942189-X'}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
                  {user.ministryPosition}
                </span>
                {user.sector && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{user.sector}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-outfit text-white tracking-tight">
                {user.fullName}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {user.city}, {user.country}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code / Badge Download */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-center space-y-2 shrink-0 self-center md:self-auto">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
              <QrCode className="w-full h-full text-[#1b2f0c]" />
            </div>
            <button
              onClick={handleDownloadMemberCard}
              className="text-[10px] font-extrabold text-amber-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>{lang === 'fr' ? 'Carte Digital TXT' : 'Download ID Card'}</span>
            </button>
            {(canAccessAdmin || user.role === 'admin' || user.role === 'superadmin') && (
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="w-full mt-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-black text-[11px] shadow-lg flex items-center justify-center gap-1.5 hover:scale-105 transition-all border border-amber-400/30"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                <span>Portail Admin (/admin)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-glass pb-4">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'info'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t('profile.personalInfo')}</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('profile.tabNotes')}</span>
          {sermonNotes.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent-gold)] text-white text-[10px]">
              {sermonNotes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('passes')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'passes'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('profile.tabPasses')}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{t('profile.tabHistory')}</span>
        </button>
      </div>

      {/* Tab 1: Personal Information Form */}
      {activeTab === 'info' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-glass pb-4">
            <h3 className="text-lg font-bold font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Modifier mes informations' : 'Edit My Details'}
            </h3>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {lang === 'fr' ? 'Mises à jour enregistrées !' : 'Updates saved successfully!'}
              </span>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Photo de Profil Section */}
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/70 border border-glass space-y-3">
              <label className="block text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Photo de Profil (Carte de Membre)' : 'Profile Photo (Member Badge)'}</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-[var(--accent-gold)] overflow-hidden shrink-0 bg-black/30 flex items-center justify-center">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[var(--text-muted)]" />
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="btn-gold py-2 px-4 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Importer une photo (Pellicule/PC)' : 'Upload from device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={() => setProfilePhoto('')}
                        className="py-2 px-3 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'fr' ? 'Supprimer' : 'Remove'}</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={profilePhoto.startsWith('data:') ? '' : profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                    placeholder={lang === 'fr' ? "Ou coller l'URL d'une image (ex: https://...)" : "Or paste image URL..."}
                    className="input-field py-2 text-xs font-mono rounded-xl w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {t('profile.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field py-2.5 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {t('profile.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field py-2.5 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {t('profile.ministryPosition')}
                </label>
                <select
                  value={ministryPosition}
                  onChange={(e) => setMinistryPosition(e.target.value as MinistryPosition)}
                  className="input-field py-2.5 text-sm font-semibold cursor-pointer w-full"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--accent-gold)] uppercase mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Secteur MGJ (Branche / Assemblée)' : 'MGJ Sector (Church Branch)'}</span>
                </label>
                <input
                  type="text"
                  list="secteurs-list"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder={lang === 'fr' ? 'Ex: Secteur Bel-Air, Kasenga, Paris...' : 'Ex: Sector Bel-Air, Paris...'}
                  className="input-field py-2.5 text-sm font-bold border-[var(--accent-gold)]/40 focus:border-[var(--accent-gold)]"
                />
                <datalist id="secteurs-list">
                  <option value="Secteur Bel-Air (Siège Central Lubumbashi)" />
                  <option value="Secteur Kasenga (Lubumbashi)" />
                  <option value="Secteur Golf / Ruashi (Lubumbashi)" />
                  <option value="Secteur Likasi / Kolwezi" />
                  <option value="Secteur Kinshasa (RDC)" />
                  <option value="Secteur Paris (France & Europe)" />
                  <option value="Secteur Bruxelles (Belgique)" />
                  <option value="Secteur Montréal (Canada & Amérique)" />
                  <option value="Secteur Johannesburg (Afrique du Sud)" />
                  <option value="Secteur En Ligne / Web Church MGJ" />
                </datalist>
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                  {lang === 'fr' ? 'Sélectionnez un secteur dans la liste ou saisissez le vôtre directement.' : 'Select a sector from the list or type your branch directly.'}
                </span>
              </div>
            </div>

            {/* Numéro de Pièce d'Identité / ID N° */}
            <div className="p-4 rounded-2xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 space-y-2">
              <label className="block text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Numéro de Pièce d\'Identité (Sur Carte de Membre ID)' : 'National / Passport ID Number (On Member ID Card)'}</span>
              </label>
              <input
                type="text"
                value={idCardNumber}
                onChange={(e) => setIdCardNumber(e.target.value)}
                placeholder="Ex: ID-RDC-08942189-X ou Passeport / Permis"
                className="input-field py-2.5 text-sm font-black text-amber-300 bg-black/50 border-[var(--accent-gold)]/50"
              />
              <span className="text-[10px] text-slate-300 block font-medium">
                {lang === 'fr' ? 'Ce numéro d\'identité officiel s\'affiche directement en or sur votre carte et badge QR de convention.' : 'This official ID number appears directly in gold on your digital member card and convention QR badge.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {t('profile.city')}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field py-2.5 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {t('profile.country')}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-field py-2.5 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary py-3 px-6 rounded-2xl text-sm font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Save className="w-4 h-4" />
                <span>{t('profile.saveBtn')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Saved Sermon Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Mes Notes de Prédication' : 'My Saved Sermon Notes'}
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              {sermonNotes.length} {lang === 'fr' ? 'notes enregistrées' : 'notes available'}
            </span>
          </div>

          {sermonNotes.length === 0 ? (
            <div className="glass-card p-12 text-center text-sm text-[var(--text-secondary)] rounded-3xl border-glass">
              {lang === 'fr' 
                ? 'Aucune note pour l\'instant. Rendez-vous sur la page Live & Médias pendant un culte pour prendre et enregistrer vos notes !' 
                : 'No notes yet. Head to the Live & Media page during a broadcast to capture and save your notes!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sermonNotes.map((note) => (
                <div key={note.id} className="glass-card p-5 sm:p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass flex flex-col justify-between space-y-4 hover:border-[var(--accent-olive)] transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-outfit font-extrabold text-base text-[var(--text-primary)]">{note.title}</h4>
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">{note.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-glass">
                    <button
                      onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([`${note.title}\nDate : ${note.date}\n\n${note.content}\n\n---\nMinistères Génération Joël`], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="btn-secondary py-1.5 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Télécharger' : 'Download'}</span>
                    </button>
                    <button
                      onClick={() => deleteSermonNote(note.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Convention Kzi Passes */}
      {activeTab === 'passes' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-outfit text-[var(--text-primary)]">
            {lang === 'fr' ? 'Mes Badges & Pass Convention Kzi' : 'My Convention Kzi Passes'}
          </h3>

          {isUserRegisteredKzi ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c2c0d] via-[var(--bg-secondary)] to-[var(--bg-card)] border-[var(--accent-gold)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Badge VIP Actif' : 'Active VIP Badge'}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black font-outfit text-[var(--text-primary)]">
                  31ème Grande Convention Internationale KZI 2026
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {lang === 'fr' ? `Accès complet pour ${user.fullName} (${user.ministryPosition}) - Du 02 au 09 Août 2026 à Kolwezi (Manika Sport).` : `Full access for ${user.fullName} (${user.ministryPosition}) - August 02-09, 2026 in Kolwezi (Manika Sport).`}
                </p>
              </div>

              <button
                onClick={handleDownloadMemberCard}
                className="btn-gold py-3 px-6 rounded-2xl font-bold text-xs shrink-0 flex items-center gap-2 shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Télécharger Mon Pass QR' : 'Download QR Pass'}</span>
              </button>
            </div>
          ) : (
            <div className="glass-card p-12 text-center space-y-4 rounded-3xl border-glass">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold font-outfit text-[var(--text-primary)]">
                {lang === 'fr' ? 'Vous n\'êtes pas encore inscrit(e) pour Kzi' : 'Not registered for Kzi yet'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                {lang === 'fr' ? 'Réservez votre place dès aujourd\'hui pour participer à ce grand événement prophétique !' : 'Reserve your spot today to participate in this great prophetic event!'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Donations & Orders History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-outfit text-[var(--text-primary)] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[var(--accent-olive)]" />
              <span>{lang === 'fr' ? 'Historique de mes Offrandes & Dîmes' : 'My Giving & Tithes Ledger'}</span>
            </h3>

            {donations.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-center text-xs text-[var(--text-secondary)]">
                {lang === 'fr' ? 'Aucune offrande répertoriée dans ce profil.' : 'No donations recorded in this profile.'}
              </div>
            ) : (
              <div className="space-y-2">
                {donations.map((don) => (
                  <div key={don.id} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] font-black text-xs">
                        {don.currency}
                      </div>
                      <div>
                        <h5 className="font-outfit font-extrabold text-sm text-[var(--text-primary)] uppercase">
                          {don.type === 'tithes' ? 'Dîmes' : don.type === 'kzi' ? 'Soutien Kzi' : 'Offrande Volontaire'}
                        </h5>
                        <span className="text-[11px] text-[var(--text-muted)]">Reçu N°: {don.receiptNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black font-outfit text-[var(--accent-gold)] block">
                        +{don.amount} {don.currency}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)]">{don.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-glass">
            <h3 className="text-lg font-bold font-outfit text-[var(--text-primary)] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>{lang === 'fr' ? 'Historique de mes Commandes Boutique' : 'My Shop Order Ledger'}</span>
            </h3>

            {orders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-center text-xs text-[var(--text-secondary)]">
                {lang === 'fr' ? 'Aucune commande de livres ou vêtements pour l\'instant.' : 'No book or apparel orders yet.'}
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-outfit font-extrabold text-sm text-[var(--text-primary)]">
                          Commande N° {ord.id}
                        </h5>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                        {ord.items.length} {lang === 'fr' ? 'articles' : 'items'} • Date: {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-base font-black font-outfit text-[var(--text-primary)]">
                      {ord.totalEur} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
