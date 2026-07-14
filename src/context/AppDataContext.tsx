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
  KziWelcomeInfo,
  MgjAntenna,
  MgjSector
} from '../types/models';

interface AppDataContextType {
  antennas: MgjAntenna[];
  saveAntenna: (antenna: MgjAntenna) => void;
  deleteAntenna: (id: string) => void;
  resetAntennasToDefault: () => void;
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
  updateScheduleItem: (item: ScheduleItem) => void;
  deleteScheduleItem: (id: string) => void;
  deleteNotification: (id: string) => void;
  createAnnouncement: (titleOrObj: any, titleEn?: string, bodyFr?: string, bodyEn?: string, type?: any, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio' | 'none', authorName?: string, authorRole?: string) => void;
  updateAnnouncement: (item: AnnouncementItem) => void;
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

export const initialAntennas: MgjAntenna[] = [
  {
    id: 'ant-lubumbashi',
    number: 'I',
    name: 'LUBUMBASHI',
    country: 'RDC',
    presidentName: 'PASTEUR JOHN KALALA',
    presidentContact: '099 701 82 15',
    sectors: [
      { id: 'lub-1', name: 'BEL AIR', leaders: 'PASTEUR MICHEL BADI / BERGER DIDI DITU', contacts: '085 094 17 90 / 085 166 28 77', address: '20, AVENUE DES PLAINES, BEL AIR', days: 'LUNDI ET JEUDI', hours: '15H A 19H' },
      { id: 'lub-2', name: 'KAMALONDO', leaders: 'PASTEUR DIDIER TSHIPAMA', contacts: '099 243 79 39', address: '234, KILWA, KAMALONDO', days: 'JEUDI ET DIMANCHE', hours: '15H A 19H' },
      { id: 'lub-3', name: 'LIDO', leaders: 'PASTEUR RAYMOND NGOY', contacts: '099 584 09 00', address: '9, AVENUE NYANGWE, REF/ BASSIN LIDO/LIDO GOLF', days: 'LUNDI ET VENDREDI', hours: '15H A 19H' },
      { id: 'lub-4', name: 'CARREFOUR', leaders: 'PASTEUR JOSUE NUNGA / PASTEUR EZECHIEL ILUNGA', contacts: '084 247 29 12 / 081 992 42 43', address: 'AVENUES MUHAMED COIN CHEMIN PUBLIC, REF. PLYCLINIQUE SAINTE AGNES, ARRET EXPRESS, CARREFOUR.', days: 'LUNDI ET JEUDI', hours: '16H A 18H30' },
      { id: 'lub-5', name: 'CENTRE VILLE', leaders: 'PROPHETE SERGE HYPPO / PASTEUR GUY KASONGO', contacts: '099 205 75 74 / 099 974 80 30', address: '41, AVENUE MANIEMA, REF. FPI, CENTRE VILLE / KITANGO', days: 'LUNDI ET JEUDI / MERCREDI', hours: '15H A 19H / 9H A 16H' },
      { id: 'lub-6', name: 'GOLF FAUSTIN', leaders: 'PASTEUR PAUL MULONGO', contacts: '099 100 46 11', address: 'GOLF FAUSTIN, LUBUMBASHI', days: 'LUNDI ET JEUDI', hours: '15H A 19H' },
      { id: 'lub-7', name: 'KENYA', leaders: 'PASTEUR ELIE KOSHI', contacts: '097 464 97 13', address: '22, RUE KAMATANDA (CAMP REGIE)/KENYA', days: 'LUNDI ET JEUDI', hours: '15H A 18H30' },
      { id: 'lub-8', name: 'GOLF PLATEAU KARAVIA', leaders: 'PASTEUR ZACHARIE EVAMBI / PAPA CHRISTIAN SUDI', contacts: '099 760 95 27 / 081 850 34 11', address: '23, AVENUE MUKUNTO, GOLF PLATEAU, REF/ARRET STATION GOLF PLATEAU', days: 'MERCREDI ET DIMANCHE', hours: '15H A 19H' },
      { id: 'lub-9', name: 'KALUBWE', leaders: 'PASTEUR KOKO KALASA / PASTEUR CHRISTIAN SINYEMBO', contacts: '097 950 44 55 / 099 770 99 16', address: '19, AVENUE DES PIONNIERS, ARRET DES PRINCES, KALUBWE DOUBLE POTEAUX.', days: 'LUNDI ET JEUDI', hours: '15H A 18H30' },
      { id: 'lub-10', name: 'KINKA VILLE', leaders: 'PROPHETE JEEF NKONGAL', contacts: '099 558 74 89', address: '4, AVENUE RUTSHURU, Q/TABACONGO, REF. ARRET CHENGE SUR DU MARCHE', days: 'LUNDI ET JEUDI', hours: '16H A 19H' },
      { id: 'lub-11', name: 'GOLF MALELA', leaders: 'PASTEUR SONGO KASONGO', contacts: '099 817 95 78', address: '516, ROUTE KIPOPO GOLF MALELA', days: 'LUNDI ET JEUDI', hours: '16H A 19H' },
      { id: 'lub-12', name: 'ALLILAC', leaders: 'PROPHETE KEN MUYAYA', contacts: '081 477 04 55', address: 'ALLILAC, LUBUMBASHI', days: 'MARDI ET DIMANCHE', hours: '14H A 19H' },
      { id: 'lub-13', name: 'KILOBELOBE', leaders: 'PASTEUR JEREMIE MITSHABU', contacts: '099 770 19 34', address: 'KILOBELOBE, LUBUMBASHI', days: 'LUNDI ET JEUDI', hours: '15H A 19H' },
      { id: 'lub-14', name: 'CELLULE LUANO', leaders: 'PROPHETE PIERRE OMARI', contacts: '099 103 22 23', address: 'CELLULE LUANO, LUBUMBASHI', days: 'MERCREDI ET VENDREDI', hours: '15H A 18H' },
      { id: 'lub-15', name: 'HEWA BORA', leaders: 'PROPHETE ABRAHAM', contacts: '099 086 57 38', address: '741, AVENUE NYEMBO/ARRET BUS KABWE SESEYA', days: 'MARDI, VENDREDI ET DIMANCHE', hours: '15H A 19H' },
      { id: 'lub-16', name: 'CELLULE MATSHIPISHA', leaders: 'PASTEUR RENE NKONGOLO', contacts: '081 507 53 80', address: 'CELLULE MATSHIPISHA, LUBUMBASHI', days: 'LUNDI ET JEUDI', hours: '15H A 19H' },
      { id: 'lub-17', name: 'DU 30 JUIN', leaders: 'PASTEUR EZECHIEL RADJABU', contacts: '099 556 48 88', address: 'DU 30 JUIN, LUBUMBASHI', days: 'MERCREDI ET VENDREDI', hours: '16H A 18H30' },
      { id: 'lub-18', name: 'KASAPA', leaders: 'BERGERE JUDITH KITETE', contacts: '099 398 54 54', address: 'KASAPA, LUBUMBASHI', days: 'JEUDI ET DIMANCHE', hours: '15H A 18H30' },
      { id: 'lub-19', name: 'MWELA/GOLF', leaders: 'PASTEUR IRENE MANDAKU', contacts: '081 296 32 44', address: 'AVENUE KALUBI, Q, METEO 1, GOLF MWELA', days: 'MERCREDI ET VENDREDI', hours: '15H A 19H' },
      { id: 'lub-20', name: 'JOLI SITE KINSEVERE', leaders: 'PASTEUR GRACE MWEPU', contacts: '099 411 22 22', address: 'ROUTE KINSEVERE 22e POTEAU', days: 'LUNDI ET JEUDI', hours: '16H A 19H' },
      { id: 'lub-21', name: 'PLATEAU 4', leaders: 'BERGER DJO-GRACE NGOIE', contacts: '097 747 09 87', address: 'CS JENODICE/REF PETIT MARCHE DGI KAMANYOLA/PLATEAU 4/ Q,OASIS', days: 'LUNDI ET JEUDI', hours: '16H A 19H' },
      { id: 'lub-22', name: 'RUASHI', leaders: 'PASTEUR JOSEPH TSHAMA', contacts: '097 483 01 02', address: 'RUASHI, LUBUMBASHI', days: 'LUNDI ET JEUDI', hours: '15H A 19H' },
      { id: 'lub-23', name: 'CELLULE JUGES', leaders: 'BERGER RICHARD STONE', contacts: '097 414 61 94', address: 'CELLULE JUGES, LUBUMBASHI', days: 'MERCREDI ET DIMANCHE', hours: '15H A 19H' }
    ]
  },
  {
    id: 'ant-kolwezi',
    number: 'II',
    name: 'KOLWEZI',
    country: 'RDC',
    presidentName: 'PASTEUR PATRICK KANDA',
    presidentContact: '099 522 45 55',
    sectors: [
      { id: 'kzi-1', name: 'QUARTIER', leaders: 'PASTEUR PATRICK KANDA / PAST NICO IRUNG / PAST ETIENNE MALITELE / PAST GABY MUNGONGE', contacts: '099 522 45 55 / 099 117 25 47 / 097 225 96 57 / 099 719 00 00', address: '182, AVENUE MUKAKA/QUARTIER', days: 'LUNDI ET JEUDI', hours: '15H30 A 19H' },
      { id: 'kzi-2', name: 'VILLE', leaders: 'PASTEUR ELIE NDUMB / PAST LUC', contacts: '099 367 03 64 / 099 050 06 22', address: 'GAZUMBU N° 2, CENTRE VILLE', days: 'LUNDI ET JEUDI', hours: '15H30 A 19H30' },
      { id: 'kzi-3', name: 'LUILU', leaders: 'PASTEUR GAMALIEL MITEU / PAST ETIENNE MILAMBWE', contacts: '081 405 40 35 / 099 903 45 81', address: 'REF : ECOLE DU PASTEUR/LUILU', days: 'MARDI ET DIMANCHE', hours: '16H A 19H30' },
      { id: 'kzi-4', name: 'CITE GCM/KZI', leaders: 'PASTEUR HENRY EXCELLENCE KASHAL TSHIPWENU', contacts: '099 033 11 06', address: 'AV, BELANDE N° 4, CITE GCM KOLWEZI', days: 'MERCREDI ET VENDREDI', hours: '15H00 A 19H00' },
      { id: 'kzi-5', name: 'QUARTIER LATIN', leaders: 'PASTEUR NICOLAS MWANGAL MUSHID / PAST GRACE ILUNGA', contacts: '099 711 04 71 / 099 923 37 24', address: '9ème CHEMIN PUBLIC', days: 'MARDI ET JEUDI', hours: '16H A 19H30' },
      { id: 'kzi-6', name: 'JOLI SITE', leaders: 'PASTEUR TRIOMPHE MULANG / PAST MARC MULULU', contacts: '099 376 05 88', address: 'AV, YA MISANO REF MOON PALACE', days: 'LUNDI, JEUDI ET DIMANCHE', hours: '15H A 19H' },
      { id: 'kzi-7', name: 'TSHALA UZK', leaders: 'PASTEUR MICHEE KAHETA', contacts: '097 672 00 13', address: 'AV, CHANGEUR FORT 2EME ARRET', days: 'MERCREDI ET LUNDI ET DIMANCHE', hours: '15H A 19H' },
      { id: 'kzi-8', name: 'MUSONOI', leaders: 'PASTEUR JEREMIE KONGOLO / PAST HABACUC NGOIE', contacts: '099 979 30 81 / 099 125 28 43', address: 'TRABECA 5 N° 65, MUSONOI', days: 'VENDREDI', hours: '15H30 A 19H30' },
      { id: 'kzi-9', name: 'KAPATA', leaders: 'PASTEUR CALEB KASONGO / PAST JEAN RENE SIMBA', contacts: '097 211 81 49', address: 'AVENUE BUKAVU N° 8', days: 'MARDI ET DIMANCHE', hours: '16H A 19H30' },
      { id: 'kzi-10', name: 'CITE MANIKA', leaders: 'PASTEUR DJO NUMBI / PAST JEFF SILEKI', contacts: '099 793 79 62 / 099 448 81 15', address: 'N° AVENUE KASAI, CITE MANIKA', days: 'LUNDI ET MARDI', hours: '16H A 19H30' },
      { id: 'kzi-11', name: 'DIUR', leaders: 'PASTEUR MARDOCHEE KALENDA', contacts: '097 149 31 41', address: 'AVENUE 3Z N° 39', days: 'VENDREDI ET DIMANCHE', hours: '15H00 A 19H00' },
      { id: 'kzi-12', name: 'KAMANYOLA 2', leaders: 'PASTEUR GHYSLAIN MUBANGA RHEMA', contacts: '089 445 67 92', address: 'AVENUE TSHALA2 N° 29', days: 'MARDI ET VENDREDI', hours: '15H00 A 19H00' },
      { id: 'kzi-13', name: 'QUARTIER LATIN 2', leaders: 'PASTEUR MICHEE KAHETA', contacts: '097 672 00 13', address: '68, AVENUE NDJIBULUBO', days: 'MERCREDI VENDREDI ET DIMANCHE', hours: '15H30 A 19H' },
      { id: 'kzi-14', name: 'JOLI SITE GOUVERNORAT', leaders: 'PROPHETE ELIE MWENZ', contacts: '097 066 61 11', address: 'ROUTE KAZEMBE EN DIAGONALE DU GOUVERNORAT', days: 'LUNDI, MERCREDI ET DIMANCHE', hours: '16H A 19H30' },
      { id: 'kzi-15', name: 'JOLI SITE 2', leaders: 'PASTEUR PATRICK KYEMO', contacts: '099 249 78 53', address: "CHEMIN PUBLIQUE EN DIAGNOLE DE L'ECOLE SAINT PAUL", days: 'MARDI ET SAMEDI', hours: '16H A 19H30' },
      { id: 'kzi-16', name: 'TSHAMUNDENDA', leaders: 'PASTEUR EZECHIEL', contacts: '082 497 29 99', address: 'TSHAMUNDENDA, KOLWEZI', days: 'MARDI ET DIMANCHE', hours: '16H30 A 19H30' },
      { id: 'kzi-17', name: 'KAMANYOLA 1', leaders: 'PROPHETE HERITIER GRACE MUSEBA', contacts: '081 737 44 31', address: '19, AVENUE TSHANIKA, Q. KAMANYOLA/ ARRET ORTHODOXE, CITE MANIKA', days: 'LUNDI, JEUDI ET SAMEDI', hours: '16H30 A 19H30' }
    ]
  },
  {
    id: 'ant-kinshasa',
    number: 'III',
    name: 'KINSHASA',
    country: 'RDC',
    presidentName: 'PROPHETE DJOGRACE MWENZE',
    presidentContact: '081 350 66 77 / 081 350 66 17',
    sectors: [
      { id: 'kin-1', name: 'DELVAUX', leaders: 'PROPHETE DJOGRACE MWENZE / PROPHETE ETIENNE KABENGELE', contacts: '081 350 66 17 / 081 076 44 69', address: '17 ROUTE MATADI, AVENUE MAKANDA KABOBI, QUARTIER DELVAUX, COMMUNE NGALIEMA', days: 'LUNDI, JEUDI ET SAMEDI', hours: '16H30 A 19H30' },
      { id: 'kin-2', name: 'OZONE', leaders: 'PROPHETE ALLAN KYARIAKOU / PASTEUR MORGAN BOKEKE', contacts: '082 100 88 27 / 097 294 13 77 / 081 032 85 71', address: '14, AVENUE KAMUNDU, QUARTIER MANENGA, COMMUNE NGALIEMA', days: 'MERCREDI, VENDREDI ET DIMANCHE', hours: '16H30 A 19H30' },
      { id: 'kin-3', name: 'CITE VERTE (MAMAN MOBUTU)', leaders: 'PASTEUR JULES LUKOMBO', contacts: '081 364 35 44', address: '491, AVENUE LOGEC, QUARTIER MAMAN MOBUTU, COMMUNE MONT-NGAFULA', days: 'LUNDI, MERCREDI ET SAMEDI', hours: '17H30 A 20H30' },
      { id: 'kin-4', name: 'UPN', leaders: 'PASTEUR DON DE DIEU MAFUALA NKUSU', contacts: '089 790 00 10 / 081 310 00 10', address: '01, AVENUE BIKELA, REF. ALLEE SAMBA, Q/NGOMBA KIKUSA, COMMUNE NGALIEMA', days: 'MARDI ET DIMANCHE', hours: '17H A 19H30' },
      { id: 'kin-5', name: 'KINGASANI', leaders: 'PASTEUR GHISLAIN KIANGEBENE', contacts: '089 988 19 26', address: '59, AVENUE NGAMBO, QUARTIER PASCAL, COMMUNE KIMBASEKE', days: 'LUNDI, JEUDI ET DIMANCHE', hours: '17H30 A 19H30' },
      { id: 'kin-6', name: 'MBUDI', leaders: 'PASTEUR DIDIER BOOFI', contacts: '099 312 67 42', address: '70, AVENUE SANKURU, QUARIER MAZALA, CPA/NGALIEMA', days: 'MARDI ET DIMANCHE', hours: '16H30 A 19H30' },
      { id: 'kin-7', name: 'YOLO', leaders: 'PASTEUR DIEUDONNE TSHABOLA', contacts: '089 669 53 39', address: '63, AVENUE ANGO, QUARTIER YOLO NORD, REF, ARRET CHAPPELLE/KALAMU', days: 'LUNDI ET VENDREDI', hours: '16H30 A 19H30' },
      { id: 'kin-8', name: 'KINTAMBO', leaders: 'PASTEUR HERVE LUKEMBO', contacts: '081 881 78 60', address: '942, AVENUE COLONEL MONDJIBA, COMMUNE KINTAMBO', days: 'MARDI', hours: '16H30 A 19H30' }
    ]
  },
  {
    id: 'ant-likasi',
    number: 'IV',
    name: 'LIKASI',
    country: 'RDC',
    presidentName: 'MZEE JULIEN BANZA',
    presidentContact: '081 409 20 33',
    sectors: [
      { id: 'lik-1', name: 'VILLE', leaders: 'MZEE JULIEN BANZA / DENIS MASSAMBA', contacts: '081 409 20 33 / 081 240 20 77', address: '4, AVENUE DES ORANGERS, Q/ZOUT, LIKASI', days: 'MARDI ET SAMEDI / VENDREDI', hours: '15H A 18H / 9H A 18H' },
      { id: 'lik-2', name: 'TOYOTA', leaders: 'BERGER DARIL', contacts: '089 949 67 34', address: '47, ROUTE MWADINGUSHA, QUARTIER TOYOTA', days: 'MARDI, VENDREDI ET DIMANCHE', hours: '15H A 18H' },
      { id: 'lik-3', name: 'BRASSERIE', leaders: 'BERGER JOSUE', contacts: '097 700 43 71', address: 'AVENUE TALITA KUMI, Q/KAMATANDA, LIKASI', days: 'MARDI ET DIMANCHE', hours: '15H A 18H' },
      { id: 'lik-4', name: 'BINAME', leaders: 'BERGER JEREMIE KAPUMBA', contacts: '099 224 17 62', address: '164, AVENUE FOYER SOCIAL, KIKULA', days: 'MARDI, VENDREDI ET DIMANCHE', hours: '15H A 18H' },
      { id: 'lik-5', name: 'KAMATANDA', leaders: 'PASTEUR AUBIN KITONGA', contacts: '099 702 89 04', address: 'DERRIERE CHEMAF, ROUTE KAMATANDA, QUARTIER KAMATANDA', days: 'MERCREDI, SAMEDI ET DIMANCHE', hours: '15H A 18 H' },
      { id: 'lik-6', name: 'QUARTIER MISSION', leaders: 'PASTEUR NONO KAPISI', contacts: '084 403 00 61', address: '44, AVENUE MUSONOI, QUARTIER MISSION, LIKASI', days: 'MERCREDI ET DIMANCHE', hours: '15H A 18H' },
      { id: 'lik-7', name: 'PANDA', leaders: 'BERGER MIRADI HUSSEN', contacts: '099 155 62 55', address: '21, AVENUE DU BRONZE PROLONGEE, Q, PEPINIERE/ PANDA', days: 'MARDI ET DIMANCHE', hours: '15H A 18H' },
      { id: 'lik-8', name: 'SAER', leaders: 'BERGER RODRIGUE KAPAMBWE', contacts: '097 649 09 66', address: 'AVENUE CHEMIN PUBLIC, COMMUNE SHITURU', days: 'MARDI ET DIMANCHE', hours: '15H A 18 H' }
    ]
  },
  {
    id: 'ant-kasumbalesa',
    number: 'V',
    name: 'KASUMBALESA',
    country: 'RDC',
    presidentName: 'PASTEUR NGOYI MARDOCHEE',
    presidentContact: '099 714 73 72',
    sectors: [
      { id: 'kas-1', name: 'KASUMBALESA', leaders: 'PASTEUR NGOYI MARDOCHEE', contacts: '099 714 73 72', address: 'QUARTIER GOLF MAGISTRAT MICHEL, REF. SOUS CIAT POLICE', days: 'MARDI, VENDREDI ET DIMANCHE', hours: '16H30 A 19H' }
    ]
  },
  {
    id: 'ant-fungurume',
    number: 'VI',
    name: 'FUNGURUME',
    country: 'RDC',
    presidentName: 'APOTRE JOSUE TSHIBANDA',
    presidentContact: '099 486 15 04',
    sectors: [
      { id: 'fun-1', name: 'KABILA', leaders: 'APOTRE JOSUE TSHIBANDA', contacts: '099 486 15 04', address: '07, ROUTE ORTHODOXE/FGM', days: 'JEUDI ET DIMANCHE', hours: '15H30 A 19H30' },
      { id: 'fun-2', name: 'QUARTIER BISIPI', leaders: 'BERGERE PRISCA KIBUTA', contacts: '084 409 56 20', address: '11, AVENUE KIMBANGU/FGM', days: 'LUNDI, MERCREDI ET VENDREDI', hours: '17H A 19H' }
    ]
  },
  {
    id: 'ant-kambove',
    number: 'VII',
    name: 'KAMBOVE',
    country: 'RDC',
    presidentName: 'PASTEUR RICHARD KASANDA',
    presidentContact: '090 341 00 62',
    sectors: [
      { id: 'kam-1', name: 'CENTRE URBAIN', leaders: 'PASTEUR RICHARD KASANDA', contacts: '090 341 00 62', address: '514, AVENUE EBEYA (5ème AVENUE)', days: 'JEUDI, SAMEDI ET DIMANCHE', hours: '15H30 A 18H30' },
      { id: 'kam-2', name: 'SAFRICAS', leaders: 'BERGER ELIE KYABU', contacts: '081 237 01 08', address: 'QUARTIER SAFRICAS', days: 'MERCREDI ET DIMANCHE', hours: '15H30 A 18H30' }
    ]
  },
  {
    id: 'ant-kakanda',
    number: 'VIII',
    name: 'KAKANDA',
    country: 'RDC',
    presidentName: 'APOTRE JOSEPH TSHAMA',
    presidentContact: '082 513 30 36 / 097 483 01 02',
    sectors: [
      { id: 'kak-1', name: 'BIENVENUE', leaders: 'APOTRE JOSEPH TSHAMA / PASTEUR NOELLA ILUNGA TSHITUKA DONEL', contacts: '081 513 30 36 / 097 483 01 02 / 082 201 26 38 / 097 002 72 73', address: '1, AVENUE SOUS STATION, KAKANDA', days: 'JEUDI, SAMEDI ET DIMANCHE / MARDI', hours: '15H30 A 18H30' }
    ]
  },
  {
    id: 'ant-kipushi',
    number: 'IX',
    name: 'KIPUSHI',
    country: 'RDC',
    presidentName: 'PROPHETE CALEB MUKENGE',
    presidentContact: '097 822 27 24',
    sectors: [
      { id: 'kip-1', name: 'KIPUSHI', leaders: 'PROPHETE CALEB MUKENGE', contacts: '097 822 27 24', address: '04, AVENUE DES EXPLOSIFS, QUARTIER GOLF PLATEAU', days: 'LUNDI, JEUDI ET DIMANCHE', hours: '15H A 18H30' },
      { id: 'kip-2', name: 'QUARTIER LUITA', leaders: 'BERGER LUDYA', contacts: '082 106 21 61', address: 'QUARTIER LUITA, KIPUSHI', days: 'MERCREDI, VENDREDI ET SAMEDI', hours: '15H30 A 18H' }
    ]
  },
  {
    id: 'ant-sakania',
    number: 'X',
    name: 'SAKANIA',
    country: 'RDC',
    presidentName: 'PASTEUR IMBA NGOPINA',
    presidentContact: '099 716 11 28',
    sectors: [
      { id: 'sak-1', name: 'SAKANIA', leaders: 'PASTEUR IMBA NGOPINA', contacts: '099 716 11 28', address: 'QUARTIER DOUANE, REF. DERRIERE BUREAU SONAS', days: 'MARDI, JEUDI ET DIMANCHE', hours: '15H A 18H30' }
    ]
  },
  {
    id: 'ant-kamina',
    number: 'XI',
    name: 'KAMINA',
    country: 'RDC',
    presidentName: 'PASTEUR JEAN GRACE LUNDA',
    presidentContact: '099 540 21 85',
    sectors: [
      { id: 'kma-1', name: 'KAMINA', leaders: 'PASTEUR JEAN GRACE LUNDA', contacts: '099 540 21 85', address: 'KAMINA, RDC', days: 'LUNDI ET JEUDI', hours: '15H A 18H30' }
    ]
  },
  {
    id: 'ant-moba',
    number: 'XII',
    name: 'MOBA',
    country: 'RDC',
    presidentName: 'PASTEUR SLUCIEN SUMAHILI',
    presidentContact: '081 702 68 80',
    sectors: [
      { id: 'mob-1', name: 'MOBA PORT', leaders: 'PASTEUR SLUCIEN SUMAHILI / BERGER STEVE', contacts: '081 702 68 80 / 081 462 45 94', address: 'MOBA PORT/ QUARTIER REGEZA AU SIEGE DES MGJ MOBA', days: 'MERCREDI / DIMANCHE', hours: '16H A 18H30 / 15H A 18H30' },
      { id: 'mob-2', name: 'KIRUNGU', leaders: 'BERGER ERNEST MBAVU / PROPHETE FREDDY SANGWA', contacts: '085 813 50 07 / 099 020 01 97', address: 'AVENUE KEYANIKA, BLOC KIBYA, QUARTIER KIRUNGU, MOBA', days: 'MARDI, JEUDI ET SAMEDI', hours: '15H A 18H' },
      { id: 'mob-3', name: 'CELLULE MWANZA', leaders: 'BERGER JOSEPH SOSO', contacts: '081 446 03 53', address: 'CELLULE MWANZA, MOBA', days: 'DIMANCHE', hours: '15H A 18H' }
    ]
  },
  {
    id: 'ant-kalemie',
    number: 'XIII',
    name: 'KALEMIE',
    country: 'RDC',
    presidentName: 'PASTEUR NICO KALALA',
    presidentContact: '099 268 95 33',
    sectors: [
      { id: 'kal-1', name: 'KALEMIE', leaders: 'PASTEUR NICO KALALA', contacts: '099 268 95 33', address: 'KALEMIE, RDC', days: 'MERCREDI ET DIMANCHE', hours: '15H A 18H30' }
    ]
  },
  {
    id: 'ant-goma',
    number: 'XIV',
    name: 'GOMA',
    country: 'RDC',
    presidentName: 'PASTEUR SAMBA TABU',
    presidentContact: '097 045 39 09',
    sectors: [
      { id: 'gom-1', name: 'GOMA', leaders: 'PASTEUR SAMBA TABU', contacts: '097 045 39 09', address: "27, AVENUE DE LA MISSION, Q/ HIMBI, REF, EN FACE DE LA MAISON DE L'EX MAIRE TUMBULA", days: 'JEUDI ET DIMANCHE', hours: '15H A 17H30' }
    ]
  },
  {
    id: 'ant-bunia',
    number: 'XV',
    name: 'BUNIA',
    country: 'RDC',
    presidentName: 'PASTEUR DIEU MERCI ASIFIWE',
    presidentContact: '081 218 64 65',
    sectors: [
      { id: 'bun-1', name: 'BUNIA', leaders: 'PASTEUR DIEU MERCI ASIFIWE', contacts: '081 218 64 65', address: "EN FACE DE L'ONG GEOC, PARALLELE AU GARAGE INPP, ROUTE VENANT DE ROND POINT PIC NIC", days: 'DIMANCHE', hours: '15H A 17H30' }
    ]
  },
  {
    id: 'ant-kisangani',
    number: 'XVI',
    name: 'KISANGANI',
    country: 'RDC',
    presidentName: 'PASTEUR PAULIN IYOKO EANGA',
    presidentContact: '084 378 24 43',
    sectors: [
      { id: 'kis-1', name: 'KISANGANI', leaders: 'PASTEUR PAULIN IYOKO EANGA', contacts: '084 378 24 43', address: '5, AVENUE LAC NYASSA, COMMUNE MAKISO, REF, EX BUREAU OMS A COTE DE LA RTEDI, DERRIERE DEPOT MAKAYABO', days: 'JEUDI ET DIMANCHE', hours: '15H A 18H30' }
    ]
  },
  {
    id: 'ant-brazzaville',
    number: 'XVII',
    name: 'BRAZZAVILLE',
    country: 'CONGO-BRAZZAVILLE',
    presidentName: 'PASTEUR SYLVAIN BATSHINA',
    presidentContact: '00 24206994912',
    sectors: [
      { id: 'bra-1', name: 'OUENZE', leaders: 'PASTEUR SYLVAIN BATSHINA', contacts: '00 24206994912', address: 'OUENZE, BRAZZAVILLE', days: 'VENDREDI ET DIMANCHE', hours: '16H A 19H' }
    ]
  },
  {
    id: 'ant-kitwe-zambia',
    number: 'XVIII',
    name: 'KITWE/ZAMBIA',
    country: 'ZAMBIE',
    presidentName: 'PASTEUR DANIEL MPETEMOYA',
    presidentContact: '00 260966197706',
    sectors: [
      { id: 'zam-1', name: 'MUSONDA COMPOUND', leaders: 'FRERE GREGORY CONSTANTINO', contacts: '00 260966053024', address: '7329, MUSONDA COMPOUND, KITWE', days: 'VENDREDI', hours: '16H A 18H' },
      { id: 'zam-2', name: 'NDEKE VILLAGE', leaders: 'PASTEUR DANIEL MPETEMOYA', contacts: '00 260966197706', address: 'G488 NDEKE VILLAGE, KITWE', days: 'VENDREDI', hours: '16H A 18H' },
      { id: 'zam-3', name: 'KAMAKONDE', leaders: 'PASTEUR MWAKA MULONDA', contacts: '00 260953160307', address: '1344, KITWE WEST KAMAKONDE', days: 'SAMEDI ET DIMANCHE', hours: '15H A 18H' }
    ]
  },
  {
    id: 'ant-namibia',
    number: 'XIX',
    name: 'NAMIBIA',
    country: 'NAMIBIE',
    presidentName: 'PASTEUR JACQUES MUNUNG',
    presidentContact: '00 264818417293',
    sectors: [
      { id: 'nam-1', name: 'WINDHOEK', leaders: 'PASTEUR JACQUES MUNUNG', contacts: '00 264818417293', address: 'WINDHOEK NORTH. REF. RHENO MEDICAL/MOTACS COLLEGE / MONTAGNE', days: 'LUNDI ET VENDREDI / SAMEDI', hours: '17H A 20H / 8H A 12H30' }
    ]
  },
  {
    id: 'ant-dar-es-salaam',
    number: 'XX',
    name: 'DAR ES SALAAM',
    country: 'TANZANIE',
    presidentName: 'FRERE JONATHAN LUKUSA',
    presidentContact: '00 255788189078',
    sectors: [
      { id: 'dar-1', name: 'DAR ES SALAAM', leaders: 'FRERE JONATHAN LUKUSA', contacts: '00 255788189078', address: 'QUARTIER KINONDONI, REF. MKWAJINI (BATIMENT HOUSE OF PRAYER)', days: 'JEUDI ET DIMANCHE', hours: '16H A 19H' }
    ]
  },
  {
    id: 'ant-jobourg',
    number: 'XXI',
    name: "JO'BOURG",
    country: 'AFRIQUE DU SUD',
    presidentName: 'PASTEUR OLIVIER KATOPWA / PASTEUR JEREMIE MONGA',
    presidentContact: '00 27812532771 / 00 27833129488',
    sectors: [
      { id: 'job-1', name: 'CRESTA', leaders: 'PASTEUR JEREMIE MONGA / PASTEUR OLIVIER KATOPWA', contacts: '00 27833129488 / 00 27812532771', address: '18 B, HILL CRESTA, CNR BAYERS NAUDE & JUDGES', days: 'SAMEDI', hours: '16H A 18H' },
      { id: 'job-2', name: 'KENSINGTON 1', leaders: 'PROPHETE TONNY KANDA / PASTEUR MIKE', contacts: '00 27619836749 / 00 27787662488', address: '8TH AVENUE, BEZUIDENHOUT VALLEY', days: 'LUNDI / DIMANCHE', hours: '17H A 19H / 16H A 19H' }
    ]
  },
  {
    id: 'ant-pretoria',
    number: 'XXII',
    name: 'PRETORIA',
    country: 'AFRIQUE DU SUD',
    presidentName: 'SŒUR CARINE MBAL',
    presidentContact: '00 27781515214',
    sectors: [
      { id: 'pre-1', name: 'PRETORIA', leaders: 'SŒUR CARINE MBAL', contacts: '00 27781515214', address: '458, MANITOBA DR FAERIEZ GLEN AT 401 GLEN MEAD FLAT, PRETORIA 081', days: 'MARDI ET DIMANCHE', hours: '17H A 19H30' }
    ]
  },
  {
    id: 'ant-durban',
    number: 'XXIII',
    name: 'DURBAN',
    country: 'AFRIQUE DU SUD',
    presidentName: 'PASTEUR MICHEL TEBULO',
    presidentContact: '00 27738243099',
    sectors: [
      { id: 'dur-1', name: 'DURBAN', leaders: 'PASTEUR MICHEL TEBULO', contacts: '00 27738243099', address: '437, POINT ROAD, AT CARMENELLO DAYCARE CENTRE IN SOUTH BEACH', days: 'SAMEDI ET DIMANCHE', hours: '17H30 A 20H' }
    ]
  },
  {
    id: 'ant-cape-town',
    number: 'XXIV',
    name: 'CAPE TOWN',
    country: 'AFRIQUE DU SUD',
    presidentName: 'PASTEUR EMMANUEL NDUWA',
    presidentContact: '00 26878515970',
    sectors: [
      { id: 'cap-1', name: 'CAPE TOWN', leaders: 'PASTEUR EMMANUEL NDUWA', contacts: '00 26878515970', address: 'CAPE TOWN, AFRIQUE DU SUD', days: 'SAMEDI ET DIMANCHE', hours: '16H A 18H' }
    ]
  },
  {
    id: 'ant-swazilande',
    number: 'XXV',
    name: 'SWAZILANDE',
    country: 'SWAZILAND',
    presidentName: 'BERGER GLORY KATENDE / BERGER MASEKO',
    presidentContact: '00 2687865116 / 00 26876138200',
    sectors: [
      { id: 'swa-1', name: 'MANZINI', leaders: 'BERGER GLORY KATENDE / BERGER MASEKO', contacts: '00 2687865116 / 00 26876138200', address: 'PARK HOTEL, MANZINI', days: 'SAMEDI', hours: '14H A 17H' }
    ]
  },
  {
    id: 'ant-usa',
    number: 'XXVI',
    name: 'USA',
    country: 'USA',
    presidentName: 'APOTRE DARIMATHEE KASONGO',
    presidentContact: '+1 469-808-8888',
    sectors: [
      { id: 'usa-1', name: 'USA & ONLINE MGJ', leaders: 'APOTRE DARIMATHEE KASONGO', contacts: '+1 469-808-8888', address: 'DALLAS, TEXAS & ONLINE MGJ USA', days: 'JEUDI ET DIMANCHE', hours: '19H00 (EST)' }
    ]
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

  const [antennas, setAntennas] = useState<MgjAntenna[]>(() => {
    try {
      const saved = localStorage.getItem('mediamondemjg_antennas');
      return saved ? JSON.parse(saved) : initialAntennas;
    } catch (e) { return initialAntennas; }
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
  useEffect(() => { try { localStorage.setItem('mediamondemjg_antennas', JSON.stringify(antennas)); } catch (e) { console.warn(e); } }, [antennas]);

  useEffect(() => {
    // 1. Speakers sync directly from Firebase Firestore (Single Source of Truth)
    const unsubSpeakers = onSnapshot(collection(db, 'convention_speakers'), (snapshot) => {
      if (!snapshot.empty) {
        const liveSpeakers: ConventionSpeaker[] = [];
        snapshot.forEach((docSnap) => liveSpeakers.push(docSnap.data() as ConventionSpeaker));
        setSpeakers(liveSpeakers);
      } else {
        initialSpeakers.forEach(s => setDoc(doc(db, 'convention_speakers', s.id), s).catch(() => {}));
      }
    }, (error) => console.warn('speakers sync error:', error));

    // 2. Schedule sync directly from Firebase Firestore
    const unsubSchedule = onSnapshot(collection(db, 'convention_schedule'), (snapshot) => {
      if (!snapshot.empty) {
        const liveSchedule: ScheduleItem[] = [];
        snapshot.forEach((docSnap) => liveSchedule.push(docSnap.data() as ScheduleItem));
        liveSchedule.sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time));
        setSchedule(liveSchedule);
      } else {
        initialSchedule.forEach(s => setDoc(doc(db, 'convention_schedule', s.id), s).catch(() => {}));
      }
    }, (error) => console.warn('schedule sync error:', error));

    // 3. Announcements sync directly from Firebase Firestore
    const unsubAnnouncements = onSnapshot(collection(db, 'mgj_announcements'), (snapshot) => {
      if (!snapshot.empty) {
        const liveAnns: AnnouncementItem[] = [];
        snapshot.forEach((docSnap) => liveAnns.push(docSnap.data() as AnnouncementItem));
        liveAnns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAnnouncements(liveAnns);
      } else {
        initialAnnouncements.forEach(a => setDoc(doc(db, 'mgj_announcements', a.id), a).catch(() => {}));
      }
    }, (error) => console.warn('announcements sync error:', error));

    // 4. Notifications sync directly from Firebase Firestore
    const unsubNotifications = onSnapshot(collection(db, 'mgj_notifications'), (snapshot) => {
      if (!snapshot.empty) {
        const liveNotifs: NotificationItem[] = [];
        snapshot.forEach((docSnap) => liveNotifs.push(docSnap.data() as NotificationItem));
        liveNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(liveNotifs);
      } else {
        initialNotifications.forEach(n => setDoc(doc(db, 'mgj_notifications', n.id), n).catch(() => {}));
      }
    }, (error) => console.warn('notifications sync error:', error));

    // 5. Shop Items sync directly from Firebase Firestore
    const unsubShopItems = onSnapshot(collection(db, 'shop_items'), (snapshot) => {
      if (!snapshot.empty) {
        const liveItems: ShopItem[] = [];
        snapshot.forEach((docSnap) => liveItems.push(docSnap.data() as ShopItem));
        setShopItems(liveItems);
      } else {
        initialShopItems.forEach(i => setDoc(doc(db, 'shop_items', i.id), i).catch(() => {}));
      }
    }, (error) => console.warn('shop_items sync error:', error));

    // 6. Shop Orders sync directly from Firebase Firestore
    const unsubOrders = onSnapshot(collection(db, 'shop_orders'), (snapshot) => {
      const liveOrders: ShopOrder[] = [];
      snapshot.forEach((docSnap) => liveOrders.push(docSnap.data() as ShopOrder));
      liveOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(liveOrders);
    }, (error) => console.warn('orders sync error:', error));

    // 7. Donations sync directly from Firebase Firestore
    const unsubDonations = onSnapshot(collection(db, 'shop_donations'), (snapshot) => {
      const liveDonations: DonationRecord[] = [];
      snapshot.forEach((docSnap) => liveDonations.push(docSnap.data() as DonationRecord));
      liveDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDonations(liveDonations);
    }, (error) => console.warn('donations sync error:', error));

    // 8. Kzi Registrants sync directly from Firebase Firestore
    const unsubKziRegistrants = onSnapshot(collection(db, 'kzi_registrants'), (snapshot) => {
      const liveRegs: KziRegistrant[] = [];
      snapshot.forEach((docSnap) => liveRegs.push(docSnap.data() as KziRegistrant));
      liveRegs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setKziRegistrantsList(liveRegs);
    }, (error) => console.warn('kzi_registrants sync error:', error));

    // 9. Antennes & Secteurs sync directly from Firebase Firestore
    const unsubAntennas = onSnapshot(collection(db, 'mgj_antennas'), (snapshot) => {
      if (!snapshot.empty) {
        const liveAntennas: MgjAntenna[] = [];
        snapshot.forEach((docSnap) => liveAntennas.push(docSnap.data() as MgjAntenna));
        setAntennas(liveAntennas);
      } else {
        initialAntennas.forEach(a => setDoc(doc(db, 'mgj_antennas', a.id), a).catch(() => {}));
      }
    }, (error) => console.warn('mgj_antennas sync error:', error));

    return () => {
      unsubSpeakers();
      unsubSchedule();
      unsubAnnouncements();
      unsubNotifications();
      unsubShopItems();
      unsubOrders();
      unsubDonations();
      unsubKziRegistrants();
      unsubAntennas();
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
      setDoc(doc(db, 'convention_schedule', newSc.id), newSc).catch(() => {});
    } catch (e) {}
  };

  const updateScheduleItem = (item: ScheduleItem) => {
    setSchedule(prev => prev.map(sc => sc.id === item.id ? item : sc));
    try {
      setDoc(doc(db, 'convention_schedule', item.id), item, { merge: true }).catch(() => {});
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
      deleteDoc(doc(db, 'convention_speakers', id)).catch(() => {});
    } catch (e) {}
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(sc => sc.id !== id));
    try {
      deleteDoc(doc(db, 'convention_schedule', id)).catch(() => {});
    } catch (e) {}
  };

  const deleteNotification = (id: string) => {
    const target = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (target) {
      setAnnouncements(prev => prev.filter(a => a.id !== id.replace('notif-', 'ann-') && a.titleFr !== target.titleFr));
      try {
        notifications.forEach(n => {
          if (n.id === id.replace('notif-', 'ann-') || n.titleFr === target.titleFr) {
            deleteDoc(doc(db, 'mgj_notifications', n.id)).catch(() => {});
          }
        });
      } catch (e) {}
    }
    try {
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
        authorName: titleOrObj.authorName || authorNameParam || 'Admin MGJ',
        authorRole: titleOrObj.authorRole || authorRoleParam || 'Équipe Média & Communication',
        authorAvatar: titleOrObj.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        pinned: titleOrObj.pinned || false,
        commentsList: []
      };
      notifCategory = titleOrObj.category || 'general';
      notifTitleFr = titleOrObj.titleFr || '📢 Nouvelle Annonce MGJ';
      notifTitleEn = titleOrObj.titleEn || notifTitleFr;
      notifBodyFr = titleOrObj.contentFr || titleOrObj.bodyFr || '';
      notifBodyEn = titleOrObj.contentEn || titleOrObj.bodyEn || notifBodyFr;
    } else {
      newAnn = {
        id: `ann-${Date.now()}`,
        titleFr: titleOrObj || '',
        titleEn: titleEn || titleOrObj || '',
        contentFr: bodyFr || '',
        contentEn: bodyEn || bodyFr || '',
        category: typeof type === 'string' ? type : 'general',
        mediaUrl: mediaUrl,
        mediaType: mediaType || (mediaUrl ? 'image' : 'none'),
        authorName: authorNameParam || 'Admin MGJ',
        authorRole: authorRoleParam || 'Équipe Média & Communication',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        pinned: false,
        commentsList: []
      };
      notifCategory = typeof type === 'string' ? type : 'general';
      notifTitleFr = titleOrObj || '📢 Nouvelle Annonce MGJ';
      notifTitleEn = titleEn || notifTitleFr;
      notifBodyFr = bodyFr || '';
      notifBodyEn = bodyEn || notifBodyFr;
    }

    setAnnouncements(prev => [newAnn, ...prev]);
    try {
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
      setDoc(doc(db, 'mgj_notifications', newNotif.id), newNotif, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const updateAnnouncement = (ann: AnnouncementItem) => {
    setAnnouncements(prev => prev.map(a => a.id === ann.id ? ann : a));
    try {
      setDoc(doc(db, 'mgj_announcements', ann.id), ann, { merge: true }).catch(() => {});
    } catch (e) {}
  };

  const deleteAnnouncement = (id: string) => {
    const target = announcements.find(a => a.id === id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (target) {
      setNotifications(prev => prev.filter(n => n.id !== id.replace('ann-', 'notif-') && n.titleFr !== target.titleFr));
      try {
        notifications.forEach(n => {
          if (n.id === id.replace('ann-', 'notif-') || n.titleFr === target.titleFr) {
            deleteDoc(doc(db, 'mgj_notifications', n.id)).catch(() => {});
          }
        });
      } catch (e) {}
    }
    try {
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

  const saveAntenna = (antenna: MgjAntenna) => {
    setAntennas(prev => {
      const exists = prev.some(a => a.id === antenna.id);
      if (exists) {
        return prev.map(a => a.id === antenna.id ? antenna : a);
      }
      return [...prev, antenna];
    });
    setDoc(doc(db, 'mgj_antennas', antenna.id), antenna, { merge: true }).catch(err => {
      console.warn('saveAntenna error:', err);
    });
  };

  const deleteAntenna = (id: string) => {
    setAntennas(prev => prev.filter(a => a.id !== id));
    deleteDoc(doc(db, 'mgj_antennas', id)).catch(err => {
      console.warn('deleteAntenna error:', err);
    });
  };

  const resetAntennasToDefault = () => {
    setAntennas(initialAntennas);
    initialAntennas.forEach(a => {
      setDoc(doc(db, 'mgj_antennas', a.id), a).catch(err => {
        console.warn('resetAntennas error:', err);
      });
    });
  };

  return (
    <AppDataContext.Provider value={{
      antennas,
      saveAntenna,
      deleteAntenna,
      resetAntennasToDefault,
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
      updateScheduleItem,
      deleteScheduleItem,
      deleteNotification,
      createAnnouncement,
      updateAnnouncement,
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
