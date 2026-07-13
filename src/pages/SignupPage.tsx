import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { MinistryPosition } from '../types/user';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Award, 
  Loader2, 
  AlertCircle, 
  Globe, 
  ArrowLeft, 
  Sparkles,
  QrCode,
  Heart,
  Flame
} from 'lucide-react';

interface SignupPageProps {
  setActivePage?: (page: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ setActivePage }) => {
  const { t, lang, toggleLanguage } = useLanguage();
  const { signUp, loading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [position, setPosition] = useState<MinistryPosition>('Membre');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('RDC');
  const [sector, setSector] = useState('Secteur Bel-Air (Siège Central Lubumbashi)');
  const [error, setError] = useState<string | null>(null);

  const positions: MinistryPosition[] = [
    'Pasteur',
    'Modérateur',
    'Chantre / Intercesseur',
    'Leader de Jeunesse',
    'Evangéliste',
    'Membre'
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError(lang === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    try {
      await signUp({
        email,
        password,
        fullName,
        phone,
        ministryPosition: position,
        city,
        country,
        sector
      });
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      if (setActivePage) {
        setActivePage('home');
      }
    } catch (err: any) {
      setError(err.message || 'Échec de l\'inscription. Veuillez réessayer.');
    }
  };

  const navigateToLogin = () => {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (setActivePage) {
      setActivePage('login');
    }
  };

  const navigateHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (setActivePage) {
      setActivePage('home');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[var(--accent-olive)]/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[var(--accent-gold)]/15 blur-[130px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <button
          onClick={navigateHome}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-glass text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[var(--accent-olive)]" />
          <span>{lang === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-glass text-xs font-extrabold transition-all"
          title="Switch Language FR / EN"
        >
          <Globe className="w-4 h-4 text-[var(--accent-olive)]" />
          <span className={lang === 'fr' ? 'text-[var(--accent-olive)] font-black' : 'text-[var(--text-secondary)]'}>FR</span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className={lang === 'en' ? 'text-[var(--accent-olive)] font-black' : 'text-[var(--text-secondary)]'}>EN</span>
        </button>
      </header>

      {/* Main Registration Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 sm:p-10 border border-glass shadow-2xl relative overflow-hidden animate-slide-up space-y-7 backdrop-blur-2xl">
          
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative group cursor-pointer" onClick={navigateHome}>
              <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent-olive)] to-[var(--accent-gold)] rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <img 
                src="/logo.png" 
                alt="MediaMGJ Monde Logo" 
                className="w-20 h-20 object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform" 
              />
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] text-[10px] font-black uppercase tracking-widest border border-[var(--accent-gold)]/30 inline-flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Enregistrement Carte Membre QR' : 'QR Member Card Registration'}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-outfit text-[var(--text-primary)] mt-2">
                {lang === 'fr' ? 'Rejoindre MGJ Monde' : 'Join MGJ Monde Family'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
                {lang === 'fr' 
                  ? 'Créez votre profil officiel et recevez votre badge QR numérique pour la Grande Convention et les cultes.' 
                  : 'Create your official profile to get your digital QR badge for the Grand Convention & services.'}
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-start gap-2.5 animate-fade-in shadow-inner">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Input Fields (6 Comprehensive Fields + Email/Pass) */}
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {lang === 'fr' ? 'Nom Complet' : 'Full Name'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean-Marc Joël"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {lang === 'fr' ? 'Téléphone / WhatsApp' : 'Phone / WhatsApp'} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+243 81 234 5678"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {t('auth.email')} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="membre@mediamgjmonde.org"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {t('auth.password')} (min 6 car.) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Ministry Position */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                {lang === 'fr' ? 'Poste / Appel dans le Ministère MGJ' : 'Ministry Calling / Position'} *
              </label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as MinistryPosition)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)] cursor-pointer"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Secteur MGJ (Branche) */}
            <div>
              <label className="block text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Secteur MGJ (Branche / Assemblée)' : 'MGJ Sector (Church Branch)'} *</span>
              </label>
              <div className="relative">
                <Flame className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                <input
                  type="text"
                  list="secteurs-list-signup"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder={lang === 'fr' ? 'Ex: Secteur Bel-Air, Kasenga, Paris...' : 'Ex: Sector Bel-Air, Paris...'}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--accent-gold)]/40 text-sm font-bold focus:border-[var(--accent-gold)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-[var(--text-primary)]"
                  required
                />
                <datalist id="secteurs-list-signup">
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
              </div>
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {lang === 'fr' ? 'Ville de Résidence' : 'City'} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kinshasa / Paris / Montréal"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  {lang === 'fr' ? 'Pays / Nationalité' : 'Country'} *
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="RDC / France / Canada"
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-[var(--accent-olive)] via-[var(--accent-gold)] to-[#3e5a17] hover:opacity-95 text-white font-extrabold font-outfit text-base shadow-xl shadow-[var(--accent-olive)]/25 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{lang === 'fr' ? 'Génération de votre carte et badge...' : 'Generating your card & badge...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{lang === 'fr' ? 'Finaliser l\'Inscription & Recevoir mon QR' : 'Complete Registration & Get QR'}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="pt-5 border-t border-glass text-center space-y-3">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              {lang === 'fr' ? 'Vous possédez déjà un compte membre MGJ ?' : 'Already have an MGJ member account?'}
            </p>
            <button
              type="button"
              onClick={navigateToLogin}
              className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--accent-olive)]/40 text-[var(--accent-olive)] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-sm"
            >
              <span>{lang === 'fr' ? 'Se connecter à mon espace membre' : 'Sign In to Member Portal'}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer Branding with 2 Logos */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-glass bg-[var(--bg-secondary)]/50 backdrop-blur-md mt-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MediaMGJ Monde Logo" className="w-8 h-8 object-contain" />
            <span className="text-xs font-black font-outfit tracking-wider uppercase text-[var(--text-primary)]">
              Ministères Génération Joël • MGJ Monde
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-[var(--text-secondary)] font-bold">
            <span>(c) Swazi Appli Lab sarl 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>{lang === 'fr' ? 'Fait avec puissance & prophétie' : 'Built with power & prophecy'}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>• Joël 2:28</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default SignupPage;
