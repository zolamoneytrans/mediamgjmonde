import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

export const PwaInstallPopup: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running as standalone app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone || 
                         document.referrer.includes('android-app://');
    if (isStandalone) return;

    // 2. Check if user previously dismissed the popup in this browser session/recently
    const isDismissed = localStorage.getItem('mediamondemjg_pwa_popup_dismissed_v2') === 'true';
    if (isDismissed) return;

    // 3. Check mobile device status
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const mobileScreen = window.innerWidth <= 768;
    const isMobile = mobileUserAgent || mobileScreen;

    const checkIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIos(checkIos);

    const handleShowEvent = () => {
      setShowPopup(true);
    };
    window.addEventListener('show-pwa-popup', handleShowEvent);

    // 4. Listen to native beforeinstallprompt event (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isMobile) {
        setShowPopup(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If mobile (especially iOS where beforeinstallprompt never fires), trigger popup after 1.8 seconds
    const timer = setTimeout(() => {
      if (isMobile && !isStandalone && !isDismissed) {
        setShowPopup(true);
      }
    }, 1800);

    return () => {
      window.removeEventListener('show-pwa-popup', handleShowEvent);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPopup(false);
        localStorage.setItem('mediamondemjg_pwa_popup_dismissed_v2', 'true');
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(!showIosGuide);
    } else {
      // Manual instruction fallback
      setShowIosGuide(!showIosGuide);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    localStorage.setItem('mediamondemjg_pwa_popup_dismissed_v2', 'true');
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 sm:left-4 sm:right-4 z-[9999] max-w-xl mx-auto p-4 sm:p-5 rounded-t-3xl sm:rounded-3xl bg-[#0a182e]/95 text-white border-2 border-amber-500/60 shadow-[0_-10px_40px_rgba(245,158,11,0.25)] backdrop-blur-xl animate-slide-up transition-all">
      <div className="flex items-start justify-between gap-3">
        
        {/* App Logo & Details */}
        <div className="flex items-center gap-3.5 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-1 shadow-lg shrink-0 flex items-center justify-center border border-white/20">
            <img src="/logo.png" alt="MediaMGJ Monde App" className="w-12 h-12 object-contain drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm sm:text-base text-amber-400">MediaMGJ Monde PWA</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                Officiel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 mt-0.5 font-medium leading-snug">
              Installez l'application sur votre téléphone pour un accès direct, alertes en temps réel et streaming audio/vidéo fluide !
            </p>
          </div>
        </div>

        {/* Close / Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors shrink-0"
          title="Fermer (Plus tard)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* iOS or Fallback Step-by-Step Guide when clicked */}
      {showIosGuide && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-gray-200 space-y-2.5 animate-fade-in">
          <div className="font-black text-amber-400 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>Guide d'Installation {isIos ? 'sur iOS (iPhone / iPad)' : 'sur Téléphone Chrome/Safari'} :</span>
          </div>
          <ol className="space-y-2 list-decimal list-inside pl-1 font-medium">
            <li className="flex items-center gap-2">
              <span>Appuyez sur l'icône <strong className="text-white">Partager / Menu</strong></span>
              {isIos ? <Share2 className="w-4 h-4 text-sky-400 shrink-0 inline" /> : <strong className="text-white"> (⋮)</strong>}
              <span>en bas ou haut de l'écran.</span>
            </li>
            <li className="flex items-center gap-2">
              <span>Sélectionnez <strong className="text-amber-300">Sur l'écran d'accueil</strong></span>
              <PlusSquare className="w-4 h-4 text-amber-400 shrink-0 inline" />
            </li>
            <li className="flex items-center gap-2">
              <span>Appuyez sur <strong className="text-emerald-400 font-bold">Ajouter</strong> en haut à droite.</span>
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 inline" />
            </li>
          </ol>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2.5">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>{deferredPrompt ? "📲 Télécharger & Installer l'App" : (isIos ? "📲 Installer sur iPhone / iPad" : "📲 Comment Installer sur Mon Téléphone")}</span>
        </button>

        <button
          onClick={handleDismiss}
          className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs sm:text-sm font-bold transition-all whitespace-nowrap"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
};
