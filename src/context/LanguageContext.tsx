import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Nav & Header
    'nav.home': 'Accueil',
    'nav.live': 'Live & Médias',
    'nav.kzi': 'Convention Kzi',
    'nav.shop': 'Boutique',
    'nav.donations': 'Offrandes',
    'nav.profile': 'Mon Profil',
    'nav.notifications': 'Notifications',
    'nav.admin': 'Admin MGJ',
    'header.login': 'Connexion',
    'header.logout': 'Déconnexion',
    'header.adminMode': 'Mode Admin',
    'header.userMode': 'Mode Membre',
    'header.installPWA': 'Installer l\'App',

    // Dashboard
    'dashboard.welcome': 'Shalom & Bienvenue dans votre sanctuaire mobile',
    'dashboard.verseTitle': 'La promesse de Joël 2:28',
    'dashboard.verseText': '« Après cela, je répandrai mon esprit sur toute chair; vos fils et vos filles prophétiseront, vos vieillards auront des songes, et vos jeunes gens des visions. »',
    'dashboard.socialTitle': 'Nos Médias Officiels & Communauté',
    'dashboard.followFb': 'Suivre sur Facebook',
    'dashboard.followYt': 'S\'abonner à YouTube',
    'dashboard.fbDesc': 'Rejoignez notre page Facebook @mediamgjmonde pour les cultes en direct, les annonces et la louange.',
    'dashboard.ytDesc': 'Abonnez-vous à notre chaîne officielle pour revivre tous les enseignements et veillées.',
    'dashboard.quickActions': 'Accès Rapide',
    'dashboard.liveAlert': 'EN DIRECT : Culte d\'adoration et d\'intercession en cours !',
    'dashboard.watchLiveNow': 'Rejoindre le Direct',

    // Live Streaming
    'live.title': 'Sanctuaire de Diffusion en Direct',
    'live.subtitle': 'Suivez les cultes en direct depuis Facebook et YouTube, participez au chat et prenez des notes.',
    'live.selectSource': 'Source de diffusion :',
    'live.chatTitle': 'Chat Fraternel en Direct',
    'live.chatPlaceholder': 'Écrivez votre Amen ou requête de prière...',
    'live.send': 'Envoyer',
    'live.notesTitle': 'Mes Notes de Prédication',
    'live.notesPlaceholder': 'Prenez note des révélations et versets clés de la prédication ici...',
    'live.saveNotes': 'Enregistrer mes notes',
    'live.scheduleTitle': 'Programme Hebdomadaire des Cultes',

    // Convention Kzi
    'kzi.title': 'Grande Convention Kzi 2026',
    'kzi.subtitle': 'L\'Effusion du Saint-Esprit et le Réveil des Nations à Kzi.',
    'kzi.countdownTitle': 'Temps restant avant la Grande Convention :',
    'kzi.days': 'Jours',
    'kzi.hours': 'Heures',
    'kzi.mins': 'Min',
    'kzi.secs': 'Sec',
    'kzi.speakersTitle': 'Orateurs & Serviteurs de Dieu invités',
    'kzi.scheduleTitle': 'Programme Détaillé des Journées',
    'kzi.day1': 'Jour 1 (Dim 02) - Ouverture & Onction',
    'kzi.day2': 'Jour 2 (Lun 03) - Séminaire des Leaders',
    'kzi.day3': 'Jour 3 (Mar 04) - Intercession & Combat',
    'kzi.day4': 'Jour 4 (Mer 05) - Guérison & Délivrance',
    'kzi.day5': 'Jour 5 (Jeu 06) - École des Ministères',
    'kzi.day6': 'Jour 6 (Ven 07) - Grande Veillée de Prière',
    'kzi.day7': 'Jour 7 (Sam 08) - Symposium Jeunesse Joël 2:28',
    'kzi.day8': 'Jour 8 (Dim 09) - Clôture, Cène & Envoi',
    'kzi.registerBtn': 'S\'inscrire & Obtenir mon Pass QR Kzi',
    'kzi.registeredSuccess': 'Félicitations ! Vous êtes inscrit(e) pour la Grande Convention Kzi.',

    // Shop
    'shop.title': 'Boutique du Ministère',
    'shop.subtitle': 'Commandez nos ouvrages littéraires bibliques, vêtements de marque MGJ et enseignements.',
    'shop.filterAll': 'Tous les articles',
    'shop.filterBooks': 'Livres & E-Books',
    'shop.filterApparel': 'Vêtements & Goodies',
    'shop.filterMedia': 'Enseignements Audio/Vidéo',
    'shop.addToCart': 'Ajouter au panier',
    'shop.cartTitle': 'Mon Panier MGJ',
    'shop.checkoutBtn': 'Valider & Commander',
    'shop.emptyCart': 'Votre panier est actuellement vide.',
    'shop.total': 'Total à payer :',

    // Donations
    'donations.title': 'Faire un Don / Offrandes',
    'donations.subtitle': 'Soutenez l\'œuvre de Dieu, la diffusion média MGJ et la préparation de la Convention Kzi.',
    'donations.selectType': 'Type d\'offrande :',
    'donations.typeTithes': 'Dîmes Bibliques',
    'donations.typeOffering': 'Offrandes Volontaires',
    'donations.typeKzi': 'Soutien Convention Kzi',
    'donations.typeMedia': 'Équipement Média MGJ',
    'donations.customAmount': 'Ou montant personnalisé',
    'donations.paymentMethod': 'Mode de paiement sécurisé :',
    'donations.payCard': 'Carte Bancaire (Visa/Mastercard)',
    'donations.payMobile': 'Mobile Money (M-Pesa / Orange / Airtel)',
    'donations.payPaypal': 'PayPal Express',
    'donations.giveNowBtn': 'Envoyer mon offrande avec foi',

    // Profile
    'profile.title': 'Mon Profil & Carte de Membre',
    'profile.badgeTitle': 'Carte de Membre Officielle MGJ',
    'profile.personalInfo': 'Mes Informations Personnelles',
    'profile.fullName': 'Nom Complet',
    'profile.phone': 'Numéro de Téléphone',
    'profile.ministryPosition': 'Poste dans le Ministère',
    'profile.city': 'Ville de résidence',
    'profile.country': 'Pays de résidence',
    'profile.saveBtn': 'Mettre à jour mon profil',
    'profile.tabNotes': 'Mes Notes Saved',
    'profile.tabPasses': 'Mes Pass Convention Kzi',
    'profile.tabHistory': 'Historique Dons & Commandes',

    // Notifications
    'notif.title': 'Centre de Notifications & Annonces',
    'notif.markAllRead': 'Tout marquer comme lu',
    'notif.empty': 'Aucune nouvelle notification pour le moment.',

    // Admin Dashboard
    'admin.title': 'Tableau de Bord Administrateur MGJ',
    'admin.tabUsers': 'Gestion des Membres',
    'admin.tabKzi': 'Contrôle & Suivi de la Convention Kzi 2026',
    'admin.tabEvents': 'Convention Kzi & Événements',
    'admin.tabAnnouncements': 'Diffusion d\'Annonces',
    'admin.tabShop': 'Inventaire Boutique',
    'admin.tabPayments': 'Finances & Offrandes',
    'admin.totalMembers': 'Total Membres',
    'admin.totalTithes': 'Total Dîmes & Dons',
    'admin.totalOrders': 'Ventes Boutique',
    'admin.kziRegistrants': 'Inscrits Convention Kzi',
    'admin.broadcastAlert': 'Diffuser une alerte en direct aux membres',

    // Auth Modal
    'auth.loginTab': 'Se Connecter',
    'auth.registerTab': 'S\'inscrire au Ministère',
    'auth.email': 'Adresse E-mail',
    'auth.password': 'Mot de passe sécurisé',
    'auth.positionHint': 'Sélectionnez votre rôle/poste spirituel'
  },
  en: {
    // Nav & Header
    'nav.home': 'Dashboard',
    'nav.live': 'Live & Media',
    'nav.kzi': 'Kzi Convention',
    'nav.shop': 'Ministry Shop',
    'nav.donations': 'Give / Offerings',
    'nav.profile': 'My Profile',
    'nav.notifications': 'Notifications',
    'nav.admin': 'MGJ Admin',
    'header.login': 'Sign In',
    'header.logout': 'Sign Out',
    'header.adminMode': 'Admin Mode',
    'header.userMode': 'Member Mode',
    'header.installPWA': 'Install App',

    // Dashboard
    'dashboard.welcome': 'Shalom & Welcome to your mobile spiritual hub',
    'dashboard.verseTitle': 'The Promise of Joel 2:28',
    'dashboard.verseText': '“And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions.”',
    'dashboard.socialTitle': 'Our Official Media & Community',
    'dashboard.followFb': 'Follow on Facebook',
    'dashboard.followYt': 'Subscribe on YouTube',
    'dashboard.fbDesc': 'Join our Facebook page @mediamgjmonde for live broadcasts, announcements, and worship.',
    'dashboard.ytDesc': 'Subscribe to our official YouTube channel for archives of all teachings and prayer vigils.',
    'dashboard.quickActions': 'Quick Shortcuts',
    'dashboard.liveAlert': 'LIVE NOW : Worship and intercessory service streaming live!',
    'dashboard.watchLiveNow': 'Join Live Stream',

    // Live Streaming
    'live.title': 'Live Broadcast Sanctuary',
    'live.subtitle': 'Watch live services from Facebook and YouTube, participate in chat and take notes.',
    'live.selectSource': 'Broadcast Source :',
    'live.chatTitle': 'Live Fellowship Chat',
    'live.chatPlaceholder': 'Type your Amen or prayer request...',
    'live.send': 'Send',
    'live.notesTitle': 'My Sermon Notes',
    'live.notesPlaceholder': 'Take notes of revelations and key scriptures during the sermon here...',
    'live.saveNotes': 'Save My Notes',
    'live.scheduleTitle': 'Weekly Broadcast Schedule',

    // Convention Kzi
    'kzi.title': 'Grande Convention Kzi 2026',
    'kzi.subtitle': 'The Outpouring of the Holy Spirit and Awakening of Nations at Kzi.',
    'kzi.countdownTitle': 'Countdown to the Grand Convention :',
    'kzi.days': 'Days',
    'kzi.hours': 'Hours',
    'kzi.mins': 'Mins',
    'kzi.secs': 'Secs',
    'kzi.speakersTitle': 'Keynote Speakers & Guest Ministers',
    'kzi.scheduleTitle': 'Daily Convention Schedule',
    'kzi.day1': 'Day 1 (Sun 02) - Opening & Anointing',
    'kzi.day2': 'Day 2 (Mon 03) - Leadership Seminar',
    'kzi.day3': 'Day 3 (Tue 04) - Intercession & Warfare',
    'kzi.day4': 'Day 4 (Wed 05) - Healing & Deliverance',
    'kzi.day5': 'Day 5 (Thu 06) - School of Ministries',
    'kzi.day6': 'Day 6 (Fri 07) - Great Prayer Vigil',
    'kzi.day7': 'Day 7 (Sat 08) - Youth Symposium Joel 2:28',
    'kzi.day8': 'Day 8 (Sun 09) - Closing, Communion & Sending',
    'kzi.registerBtn': 'Register & Get My Kzi QR Badge',
    'kzi.registeredSuccess': 'Congratulations! You are officially registered for the Kzi Convention.',

    // Shop
    'shop.title': 'Ministry Bookstore & Shop',
    'shop.subtitle': 'Order our biblical books, branded MGJ apparel, and audio/video teachings.',
    'shop.filterAll': 'All Products',
    'shop.filterBooks': 'Books & E-Books',
    'shop.filterApparel': 'Apparel & Goodies',
    'shop.filterMedia': 'Audio / Video Teachings',
    'shop.addToCart': 'Add to Cart',
    'shop.cartTitle': 'My MGJ Cart',
    'shop.checkoutBtn': 'Proceed to Checkout',
    'shop.emptyCart': 'Your shopping cart is currently empty.',
    'shop.total': 'Total Due :',

    // Donations
    'donations.title': 'Give / Offerings Portal',
    'donations.subtitle': 'Support God\'s kingdom work, MGJ media expansion, and Kzi Convention preparation.',
    'donations.selectType': 'Giving Category :',
    'donations.typeTithes': 'Biblical Tithes',
    'donations.typeOffering': 'Free-will Offerings',
    'donations.typeKzi': 'Kzi Convention Sponsorship',
    'donations.typeMedia': 'MGJ Media Equipment Fund',
    'donations.customAmount': 'Or enter custom amount',
    'donations.paymentMethod': 'Secure Payment Method :',
    'donations.payCard': 'Credit / Debit Card (Visa/Mastercard)',
    'donations.payMobile': 'Mobile Money (M-Pesa / Orange / Airtel)',
    'donations.payPaypal': 'PayPal Express',
    'donations.giveNowBtn': 'Give My Offering in Faith',

    // Profile
    'profile.title': 'My Profile & Spiritual ID Badge',
    'profile.badgeTitle': 'Official MGJ Member Card',
    'profile.personalInfo': 'Personal Details & Ministry Position',
    'profile.fullName': 'Full Name',
    'profile.phone': 'Phone Number',
    'profile.ministryPosition': 'Ministry Position',
    'profile.city': 'City of Residence',
    'profile.country': 'Country of Residence',
    'profile.saveBtn': 'Update My Profile',
    'profile.tabNotes': 'Saved Sermon Notes',
    'profile.tabPasses': 'My Kzi Convention Passes',
    'profile.tabHistory': 'Donations & Orders History',

    // Notifications
    'notif.title': 'Notifications & Announcements Center',
    'notif.markAllRead': 'Mark all as read',
    'notif.empty': 'No new notifications right now.',

    // Admin Dashboard
    'admin.title': 'MGJ Admin Command Dashboard',
    'admin.tabUsers': 'Member Management',
    'admin.tabKzi': 'Contrôle & Suivi de la Convention Kzi 2026',
    'admin.tabEvents': 'Kzi Convention & Events',
    'admin.tabAnnouncements': 'Broadcast Announcements',
    'admin.tabShop': 'Shop Inventory',
    'admin.tabPayments': 'Financial Ledger & Offerings',
    'admin.totalMembers': 'Total Members',
    'admin.totalTithes': 'Total Tithes & Gifts',
    'admin.totalOrders': 'Shop Sales',
    'admin.kziRegistrants': 'Kzi Registrants',
    'admin.broadcastAlert': 'Broadcast Live Alert to All Members',

    // Auth Modal
    'auth.loginTab': 'Sign In',
    'auth.registerTab': 'Sign Up as Member',
    'auth.email': 'Email Address',
    'auth.password': 'Secure Password',
    'auth.positionHint': 'Select your spiritual ministry role/position'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('mediamondemjg_lang');
    return (saved === 'fr' || saved === 'en') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('mediamondemjg_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLangState(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
