import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { 
  Tv, 
  Send, 
  FileText, 
  Save, 
  Download, 
  Trash2, 
  Calendar,
  CheckCircle2,
  Radio,
  Play,
  Share2,
  ThumbsUp,
  MessageSquare,
  Globe,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Maximize2,
  LayoutList,
  Grid,
  Eye,
  X
} from 'lucide-react';

interface YouTubeVideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  date: string;
  description: string;
}

const youtubeChannelVideos: YouTubeVideoItem[] = [
  {
    id: 'K8lflONW4mk',
    title: "GRANDE CLOTURE DE LA 30ème Grande Convention Internationale des ministères génération Joël 2025",
    category: "Grande Convention KZI",
    duration: "🔴 DIRECT VOD",
    views: "3.0 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"GRANDE CLOTURE DE LA 30ème Grande Convention Internationale des ministères génération Joël 2025\"."
  },
  {
    id: 'Xr69WxiIGLU',
    title: "GRANDE CLOTURE DE LA 30ème Grande Convention Internationale des ministères génération Joël 2025",
    category: "Grande Convention KZI",
    duration: "6h 25m",
    views: "11.4 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"GRANDE CLOTURE DE LA 30ème Grande Convention Internationale des ministères génération Joël 2025\"."
  },
  {
    id: 'q2Wxvwqd2WU',
    title: "SESSION SOIR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "4h 21m",
    views: "7.2 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SESSION SOIR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'gblUkYieFb8',
    title: "SESSION JOUR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "1h 21m",
    views: "3.6 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SESSION JOUR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'Wc3uaI0skdc',
    title: "SESSION JOUR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "2h 10m",
    views: "3.9 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SESSION JOUR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: '8yEFWROV8oA',
    title: "HEURE DES CHAMPIOS, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "2h 35m",
    views: "1.5 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"HEURE DES CHAMPIOS, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: '_hDvEk4j_lY',
    title: "SESSION SOIR, JOUR 6 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "4h 4m",
    views: "11.1 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SESSION SOIR, JOUR 6 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'FzCssMV_aOA',
    title: "SESSION JOUR, JOUR 6 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "4h 14m",
    views: "3.9 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SESSION JOUR, JOUR 6 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'uQDIhTmHb78',
    title: "HEURE DES CHAMPIONS JOUR 6 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "1h 47m",
    views: "12.3 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"HEURE DES CHAMPIONS JOUR 6 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'j6pP9vQDW6E',
    title: "JOUR 5 SOIR Prophete Ken MUYAYA, Past. Michel BADI 30eme CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "4h 47m",
    views: "2.1 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"JOUR 5 SOIR Prophete Ken MUYAYA, Past. Michel BADI 30eme CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'sJJIdXrhPqw',
    title: "JOUR 05 MIDI 30eme GRANDE CONVENTION Ministères Génération Joel",
    category: "Grande Convention KZI",
    duration: "1h 12m",
    views: "10.5 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"JOUR 05 MIDI 30eme GRANDE CONVENTION Ministères Génération Joel\"."
  },
  {
    id: 'Omx8sDmWR9E',
    title: "CLOTURE 28éme GRANDE CONVENTION",
    category: "Grande Convention KZI",
    duration: "1h 12m",
    views: "3.6 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"CLOTURE 28éme GRANDE CONVENTION\"."
  },
  {
    id: 'kOqpzYnaJ40',
    title: "CLOTURE 28éme GRANDE CONVENTION",
    category: "Grande Convention KZI",
    duration: "3h 55m",
    views: "1.5 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"CLOTURE 28éme GRANDE CONVENTION\"."
  },
  {
    id: 'Sf5-KBKCJkA',
    title: "PROPHETE KENE MUYAYA",
    category: "Enseignements",
    duration: "1h 38m",
    views: "11.1 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"PROPHETE KENE MUYAYA\"."
  },
  {
    id: 'zC95jEYLwVg',
    title: "PROPHETE KENE MUYAYA",
    category: "Enseignements",
    duration: "6m 46s",
    views: "3.9 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"PROPHETE KENE MUYAYA\"."
  },
  {
    id: 'luSNuEYH6E4',
    title: "PASTEUR RAYMOND",
    category: "Enseignements",
    duration: "11m 13s",
    views: "12.3 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"PASTEUR RAYMOND\"."
  },
  {
    id: 'ZsVjDnwyfAo',
    title: "PASTEUR RAYMOND",
    category: "Enseignements",
    duration: "34m",
    views: "2.1 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"PASTEUR RAYMOND\"."
  },
  {
    id: '6sM9hyWp-s4',
    title: "SEANCE DE L'AVANT-MIDI JOUR 07",
    category: "Enseignements",
    duration: "26m",
    views: "10.5 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SEANCE DE L'AVANT-MIDI JOUR 07\"."
  },
  {
    id: 'ajyjjCaN6eU',
    title: "SEANCE DE L'AVANT-MIDI JOUR 07",
    category: "Enseignements",
    duration: "4h 21m",
    views: "3.6 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SEANCE DE L'AVANT-MIDI JOUR 07\"."
  },
  {
    id: 'M7iFtC3rd1o',
    title: "HEURE DES CHAMPIONS JOUR 07",
    category: "Direct / Live",
    duration: "1h 33m",
    views: "1.5 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"HEURE DES CHAMPIONS JOUR 07\"."
  },
  {
    id: 'IJDddB1PN-s',
    title: "SEANCE DE L'APRES-MIDI JOUR 06",
    category: "Enseignements",
    duration: "37m",
    views: "11.1 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SEANCE DE L'APRES-MIDI JOUR 06\"."
  },
  {
    id: 'L2A7JxD_9bA',
    title: "SEANCE DE L'APRES-MIDI JOUR 06",
    category: "Enseignements",
    duration: "2h 49m",
    views: "3.9 k vues",
    date: "Il y a 11 mois",
    description: "Retransmission officielle Média Ministères Génération Joël Monde (@mediaministeresgenerationj4157) : \"SEANCE DE L'APRES-MIDI JOUR 06\"."
  }
];

export const LiveStreamingPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { sermonNotes, addSermonNote, deleteSermonNote } = useAppData();

  const [activeSource, setActiveSource] = useState<'youtube' | 'facebook'>('youtube');
  const [fbFeedType, setFbFeedType] = useState<'official_meta' | 'interactive_app'>('official_meta');
  const [ytFeedType, setYtFeedType] = useState<'channel_gallery' | 'interactive_app'>('channel_gallery');
  const [ytCategory, setYtCategory] = useState<string>('Tous');
  const [ytSearchQuery, setYtSearchQuery] = useState<string>('');

  // Smart Mobile Experience States (Zooming, Animations, Layouts, Lightbox)
  const [feedZoom, setFeedZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'dynamic' | 'compact'>('dynamic');
  const [zoomedMedia, setZoomedMedia] = useState<{ type: 'image' | 'video'; src?: string; title?: string; videoId?: string } | null>(null);
  const [modalScale, setModalScale] = useState<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem('mgj_active_social');
    if (saved === 'facebook' || saved === 'youtube') {
      setActiveSource(saved);
      localStorage.removeItem('mgj_active_social');
    }
    const handleSwitch = (e: any) => {
      if (e.detail === 'facebook' || e.detail === 'youtube') {
        setActiveSource(e.detail);
      }
    };
    window.addEventListener('mgj-open-social', handleSwitch);
    return () => window.removeEventListener('mgj-open-social', handleSwitch);
  }, []);

  // Top Video / Live Stream Embed State
  const [selectedVideo, setSelectedVideo] = useState({
    id: 'q2Wxvwqd2WU',
    title: 'SESSION SOIR, JOUR 7 30eme GRANDE CONVENTION Ministères Génération Joel',
    channel: 'Ministères Génération Joël (@mediaministeresgenerationj4157)',
    views: '7.2 k vues',
    time: '🔴 DIRECT INTÉGRÉ'
  });
  
  // Live Chat Simulator State
  const [messages, setMessages] = useState<Array<{ id: string; sender: string; text: string; time: string; isUser?: boolean }>>([
    { id: '1', sender: 'Pasteur Élie M.', text: 'Shalom à tous les frères et sœurs connectés ! Que l\'onction du Saint-Esprit descende sur vous.', time: '18:02' },
    { id: '2', sender: 'Sœur Grâce K.', text: 'Amen Amen !! Nous sommes connectés depuis Kolwezi et Kinshasa avec toute la famille.', time: '18:04' },
    { id: '3', sender: 'Frère David T.', text: 'Alléluia ! Gloire au Seigneur Jésus-Christ pour ce merveilleux culte en direct dans l\'application.', time: '18:05' },
    { id: '4', sender: 'Chantre Rebecca', text: 'Seigneur, oins les lèvres de ton serviteur ce soir au nom de Jésus.', time: '18:07' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Interactive Social Feeds & Posts State (`user must scroll the feed page and comment within the app`)
  const [socialFeedPosts, setSocialFeedPosts] = useState<Array<{
    id: string;
    platform: 'facebook' | 'youtube';
    author: string;
    handle: string;
    avatarBg: string;
    time: string;
    content: string;
    image?: string;
    videoTitle?: string;
    videoId?: string;
    likes: number;
    shares: number;
    comments: Array<{ id: string; author: string; text: string; time: string }>;
  }>>([
    {
      id: 'fb-1',
      platform: 'facebook',
      author: 'Media MGJ Monde',
      handle: '@mediamgjmonde',
      avatarBg: 'bg-blue-600',
      time: lang === 'fr' ? 'Il y a 45 min • 🔴 DIRECT ACTIF' : '45 mins ago • 🔴 LIVE NOW',
      content: lang === 'fr' 
        ? '🔥 DIRECT SPÉCIAL • Grande Veillée d\'Intercession et de Consécration pour la 31ème Grande Convention Internationale KZI 2026 ! Connectez-vous d\'où que vous soyez, l\'onction de Joël 2:28 est à l\'œuvre ce soir ! Écrivez vos sujets de prière et vos commentaires directement sous cette publication.'
        : '🔥 SPECIAL LIVE • Grand Intercession & Consecration Vigil for the 31st KZI 2026 International Convention! Connect right now! Write your prayer requests and comments directly inside this app below.',
      videoTitle: lang === 'fr' ? '🔴 RETRANSMISSION DIRECTE : VEILLÉE D\'INTERCESSION (FLUX FB INTÉGRÉ)' : '🔴 LIVE BROADCAST: INTERCESSION VIGIL (IN-APP FB STREAM)',
      videoId: 'jfKfPfyJRdk',
      likes: 412,
      shares: 128,
      comments: [
        { id: 'c1', author: 'Sœur Marie K.', text: 'Amen Amen ! Nous prions en direct depuis l\'application sans quitter notre sanctuaire virtuel !', time: 'Il y a 30 min' },
        { id: 'c2', author: 'Frère Emmanuel T.', text: 'Gloire à Dieu ! Seigneur bénis notre Couple visionnaire Réussite et Irène MANDAKU.', time: 'Il y a 15 min' }
      ]
    },
    {
      id: 'fb-2',
      platform: 'facebook',
      author: 'Media MGJ Monde',
      handle: '@mediamgjmonde',
      avatarBg: 'bg-blue-600',
      time: lang === 'fr' ? 'Hier à 16:20' : 'Yesterday at 4:20 PM',
      content: lang === 'fr'
        ? '📢 ANNONCE PROPHÉTIQUE : 31ème GRANDE CONVENTION INTERNATIONALE KZI 2026 !\n🙏 Sous la direction du Couple visionnaire Réussite & Irène MANDAKU.\n📍 Lieu : Kolwezi (Stade Manika Sport)\n📅 Dates : Du 02 au 09 Août 2026\n🎯 Thème : « JÉSUS-CHRIST REVIENT BIENTÔT ! »\n➡️ Le programme de toutes les sessions prophétiques et l\'accès VIP sont intégrés sur votre application.'
        : '📢 PROPHETIC ANNOUNCEMENT: 31st GRAND KZI 2026 INTERNATIONAL CONVENTION!\n🙏 Under the direction of Visionary Couple Réussite & Irène MANDAKU.\n📍 Location: Kolwezi (Manika Sport)\n📅 Dates: August 02-09, 2026\n🎯 Theme: "JESUS CHRIST IS COMING SOON!"\n➡️ The full schedule and VIP badges are integrated right here on your app.',
      image: '/poster-kzi-2026.jpg',
      likes: 856,
      shares: 340,
      comments: [
        { id: 'c3', author: 'Chantre Paul L.', text: 'Alléluia ! Nous serons tous à Kolwezi pour cette grande fête du Saint-Esprit !', time: 'Hier' },
        { id: 'c3b', author: 'Sœur Dorcas M.', text: 'Je partage immédiatement cette publication à tous les groupes de jeûne et prière !', time: 'Il y a 10h' }
      ]
    },
    {
      id: 'fb-3',
      platform: 'facebook',
      author: 'Media MGJ Monde',
      handle: '@mediamgjmonde',
      avatarBg: 'bg-blue-600',
      time: lang === 'fr' ? '2 juillet à 08:00' : 'July 2 at 8:00 AM',
      content: lang === 'fr'
        ? '📖 « Voici, je vous ai donné le pouvoir de marcher sur les serpents et les scorpions, et sur toute la puissance de l\'ennemi ; et rien ne pourra vous nuire. » (Luc 10:19).\n🙏 Prenez autorité sur votre journée, sur votre famille et sur vos projets au nom puissant de Jésus-Christ !'
        : '📖 "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you." (Luke 10:19).\n🙏 Take authority over your day and your family in Jesus\' mighty name!',
      likes: 319,
      shares: 94,
      comments: [
        { id: 'c4', author: 'Pasteur Élie M.', text: 'Amen et Amen ! Que cette autorité divine se manifeste dans chaque foyer !', time: '2 juillet' }
      ]
    },
    {
      id: 'yt-1',
      platform: 'youtube',
      author: 'Ministères Génération Joël',
      handle: '@mediaministeresgenerationj4157',
      avatarBg: 'bg-red-600',
      time: lang === 'fr' ? '🔴 DIFFUSION 24/7 EN COURS' : '🔴 LIVE NOW 24/7',
      content: lang === 'fr'
        ? '⚡ [DIRECT HD INTÉGRÉ] Culte Solennel & Louange d\'Adoration prophétique avec l\'Équipe Média MGJ. Écoutez, louez et commentez en direct à l\'intérieur de notre plateforme.'
        : '⚡ [EMBEDDED HD LIVE] Solemn Worship & Prophetic Praise Service with MGJ Media Team. Listen, praise, and comment live right inside our platform.',
      videoTitle: lang === 'fr' ? 'DIRECT HD : CULTE D\'ADORATION & LOUANGE MGJ' : 'HD LIVE: MGJ WORSHIP & PRAISE SERVICE',
      videoId: 'jfKfPfyJRdk',
      likes: 1420,
      shares: 512,
      comments: [
        { id: 'yc1', author: 'Frère Jean-Baptiste', text: 'Gloire à Jésus pour cette louange et cette qualité de son HD !', time: 'En direct' },
        { id: 'yc1b', author: 'Sœur Déborah P.', text: 'Nous intercédons en ligne avec toute l\'équipe !', time: 'Il y a 5 min' }
      ]
    },
    {
      id: 'yt-2',
      platform: 'youtube',
      author: 'Ministères Génération Joël',
      handle: '@mediaministeresgenerationj4157',
      avatarBg: 'bg-red-600',
      time: lang === 'fr' ? 'Il y a 2 jours • 14.2K vues' : '2 days ago • 14.2K views',
      content: lang === 'fr'
        ? '🔥 ENSEIGNEMENT MAJEUR : Le Combat Spirituel & Comment briser les barrières et alliances négatives de famille. Prédication inspirée par la Parole.'
        : '🔥 MAJOR TEACHING: Spiritual Warfare & How to break negative family barriers. Inspired sermon by the Word.',
      videoTitle: 'LE COMBAT SPIRITUEL & LA PRIÈRE D\'AUTORITÉ',
      videoId: '5qap5aO4i9A',
      likes: 2840,
      shares: 890,
      comments: [
        { id: 'yc2', author: 'Sœur Sarah B.', text: 'Cet enseignement a transformé ma vie spirituelle et brisé mes chaînes, merci !', time: 'Il y a 1 jour' }
      ]
    },
    {
      id: 'yt-3',
      platform: 'youtube',
      author: 'Ministères Génération Joël',
      handle: '@mediaministeresgenerationj4157',
      avatarBg: 'bg-red-600',
      time: lang === 'fr' ? 'Il y a 5 jours • 9.1K vues' : '5 days ago • 9.1K views',
      content: lang === 'fr'
        ? '🌍 Grande Convention KZI 2026 : Appel Prophétique aux Nations ! Découvrez la vision céleste et préparez-vous pour la grande moisson de Kolwezi du 02 au 09 Août.'
        : '🌍 Grand KZI 2026 Convention: Prophetic Call to the Nations! Discover the heavenly vision and prepare for the Kolwezi harvest from Aug 02-09.',
      videoTitle: 'APPEL PROPHÉTIQUE KZI 2026 • COUPLE VISIONNAIRE MANDAKU',
      videoId: 'dQw4w9WgXcQ',
      likes: 1150,
      shares: 410,
      comments: [
        { id: 'yc3', author: 'Frère David K.', text: 'Kolwezi nous attend ! Joël 2:28 est en marche, soyez bénis !', time: 'Il y a 3 jours' }
      ]
    }
  ]);

  const [postCommentInput, setPostCommentInput] = useState<{ [postId: string]: string }>({});

  const handlePostComment = (postId: string) => {
    const text = postCommentInput[postId];
    if (!text || !text.trim()) return;
    const authorName = user ? user.fullName : (lang === 'fr' ? 'Membre MGJ Connecté' : 'Connected MGJ Member');
    
    setSocialFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              author: authorName,
              text: text.trim(),
              time: lang === 'fr' ? 'À l\'instant' : 'Just now'
            }
          ]
        };
      }
      return post;
    }));
    setPostCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  // Sermon Notes Input State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: user ? user.fullName.split(' ')[0] : (lang === 'fr' ? 'Intercesseur MGJ' : 'MGJ Intercessor'),
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulated community response after 2 seconds
    setTimeout(() => {
      const responses = [
        'Amen !! Que Dieu vous bénisse abondamment frère/sœur !',
        'Gloire à Jésus pour cette foi et cette prière fervente !',
        'Alléluia ! Nous prions en accord total avec vous.',
        'Dieu est fidèle pour accomplir toutes ses promesses.'
      ];
      const randomResp = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, {
        id: `msg-sim-${Date.now()}`,
        sender: 'Modérateur MGJ Monde',
        text: randomResp,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addSermonNote(
      noteTitle.trim() || (lang === 'fr' ? `Prédication du ${new Date().toLocaleDateString('fr-FR')}` : `Sermon of ${new Date().toLocaleDateString()}`),
      noteContent
    );
    setNoteTitle('');
    setNoteContent('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  const handleDownloadNote = (note: { title: string; content: string; date: string }) => {
    const element = document.createElement("a");
    const file = new Blob([`${note.title}\nDate : ${note.date}\n\n${note.content}\n\n---\nMinistères Génération Joël (MGJ Monde)`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-live mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider">{lang === 'fr' ? 'Direct & Réseaux Intégrés MGJ' : 'MGJ Live & In-App Feeds'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-[var(--text-primary)]">
            {t('live.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1">
            {lang === 'fr' 
              ? 'Consultez les pages Facebook et YouTube en direct, faites défiler les publications et commentez 100% à l\'intérieur de l\'application sans lien externe.' 
              : 'Browse Facebook and YouTube live feeds, scroll posts and comment 100% inside the app with zero external links.'}
          </p>
        </div>

        {/* Source Switcher (No external navigation) */}
        <div className="flex items-center rounded-2xl bg-[var(--bg-primary)] p-1 border border-glass self-start sm:self-center">
          <button
            onClick={() => setActiveSource('youtube')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeSource === 'youtube'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>YouTube Feed & Live</span>
          </button>
          <button
            onClick={() => setActiveSource('facebook')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeSource === 'facebook'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Facebook Feed & Live</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Stream Player + Interactive Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left 2 Cols: Video Player Box + Scrollable Feed Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden rounded-3xl bg-black border border-glass shadow-2xl relative aspect-video flex flex-col justify-between group">
            
            {activeSource === 'youtube' ? (
              /* YouTube Embedded Player Engine (In-App) */
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=0&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-red-500/40 text-[11px] font-black text-red-400 flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>DIRECT & LECTEUR YOUTUBE HD • {selectedVideo.views}</span>
                  </span>
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => {
                        setYtFeedType('channel_gallery');
                        const ytEl = document.getElementById('yt-gallery-section');
                        if (ytEl) ytEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-lg transition-all hover:scale-105"
                    >
                      <LayoutList className="w-3 h-3" />
                      <span>{lang === 'fr' ? 'Toutes les Vidéos' : 'All Videos'}</span>
                    </button>
                    <a
                      href="https://www.youtube.com/@mediaministeresgenerationj4157"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-black/80 hover:bg-white/20 text-white font-extrabold text-[11px] flex items-center gap-1.5 border border-white/20 transition-all shadow-lg"
                    >
                      <span>Chaîne Officielle</span>
                      <Share2 className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Facebook Live Embedded Player / Stream Simulator (In-App) */
              <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-black p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl mb-4 font-black text-3xl animate-pulse">
                  f
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>FLUX FACEBOOK LIVE INTÉGRÉ (@mediamgjmonde)</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black font-outfit text-white mb-2 max-w-xl">
                  {lang === 'fr' ? 'Grande Veillée & Culte Prophétique d\'Adoration en Direct' : 'Grand Prophetic Prayer Vigil & Worship Live Service'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-4 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Le flux et le journal officiel de la page Media MGJ Monde sont synchronisés ci-dessous. Faites défiler le fil Facebook en direct.' 
                    : 'The official Media MGJ Monde timeline & broadcast are synchronized right below. Scroll through all real-time posts.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <button
                    onClick={() => {
                      setFbFeedType('official_meta');
                      const feedEl = document.getElementById('fb-feed-section');
                      if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                  >
                    <span>{lang === 'fr' ? 'Faire Défiler le Fil Officiel FB' : 'Scroll Official FB Feed'}</span>
                    <Tv className="w-4 h-4" />
                  </button>
                  <a
                    href="https://www.facebook.com/mediamgjmonde"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-2 border border-white/20 transition-all"
                  >
                    <span>Page Facebook (@mediamgjmonde)</span>
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-bold px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    DIRECT FACEBOOK 1080P HD
                  </span>
                  <span>1,842 {lang === 'fr' ? 'connectés dans l\'app' : 'connected inside app'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick info banner */}
          <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--bg-secondary)] border-glass">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] font-bold text-xs">
                {lang === 'fr' ? 'Alerte Prédication' : 'Sermon Alert'}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                {lang === 'fr' ? 'Thème du jour : "La Puissance de la Prière d\'Autorité et l\'Onction de Joël 2:28"' : 'Today\'s Theme: "The Power of Authority Prayer & The Anointing of Joel 2:28"'}
              </p>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-medium shrink-0">
              {lang === 'fr' ? 'Orateur : Pasteur Jean-Marc Joël' : 'Speaker: Pastor Jean-Marc Joel'}
            </span>
          </div>

          {/* Interactive Scrollable Social Feed Engine (`user must scroll the feed page and comment within the app`) */}
          <div className="space-y-6 pt-4">
            
            {/* Smart Mobile Anti-Overflow Header & Mode Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[var(--bg-secondary)] border border-glass shadow-xl relative overflow-hidden">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shrink-0 transition-transform hover:scale-105 ${activeSource === 'facebook' ? 'bg-blue-600 text-2xl' : 'bg-red-600 text-xl'}`}>
                  {activeSource === 'facebook' ? 'f' : '▶'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-xl font-extrabold font-outfit text-[var(--text-primary)] truncate max-w-full">
                      {activeSource === 'facebook' ? 'Fil d\'Actualité Facebook' : 'Fil & Vidéos YouTube'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] text-[11px] font-bold shrink-0">
                      {activeSource === 'facebook' ? '@mediamgjmonde' : '@mediaministeres...'}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-[var(--accent-gold)] block mt-1 leading-snug break-words">
                    {lang === 'fr' ? '📱 Navigation & Commentaires 100% Intégrés (Zéro Lien Externe)' : '📱 100% In-App Scrollable Feed & Commenting'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-glass text-xs font-extrabold text-[var(--text-secondary)] self-start sm:self-center shrink-0 shadow-inner">
                <Globe className="w-3.5 h-3.5 text-[var(--accent-gold)] animate-pulse" />
                <span>{lang === 'fr' ? 'Mode : Direct App' : 'Mode: In-App'}</span>
              </div>
            </div>

            {/* Smart Mobile Browsing Controls Bar (Zoom, Card Animations & Layouts) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[var(--bg-primary)]/80 border border-glass backdrop-blur-md shadow-lg sticky top-2 z-20">
              
              {/* Zoom Controls Bar */}
              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-xl border border-glass">
                <span className="text-[11px] font-extrabold uppercase text-[var(--text-secondary)] flex items-center gap-1.5 mr-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span className="hidden xs:inline">{lang === 'fr' ? 'Zoom Cartes :' : 'Feed Zoom:'}</span>
                </span>
                
                <button
                  onClick={() => setFeedZoom(Math.max(0.85, Number((feedZoom - 0.08).toFixed(2))))}
                  title={lang === 'fr' ? 'Réduire' : 'Zoom Out'}
                  className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--accent-olive)] hover:text-white transition-all flex items-center justify-center text-xs font-black shadow-sm"
                >
                  -
                </button>
                
                <button
                  onClick={() => setFeedZoom(1)}
                  title={lang === 'fr' ? 'Réinitialiser le zoom (100%)' : 'Reset Zoom (100%)'}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--accent-gold)] hover:text-slate-950 transition-all text-xs font-mono font-bold shadow-sm"
                >
                  {Math.round(feedZoom * 100)}%
                </button>
                
                <button
                  onClick={() => setFeedZoom(Math.min(1.28, Number((feedZoom + 0.08).toFixed(2))))}
                  title={lang === 'fr' ? 'Agrandir' : 'Zoom In'}
                  className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--accent-olive)] hover:text-white transition-all flex items-center justify-center text-xs font-black shadow-sm"
                >
                  +
                </button>
              </div>

              {/* View Layout Switcher (Dynamic Animations vs Compact Grid) */}
              <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] p-1 rounded-xl border border-glass">
                <button
                  onClick={() => setViewMode('dynamic')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    viewMode === 'dynamic'
                      ? 'bg-[var(--accent-olive)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? '✨ Vue Dynamique' : '✨ Dynamic 3D'}</span>
                </button>
                
                <button
                  onClick={() => setViewMode('compact')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    viewMode === 'compact'
                      ? 'bg-[var(--accent-olive)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? '⚡ Grille Compacte' : '⚡ Compact'}</span>
                </button>
              </div>

            </div>

            {/* YouTube Dual Feed Engine Mode Switcher (`When on YouTube Tab`) */}
            {activeSource === 'youtube' && (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-red-500/30 shadow-md">
                <button
                  onClick={() => setYtFeedType('channel_gallery')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    ytFeedType === 'channel_gallery'
                      ? 'bg-red-600 text-white shadow-lg scale-[1.02]'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-red-950/40'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                  <span>{lang === 'fr' ? '🎬 Vidéothèque & Toutes les Vidéos de la Chaîne' : '🎬 Official Channel Video Gallery'}</span>
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse ml-1" />
                </button>
                <button
                  onClick={() => setYtFeedType('interactive_app')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    ytFeedType === 'interactive_app'
                      ? 'bg-[var(--accent-olive)] text-white shadow-lg scale-[1.02]'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === 'fr' ? '⚡ Fil Communautaire & Commentaires App' : '⚡ In-App Community Feed'}</span>
                </button>
              </div>
            )}

            {/* Facebook Dual Feed Engine Mode Switcher (`When on Facebook Tab`) */}
            {activeSource === 'facebook' && (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-blue-500/30 shadow-md">
                <button
                  onClick={() => setFbFeedType('official_meta')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    fbFeedType === 'official_meta'
                      ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-blue-950/40'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>{lang === 'fr' ? '🌟 Journal Facebook En Direct (Officiel Meta)' : '🌟 Official Meta Live Timeline'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </button>
                <button
                  onClick={() => setFbFeedType('interactive_app')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    fbFeedType === 'interactive_app'
                      ? 'bg-[var(--accent-olive)] text-white shadow-lg scale-[1.02]'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === 'fr' ? '⚡ Fil Communautaire & Prédications App' : '⚡ In-App Community Feed'}</span>
                </button>
              </div>
            )}

            {/* Render Official YouTube Channel Video Gallery, Official Facebook Timeline, or In-App Scrollable Cards */}
            {activeSource === 'youtube' && ytFeedType === 'channel_gallery' ? (
              <div id="yt-gallery-section" className="space-y-6 pt-2 animate-fade-in">
                
                {/* Official YouTube Channel Header Card */}
                <div className="glass-card p-5 sm:p-6 rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-950/40 via-slate-900/80 to-[var(--bg-secondary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xl">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black flex items-center justify-center text-3xl shadow-2xl shrink-0 animate-pulse">
                      ▶
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-outfit font-black text-white text-lg sm:text-xl flex items-center gap-1.5">
                          <span>Chaîne Officielle : Media MGJ</span>
                          <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-mono font-bold">
                          @mediaministeresgenerationj4157
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 font-medium block mt-1 leading-relaxed">
                        {lang === 'fr' 
                          ? '✨ Vidéothèque complète et accès direct à toutes les vidéos publiées, prédications, cultes de dimanche et veillées de prière à lire au sein de l\'application.' 
                          : '✨ Complete video library & direct access to all published videos, sermons, Sunday worships, and prayer vigils right within the app.'}
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://www.youtube.com/@mediaministeresgenerationj4157"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl transition-all shrink-0 self-start sm:self-center hover:scale-105"
                  >
                    <span>{lang === 'fr' ? 'S\'abonner sur YouTube' : 'Subscribe on YouTube'}</span>
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Smart Category Filter Tabs & Search Bar inside Gallery */}
                <div className="glass-card p-4 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-3.5 shadow-lg">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {['Tous', 'Direct / Live', 'Cultes de Dimanche', 'Enseignements', 'Veillées & Prières', 'Louange & Adoration', 'Séminaires & Leaders', 'Témoignages & Miracles'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setYtCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap shrink-0 ${
                          ytCategory === cat
                            ? 'bg-red-600 text-white shadow-md scale-105'
                            : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white border border-glass'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-4 py-2.5 rounded-2xl border border-glass">
                    <span className="text-xs font-bold text-[var(--accent-gold)] shrink-0">🔍 Rechercher :</span>
                    <input
                      type="text"
                      value={ytSearchQuery}
                      onChange={(e) => setYtSearchQuery(e.target.value)}
                      placeholder={lang === 'fr' ? "Rechercher une vidéo, un orateur (Joël, Prière, Convention...)" : "Search any video or topic..."}
                      className="bg-transparent text-xs sm:text-sm text-white focus:outline-none w-full font-medium"
                    />
                    {ytSearchQuery && (
                      <button onClick={() => setYtSearchQuery('')} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Scrollable Video Gallery Grid */}
                <div 
                  style={{ 
                    transform: `scale(${feedZoom})`, 
                    transformOrigin: 'top center',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-h-[860px] overflow-y-auto pr-2 custom-scrollbar pb-10"
                >
                  {youtubeChannelVideos
                    .filter(v => (ytCategory === 'Tous' || v.category === ytCategory) && (v.title.toLowerCase().includes(ytSearchQuery.toLowerCase()) || v.description.toLowerCase().includes(ytSearchQuery.toLowerCase())))
                    .map((video, idx) => (
                      <div
                        key={`${video.id}-${idx}`}
                        className="glass-card rounded-3xl overflow-hidden border border-glass bg-[var(--bg-secondary)] shadow-xl hover:shadow-2xl hover:border-red-500/50 hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between group/card relative"
                      >
                        {/* Video Thumbnail Box */}
                        <div>
                          <div 
                            onClick={() => {
                              setSelectedVideo({
                                id: video.id,
                                title: video.title,
                                channel: 'Media MGJ Monde',
                                views: video.views,
                                time: video.date
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group/thumb"
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                              alt={video.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="w-14 h-14 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover/thumb:scale-110 group-hover/thumb:bg-red-600 transition-all">
                                <Play className="w-7 h-7 fill-current ml-1" />
                              </div>
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/85 text-white font-mono font-bold text-[11px] shadow">
                              {video.duration}
                            </div>
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wider shadow">
                              {video.category}
                            </div>
                          </div>

                          {/* Video Info & Details */}
                          <div className="p-4 sm:p-5 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                              <span>{video.views}</span>
                              <span>{video.date}</span>
                            </div>
                            <h4 className="font-outfit font-black text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover/card:text-red-400 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
                              {video.description}
                            </p>
                          </div>
                        </div>

                        {/* Direct In-App Action Buttons */}
                        <div className="p-4 pt-0 flex items-center gap-2.5 border-t border-glass/40 mt-2">
                          <button
                            onClick={() => {
                              setSelectedVideo({
                                id: video.id,
                                title: video.title,
                                channel: 'Media MGJ Monde',
                                views: video.views,
                                time: video.date
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{lang === 'fr' ? 'Lire dans l\'App' : 'Play In-App'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setZoomedMedia({ type: 'video', videoId: video.id, title: video.title });
                            }}
                            title={lang === 'fr' ? 'Aperçu Modal HD en Plein Écran' : 'Full Screen HD Modal Preview'}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[var(--accent-gold)] hover:text-slate-950 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{lang === 'fr' ? 'Plein Écran' : 'Full Screen'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : activeSource === 'facebook' && fbFeedType === 'official_meta' ? (
              <div id="fb-feed-section" className="space-y-6 pt-2 animate-fade-in">
                <div className="glass-card p-4 sm:p-6 rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-[var(--bg-secondary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-2xl shadow-lg shrink-0 animate-pulse">
                      f
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-outfit font-black text-white text-base sm:text-lg flex items-center gap-1.5 truncate">
                        <span className="truncate">Page Officielle : Media MGJ Monde</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      </h4>
                      <span className="text-xs text-blue-300 font-semibold block truncate">
                        {lang === 'fr' ? 'Retransmission en direct des publications officielles (@mediamgjmonde)' : 'Direct live broadcast of official publications (@mediamgjmonde)'}
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://www.facebook.com/mediamgjmonde"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 self-start sm:self-center hover:scale-105"
                  >
                    <span>{lang === 'fr' ? 'Ouvrir sur Facebook.com' : 'Open on Facebook.com'}</span>
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Official Meta Facebook Page Plugin iframe (`Scrollable directly within the app`) */}
                <div className="glass-card rounded-3xl overflow-hidden border border-glass shadow-2xl bg-white flex flex-col items-center justify-center min-h-[860px] relative">
                  <div className="w-full h-full flex items-center justify-center py-2 bg-slate-900/10">
                    <iframe
                      src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmediamgjmonde&tabs=timeline%2Cevents&width=500&height=850&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                      width="100%"
                      height="850"
                      style={{ border: 'none', overflow: 'hidden', minHeight: '850px', maxWidth: '500px', width: '100%' }}
                      scrolling="yes"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      className="rounded-xl shadow-xl bg-white mx-auto block"
                    />
                  </div>
                  <div className="p-3.5 text-center w-full bg-slate-950 text-xs text-slate-300 font-bold border-t border-glass">
                    {lang === 'fr' 
                      ? '💡 Astuce : Faites défiler le bloc blanc ci-dessus pour lire toutes les publications officielles de la page MGJ. Si votre navigateur bloque les scripts Meta, cliquez sur l\'onglet "Fil Communautaire App".' 
                      : '💡 Tip: Scroll inside the white block above to read all official posts. If browser blocks Meta scripts, click "In-App Community Feed".'}
                  </div>
                </div>
              </div>
            ) : (
              /* Scrollable Posts List with Dynamic Scale & Animation Engine */
              <div 
                style={{ 
                  transform: `scale(${feedZoom})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="space-y-6 max-h-[860px] overflow-y-auto pr-2 custom-scrollbar pb-10"
              >
                {socialFeedPosts.filter(p => p.platform === activeSource).map((post, index) => (
                  <div 
                    key={post.id} 
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={`glass-card rounded-2xl sm:rounded-3xl border border-glass transition-all relative overflow-hidden group ${
                      viewMode === 'dynamic'
                        ? 'p-5 sm:p-7 space-y-4 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-primary)] shadow-xl hover:shadow-2xl hover:shadow-[var(--accent-gold)]/10 hover:border-[var(--accent-gold)]/60 hover:scale-[1.015] sm:hover:scale-[1.02] duration-500 cubic-bezier(0.4, 0, 0.2, 1)'
                        : 'p-4 sm:p-5 space-y-3 bg-[var(--bg-secondary)] shadow-md hover:border-glass'
                    }`}
                  >
                    {/* Ambient Shimmer Top Glow (Dynamic Mode) */}
                    {viewMode === 'dynamic' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    )}
                    
                    {/* Post Header */}
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-md shrink-0 ${post.avatarBg}`}>
                          {post.platform === 'facebook' ? 'f' : '▶'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 font-outfit font-extrabold text-sm sm:text-base text-[var(--text-primary)] truncate">
                            <span className="truncate">{post.author}</span>
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          </div>
                          <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-muted)] block truncate">{post.time} • {post.handle}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)] text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm">
                        {post.platform === 'facebook' ? 'Publication FB' : 'Vidéo HD'}
                      </span>
                    </div>

                    {/* Post Text */}
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-medium break-words">
                      {post.content}
                    </p>

                    {/* Post Image Preview with Lightbox Zoom Trigger */}
                    {post.image && (
                      <div 
                        onClick={() => setZoomedMedia({ type: 'image', src: post.image, title: `${post.author} • ${post.time}` })}
                        className="rounded-2xl overflow-hidden border border-glass shadow-lg bg-black/40 relative group/img cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                      >
                        <img src={post.image} alt="Publication MGJ" className="w-full h-auto max-h-[500px] object-contain object-center mx-auto transition-transform duration-500 group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-slate-950 text-xs font-black flex items-center gap-2 shadow-2xl scale-95 group-hover/img:scale-100 transition-transform">
                            <Maximize2 className="w-4 h-4" />
                            <span>{lang === 'fr' ? 'Toucher pour Zoomer en Plein Écran' : 'Tap to Zoom Full Screen'}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Post Video Preview with Play & Lightbox Options */}
                    {post.videoTitle && (
                      <div className="rounded-2xl overflow-hidden border border-red-500/40 bg-black/85 p-5 sm:p-6 text-center shadow-2xl relative aspect-video flex flex-col items-center justify-center group/vid">
                        <div 
                          onClick={() => {
                            if (post.videoId) {
                              setSelectedVideo({
                                id: post.videoId,
                                title: post.videoTitle || '',
                                channel: post.author,
                                views: '1,428 spectateurs connectés',
                                time: '🔴 DIRECT'
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-2xl mb-3 group-hover/vid:scale-110 transition-transform">
                            <Play className="w-8 h-8 fill-current ml-1" />
                          </div>
                          <h4 className="font-outfit font-black text-white text-sm sm:text-lg max-w-md px-2 line-clamp-2">
                            {post.videoTitle}
                          </h4>
                          <span className="text-xs text-red-400 font-bold mt-3 inline-flex items-center gap-1.5 bg-red-950/60 px-4 py-1.5 rounded-full border border-red-500/30">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            {lang === 'fr' ? 'Cliquez pour lire en direct (Lecteur au-dessus)' : 'Click to play in top player'}
                          </span>
                        </div>

                        {/* Modal Lightbox Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedMedia({ type: 'video', videoId: post.videoId, title: post.videoTitle });
                          }}
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[var(--accent-gold)] hover:text-slate-950 text-white text-[11px] font-extrabold flex items-center gap-1.5 border border-white/20 transition-all shadow-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'fr' ? 'Aperçu Modal HD' : 'Modal HD Preview'}</span>
                        </button>
                      </div>
                    )}

                    {/* Post Stats & Reactions */}
                    <div className="flex items-center justify-between pt-3 border-t border-glass text-xs font-bold text-[var(--text-secondary)]">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => {
                            setSocialFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                          }}
                          className="flex items-center gap-1.5 hover:text-blue-400 transition-colors py-1 px-2 rounded-lg bg-[var(--bg-primary)]/50"
                        >
                          <ThumbsUp className="w-4 h-4 text-blue-400" />
                          <span>{post.likes} {lang === 'fr' ? 'J\'aime' : 'Likes'}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-[var(--accent-gold)] py-1 px-2 rounded-lg bg-[var(--bg-primary)]/50">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments.length} {lang === 'fr' ? 'commentaires' : 'comments'}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{post.shares} {lang === 'fr' ? 'partages' : 'shares'}</span>
                      </div>
                    </div>

                    {/* In-App Commenting Engine (`comment within the app`) */}
                    <div className="pt-3 border-t border-glass space-y-3 bg-[var(--bg-primary)]/40 p-4 rounded-2xl">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-olive)] flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{lang === 'fr' ? 'Commentaires au sein de l\'application' : 'Comments within app'} ({post.comments.length})</span>
                      </h5>

                      {/* Comment List */}
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {post.comments.map(c => (
                          <div key={c.id} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-glass flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-outfit font-extrabold text-xs text-[var(--text-primary)] flex items-center gap-1">
                                {c.author}
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">{c.time}</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">{c.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add Comment Input Form within the app */}
                      <div className="flex items-center gap-2 pt-1">
                        <input 
                          type="text"
                          value={postCommentInput[post.id] || ''}
                          onChange={(e) => setPostCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePostComment(post.id);
                          }}
                          placeholder={lang === 'fr' ? `Écrivez un commentaire sous ${post.platform === 'facebook' ? 'cette publication FB' : 'cette vidéo YT'}...` : `Write a comment on this ${post.platform} post...`}
                          className="input-field py-2 text-xs flex-1 rounded-xl bg-[var(--bg-tertiary)]"
                        />
                        <button 
                          onClick={() => handlePostComment(post.id)}
                          className="btn-gold px-4 py-2 text-xs rounded-xl font-bold flex items-center gap-1.5 shrink-0 shadow-md hover:scale-105 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{lang === 'fr' ? 'Publier' : 'Post'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Chat Simulator Box */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[650px] bg-[var(--bg-secondary)] border border-glass shadow-xl sticky top-24">
          <div className="p-4 border-b border-glass flex items-center justify-between bg-[var(--bg-tertiary)]/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-outfit font-extrabold text-sm text-[var(--text-primary)]">
                {t('live.chatTitle')}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[var(--text-secondary)]">
              {messages.length} messages
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'} animate-slide-up`} style={{ animationDuration: '0.2s' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[11px] font-extrabold ${m.isUser ? 'text-[var(--accent-gold)]' : 'text-[var(--accent-olive)]'}`}>
                    {m.sender}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">{m.time}</span>
                </div>
                <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[88%] ${
                  m.isUser 
                    ? 'bg-[var(--accent-olive)] text-white rounded-br-none shadow-md' 
                    : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-glass rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-glass bg-[var(--bg-primary)] flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('live.chatPlaceholder')}
              className="input-field py-2.5 text-xs flex-1 rounded-xl"
            />
            <button
              type="submit"
              className="btn-primary p-2.5 rounded-xl text-white shrink-0 shadow-md"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Section: Sermon Notes Notepad + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Sermon Notes Box */}
        <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-outfit text-[var(--text-primary)]">
                {t('live.notesTitle')}
              </h3>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-semibold">
              {sermonNotes.length} {lang === 'fr' ? 'notes enregistrées' : 'saved notes'}
            </span>
          </div>

          {noteSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{lang === 'fr' ? 'Note enregistrée avec succès dans votre profil !' : 'Note successfully saved to your profile!'}</span>
            </div>
          )}

          <form onSubmit={handleSaveNote} className="space-y-3">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder={lang === 'fr' ? 'Titre de la prédication ou verset clé...' : 'Sermon title or key scripture...'}
              className="input-field py-2 text-sm rounded-xl font-bold"
            />
            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={t('live.notesPlaceholder')}
              className="input-field py-2.5 text-sm rounded-xl resize-none"
              required
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="submit"
                className="btn-gold py-2 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{t('live.saveNotes')}</span>
              </button>
            </div>
          </form>

          {/* List of Saved Notes */}
          {sermonNotes.length > 0 && (
            <div className="pt-3 border-t border-glass space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                {lang === 'fr' ? 'Notes Récentes' : 'Recent Saved Notes'}
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {sermonNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-glass flex items-start justify-between gap-3">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">{note.title}</h5>
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0">{note.date}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDownloadNote(note)}
                        title={lang === 'fr' ? 'Télécharger en TXT' : 'Download TXT'}
                        className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--accent-olive)] text-[var(--text-secondary)] hover:text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSermonNote(note.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-red-500 text-[var(--text-secondary)] hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weekly Live Schedule Box */}
        <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-olive)]/15 text-[var(--accent-olive)]">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-[var(--text-primary)]">
              {t('live.scheduleTitle')}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-glass flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase text-[var(--accent-olive)] tracking-wider">
                  {lang === 'fr' ? 'Mardi 18h30 - 20h30' : 'Tuesday 6:30 PM - 8:30 PM'}
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                  {lang === 'fr' ? 'Veillée d\'Intercession & Prière de Feu' : 'Intercessory Vigil & Prayer of Fire'}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {lang === 'fr' ? 'En direct sur le flux intégré FB & YouTube avec l\'équipe d\'intercession.' : 'Live inside our in-app FB and YouTube feed with the intercession team.'}
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] text-[10px] font-extrabold shrink-0">
                LIVE INTÉGRÉ
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-glass flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase text-[var(--accent-gold)] tracking-wider">
                  {lang === 'fr' ? 'Vendredi 18h00 - 20h00' : 'Friday 6:00 PM - 8:00 PM'}
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                  {lang === 'fr' ? 'École Prophétique & Enseignement Biblique' : 'Prophetic School & Biblical Teaching'}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {lang === 'fr' ? 'Étude approfondie de la Parole de Dieu et préparation prophétique.' : 'In-depth study of God\'s Word and prophetic preparation.'}
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-[var(--accent-gold-glow)] text-[var(--accent-gold)] text-[10px] font-extrabold shrink-0">
                YT HD
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-glass flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase text-[var(--accent-orange)] tracking-wider">
                  {lang === 'fr' ? 'Dimanche 09h00 - 12h30' : 'Sunday 9:00 AM - 12:30 PM'}
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                  {lang === 'fr' ? 'Grand Culte d\'Adoration, Louange & Miracles' : 'Grand Worship, Praise & Miracle Service'}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {lang === 'fr' ? 'Retransmission solennelle depuis notre sanctuaire central directement dans l\'application.' : 'Solemn broadcast from our central sanctuary directly inside the app.'}
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-[var(--accent-orange-glow)] text-[var(--accent-orange)] text-[10px] font-extrabold shrink-0">
                DIRECT APP
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Full-Screen Interactive Lightbox & Zoom Viewer Modal for Mobile Browsing */}
      {zoomedMedia && (
        <div 
          onClick={() => { setZoomedMedia(null); setModalScale(1); }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          {/* Top Control Bar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 inset-x-4 max-w-4xl mx-auto flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 z-10"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-gold)] text-slate-950 font-black text-xs shrink-0">
                {zoomedMedia.type === 'image' ? 'ZOOM PHOTO' : 'DIRECT HD MODAL'}
              </span>
              <h4 className="font-outfit font-bold text-white text-xs sm:text-sm truncate">
                {zoomedMedia.title || 'Média MGJ'}
              </h4>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {zoomedMedia.type === 'image' && (
                <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-white/10">
                  <button 
                    onClick={() => setModalScale(Math.max(0.8, Number((modalScale - 0.25).toFixed(2))))}
                    className="w-7 h-7 rounded bg-white/10 hover:bg-[var(--accent-gold)] hover:text-slate-950 text-white font-bold text-sm transition-all flex items-center justify-center"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold text-amber-300 px-1.5">{Math.round(modalScale * 100)}%</span>
                  <button 
                    onClick={() => setModalScale(Math.min(2.5, Number((modalScale + 0.25).toFixed(2))))}
                    className="w-7 h-7 rounded bg-white/10 hover:bg-[var(--accent-gold)] hover:text-slate-950 text-white font-bold text-sm transition-all flex items-center justify-center"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => setModalScale(1)}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-[var(--accent-olive)] text-white text-[10px] font-bold transition-all ml-1"
                  >
                    Reset
                  </button>
                </div>
              )}

              <button
                onClick={() => { setZoomedMedia(null); setModalScale(1); }}
                className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all font-black text-lg"
                title="Fermer (Close)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Content Box */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[85vh] flex items-center justify-center overflow-auto p-2 sm:p-4 custom-scrollbar"
          >
            {zoomedMedia.type === 'image' && zoomedMedia.src ? (
              <img 
                src={zoomedMedia.src} 
                alt={zoomedMedia.title || 'Média en grand'} 
                style={{ 
                  transform: `scale(${modalScale})`, 
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' 
                }}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing border border-white/20"
              />
            ) : zoomedMedia.type === 'video' && zoomedMedia.videoId ? (
              <div className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-[var(--accent-gold)] shadow-2xl bg-black relative">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${zoomedMedia.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title="YouTube video player modal"
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
          </div>

          <div className="absolute bottom-4 inset-x-4 text-center pointer-events-none">
            <span className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] text-slate-300 font-extrabold">
              {lang === 'fr' ? '💡 Astuce : Pincez l\'écran ou utilisez les boutons pour zoomer librement' : '💡 Tip: Pinch screen or use buttons to freely zoom'}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
