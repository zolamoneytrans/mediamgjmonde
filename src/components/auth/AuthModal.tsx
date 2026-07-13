import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MinistryPosition } from '../../types/user';
import { X, Mail, Lock, User, Phone, MapPin, Award, Eye, EyeOff, Loader2, Flame } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signUp } = useAuth();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register form
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPosition, setRegPosition] = useState<MinistryPosition>('Chantre / Intercesseur');
  const [regCity, setRegCity] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regSector, setRegSector] = useState('Secteur Bel-Air (Siège Central Lubumbashi)');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError(lang === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err: any) {
      setError(lang === 'fr' ? 'Identifiants invalides ou erreur de connexion.' : 'Invalid credentials or login error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFullName || !regPhone || !regCity || !regCountry) {
      setError(lang === 'fr' ? 'Veuillez renseigner tous les champs obligatoires (6 champs + email/password).' : 'Please fill out all required fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUp({
        email: regEmail,
        password: regPassword,
        fullName: regFullName,
        phone: regPhone,
        ministryPosition: regPosition,
        city: regCity,
        country: regCountry,
        sector: regSector
      });
      onClose();
    } catch (err: any) {
      setError(err.message || (lang === 'fr' ? 'Erreur lors de l\'inscription.' : 'Error during registration.'));
    } finally {
      setLoading(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-slide-up" style={{ animationDuration: '0.2s' }}>
      <div className="glass-panel w-full max-w-lg p-6 md:p-8 rounded-3xl relative overflow-hidden border border-[var(--accent-olive)]/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="MediaMGJ Monde Logo" 
            className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow-lg animate-fade-in" 
          />
          <h3 className="text-2xl font-bold font-outfit text-[var(--text-primary)]">
            MediaMonde<span className="gradient-text-olive">MJG</span>
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {lang === 'fr' ? 'Sanctuaire numérique des Ministères Génération Joël' : 'Digital Sanctuary of Generation Joel Ministries'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-[var(--bg-primary)] p-1 mb-6 border border-glass">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-[var(--accent-olive)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t('auth.loginTab')}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-[var(--accent-olive)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t('auth.registerTab')}
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="pasteur.joel@mediamgjmonde.org"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showLoginPass ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showLoginPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2 font-outfit text-base shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {lang === 'fr' ? 'Connexion en cours...' : 'Signing in...'}
                </>
              ) : (
                t('auth.loginTab')
              )}
            </button>
          </form>
        )}

        {/* Register Form (6 Comprehensive Fields + Email/Pass) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {lang === 'fr' ? 'Nom Complet' : 'Full Name'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Jean-Marc Joël"
                    className="input-field pl-9 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {lang === 'fr' ? 'Téléphone' : 'Phone'} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+243 81 234 5678"
                    className="input-field pl-9 py-2 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="membre@mediamgjmonde.org"
                  className="input-field pl-9 py-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showRegPass ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-9 py-2 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(!showRegPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Ministry Position */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                {lang === 'fr' ? 'Poste dans le Ministère' : 'Ministry Position'} *
              </label>
              <select
                value={regPosition}
                onChange={(e) => setRegPosition(e.target.value as MinistryPosition)}
                className="input-field py-2 text-sm cursor-pointer"
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            {/* Secteur MGJ */}
            <div>
              <label className="block text-xs font-semibold text-[var(--accent-gold)] uppercase mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Secteur MGJ (Branche)' : 'MGJ Sector (Branch)'} *</span>
              </label>
              <input
                type="text"
                list="secteurs-list-modal"
                value={regSector}
                onChange={(e) => setRegSector(e.target.value)}
                placeholder="Ex: Secteur Bel-Air..."
                className="input-field py-2 text-sm font-bold border-[var(--accent-gold)]/40"
                required
              />
              <datalist id="secteurs-list-modal">
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

            {/* City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {lang === 'fr' ? 'Ville' : 'City'} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Kinshasa / Paris"
                    className="input-field pl-9 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                  {lang === 'fr' ? 'Pays' : 'Country'} *
                </label>
                <input
                  type="text"
                  value={regCountry}
                  onChange={(e) => setRegCountry(e.target.value)}
                  placeholder="RDC / France / Canada"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 mt-4 font-outfit text-base shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {lang === 'fr' ? 'Création de la carte membre...' : 'Creating member profile...'}
                </>
              ) : (
                t('auth.registerTab')
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
