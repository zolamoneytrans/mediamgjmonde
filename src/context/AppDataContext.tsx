import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  NotificationItem, 
  ShopItem, 
  CartItem, 
  ShopOrder, 
  DonationRecord, 
  ConventionSpeaker, 
  ScheduleItem,
  SermonNote,
  AnnouncementItem,
  KziRegistrant,
  KziWelcomeInfo
} from '../types/models';

interface AppDataContextType {
  notifications: NotificationItem[];
  announcements: AnnouncementItem[];
  shopItems: ShopItem[];
  cart: CartItem[];
  orders: ShopOrder[];
  donations: DonationRecord[];
  speakers: ConventionSpeaker[];
  schedule: ScheduleItem[];
  sermonNotes: SermonNote[];
  kziRegistrantsCount: number;
  isUserRegisteredKzi: boolean;
  registerForKzi: () => void;
  kziRegistrantsList: KziRegistrant[];
  addKziRegistrant: (reg: Omit<KziRegistrant, 'id' | 'createdAt' | 'passSerial' | 'status'> & { passSerial?: string; status?: any }) => KziRegistrant;
  deleteKziRegistrant: (id: string) => void;
  updateKziRegistrantStatus: (id: string, status: 'Confirmé - Logistique Planifiée' | 'En attente de validation') => void;
  kziWelcomeInfo: KziWelcomeInfo;
  updateKziWelcomeInfo: (info: KziWelcomeInfo) => void;

  // Cart actions
  addCartItem: (product: ShopItem) => void;
  removeCartItem: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  createOrder: (userEmail: string, userName: string) => Promise<ShopOrder>;

  // Donation actions
  createDonationRecord: (record: Omit<DonationRecord, 'id' | 'createdAt' | 'receiptNumber'>) => void;

  // Notification actions
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Admin Shop/Convention actions
  addShopItem: (item: Omit<ShopItem, 'id'>) => void;
  updateShopItem: (item: ShopItem) => void;
  deleteShopItem: (id: string) => void;
  addSpeaker: (speaker: Omit<ConventionSpeaker, 'id'>) => void;
  updateSpeaker: (speaker: ConventionSpeaker) => void;
  deleteSpeaker: (id: string) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  deleteScheduleItem: (id: string) => void;
  deleteNotification: (id: string) => void;
  createAnnouncement: (titleOrObj: any, titleEn?: string, bodyFr?: string, bodyEn?: string, type?: any, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio' | 'none', authorName?: string, authorRole?: string) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  likeAnnouncement: (id: string) => void;
  commentAnnouncement: (announcementId: string, content: string, authorName?: string) => void;
  shareAnnouncementCount: (announcementId: string) => void;
  likeComment: (announcementId: string, commentId: string) => void;

  // Sermon notes actions
  addSermonNote: (title: string, content: string) => void;
  deleteSermonNote: (id: string) => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-kzi-2026-com1',
    titleFr: '📢 COMMUNIQUÉ IMPORTANT : DERNIÈRE LIGNE DROITE KZI 2026 !',
    titleEn: '📢 IMPORTANT COMMUNIQUÉ: FINAL HOME STRETCH KZI 2026!',
    messageFr: 'Signalement obligatoire sur WhatsApp (+243 99 022 8048), Logement Internat Umoja, et tarifs Bus/Avion. Cliquez pour lire l\'intégralité.',
    messageEn: 'Mandatory check-in via WhatsApp (+243 99 022 8048), Umoja Boarding accommodation, and Bus/Flight details. Click to read full details.',
    category: 'kzi',
    urgent: true,
    read: false,
    createdAt: new Date().toISOString(),
    actionLink: '/announcements',
    actionTextFr: 'Lire le communiqué',
    actionTextEn: 'Read communiqué'
  },
  {
    id: 'notif-1',
    titleFr: '🔴 EN DIRECT : Culte d\'Adoration & Intercession',
    titleEn: '🔴 LIVE NOW : Worship & Intercessory Service',
    messageFr: 'Le culte est en direct sur YouTube et Facebook. Rejoignez les milliers d\'intercesseurs connectés !',
    messageEn: 'Our service is live on YouTube and Facebook. Join thousands of intercessors online right now!',
    category: 'direct',
    urgent: true,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actionLink: '/live',
    actionTextFr: 'Regarder le Direct',
    actionTextEn: 'Watch Live Now'
  },
  {
    id: 'notif-2',
    titleFr: '⏳ Plus que quelques mois avant la Grande Convention Kzi',
    titleEn: '⏳ Countdown to the Kzi Grand Convention',
    messageFr: 'Assurez-vous de réserver votre badge QR pour l\'Effusion du Saint-Esprit à Kzi.',
    messageEn: 'Make sure to secure your QR badge for the Outpouring of the Holy Spirit at Kzi.',
    category: 'kzi',
    urgent: false,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    actionLink: '/kzi',
    actionTextFr: 'S\'inscrire maintenant',
    actionTextEn: 'Register Now'
  },
  {
    id: 'notif-3',
    titleFr: '📖 Nouveauté Boutique : "L\'Onction du Réveil"',
    titleEn: '📖 New in Shop : "The Anointing of Awakening"',
    messageFr: 'Le nouveau livre d\'étude du Ministère Génération Joël est désormais disponible en format physique et E-book.',
    messageEn: 'The brand new study book by Generation Joel Ministry is now available in physical and E-book format.',
    category: 'shop',
    urgent: false,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    actionLink: '/shop',
    actionTextFr: 'Découvrir le livre',
    actionTextEn: 'View Book'
  }
];

const initialShopItems: ShopItem[] = [
  {
    id: 'book-1',
    titleFr: 'L\'Effusion de l\'Esprit - Joël 2:28',
    titleEn: 'The Outpouring of the Spirit - Joel 2:28',
    descFr: 'Un guide spirituel profond sur le réveil prophétique de la jeunesse et l\'intercession dans les derniers temps.',
    descEn: 'A profound spiritual guide on the prophetic awakening of youth and intercession in the last days.',
    priceEur: 18.50,
    priceUsd: 20.00,
    priceFc: 50000,
    category: 'books',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'apparel-1',
    titleFr: 'T-Shirt Officiel MGJ Monde (Vert Olive)',
    titleEn: 'Official MGJ Monde T-Shirt (Olive Green)',
    descFr: 'T-shirt 100% coton bio de haute qualité avec le logo officiel Génération Joël brodé en or.',
    descEn: 'High quality 100% organic cotton t-shirt with the official Generation Joel logo embroidered in gold.',
    priceEur: 24.99,
    priceUsd: 27.00,
    priceFc: 68000,
    category: 'apparel',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'apparel-2',
    titleFr: 'Hoodie Premium "Génération Joël 2:28"',
    titleEn: 'Premium Hoodie "Generation Joel 2:28"',
    descFr: 'Sweat à capuche molletonné confortable, idéal pour les veillées de prière et conventions hivernales.',
    descEn: 'Comfortable fleece hoodie, perfect for prayer vigils and winter conventions.',
    priceEur: 45.00,
    priceUsd: 49.00,
    priceFc: 125000,
    category: 'apparel',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'media-1',
    titleFr: 'Coffret USB : 12 Enseignements sur la Prière d\'Autorité',
    titleEn: 'USB Box Set : 12 Teachings on Prayer of Authority',
    descFr: 'Clé USB 64 Go dorée contenant 12 prédications majeures en haute définition MP4 et MP3.',
    descEn: '64GB golden USB drive containing 12 major sermons in high definition MP4 and MP3.',
    priceEur: 35.00,
    priceUsd: 38.00,
    priceFc: 95000,
    category: 'media',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'book-2',
    titleFr: 'Le Combat Spirituel & La Protection Divine',
    titleEn: 'Spiritual Warfare & Divine Protection',
    descFr: 'Manuel d\'intercession pratique pour briser les liens et posséder ses portes spirituelles.',
    descEn: 'Practical intercession manual to break chains and possess spiritual gates.',
    priceEur: 15.00,
    priceUsd: 16.50,
    priceFc: 42000,
    category: 'books',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    inStock: true
  }
];

const initialSpeakers: ConventionSpeaker[] = [
  {
    id: 'speaker-1',
    name: 'Couple Visionnaire Réussite & Irène MANDAKU',
    roleFr: 'Couple Visionnaire & Hôte de la Convention KZI',
    roleEn: 'Visionary Couple & Host of the KZI Convention',
    bioFr: 'Serviteurs de Dieu oints et visionnaires des Ministères Génération Joël (MGJ Monde), hôtes de la 31ème Grande Convention Internationale à Kolwezi.',
    bioEn: 'Anointed servants of God and visionary couple of Generation Joel Ministries (MGJ Monde), hosts of the 31st Grand International Convention in Kolwezi.',
    imageUrl: '/speakers/couple-mandaku.jpg'
  },
  {
    id: 'speaker-reussite',
    name: 'Révérend Réussite MANDAKU',
    roleFr: 'Visionnaire & Fondateur MGJ Monde',
    roleEn: 'Visionary & Founder MGJ Monde',
    bioFr: 'Homme de foi, visionnaire et oint pour le réveil des nations selon la prophétie de Joël 2:28.',
    bioEn: 'Man of faith, visionary, and anointed for the revival of nations according to Joel 2:28.',
    imageUrl: '/speakers/reussite-mandaku.jpg'
  },
  {
    id: 'speaker-irene',
    name: 'Maman Irène MANDAKU',
    roleFr: 'Co-Visionnaire & Maman de la Convention KZI',
    roleEn: 'Co-Visionary & Mother of the KZI Convention',
    bioFr: 'Servante de Dieu ointe pour l\'intercession, l\'encouragement et l\'édification spirituelle du peuple de Dieu.',
    bioEn: 'Servant of God anointed for intercession, encouragement, and the spiritual edification of God\'s people.',
    imageUrl: '/speakers/irene-mandaku.jpg'
  },
  {
    id: 'speaker-invite-1',
    name: 'Apôtre & Orateur Principal',
    roleFr: 'Orateur Apostolique & Invité KZI 2026',
    roleEn: 'Apostolic Speaker & KZI 2026 Guest',
    bioFr: 'Ministre apostolique invité spécialement pour dispenser la parole d\'onction et de puissance lors des plénières.',
    bioEn: 'Apostolic minister specially invited to dispense the word of anointing and power during the plenary sessions.',
    imageUrl: '/speakers/orateur-kzi-1.jpg'
  },
  {
    id: 'speaker-2',
    name: 'Prophétesse Sarah Malu',
    roleFr: 'Oratrice Invitée (Spécialiste Intercession)',
    roleEn: 'Guest Speaker (Intercession Specialist)',
    bioFr: 'Voix prophétique des nations apportant un ministère de feu, de délivrance et de prière exaucée.',
    bioEn: 'Prophetic voice to the nations bringing a ministry of fire, deliverance, and answered prayer.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'speaker-3',
    name: 'Chantre Emmanuel Kasa',
    roleFr: 'Directeur Artistique & Louange MGJ',
    roleEn: 'Worship Leader & Artistic Director MGJ',
    bioFr: 'Conducteur d\'adoration oint dont les mélodies transportent le peuple de Dieu dans le lieu très saint.',
    bioEn: 'Anointed worship leader whose melodies transport the people of God into the holy of holies.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  }
];

const initialSchedule: ScheduleItem[] = [
  // JOUR 1 - Dimanche 02 Août
  {
    id: 'sched-1',
    day: 1,
    time: '09:00 - 13:00',
    titleFr: 'Culte Solennel d\'Ouverture : L\'Appel de Joël',
    titleEn: 'Solemn Opening Service : The Call of Joel',
    descFr: 'Consécration générale, louange et premier message prophétique d\'introduction à la 31ème Grande Convention.',
    descEn: 'General consecration, worship, and opening prophetic message introducing the 31st Grand Convention.',
    speakerName: 'Réussite & Irène MANDAKU'
  },
  {
    id: 'sched-2',
    day: 1,
    time: '16:00 - 19:00',
    titleFr: 'Plénière du Soir : L\'Effusion de l\'Esprit (Joël 2:28)',
    titleEn: 'Evening Plenary : The Outpouring of the Spirit (Joel 2:28)',
    descFr: 'Enseignement fondamental sur l\'effusion prophétique des derniers temps et prière d\'activation.',
    descEn: 'Fundamental teaching on the prophetic outpouring of the last days and activation prayer.',
    speakerName: 'Réussite & Irène MANDAKU'
  },

  // JOUR 2 - Lundi 03 Août
  {
    id: 'sched-3',
    day: 2,
    time: '09:00 - 12:30',
    titleFr: 'Séminaire des Leaders & Administration du Ministère',
    titleEn: 'Leadership Seminar & Ministry Administration',
    descFr: 'Formation spéciale pour les pasteurs, responsables de départements et encadreurs de la jeunesse.',
    descEn: 'Special training for pastors, department leaders, and youth directors.',
    speakerName: 'Pasteur Jeremie Kongolo'
  },
  {
    id: 'sched-4',
    day: 2,
    time: '15:30 - 18:30',
    titleFr: 'Atelier Média : Évangélisation dans l\'Ère Numérique',
    titleEn: 'Media Workshop : Evangelism in the Digital Era',
    descFr: 'Comment évangéliser par les médias (Facebook, YouTube, TikTok) avec excellence et un impact mondial.',
    descEn: 'How to evangelize through media (Facebook, YouTube, TikTok) with excellence and global impact.',
    speakerName: 'Équipe Média MGJ'
  },

  // JOUR 3 - Mardi 04 Août
  {
    id: 'sched-5',
    day: 3,
    time: '09:00 - 13:00',
    titleFr: 'Grande Matinée d\'Intercession & Combat Spirituel',
    titleEn: 'Great Morning of Intercession & Spiritual Warfare',
    descFr: 'Prières d\'autorité pour briser les jougs familiaux, territoriaux et posséder ses portes spirituelles.',
    descEn: 'Prayers of authority to break familial and territorial yokes and possess spiritual gates.',
    speakerName: 'Prophétesse Sarah Malu'
  },
  {
    id: 'sched-6',
    day: 3,
    time: '16:30 - 19:30',
    titleFr: 'Session Prophétique : La Voix de l\'Intercesseur',
    titleEn: 'Prophetic Session : The Voice of the Intercessor',
    descFr: 'Enseignement sur le discernement spirituel, l\'écoute de Dieu et les secrets de la prière exaucée.',
    descEn: 'Teaching on spiritual discernment, hearing God\'s voice, and secrets to answered prayer.',
    speakerName: 'Prophétesse Sarah Malu'
  },

  // JOUR 4 - Mercredi 05 Août
  {
    id: 'sched-7',
    day: 4,
    time: '09:30 - 14:00',
    titleFr: 'Journée Spéciale de Guérison & Délivrance',
    titleEn: 'Special Day of Healing & Deliverance',
    descFr: 'Imposition des mains, prière pour les malades et délivrance des oppressions par la puissance du Saint-Esprit.',
    descEn: 'Laying on of hands, prayer for the sick, and deliverance from oppressions by the Holy Spirit\'s power.',
    speakerName: 'Prophétesse Sarah Malu & Équipe Pastorale'
  },
  {
    id: 'sched-8',
    day: 4,
    time: '17:00 - 20:00',
    titleFr: 'Soirée de Témoignages & Actions de Grâces',
    titleEn: 'Evening of Testimonies & Thanksgiving',
    descFr: 'Partage des miracles spirituels, guérisons et louange triomphante à la gloire de Jésus-Christ.',
    descEn: 'Sharing spiritual miracles, healings, and triumphant worship to the glory of Jesus Christ.',
    speakerName: 'Chantre Emmanuel Kasa'
  },

  // JOUR 5 - Jeudi 06 Août
  {
    id: 'sched-9',
    day: 5,
    time: '09:00 - 12:30',
    titleFr: 'École des Ministères : L\'Appel & La Consécration',
    titleEn: 'School of Ministries : The Call & Consecration',
    descFr: 'Comprendre son appel spirituel, développer le caractère du serviteur de Dieu et fidélité dans le ministère.',
    descEn: 'Understanding your spiritual call, developing godly character, and faithfulness in ministry.',
    speakerName: 'Pasteur Jeremie Kongolo'
  },
  {
    id: 'sched-10',
    day: 5,
    time: '15:30 - 18:30',
    titleFr: 'Conférence thématique : Les Dons du Saint-Esprit',
    titleEn: 'Thematic Conference : Gifts of the Holy Spirit',
    descFr: 'Comment identifier, cultiver et opérer dans les 9 dons du Saint-Esprit avec sagesse et équilibre.',
    descEn: 'How to identify, cultivate, and operate in the 9 gifts of the Holy Spirit with wisdom and balance.',
    speakerName: 'Réussite & Irène MANDAKU'
  },

  // JOUR 6 - Vendredi 07 Août
  {
    id: 'sched-11',
    day: 6,
    time: '10:00 - 13:00',
    titleFr: 'Matinée de Louange Céleste & Adoration Prophétique',
    titleEn: 'Morning of Heavenly Praise & Prophetic Worship',
    descFr: 'Atelier avec les chantres, musiciens et chorales sur l\'adoration véritable en esprit et en vérité.',
    descEn: 'Workshop with worship leaders, musicians, and choirs on true worship in spirit and truth.',
    speakerName: 'Chantre Emmanuel Kasa'
  },
  {
    id: 'sched-12',
    day: 6,
    time: '21:00 - 04:00',
    titleFr: 'GRANDE VEILLÉE DE PRIÈS & FEU DU RÉVEIL (Nuit Blanche)',
    titleEn: 'GREAT PRAYER VIGIL & FIRE OF REVIVAL (All-Night Service)',
    descFr: 'Nuit entière d\'intercession, de cri prophétique, de louange et d\'effusion du Saint-Esprit sur Kolwezi.',
    descEn: 'All-night intercession, prophetic cry, worship, and outpouring of the Holy Spirit over Kolwezi.',
    speakerName: 'Tous les Orateurs & Chœur MGJ Monde'
  },

  // JOUR 7 - Samedi 08 Août
  {
    id: 'sched-13',
    day: 7,
    time: '11:00 - 15:00',
    titleFr: 'Symposium de la Jeunesse : Génération Joël 2:28',
    titleEn: 'Youth Symposium : Generation Joel 2:28',
    descFr: 'Rencontre grand format pour la jeunesse, panels sur l\'entrepreneuriat chrétien, la pureté et la destinée.',
    descEn: 'Grand youth gathering, panels on Christian entrepreneurship, purity, and fulfilling destiny.',
    speakerName: 'Réussite & Irène MANDAKU'
  },
  {
    id: 'sched-14',
    day: 7,
    time: '17:00 - 20:30',
    titleFr: 'Concert de Gala & Célébration Internationale',
    titleEn: 'Gala Concert & International Celebration',
    descFr: 'Grand concert de louange avec tous les artistes invités, délégations des provinces et de la diaspora.',
    descEn: 'Grand worship concert with all guest artists, provincial delegations, and diaspora members.',
    speakerName: 'Chantre Emmanuel Kasa & Invités'
  },

  // JOUR 8 - Dimanche 09 Août
  {
    id: 'sched-15',
    day: 8,
    time: '09:00 - 14:30',
    titleFr: 'GRAND CULTE DE CLÔTURE, SAINTE CÈNE & ENVOI',
    titleEn: 'GRAND CLOSING SERVICE, HOLY COMMUNION & SENDING OUT',
    descFr: 'Culte apothéose, partage de la Sainte Cène, onction d\'huile sur tous les participants et bénédiction apostolique.',
    descEn: 'Grand finale service, Holy Communion, anointing oil over all attendees, and apostolic blessing.',
    speakerName: 'Réussite & Irène MANDAKU & Comité International'
  }
];

const initialDonations: DonationRecord[] = [
  {
    id: 'don-1',
    userId: 'user-demo',
    userName: 'Frère David K.',
    type: 'tithes',
    amount: 120,
    currency: 'EUR',
    paymentMethod: 'Carte Bancaire',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    receiptNumber: 'REC-MGJ-9821'
  },
  {
    id: 'don-2',
    userId: 'user-demo',
    userName: 'Sœur Marie T.',
    type: 'kzi',
    amount: 50,
    currency: 'USD',
    paymentMethod: 'Mobile Money',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    receiptNumber: 'REC-MGJ-9844'
  }
];

const initialOrders: ShopOrder[] = [
  {
    id: 'ord-101',
    userId: 'mgj-demo-pastor',
    userEmail: 'pasteur.joel@mediamgjmonde.org',
    userName: 'Pasteur Jean-Marc Joël',
    items: [
      { product: initialShopItems[0], quantity: 1 },
      { product: initialShopItems[1], quantity: 2 }
    ],
    totalEur: 68.48,
    status: 'Expédié',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  }
];

const initialNotes: SermonNote[] = [
  {
    id: 'note-1',
    title: 'La Joie et la puissance de Joël 2:28',
    content: '1. Dieu promet une effusion universelle ("sur toute chair").\n2. Les jeunes ont des visions bibliques pour diriger leur avenir.\n3. L\'intercession prépare l\'atmosphère pour le miraculeux.',
    date: new Date().toLocaleDateString('fr-FR')
  }
];

const initialAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann-kzi-2026-com1',
    titleFr: '📢 COMMUNIQUÉ IMPORTANT : DERNIÈRE LIGNE DROITE !',
    titleEn: '📢 IMPORTANT COMMUNIQUÉ: FINAL HOME STRETCH!',
    contentFr: `🌍 GRANDE CONVENTION INTERNATIONALE DE KOLWEZI 2026

Du 02 au 09 août 2026 — Jour J - 21.

À l'attention de tous les participants en provenance des villes autres que Lubumbashi, Likasi, Kipushi, Kolwezi, Kasumbalesa, Sakania et Fungurume :
Vous êtes priés de signaler obligatoirement votre arrivée et votre participation auprès de l'administration avant votre déplacement.

Contact Administration (WhatsApp uniquement) : +243 99 022 8048

Veuillez nous informer au plus tôt pour une meilleure prise en charge logistique.

🏡 CONDITIONS D'HÉBERGEMENT & LOGEMENT

Les options de logement à Kolwezi dépendront de la bourse de chaque participant :

- Site d'accueil officiel : L'Internat Umoja a été réservé par l'organisation.
- Autres options : Les réservations d'hôtels, d'appartements ou de Guest Houses restent à la charge individuelle de chacun.

💰 FRAIS DE PARTICIPATION & CONTRIBUTIONS
- Participants de Kolwezi : 10 $ + 2 PHs
- Participants des autres villes/provenances : 5 $ + 2 PHs

NB : PAS DE LOGEMENT GRATUIT.

🚘 OPTIONS DE TRANSPORT (Au départ de Lubumbashi)
Pour la délégation de Lubumbashi, voici les tarifs disponibles pour rejoindre Kolwezi :
- Bus réservé par l'organisation (Délégation) : 35 000 FC
- Bus Mulykap : 50 000 FC
- Voie Aérienne (Avion) : 200 $ (Aller simple — réservation à votre charge.)

En route vers la réussite de ce grand rendez-vous...

Que Dieu vous bénisse abondamment !

L'Administration`,
    contentEn: `🌍 GRAND INTERNATIONAL CONVENTION OF KOLWEZI 2026

From August 02 to 09, 2026 — D-Day - 21.

Attention to all participants arriving from cities other than Lubumbashi, Likasi, Kipushi, Kolwezi, Kasumbalesa, Sakania, and Fungurume:
You are strictly required to report your arrival and participation to the administration prior to your travel.

Administration Contact (WhatsApp only): +243 99 022 8048

Please inform us as early as possible to ensure proper logistical coordination.

🏡 ACCOMMODATION & LODGING CONDITIONS

Lodging options in Kolwezi will depend on each participant's budget:

- Official hosting site: The Umoja Boarding School has been reserved by the organization.
- Other options: Hotel, apartment, or Guest House bookings remain at each individual's expense.

💰 PARTICIPATION FEES & CONTRIBUTIONS
- Kolwezi participants: $10 + 2 PHs
- Participants from other cities/origins: $5 + 2 PHs

NOTE: NO FREE ACCOMMODATION.

🚘 TRANSPORT OPTIONS (Departing from Lubumbashi)
For the Lubumbashi delegation, available rates to reach Kolwezi are:
- Organization reserved Bus (Delegation): 35,000 FC
- Mulykap Bus: 50,000 FC
- Air Travel (Flight): $200 (One-way — booking at your own expense.)

On the road to the success of this great gathering...

May God bless you abundantly!

The Administration`,
    category: 'event',
    authorName: 'Administration MGJ Monde',
    authorRole: 'Comité Central d\'Organisation KZI 2026',
    createdAt: new Date().toISOString(),
    likesCount: 642,
    sharesCount: 215,
    pinned: true,
    comments: [
      {
        id: 'c-kzi-1',
        authorName: 'Frère Christian Kasongo',
        authorAvatar: 'C',
        content: 'Reçu 5/5 par l\'Administration ! Notre délégation est en route depuis Kinshasa, nous contactons immédiatement le +243 99 022 8048 sur WhatsApp ! 🙏🔥',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        likes: 42
      },
      {
        id: 'c-kzi-2',
        authorName: 'Sœur Dorcas Mbuyi',
        authorAvatar: 'D',
        content: 'Merci pour ces précisions claires et détaillées. Que le Seigneur bénisse le comité d\'organisation ! Rendez-vous à Kolwezi ! ✨🙌',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        likes: 19
      }
    ]
  },
  {
    id: 'ann-1',
    titleFr: '🔴 GRANDE EFFUSION PROPHÉTIQUE : Veillée de Feu & Joël 2:28',
    titleEn: '🔴 GREAT PROPHETIC OUTPOURING: Night of Fire & Joel 2:28',
    contentFr: 'Nous invitons tous les intercesseurs, ministres et fidèles connectés à se joindre à la grande veillée d\'intercession diffusée en direct sur tous nos canaux. Préparez vos cœurs à recevoir une dimension nouvelle de l\'onction prophétique !',
    contentEn: 'We invite all intercessors, ministers, and connected believers to join our grand intercessory all-night service broadcast live across all our channels. Prepare your hearts to receive a new dimension of prophetic anointing!',
    category: 'prophetic',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    authorName: 'Admin MGJ',
    authorRole: 'Administration & Secrétariat Général',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    likesCount: 342,
    sharesCount: 84,
    pinned: true,
    comments: [
      {
        id: 'c-101',
        authorName: 'Pasteur Élie Mukendi',
        authorAvatar: 'P',
        content: 'Gloire à Dieu ! Nous serons tous connectés en esprit et en vérité de Kinshasa ! 🔥🙌',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likes: 24
      },
      {
        id: 'c-102',
        authorName: 'Sœur Grâce Kasese',
        authorAvatar: 'S',
        content: 'Amen ! Que le feu du réveil descende puissamment selon Joël 2:28 ! 🙏✨',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        likes: 11
      }
    ]
  },
  {
    id: 'ann-2',
    titleFr: '⭐ 31ème Grande Convention Internationale KZI 2026 : Appel aux Sacrificateurs',
    titleEn: '⭐ 31st Grand International Convention KZI 2026: Call to Priests',
    contentFr: 'Du 02 au 09 Août 2026 à Kolwezi (KZI). Découvrez le clip d\'annonce officiel et le mot d\'orientation pastorale. Réservez votre badge QR dès aujourd\'hui et préparez votre voyage spirituel !',
    contentEn: 'From August 02 to 09, 2026 in Kolwezi (KZI). Watch the official announcement video and pastoral orientation word. Secure your QR badge today and prepare your spiritual journey!',
    category: 'event',
    mediaUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    mediaType: 'video',
    authorName: 'Secrétariat Général KZI',
    authorRole: 'Comité d\'Organisation International',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 518,
    sharesCount: 156,
    pinned: true,
    comments: [
      {
        id: 'c-103',
        authorName: 'Frère Jonathan Ilunga',
        authorAvatar: 'J',
        content: 'Badge VIP déjà réservé ! Vivement le mois d\'août à Kolwezi pour vivre cet impact apostolique !',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        likes: 38
      }
    ]
  },
  {
    id: 'ann-3',
    titleFr: '📖 Nouveaux Enseignements sur "Les 4 Piliers de l\'Onction"',
    titleEn: '📖 New Teachings on "The 4 Pillars of Anointing"',
    contentFr: 'Les notes complètes de l\'étude pastorale sur la consécration et la réforme des nations sont désormais accessibles dans votre section Notes et en e-book dans la boutique.',
    contentEn: 'The complete pastoral study notes on consecration and reforming nations are now available in your Notes section and as an e-book in the shop.',
    category: 'general',
    authorName: 'Administration MGJ Monde',
    authorRole: 'Équipe de Rédaction Multimédia',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likesCount: 189,
    sharesCount: 42,
    pinned: false,
    comments: [
      {
        id: 'c-104',
        authorName: 'Diacre Samuel Mbuji',
        authorAvatar: 'S',
        content: 'Les 4 piliers ont complètement révolutionné notre méditation quotidienne, merci Révérend ! 📖🙏',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        likes: 15
      }
    ]
  }
];

const initialKziWelcomeInfo: KziWelcomeInfo = {
  themeFr: 'L\'Effusion de l\'Esprit - Joël 2:28',
  themeEn: 'The Outpouring of the Spirit - Joel 2:28',
  datesFr: 'Du 02 au 09 Août 2026',
  datesEn: 'From August 02 to 09, 2026',
  locationFr: 'Kolwezi • Manika Sport (Sanctuaire Central)',
  locationEn: 'Kolwezi • Manika Sport (Central Sanctuary)',
  visionTextFr: 'La 31ème Grande Convention Internationale KZI 2026 est le grand rassemblement solennel et apostolique des Ministères Génération Joël (MGJ Monde). Des milliers de pèlerins se réunissent pour recevoir le baptême du feu, l\'imposition des mains et l\'équipement prophétique des derniers temps.',
  visionTextEn: 'The 31st Grand International Convention KZI 2026 is the solemn and apostolic gathering of Generation Joel Ministries (MGJ Monde). Thousands of pilgrims gather to receive the baptism of fire, laying on of hands, and end-time prophetic equipping.',
  kitPriceUsd: 25,
  kitPriceFc: 65000,
  busMgjPriceFc: 35000,
  busMulykapPriceFc: 50000,
  flightPriceUsd: 200,
  umojaBoardingStatus: 'Réservé par l\'organisation MGJ (Site d\'accueil officiel pour les délégations)',
  hotelAdviceFr: 'Les réservations d\'hôtels, appartements meublés ou Guest Houses à Kolwezi restent à la charge et aux frais individuels du participant.'
};

const initialKziRegistrants: KziRegistrant[] = [
  {
    id: 'kzi-reg-001',
    fullName: 'Pasteur Jean-Marc Joël',
    whatsapp: '+243 81 234 5678',
    city: 'Kinshasa',
    arrivalDate: '01/08/2026',
    departureDate: '09/08/2026',
    transport: 'Vol Aérien & Navette (200 USD)',
    lodgingOption: 'Internat Umoja (Réservé par MGJ)',
    passSerial: 'KZI-2026-VIP-AIR-101',
    seatsCount: 2,
    status: 'Confirmé - Logistique Planifiée',
    purchasedKit: true,
    kitType: 'KIT Officiel KZI 2026 (Pass VIP & T-shirt)',
    kitCount: 2,
    amountPaid: '200 USD (Vol) + 50 USD (Kit)',
    bookingType: 'flight',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'kzi-reg-002',
    fullName: 'Sœur Dorcas Mbuyi',
    whatsapp: '+243 99 111 2233',
    city: 'Lubumbashi',
    arrivalDate: '02/08/2026',
    departureDate: '09/08/2026',
    transport: 'Bus MGJ Officiel (35 000 FC)',
    lodgingOption: 'Internat Umoja (Réservé par MGJ)',
    passSerial: 'KZI-2026-VIP-BUS-114',
    seatsCount: 1,
    status: 'Confirmé - Logistique Planifiée',
    purchasedKit: true,
    kitType: 'KIT Officiel KZI 2026 (Pass VIP Numéroté)',
    kitCount: 1,
    amountPaid: '35 000 FC (Bus) + 25 USD (Kit)',
    bookingType: 'bus',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'kzi-reg-003',
    fullName: 'Frère Christian Kasongo',
    whatsapp: '+33 6 12 34 56 78',
    city: 'Paris / Europe',
    arrivalDate: '31/07/2026',
    departureDate: '10/08/2026',
    transport: 'Vol Aérien (Lubumbashi -> Kolwezi)',
    lodgingOption: 'Hôtel VIP 5 Étoiles (À charge individuelle)',
    passSerial: 'KZI-2026-VIP-AIR-119',
    seatsCount: 1,
    status: 'En attente de validation',
    purchasedKit: false,
    amountPaid: '200 USD',
    bookingType: 'flight',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 'kzi-reg-004',
    fullName: 'Frère Emmanuel Ngoie',
    whatsapp: '+243 99 222 3344',
    city: 'Likasi',
    arrivalDate: '02/08/2026',
    departureDate: '09/08/2026',
    transport: 'Bus Mulykap Express (50 000 FC)',
    lodgingOption: 'Internat Umoja (Réservé par MGJ)',
    passSerial: 'KZI-2026-VIP-BUS-128',
    seatsCount: 3,
    status: 'Confirmé - Logistique Planifiée',
    purchasedKit: true,
    kitType: 'KIT Officiel KZI 2026 (Pack 3x Pass VIP & Polo)',
    kitCount: 3,
    amountPaid: '150 000 FC (Bus) + 75 USD (Kit)',
    bookingType: 'kit',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_announcements') || '[]');
      const saved = localStorage.getItem('mediamondemjg_announcements');
      if (saved) {
        const parsed: AnnouncementItem[] = JSON.parse(saved);
        const updated = parsed.map(ann => {
          if (ann.authorName === 'Révérend Réussite Ngoie Mandaku' || ann.authorName === 'Administration MGJ Monde') {
            return { ...ann, authorName: 'Admin MGJ', authorRole: 'Administration & Secrétariat Général' };
          }
          return ann;
        });
        const missing = initialAnnouncements.filter(ia => !updated.some(pa => pa.id === ia.id) && !delIds.includes(ia.id));
        return [...missing, ...updated].filter(a => !delIds.includes(a.id));
      }
      return initialAnnouncements.filter(a => !delIds.includes(a.id));
    } catch (e) {
      return initialAnnouncements;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_notifs') || '[]');
      const saved = localStorage.getItem('mediamondemjg_notifs');
      if (saved) {
        const parsed: NotificationItem[] = JSON.parse(saved);
        const missing = initialNotifications.filter(inotif => !parsed.some(pn => pn.id === inotif.id) && !delIds.includes(inotif.id));
        return [...missing, ...parsed].filter(n => !delIds.includes(n.id));
      }
      return initialNotifications.filter(n => !delIds.includes(n.id));
    } catch (e) {
      return initialNotifications;
    }
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_shop');
      return saved ? JSON.parse(saved) : initialShopItems;
    } catch (e) { return initialShopItems; }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [orders, setOrders] = useState<ShopOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch (e) { return initialOrders; }
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_donations');
      return saved ? JSON.parse(saved) : initialDonations;
    } catch (e) { return initialDonations; }
  });

  const [speakers, setSpeakers] = useState<ConventionSpeaker[]>(() => {
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_speakers') || '[]');
      const saved = localStorage.getItem('mediamondemjg_speakers');
      if (saved) {
        const parsed: ConventionSpeaker[] = JSON.parse(saved);
        const updated = parsed.map(s => {
          if (s.id === 'speaker-1' && (s.imageUrl === '/poster-kzi-2026.jpg' || s.imageUrl.includes('unsplash'))) {
            return { ...s, name: 'Couple Visionnaire Réussite & Irène MANDAKU', imageUrl: '/speakers/couple-mandaku.jpg' };
          }
          if (s.id === 'speaker-reussite' && s.imageUrl.includes('unsplash')) {
            return { ...s, imageUrl: '/speakers/reussite-mandaku.jpg' };
          }
          if (s.id === 'speaker-irene' && s.imageUrl.includes('unsplash')) {
            return { ...s, imageUrl: '/speakers/irene-mandaku.jpg' };
          }
          return s;
        });
        const missingNew = initialSpeakers.filter(is => !updated.some(ps => ps.id === is.id) && !delIds.includes(is.id));
        return [...updated, ...missingNew].filter(s => !delIds.includes(s.id));
      }
      return initialSpeakers.filter(s => !delIds.includes(s.id));
    } catch (e) { return initialSpeakers; }
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_schedule') || '[]');
      const saved = localStorage.getItem('mediamondemjg_schedule');
      if (saved) {
        const parsed: ScheduleItem[] = JSON.parse(saved);
        return parsed.filter(s => !delIds.includes(s.id));
      }
      return initialSchedule.filter(s => !delIds.includes(s.id));
    } catch (e) { return initialSchedule; }
  });

  const [sermonNotes, setSermonNotes] = useState<SermonNote[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_notes');
      return saved ? JSON.parse(saved) : initialNotes;
    } catch (e) { return initialNotes; }
  });

  const [kziRegistrantsCount, setKziRegistrantsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_kzi_count');
      return saved ? Number(saved) : 1428;
    } catch (e) { return 1428; }
  });

  const [isUserRegisteredKzi, setIsUserRegisteredKzi] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mediamondemjg_user_kzi') === 'true';
    } catch (e) { return false; }
  });

  const [kziRegistrantsList, setKziRegistrantsList] = useState<KziRegistrant[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_kzi_regs_v2');
      return saved ? JSON.parse(saved) : initialKziRegistrants;
    } catch (e) { return initialKziRegistrants; }
  });

  const [kziWelcomeInfo, setKziWelcomeInfo] = useState<KziWelcomeInfo>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_kzi_info_v2');
      return saved ? JSON.parse(saved) : initialKziWelcomeInfo;
    } catch (e) { return initialKziWelcomeInfo; }
  });

  useEffect(() => { try { localStorage.setItem('mediamondemjg_announcements', JSON.stringify(announcements)); } catch (e) { console.warn(e); } }, [announcements]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_notifs', JSON.stringify(notifications)); } catch (e) { console.warn(e); } }, [notifications]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_shop', JSON.stringify(shopItems)); } catch (e) { console.warn(e); } }, [shopItems]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_cart', JSON.stringify(cart)); } catch (e) { console.warn(e); } }, [cart]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_orders', JSON.stringify(orders)); } catch (e) { console.warn(e); } }, [orders]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_donations', JSON.stringify(donations)); } catch (e) { console.warn(e); } }, [donations]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_speakers', JSON.stringify(speakers)); } catch (e) { console.warn('Could not save speakers to localStorage quota:', e); } }, [speakers]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_schedule', JSON.stringify(schedule)); } catch (e) { console.warn(e); } }, [schedule]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_notes', JSON.stringify(sermonNotes)); } catch (e) { console.warn(e); } }, [sermonNotes]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_kzi_regs_v2', JSON.stringify(kziRegistrantsList)); } catch (e) { console.warn(e); } }, [kziRegistrantsList]);
  useEffect(() => { try { localStorage.setItem('mediamondemjg_kzi_info_v2', JSON.stringify(kziWelcomeInfo)); } catch (e) { console.warn(e); } }, [kziWelcomeInfo]);

  useEffect(() => {
    // 1. Speakers sync & merge
    const unsubSpeakers = onSnapshot(collection(db, 'convention_speakers'), (snapshot) => {
      const liveSpeakers: ConventionSpeaker[] = [];
      snapshot.forEach((docSnap) => {
        liveSpeakers.push(docSnap.data() as ConventionSpeaker);
      });
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_speakers') || '[]');
      setSpeakers(prev => {
        const map = new Map<string, ConventionSpeaker>();
        prev.forEach(s => !delIds.includes(s.id) && map.set(s.id, s));
        liveSpeakers.forEach(s => !delIds.includes(s.id) && map.set(s.id, s));
        const merged = Array.from(map.values());
        merged.forEach(s => {
          if (!liveSpeakers.some(l => l.id === s.id)) {
            setDoc(doc(db, 'convention_speakers', s.id), s, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('speakers sync error:', error));

    // 2. Schedule sync & merge
    const unsubSchedule = onSnapshot(collection(db, 'convention_schedule'), (snapshot) => {
      const liveSchedule: ScheduleItem[] = [];
      snapshot.forEach((docSnap) => {
        liveSchedule.push(docSnap.data() as ScheduleItem);
      });
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_schedule') || '[]');
      setSchedule(prev => {
        const map = new Map<string, ScheduleItem>();
        prev.forEach(s => !delIds.includes(s.id) && map.set(s.id, s));
        liveSchedule.forEach(s => !delIds.includes(s.id) && map.set(s.id, s));
        const merged = Array.from(map.values()).sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time));
        merged.forEach(s => {
          if (!liveSchedule.some(l => l.id === s.id)) {
            setDoc(doc(db, 'convention_schedule', s.id), s, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('schedule sync error:', error));

    // 3. Announcements sync & merge (Never delete existing announcements when uploading media)
    const unsubAnnouncements = onSnapshot(collection(db, 'mgj_announcements'), (snapshot) => {
      const liveAnns: AnnouncementItem[] = [];
      snapshot.forEach((docSnap) => {
        liveAnns.push(docSnap.data() as AnnouncementItem);
      });
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_announcements') || '[]');
      setAnnouncements(prev => {
        const map = new Map<string, AnnouncementItem>();
        prev.forEach(a => !delIds.includes(a.id) && map.set(a.id, a));
        liveAnns.forEach(a => !delIds.includes(a.id) && map.set(a.id, a));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        merged.forEach(a => {
          if (!liveAnns.some(l => l.id === a.id)) {
            // Backup initial/unsynced announcements to Firestore
            setDoc(doc(db, 'mgj_announcements', a.id), a, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('announcements sync error:', error));

    // 4. Notifications sync & merge
    const unsubNotifications = onSnapshot(collection(db, 'mgj_notifications'), (snapshot) => {
      const liveNotifs: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        liveNotifs.push(docSnap.data() as NotificationItem);
      });
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_notifs') || '[]');
      setNotifications(prev => {
        const map = new Map<string, NotificationItem>();
        prev.forEach(n => !delIds.includes(n.id) && map.set(n.id, n));
        liveNotifs.forEach(n => !delIds.includes(n.id) && map.set(n.id, n));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        merged.forEach(n => {
          if (!liveNotifs.some(l => l.id === n.id)) {
            setDoc(doc(db, 'mgj_notifications', n.id), n, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('notifications sync error:', error));

    // 5. Shop Items sync & merge
    const unsubShopItems = onSnapshot(collection(db, 'shop_items'), (snapshot) => {
      const liveItems: ShopItem[] = [];
      snapshot.forEach((docSnap) => {
        liveItems.push(docSnap.data() as ShopItem);
      });
      setShopItems(prev => {
        const map = new Map<string, ShopItem>();
        prev.forEach(i => map.set(i.id, i));
        liveItems.forEach(i => map.set(i.id, i));
        const merged = Array.from(map.values());
        merged.forEach(i => {
          if (!liveItems.some(l => l.id === i.id)) {
            setDoc(doc(db, 'shop_items', i.id), i, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('shop_items sync error:', error));

    // 6. Shop Orders sync & merge
    const unsubOrders = onSnapshot(collection(db, 'shop_orders'), (snapshot) => {
      const liveOrders: ShopOrder[] = [];
      snapshot.forEach((docSnap) => {
        liveOrders.push(docSnap.data() as ShopOrder);
      });
      setOrders(prev => {
        const map = new Map<string, ShopOrder>();
        prev.forEach(o => map.set(o.id, o));
        liveOrders.forEach(o => map.set(o.id, o));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        merged.forEach(o => {
          if (!liveOrders.some(l => l.id === o.id)) {
            setDoc(doc(db, 'shop_orders', o.id), o, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('orders sync error:', error));

    // 7. Donations sync & merge
    const unsubDonations = onSnapshot(collection(db, 'shop_donations'), (snapshot) => {
      const liveDonations: DonationRecord[] = [];
      snapshot.forEach((docSnap) => {
        liveDonations.push(docSnap.data() as DonationRecord);
      });
      setDonations(prev => {
        const map = new Map<string, DonationRecord>();
        prev.forEach(d => map.set(d.id, d));
        liveDonations.forEach(d => map.set(d.id, d));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        merged.forEach(d => {
          if (!liveDonations.some(l => l.id === d.id)) {
            setDoc(doc(db, 'shop_donations', d.id), d, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('donations sync error:', error));

    // 8. Kzi Registrants sync & merge
    const unsubKziRegistrants = onSnapshot(collection(db, 'kzi_registrants'), (snapshot) => {
      const liveRegs: KziRegistrant[] = [];
      snapshot.forEach((docSnap) => {
        liveRegs.push(docSnap.data() as KziRegistrant);
      });
      setKziRegistrantsList(prev => {
        const map = new Map<string, KziRegistrant>();
        prev.forEach(r => map.set(r.id, r));
        liveRegs.forEach(r => map.set(r.id, r));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        merged.forEach(r => {
          if (!liveRegs.some(l => l.id === r.id)) {
            setDoc(doc(db, 'kzi_registrants', r.id), r, { merge: true }).catch(() => {});
          }
        });
        return merged;
      });
    }, (error) => console.warn('kzi_registrants sync error:', error));

    return () => {
      unsubSpeakers();
      unsubSchedule();
      unsubAnnouncements();
      unsubNotifications();
      unsubShopItems();
      unsubOrders();
      unsubDonations();
      unsubKziRegistrants();
    };
  }, []);

  const registerForKzi = () => {
    setIsUserRegisteredKzi(true);
    localStorage.setItem('mediamondemjg_user_kzi', 'true');
    setKziRegistrantsCount(prev => {
      const next = prev + 1;
      localStorage.setItem('mediamondemjg_kzi_count', String(next));
      return next;
    });
  };

  const addKziRegistrant = (reg: Omit<KziRegistrant, 'id' | 'createdAt' | 'passSerial' | 'status'> & { passSerial?: string; status?: any }) => {
    const nextSerialNum = kziRegistrantsList.length + 42;
    const serial = reg.passSerial || `KZI-2026-VIP-${reg.transport?.includes('Avion') ? 'AIR' : reg.purchasedKit ? 'KIT' : 'BUS'}-${nextSerialNum}`;
    const newReg: KziRegistrant = {
      ...reg,
      id: `kzi-reg-${Date.now()}`,
      passSerial: serial,
      status: reg.status || 'Confirmé - Logistique Planifiée',
      createdAt: new Date().toISOString()
    };
    setKziRegistrantsList(prev => [newReg, ...prev]);
    setKziRegistrantsCount(prev => prev + (reg.seatsCount || 1));
    setIsUserRegisteredKzi(true);
    localStorage.setItem('mediamondemjg_user_kzi', 'true');
    try {
      setDoc(doc(db, 'kzi_registrants', newReg.id), newReg).catch(() => {});
    } catch (e) {}
    return newReg;
  };

  const deleteKziRegistrant = (id: string) => {
    setKziRegistrantsList(prev => prev.filter(r => r.id !== id));
    try {
      deleteDoc(doc(db, 'kzi_registrants', id)).catch(() => {});
    } catch (e) {}
  };

  const updateKziRegistrantStatus = (id: string, status: 'Confirmé - Logistique Planifiée' | 'En attente de validation') => {
    setKziRegistrantsList(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      setDoc(doc(db, 'kzi_registrants', id), { status }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateKziWelcomeInfo = (info: KziWelcomeInfo) => {
    setKziWelcomeInfo(info);
  };

  // Cart logic
  const addCartItem = (product: ShopItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const removeCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const nextQ = item.quantity + delta;
        return nextQ > 0 ? { ...item, quantity: nextQ } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = async (userEmail: string, userName: string): Promise<ShopOrder> => {
    const total = cart.reduce((acc, item) => acc + (item.product.priceEur * item.quantity), 0);
    const newOrder: ShopOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: userEmail,
      userEmail,
      userName,
      items: [...cart],
      totalEur: Number(total.toFixed(2)),
      status: 'En préparation',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    try {
      setDoc(doc(db, 'shop_orders', newOrder.id), newOrder, { merge: true }).catch(() => {});
    } catch (e) {}
    return newOrder;
  };

  // Donations logic
  const createDonationRecord = (record: Omit<DonationRecord, 'id' | 'createdAt' | 'receiptNumber'>) => {
    const newDon: DonationRecord = {
      ...record,
      id: `DON-${Date.now()}`,
      createdAt: new Date().toISOString(),
      receiptNumber: `REC-MGJ-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setDonations(prev => [newDon, ...prev]);
    try {
      setDoc(doc(db, 'shop_donations', newDon.id), newDon, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  // Notification actions
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    try {
      setDoc(doc(db, 'mgj_notifications', newNotif.id), newNotif, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      setDoc(doc(db, 'mgj_notifications', id), { read: true }, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    notifications.forEach(n => {
      try {
        setDoc(doc(db, 'mgj_notifications', n.id), { read: true }, { merge: true }).catch(() => {});
      } catch (e) {}
    });
  };

  // Admin Shop/Convention actions
  const addShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    setShopItems(prev => [newItem, ...prev]);
    try {
      setDoc(doc(db, 'shop_items', newItem.id), newItem, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateShopItem = (item: ShopItem) => {
    setShopItems(prev => prev.map(i => i.id === item.id ? item : i));
    try {
      setDoc(doc(db, 'shop_items', item.id), item, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const addSpeaker = (speaker: Omit<ConventionSpeaker, 'id'>) => {
    const newSp: ConventionSpeaker = {
      ...speaker,
      id: `speaker-${Date.now()}`
    };
    setSpeakers(prev => [...prev, newSp]);
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_speakers') || '[]');
      const filtered = delIds.filter(d => d !== newSp.id);
      localStorage.setItem('mediamondemjg_deleted_speakers', JSON.stringify(filtered));
      setDoc(doc(db, 'convention_speakers', newSp.id), newSp).catch(() => {});
    } catch (e) {}
  };

  const updateSpeaker = (speaker: ConventionSpeaker) => {
    setSpeakers(prev => prev.map(s => s.id === speaker.id ? speaker : s));
    try {
      setDoc(doc(db, 'convention_speakers', speaker.id), speaker, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newSc: ScheduleItem = {
      ...item,
      id: `sched-${Date.now()}`
    };
    setSchedule(prev => [...prev, newSc]);
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_schedule') || '[]');
      const filtered = delIds.filter(d => d !== newSc.id);
      localStorage.setItem('mediamondemjg_deleted_schedule', JSON.stringify(filtered));
      setDoc(doc(db, 'convention_schedule', newSc.id), newSc).catch(() => {});
    } catch (e) {}
  };

  const deleteShopItem = (id: string) => {
    setShopItems(prev => prev.filter(i => i.id !== id));
    try {
      deleteDoc(doc(db, 'shop_items', id)).catch(() => {});
    } catch (e) {}
  };

  const deleteSpeaker = (id: string) => {
    setSpeakers(prev => prev.filter(s => s.id !== id));
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_speakers') || '[]');
      if (!delIds.includes(id)) {
        delIds.push(id);
        localStorage.setItem('mediamondemjg_deleted_speakers', JSON.stringify(delIds));
      }
      deleteDoc(doc(db, 'convention_speakers', id)).catch(() => {});
    } catch (e) {}
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(sc => sc.id !== id));
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_schedule') || '[]');
      if (!delIds.includes(id)) {
        delIds.push(id);
        localStorage.setItem('mediamondemjg_deleted_schedule', JSON.stringify(delIds));
      }
      deleteDoc(doc(db, 'convention_schedule', id)).catch(() => {});
    } catch (e) {}
  };

  const deleteNotification = (id: string) => {
    const target = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (target) {
      setAnnouncements(prev => prev.filter(a => a.id !== id.replace('notif-', 'ann-') && a.titleFr !== target.titleFr));
      try {
        const annDelIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_announcements') || '[]');
        announcements.forEach(a => {
          if (a.id === id.replace('notif-', 'ann-') || a.titleFr === target.titleFr) {
            if (!annDelIds.includes(a.id)) {
              annDelIds.push(a.id);
              localStorage.setItem('mediamondemjg_deleted_announcements', JSON.stringify(annDelIds));
            }
            deleteDoc(doc(db, 'mgj_announcements', a.id)).catch(() => {});
          }
        });
      } catch (e) {}
    }
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_notifs') || '[]');
      if (!delIds.includes(id)) {
        delIds.push(id);
        localStorage.setItem('mediamondemjg_deleted_notifs', JSON.stringify(delIds));
      }
      deleteDoc(doc(db, 'mgj_notifications', id)).catch(() => {});
    } catch (e) {}
  };

  const createAnnouncement = (titleOrObj: any, titleEn?: string, bodyFr?: string, bodyEn?: string, type: any = 'urgent', mediaUrl?: string, mediaType: 'image' | 'video' | 'audio' | 'none' = 'none', authorNameParam?: string, authorRoleParam?: string) => {
    let newAnn: AnnouncementItem;
    let notifCategory: any = 'general';
    let notifTitleFr = '';
    let notifTitleEn = '';
    let notifBodyFr = '';
    let notifBodyEn = '';

    if (typeof titleOrObj === 'object' && titleOrObj !== null) {
      newAnn = {
        id: `ann-${Date.now()}`,
        titleFr: titleOrObj.titleFr || '',
        titleEn: titleOrObj.titleEn || titleOrObj.titleFr || '',
        contentFr: titleOrObj.contentFr || titleOrObj.bodyFr || '',
        contentEn: titleOrObj.contentEn || titleOrObj.bodyEn || titleOrObj.contentFr || '',
        category: titleOrObj.category || 'general',
        mediaUrl: titleOrObj.mediaUrl,
        mediaType: titleOrObj.mediaType || (titleOrObj.mediaUrl ? 'image' : 'none'),
        authorName: titleOrObj.authorName || 'Admin MGJ',
        authorRole: titleOrObj.authorRole || 'Administration & Secrétariat Général',
        createdAt: new Date().toISOString(),
        likesCount: 1,
        pinned: titleOrObj.pinned || false
      };
      notifCategory = newAnn.category === 'prophetic' || newAnn.category === 'urgent' ? 'direct' : newAnn.category === 'event' ? 'kzi' : 'general';
      notifTitleFr = newAnn.titleFr;
      notifTitleEn = newAnn.titleEn;
      notifBodyFr = newAnn.contentFr;
      notifBodyEn = newAnn.contentEn;
    } else {
      const annCategory = type === 'urgent' ? 'prophetic' : type === 'event' ? 'event' : 'general';
      newAnn = {
        id: `ann-${Date.now()}`,
        titleFr: typeof titleOrObj === 'string' ? titleOrObj : '',
        titleEn: titleEn || (typeof titleOrObj === 'string' ? titleOrObj : ''),
        contentFr: bodyFr || '',
        contentEn: bodyEn || bodyFr || '',
        category: annCategory,
        mediaUrl: mediaUrl,
        mediaType: mediaType || (mediaUrl ? 'image' : 'none'),
        authorName: authorNameParam || 'Admin MGJ',
        authorRole: authorRoleParam || 'Administration & Secrétariat Général',
        createdAt: new Date().toISOString(),
        likesCount: 1,
        pinned: type === 'urgent' || type === 'event'
      };
      notifCategory = type === 'urgent' ? 'direct' : type === 'event' ? 'kzi' : 'general';
      notifTitleFr = typeof titleOrObj === 'string' ? titleOrObj : '';
      notifTitleEn = titleEn || '';
      notifBodyFr = bodyFr || '';
      notifBodyEn = bodyEn || '';
    }

    setAnnouncements(prev => [newAnn, ...prev]);
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_announcements') || '[]');
      const filtered = delIds.filter(d => d !== newAnn.id);
      localStorage.setItem('mediamondemjg_deleted_announcements', JSON.stringify(filtered));
      setDoc(doc(db, 'mgj_announcements', newAnn.id), newAnn, { merge: true }).catch(() => {});
    } catch (e) {}

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleFr: notifTitleFr,
      titleEn: notifTitleEn,
      messageFr: notifBodyFr,
      messageEn: notifBodyEn,
      bodyFr: notifBodyFr,
      bodyEn: notifBodyEn,
      category: notifCategory,
      type: typeof type === 'string' ? type : 'urgent',
      urgent: typeof type === 'string' ? type === 'urgent' : newAnn.category === 'prophetic',
      read: false,
      createdAt: new Date().toISOString(),
      actionLink: '/announcements',
      actionTextFr: 'Voir l\'Annonce & Médias',
      actionTextEn: 'View Announcement & Media',
      mediaUrl: newAnn.mediaUrl,
      mediaType: newAnn.mediaType
    };
    setNotifications(prev => [newNotif, ...prev]);
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_notifs') || '[]');
      const filtered = delIds.filter(d => d !== newNotif.id);
      localStorage.setItem('mediamondemjg_deleted_notifs', JSON.stringify(filtered));
      setDoc(doc(db, 'mgj_notifications', newNotif.id), newNotif, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const deleteAnnouncement = (id: string) => {
    const target = announcements.find(a => a.id === id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (target) {
      setNotifications(prev => prev.filter(n => n.id !== id.replace('ann-', 'notif-') && n.titleFr !== target.titleFr));
      try {
        const notifDelIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_notifs') || '[]');
        notifications.forEach(n => {
          if (n.id === id.replace('ann-', 'notif-') || n.titleFr === target.titleFr) {
            if (!notifDelIds.includes(n.id)) {
              notifDelIds.push(n.id);
              localStorage.setItem('mediamondemjg_deleted_notifs', JSON.stringify(notifDelIds));
            }
            deleteDoc(doc(db, 'mgj_notifications', n.id)).catch(() => {});
          }
        });
      } catch (e) {}
    }
    try {
      const delIds: string[] = JSON.parse(localStorage.getItem('mediamondemjg_deleted_announcements') || '[]');
      if (!delIds.includes(id)) {
        delIds.push(id);
        localStorage.setItem('mediamondemjg_deleted_announcements', JSON.stringify(delIds));
      }
      deleteDoc(doc(db, 'mgj_announcements', id)).catch(() => {});
    } catch (e) {}
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const likeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, likesCount: a.likesCount + 1 } : a));
  };

  const commentAnnouncement = (announcementId: string, content: string, authorName?: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      authorName: authorName || 'Fidèle Connecté',
      authorAvatar: authorName ? authorName[0].toUpperCase() : 'F',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setAnnouncements(prev => prev.map(a => {
      if (a.id === announcementId) {
        return {
          ...a,
          comments: [...(a.comments || []), newComment]
        };
      }
      return a;
    }));
  };

  const shareAnnouncementCount = (announcementId: string) => {
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, sharesCount: (a.sharesCount || 0) + 1 } : a));
  };

  const likeComment = (announcementId: string, commentId: string) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === announcementId && a.comments) {
        return {
          ...a,
          comments: a.comments.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c)
        };
      }
      return a;
    }));
  };

  // Sermon notes actions
  const addSermonNote = (title: string, content: string) => {
    const newNote: SermonNote = {
      id: `note-${Date.now()}`,
      title: title || 'Note de Prédication',
      content,
      date: new Date().toLocaleDateString('fr-FR')
    };
    setSermonNotes(prev => [newNote, ...prev]);
  };

  const deleteSermonNote = (id: string) => {
    setSermonNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppDataContext.Provider value={{
      notifications,
      announcements,
      shopItems,
      cart,
      orders,
      donations,
      speakers,
      schedule,
      sermonNotes,
      kziRegistrantsCount,
      isUserRegisteredKzi,
      registerForKzi,
      kziRegistrantsList,
      addKziRegistrant,
      deleteKziRegistrant,
      updateKziRegistrantStatus,
      kziWelcomeInfo,
      updateKziWelcomeInfo,
      addCartItem,
      removeCartItem,
      updateCartQuantity,
      clearCart,
      createOrder,
      createDonationRecord,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      addShopItem,
      updateShopItem,
      deleteShopItem,
      addSpeaker,
      updateSpeaker,
      deleteSpeaker,
      addScheduleItem,
      deleteScheduleItem,
      deleteNotification,
      createAnnouncement,
      deleteAnnouncement,
      togglePinAnnouncement,
      likeAnnouncement,
      commentAnnouncement,
      shareAnnouncementCount,
      likeComment,
      addSermonNote,
      deleteSermonNote
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
