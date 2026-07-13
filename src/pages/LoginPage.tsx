import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Globe, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  Heart
} from 'lucide-react';

interface LoginPageProps {
  setActivePage?: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActivePage }) => {
  const { t, lang, toggleLanguage } = useLanguage();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      if (setActivePage) {
        setActivePage('home');
      }
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  const navigateToSignup = () => {
    window.history.pushState({}, '', '/signup');
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (setActivePage) {
      setActivePage('signup');
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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent-olive)]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent-orange)]/15 blur-[120px] pointer-events-none" />

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

      {/* Main Sign-In Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border border-glass shadow-2xl relative overflow-hidden animate-slide-up space-y-7 backdrop-blur-2xl">
          
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
              <span className="px-3 py-1 rounded-full bg-[var(--accent-olive)]/15 text-[var(--accent-olive)] text-[10px] font-black uppercase tracking-widest border border-[var(--accent-olive)]/30 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin-slow" />
                <span>{lang === 'fr' ? 'Espace Numérique Sécurisé' : 'Secure Digital Portal'}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-outfit text-[var(--text-primary)] mt-2">
                {t('auth.loginTab')}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
                {lang === 'fr' 
                  ? 'Connectez-vous pour accéder à vos directs, offrandes et privilèges KZI.' 
                  : 'Sign in to access your live streams, offerings, and KZI privileges.'}
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

          {/* Form Input Fields */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@mediamgjmonde.org"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {t('auth.password')}
                </label>
                <button
                  type="button"
                  onClick={() => alert(lang === 'fr' ? 'Veuillez contacter l\'administrateur ou le secrétariat MGJ pour réinitialiser votre mot de passe.' : 'Please contact the MGJ secretariat to reset your password.')}
                  className="text-[11px] font-bold text-[var(--accent-olive)] hover:underline"
                >
                  {lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-glass text-sm font-medium focus:border-[var(--accent-olive)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-olive)]/20 transition-all text-[var(--text-primary)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--accent-olive)] to-[#344e13] hover:from-[#3f5d1b] hover:to-[#283d0f] text-white font-extrabold font-outfit text-base shadow-xl shadow-[var(--accent-olive)]/25 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{lang === 'fr' ? 'Connexion en cours...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>{lang === 'fr' ? 'Se Connecter à Mon Espace' : 'Sign In to My Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="pt-5 border-t border-glass text-center space-y-3">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              {lang === 'fr' ? 'Nouveau dans la famille MGJ Monde ?' : 'New to the MGJ Monde family?'}
            </p>
            <button
              type="button"
              onClick={navigateToSignup}
              className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--accent-olive)]/40 text-[var(--accent-olive)] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'fr' ? 'Créer mon compte membre QR (S\'inscrire)' : 'Create Member QR Account (Sign Up)'}</span>
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

export default LoginPage;
