import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { MinistryPosition } from '../types/user';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  Radio, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Award, 
  Send, 
  Download, 
  TrendingUp, 
  UserCheck, 
  Layers, 
  AlertCircle,
  Tv,
  LogOut,
  Lock,
  Key,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Check,
  Upload,
  Camera,
  Package,
  Bus,
  Plane,
  Filter,
  Edit2,
  Save,
  CloudUpload,
  X,
  FileText
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateToPublic?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateToPublic }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useLanguage();
  const { user, login, logout, canAccessAdmin } = useAuth();
  const { 
    shopItems, 
    addShopItem, 
    updateShopItem,
    deleteShopItem, 
    speakers, 
    addSpeaker, 
    updateSpeaker,
    deleteSpeaker, 
    schedule, 
    addScheduleItem, 
    updateScheduleItem,
    deleteScheduleItem, 
    notifications,
    announcements,
    createAnnouncement,
    updateAnnouncement,
    deleteNotification, 
    deleteAnnouncement,
    donations, 
    orders,
    kziWelcomeInfo,
    updateKziWelcomeInfo,
    kziRegistrantsList,
    deleteKziRegistrant,
    updateKziRegistrantStatus
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'users' | 'kzi' | 'announcements' | 'shop' | 'finances'>('users');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Firebase Manual Edit & Save Suite
  const [editingItem, setEditingItem] = useState<{
    type: 'speaker' | 'schedule' | 'announcement' | 'shop' | null;
    data: any;
  } | null>(null);
  const [firebaseActionStatus, setFirebaseActionStatus] = useState<string | null>(null);

  const showFirebaseToast = (msg: string) => {
    setFirebaseActionStatus(msg);
    setTimeout(() => setFirebaseActionStatus(null), 4500);
  };

  const handleDirectFirebaseSave = async (collectionName: string, item: any, successMsg: string) => {
    try {
      await setDoc(doc(db, collectionName, item.id), item, { merge: true });
      showFirebaseToast(successMsg);
    } catch (e: any) {
      showFirebaseToast(`❌ Erreur Firebase: ${e.message}`);
    }
  };

  // Real User Management State fetched from Firestore without mock data
  const [memberList, setMemberList] = useState<any[]>(() => {
    const cached = localStorage.getItem('cached_mgj_users_list');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [kziFilter, setKziFilter] = useState<'all' | 'kit' | 'bus' | 'flight'>('all');
  const [kziSearchQuery, setKziSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList: any[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          usersList.push({
            id: docSnap.id || data.uid || `u-${Math.random()}`,
            name: data.fullName || data.name || data.email || 'Utilisateur MGJ',
            email: data.email || '',
            phone: data.phone || '+243 81 000 0000',
            position: data.ministryPosition || data.position || 'Membre',
            country: data.country || 'RDC',
            city: data.city || 'Lubumbashi',
            role: (data.role || 'user') as any
          });
        });
        if (usersList.length > 0) {
          setMemberList(usersList);
          localStorage.setItem('cached_mgj_users_list', JSON.stringify(usersList));
        } else if (user) {
          const initialUser = [{
            id: user.uid,
            name: user.fullName || user.email,
            email: user.email,
            phone: user.phone || '+243 81 000 0001',
            position: user.ministryPosition || 'Pasteur',
            country: user.country || 'RDC',
            city: user.city || 'Lubumbashi',
            role: (user.role || 'admin') as any
          }];
          setMemberList(initialUser);
          localStorage.setItem('cached_mgj_users_list', JSON.stringify(initialUser));
        }
      } catch (err) {
        console.warn('Could not load users list from Firestore:', err);
      }
    };
    fetchAllUsers();
  }, [activeTab, user]);

  // New Admin Assignment Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('+243 ');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'user'>('admin');
  const [newAdminPos, setNewAdminPos] = useState<MinistryPosition>('Pasteur');

  // Speaker Form State
  const [spkName, setSpkName] = useState('');
  const [spkRoleFr, setSpkRoleFr] = useState('');
  const [spkBioFr, setSpkBioFr] = useState('');
  const [spkImage, setSpkImage] = useState('');

  // Schedule Form State
  const [schedDay, setSchedDay] = useState(1);
  const [schedTime, setSchedTime] = useState('10:00 - 12:00');
  const [schedTitleFr, setSchedTitleFr] = useState('');
  const [schedDescFr, setSchedDescFr] = useState('');
  const [schedSpeaker, setSchedSpeaker] = useState('Pasteur Jean-Marc Joël');

  // KZI Welcome Info Edit State
  const [editThemeFr, setEditThemeFr] = useState(kziWelcomeInfo?.themeFr || 'L\'Effusion de l\'Esprit - Joël 2:28');
  const [editDatesFr, setEditDatesFr] = useState(kziWelcomeInfo?.datesFr || 'Du 02 au 09 Août 2026');
  const [editLocationFr, setEditLocationFr] = useState(kziWelcomeInfo?.locationFr || 'Kolwezi • Manika Sport (Sanctuaire Central)');
  const [editVisionFr, setEditVisionFr] = useState(kziWelcomeInfo?.visionTextFr || 'La 31ème Grande Convention Internationale KZI 2026 est le grand rassemblement solennel et apostolique des Ministères Génération Joël (MGJ Monde).');

  const handleSaveKziWelcomeInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateKziWelcomeInfo && kziWelcomeInfo) {
      updateKziWelcomeInfo({
        ...kziWelcomeInfo,
        themeFr: editThemeFr,
        datesFr: editDatesFr,
        locationFr: editLocationFr,
        visionTextFr: editVisionFr
      });
      showFeedback('Paramètres d\'accueil & vision de la Convention Kzi mis à jour !');
    }
  };

  // Announcement Form State
  const [annTitleFr, setAnnTitleFr] = useState('');
  const [annBodyFr, setAnnBodyFr] = useState('');
  const [annType, setAnnType] = useState<'urgent' | 'event' | 'general'>('urgent');
  const [annMediaUrl, setAnnMediaUrl] = useState('');
  const [annMediaType, setAnnMediaType] = useState<'image' | 'video' | 'audio' | 'none'>('none');
  const [annSender, setAnnSender] = useState<'Admin MGJ' | 'MediaMGJMonde' | 'Visionnaire MGJ'>('Admin MGJ');

  const handleAnnMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxDim = 600;
              let w = img.width;
              let h = img.height;
              if (w > h) {
                if (w > maxDim) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                }
              } else {
                if (h > maxDim) {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                const compressedUrl = canvas.toDataURL('image/jpeg', 0.65);
                setAnnMediaUrl(compressedUrl);
                setAnnMediaType('image');
                showFeedback('Image compressée et prête pour Firebase !');
              } else {
                setAnnMediaUrl(reader.result as string);
                setAnnMediaType('image');
                showFeedback('Image chargée !');
              }
            };
            img.onerror = () => {
              setAnnMediaUrl(reader.result as string);
              setAnnMediaType('image');
              showFeedback('Image chargée !');
            };
            img.src = reader.result;
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        const type = file.type.startsWith('video/') ? 'video' : 'audio';
        if (file.size > 720 * 1024) {
          alert('⚠️ Le fichier dépasse 720 Ko (la taille maximum autorisée par document Firebase Firestore pour la synchronisation instantanée sans serveur externe). Veuillez coller un lien URL (ex: YouTube, Vimeo, Google Drive) ou choisir un fichier moins lourd (< 700 Ko).');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setAnnMediaUrl(reader.result);
            setAnnMediaType(type);
            showFeedback(`${type === 'video' ? 'Vidéo' : 'Fichier Audio'} chargé et prêt pour Firebase !`);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Shop Product Form State
  const [prodTitleFr, setProdTitleFr] = useState('');
  const [prodDescFr, setProdDescFr] = useState('');
  const [prodCat, setProdCat] = useState<'books' | 'apparel' | 'media'>('books');
  const [prodPriceEur, setProdPriceEur] = useState(25);
  const [prodPriceUsd, setProdPriceUsd] = useState(27);
  const [prodPriceFc, setProdPriceFc] = useState(62500);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600');

  // Quick Action feedback
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handlePromoteMember = async (id: string, newRole: 'admin' | 'user') => {
    setMemberList(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, role: newRole } : m);
      try { localStorage.setItem('cached_mgj_users_list', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    showFeedback(newRole === 'admin' ? 'Membre promu Administrateur !' : 'Rôle modifié avec succès.');
    try {
      await setDoc(doc(db, 'users', id), { role: newRole }, { merge: true });
    } catch (err) {
      console.warn('Could not update user role in Firestore:', err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    setMemberList(prev => {
      const updated = prev.filter(m => m.id !== id);
      try { localStorage.setItem('cached_mgj_users_list', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    showFeedback('Membre supprimé.');
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      console.warn('Could not delete user from Firestore:', err);
    }
  };

  const handleAssignNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;
    const cleanEmail = newAdminEmail.toLowerCase().trim();
    const existing = memberList.find(m => m.email.toLowerCase() === cleanEmail);
    const userId = existing ? existing.id : `admin-${Date.now()}`;
    const newMember = {
      id: userId,
      name: newAdminName,
      email: cleanEmail,
      phone: newAdminPhone || '+243 81 000 0000',
      position: newAdminPos,
      country: 'RDC',
      city: 'Lubumbashi',
      role: newAdminRole
    };
    setMemberList(prev => {
      const filtered = prev.filter(m => m.email.toLowerCase() !== cleanEmail);
      const updated = [newMember, ...filtered];
      try { localStorage.setItem('cached_mgj_users_list', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setNewAdminEmail('');
    setNewAdminName('');
    setNewAdminPhone('+243 ');
    showFeedback(newAdminRole === 'admin' ? `✅ Compte Administrateur (${newMember.email}) créé et assigné avec succès par Dr. Nduwa !` : `✅ Membre (${newMember.email}) ajouté.`);
    try {
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email: cleanEmail,
        fullName: newAdminName,
        phone: newAdminPhone || '+243 81 000 0000',
        ministryPosition: newAdminPos,
        city: 'Lubumbashi',
        country: 'RDC',
        role: newAdminRole,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not save assigned admin to Firestore:', err);
    }
  };

  const handleSpeakerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 450;
            let w = img.width;
            let h = img.height;
            if (w > h) {
              if (w > maxDim) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              }
            } else {
              if (h > maxDim) {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
              setSpkImage(compressedUrl);
              showFeedback('Photo de l\'orateur chargée et compressée (450px) !');
            } else {
              setSpkImage(reader.result as string);
              showFeedback('Photo de l\'orateur chargée !');
            }
          };
          img.onerror = () => {
            setSpkImage(reader.result as string);
            showFeedback('Photo de l\'orateur chargée !');
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShopImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 500;
            let w = img.width;
            let h = img.height;
            if (w > h) {
              if (w > maxDim) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              }
            } else {
              if (h > maxDim) {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressedUrl = canvas.toDataURL('image/jpeg', 0.75);
              setProdImage(compressedUrl);
              showFeedback('Photo de l\'article chargée et compressée avec succès !');
            } else {
              setProdImage(reader.result as string);
              showFeedback('Photo de l\'article chargée !');
            }
          };
          img.onerror = () => {
            setProdImage(reader.result as string);
            showFeedback('Photo de l\'article chargée !');
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpeakerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spkName.trim()) return;
    addSpeaker({
      name: spkName,
      roleFr: spkRoleFr || 'Orateur & Serviteur de Dieu',
      roleEn: spkRoleFr || 'Speaker & Minister of God',
      bioFr: spkBioFr || 'Serviteur oint pour l\'édification du corps du Christ.',
      bioEn: spkBioFr || 'Anointed minister for the edification of the body of Christ.',
      imageUrl: spkImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
    });
    setSpkName('');
    setSpkRoleFr('');
    setSpkBioFr('');
    setSpkImage('');
    showFeedback('Orateur Convention Kzi ajouté !');
  };

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitleFr.trim()) return;
    addScheduleItem({
      day: schedDay,
      time: schedTime,
      titleFr: schedTitleFr,
      titleEn: schedTitleFr,
      descFr: schedDescFr || 'Session spéciale d\'onction et de prière.',
      descEn: schedDescFr || 'Special session of anointing and prayer.',
      speakerName: schedSpeaker
    });
    setSchedTitleFr('');
    setSchedDescFr('');
    showFeedback('Session au programme Kzi ajoutée !');
  };

  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitleFr.trim() || !annBodyFr.trim()) return;
    let authorName = 'Admin MGJ';
    let authorRole = 'Administration & Secrétariat Général';
    if (annSender === 'MediaMGJMonde') {
      authorName = 'MediaMGJMonde';
      authorRole = 'Département Technique & Communication';
    } else if (annSender === 'Visionnaire MGJ') {
      authorName = 'Visionnaire MGJ';
      authorRole = 'Visionnaire & Fondateur MGJ Monde';
    }
    createAnnouncement(
      annTitleFr,
      annTitleFr,
      annBodyFr,
      annBodyFr,
      annType,
      annMediaUrl || undefined,
      annMediaType,
      authorName,
      authorRole
    );
    setAnnTitleFr('');
    setAnnBodyFr('');
    setAnnMediaUrl('');
    setAnnMediaType('none');
    setAnnSender('Admin MGJ');
    showFeedback('Annonce publiée instantanément à tous les utilisateurs !');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitleFr.trim()) return;
    addShopItem({
      titleFr: prodTitleFr,
      titleEn: prodTitleFr,
      descFr: prodDescFr || 'Article officiel du ministère MGJ.',
      descEn: prodDescFr || 'Official ministry item from MGJ.',
      priceEur: Number(prodPriceEur),
      priceUsd: Number(prodPriceUsd),
      priceFc: Number(prodPriceFc),
      category: prodCat,
      imageUrl: prodImage,
      inStock: true
    });
    setProdTitleFr('');
    setProdDescFr('');
    showFeedback('Nouvel article ajouté à la boutique !');
  };

  const handleDownloadFinancialReport = () => {
    const totalEur = donations.filter(d => d.currency === 'EUR').reduce((a, b) => a + b.amount, 0);
    const totalUsd = donations.filter(d => d.currency === 'USD').reduce((a, b) => a + b.amount, 0);
    const totalFc = donations.filter(d => d.currency === 'FC').reduce((a, b) => a + b.amount, 0);

    const element = document.createElement("a");
    const reportText = `=======================================================\n   RAPPORT FINANCIER ADMINISTRATEUR - MGJ MONDE\n=======================================================\nDate du Rapport : ${new Date().toLocaleDateString('fr-FR')}\nGénéré par : ${user ? user.fullName : 'Admin MGJ'}\n\n=== SYNTHÈSE GLOBALE DES OFFRANDES ===\nTotal en Euro (EUR) : ${totalEur.toFixed(2)} €\nTotal en Dollar (USD) : ${totalUsd.toFixed(2)} $\nTotal en Franc Congolais (FC) : ${totalFc.toLocaleString('fr-FR')} FC\n\n=== DÉTAIL DES TRANSACTIONS ===\n` +
      donations.map(d => `[${d.createdAt.slice(0,10)}] ${d.userName} (${d.type.toUpperCase()}) : +${d.amount} ${d.currency} - ${d.paymentMethod} (Reçu: ${d.receiptNumber})`).join('\n') +
      `\n\n« Après cela, je répandrai mon esprit sur toute chair... » Joël 2:28\n=======================================================`;
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Rapport_Financier_MGJ_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredMembers = memberList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || (!canAccessAdmin && user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative">
        
        {/* Top bar for Gateway */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
          <button
            onClick={() => {
              if (onNavigateToPublic) onNavigateToPublic();
              else {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-glass text-xs font-bold flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-md"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'fr' ? 'Retour au Site Public' : 'Return to Public Site'}</span>
          </button>
        </div>

        {/* Secure Gateway Card */}
        <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative overflow-hidden animate-slide-up space-y-6">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-xl">
              <ShieldAlert className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
                Accès Restreint & Sépare
              </span>
              <h1 className="text-2xl font-black font-outfit text-[var(--text-primary)] mt-2">
                Portail d'Administration
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Connexion requise pour le Centre de Commandement MGJ MONDE
              </p>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setAuthError('');
              if (!loginEmail || !loginPass) {
                setAuthError('Veuillez saisir vos identifiants administrateur.');
                return;
              }
              try {
                await login(loginEmail, loginPass);
              } catch (err: any) {
                setAuthError(err.message || 'Erreur lors de la connexion administrateur.');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Identifiant / Email Admin
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ex: pasteur.joel@mediamgjmonde.org"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-glass text-sm focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Mot de Passe de Sécurité
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-glass text-sm focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Accéder au Portail Admin' : 'Enter Admin Command Center'}</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-4 border-t border-glass text-center space-y-2">
            <span className="text-[11px] text-[var(--text-muted)] block uppercase tracking-wider font-semibold">
              Option Démonstration / Audit
            </span>
            <button
              onClick={async () => {
                try {
                  setAuthError('');
                  await login('pasteur.joel@mediamgjmonde.org', 'admin123');
                } catch (err: any) {
                  setAuthError(err.message || 'Erreur lors de la connexion démo.');
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-amber-500/30 text-amber-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>👑 Connexion Rapide Démo (Jean-Marc Joël - Admin)</span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 pb-16">
      
      {/* Standalone Admin Command Center Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-amber-500/30 px-4 sm:px-8 py-3.5 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-outfit font-black text-lg tracking-tight text-white leading-none">
                  MGJ <span className="text-amber-400">ADMIN</span> PORTAL
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider">
                  ISOLÉ & SÉPARÉ
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Command Center • Médiamonde MJG
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (onNavigateToPublic) onNavigateToPublic();
                else {
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              title="Accéder à l'espace utilisateur (sans perdre la session Admin)"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">🌐 Espace Utilisateur (/)</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
              title="Mode Sombre / Clair"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="truncate max-w-[140px]">{user.fullName}</span>
            </div>

            <button
              onClick={async () => {
                await logout();
                if (onNavigateToPublic) onNavigateToPublic();
                else {
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Déconnexion sécurisée"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-slide-up mt-2" style={{ animationDuration: '0.3s' }}>
        
        {/* VIP Admin Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-[#3a250a] to-[#0f172a] p-6 sm:p-8 border border-amber-500/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-xl shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{t('admin.roleBadge')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-white leading-tight">
                {t('admin.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {t('admin.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (onNavigateToPublic) onNavigateToPublic();
                else {
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>🌐 {lang === 'fr' ? 'Aller sur l\'Espace Utilisateur' : 'Go to User Site'}</span>
            </button>
          </div>
        </div>

      {/* Global Success Feedback Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-sm flex items-center justify-between gap-3 animate-slide-up shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* 5 Management Center Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-glass pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('admin.tabUsers')} ({memberList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kzi')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'kzi'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Contrôle & Suivi de la Convention Kzi 2026 ({kziRegistrantsList?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <Radio className="w-4 h-4 text-red-400" />
          <span>{t('admin.tabAnnouncements')}</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'shop'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('admin.tabShop')} ({shopItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'finances'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>{t('admin.tabFinances')}</span>
        </button>
      </div>

      {/* Firebase Action Toast Banner */}
      {firebaseActionStatus && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-[var(--accent-gold)] text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-between border-2 border-white animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{firebaseActionStatus}</span>
          </div>
          <button onClick={() => setFirebaseActionStatus(null)} className="p-1 hover:bg-black/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: USER & LEADER CONTROL SUITE */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Superadmin Dr. Nduwa Assignment Form */}
          <div className="glass-card rounded-3xl p-6 border border-amber-500/40 bg-gradient-to-br from-[#1c2c0d]/60 via-[#15230c]/40 to-[#0f172a]/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    Super Administrateur Prophétique (drnduwa@gmail.com)
                  </span>
                  <h3 className="text-base font-black font-outfit text-white">
                    Créer & Assigner un Compte Administrateur
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hidden sm:inline-block">
                Privilège Superadmin
              </span>
            </div>

            <form onSubmit={handleAssignNewAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Email admin (ex: pasteur@mediamgj.org)"
                className="input-field py-2.5 px-3 text-xs font-bold rounded-xl bg-black/40 border-white/15 text-white"
                required
              />
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Nom complet / Titre spirituel"
                className="input-field py-2.5 px-3 text-xs font-bold rounded-xl bg-black/40 border-white/15 text-white"
                required
              />
              <input
                type="tel"
                value={newAdminPhone}
                onChange={(e) => setNewAdminPhone(e.target.value)}
                placeholder="Téléphone / WhatsApp"
                className="input-field py-2.5 px-3 text-xs font-bold rounded-xl bg-black/40 border-white/15 text-white"
              />
              <select
                value={newAdminPos}
                onChange={(e) => setNewAdminPos(e.target.value as MinistryPosition)}
                className="input-field py-2.5 px-3 text-xs font-bold rounded-xl bg-black/40 border-white/15 text-white"
              >
                <option value="Pasteur">Pasteur</option>
                <option value="Modérateur">Modérateur</option>
                <option value="Evangéliste">Evangéliste</option>
                <option value="Leader de Jeunesse">Leader de Jeunesse</option>
                <option value="Chantre / Intercesseur">Chantre / Intercesseur</option>
                <option value="Membre">Membre</option>
              </select>
              <div className="flex gap-2">
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'user')}
                  className="input-field py-2.5 px-2 text-xs font-black rounded-xl bg-amber-500/20 text-amber-300 border-amber-500/40"
                >
                  <option value="admin">ADMIN VIP</option>
                  <option value="user">Utilisateur</option>
                </select>
                <button
                  type="submit"
                  className="btn-gold py-2.5 px-4 rounded-xl font-outfit font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shrink-0"
                  title="Assigner ce rôle"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assigner</span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, pays ou poste..."
                className="input-field py-2.5 pl-10 text-xs w-full rounded-xl"
              />
            </div>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {filteredMembers.length} membres affichés
            </span>
          </div>

          <div className="glass-card overflow-hidden rounded-3xl border-glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-tertiary)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] border-b border-glass">
                    <th className="py-3.5 px-4">Membre & Email</th>
                    <th className="py-3.5 px-4">Poste & Ministère</th>
                    <th className="py-3.5 px-4">Ville & Pays</th>
                    <th className="py-3.5 px-4">Rôle</th>
                    <th className="py-3.5 px-4 text-right">Actions VIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass/40 text-xs font-medium">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[var(--text-primary)]">{m.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{m.email} • {m.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] font-extrabold">
                          {m.position}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        {m.city}, <strong className="text-[var(--text-primary)]">{m.country}</strong>
                      </td>
                      <td className="py-3.5 px-4">
                        {m.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-[10px] uppercase">
                            ADMIN VIP
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-secondary)] font-bold text-[10px] uppercase">
                            MEMBRE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handlePromoteMember(m.id, m.role === 'admin' ? 'user' : 'admin')}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-primary)] hover:bg-amber-500 text-[var(--text-secondary)] hover:text-white font-bold text-[10px] transition-colors"
                          title="Promouvoir ou révoquer Admin"
                        >
                          {m.role === 'admin' ? 'Rétrograder' : 'Promouvoir Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 text-white transition-colors"
                          title="Supprimer ce compte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS & CONVENTION KZI CONTROL SUITE */}
      {activeTab === 'kzi' && (
        <div className="space-y-8">
          
          {/* Top Panel: Arrival & Participation Registrants Dashboard */}
          <div className="space-y-6">
            
            {/* KPI Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Kit Convention Kzi 2026 */}
              <div 
                onClick={() => setKziFilter(kziFilter === 'kit' ? 'all' : 'kit')}
                className={`glass-card p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex flex-col justify-between ${
                  kziFilter === 'kit' 
                    ? 'bg-amber-500/20 border-amber-400 scale-[1.02]' 
                    : 'bg-[var(--bg-secondary)] border-[var(--accent-gold)]/40 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase">
                    Pass VIP
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black font-outfit text-[var(--text-primary)]">
                    {(kziRegistrantsList || []).filter(r => r.purchasedKit || r.bookingType === 'kit' || r.passSerial?.includes('KIT')).reduce((sum, r) => sum + (r.kitCount || r.seatsCount || 1), 0)}
                  </div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">KIT Convention KZI 2026</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">
                    Pass VIP, Sièges Numérotés & Kits Achetés
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-glass flex items-center justify-between text-[10px] font-extrabold text-amber-400">
                  <span>{kziFilter === 'kit' ? '✓ Filtre Actif' : 'Cliquer pour filtrer'}</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 2: Transport Bus */}
              <div 
                onClick={() => setKziFilter(kziFilter === 'bus' ? 'all' : 'bus')}
                className={`glass-card p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex flex-col justify-between ${
                  kziFilter === 'bus' 
                    ? 'bg-emerald-500/20 border-emerald-400 scale-[1.02]' 
                    : 'bg-[var(--bg-secondary)] border-emerald-500/30 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <Bus className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase">
                    Transport Bus
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black font-outfit text-[var(--text-primary)]">
                    {(kziRegistrantsList || []).filter(r => r.transport?.toLowerCase().includes('bus') || r.bookingType === 'bus').reduce((sum, r) => sum + (r.seatsCount || 1), 0)} <span className="text-sm font-bold text-emerald-400">places</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">Réservations Bus (MGJ / Mulykap)</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1 truncate">
                    MGJ: {(kziRegistrantsList || []).filter(r => r.transport?.toLowerCase().includes('mgj') || r.transport?.toLowerCase().includes('officiel')).reduce((sum, r) => sum + (r.seatsCount || 1), 0)} pl • Mulykap: {(kziRegistrantsList || []).filter(r => r.transport?.toLowerCase().includes('mulykap')).reduce((sum, r) => sum + (r.seatsCount || 1), 0)} pl
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-glass flex items-center justify-between text-[10px] font-extrabold text-emerald-400">
                  <span>{kziFilter === 'bus' ? '✓ Filtre Actif' : 'Cliquer pour filtrer'}</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 3: Transport Avion / Vol */}
              <div 
                onClick={() => setKziFilter(kziFilter === 'flight' ? 'all' : 'flight')}
                className={`glass-card p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex flex-col justify-between ${
                  kziFilter === 'flight' 
                    ? 'bg-blue-500/20 border-blue-400 scale-[1.02]' 
                    : 'bg-[var(--bg-secondary)] border-blue-500/30 hover:border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                    <Plane className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase">
                    Vol Aérien
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black font-outfit text-[var(--text-primary)]">
                    {(kziRegistrantsList || []).filter(r => r.transport?.toLowerCase().includes('vol') || r.transport?.toLowerCase().includes('avion') || r.transport?.toLowerCase().includes('air') || r.bookingType === 'flight').reduce((sum, r) => sum + (r.seatsCount || 1), 0)} <span className="text-sm font-bold text-blue-400">billets</span>
                  </div>
                  <div className="text-xs font-bold text-blue-400 mt-0.5">Billets d'Avion & Navette</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">
                    Vol direct + Navette VIP vers Kolwezi
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-glass flex items-center justify-between text-[10px] font-extrabold text-blue-400">
                  <span>{kziFilter === 'flight' ? '✓ Filtre Actif' : 'Cliquer pour filtrer'}</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 4: Total & Logement */}
              <div 
                onClick={() => setKziFilter('all')}
                className={`glass-card p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex flex-col justify-between ${
                  kziFilter === 'all' 
                    ? 'bg-purple-500/20 border-purple-400 scale-[1.02]' 
                    : 'bg-[var(--bg-secondary)] border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-[10px] uppercase">
                    Délégations
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black font-outfit text-[var(--text-primary)]">
                    {(kziRegistrantsList || []).length}
                  </div>
                  <div className="text-xs font-bold text-purple-400 mt-0.5">Total Inscrits & Logement</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1 truncate">
                    Internat Umoja & Signalements d'Arrivée
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-glass flex items-center justify-between text-[10px] font-extrabold text-purple-400">
                  <span>{kziFilter === 'all' ? '✓ Affichage Global' : 'Afficher Tout'}</span>
                  <span>→</span>
                </div>
              </div>

            </div>

            {/* Filter and Table Container */}
            <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border-2 border-[var(--accent-gold)] space-y-4 shadow-xl">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-glass">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)] text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    Contrôle Détaillé KZI 2026
                  </span>
                  <h3 className="text-lg font-black font-outfit text-[var(--text-primary)] mt-1 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-400" />
                    <span>
                      {kziFilter === 'kit' && 'Acheteurs KIT Convention KZI 2026'}
                      {kziFilter === 'bus' && 'Délégations & Réservations Transport Bus'}
                      {kziFilter === 'flight' && 'Réservations Vol Aérien & Navette'}
                      {kziFilter === 'all' && 'Tableau de Toutes les Inscriptions & Signalements KZI 2026'}
                    </span>
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher nom, ville, whatsapp, pass n°..."
                      value={kziSearchQuery}
                      onChange={e => setKziSearchQuery(e.target.value)}
                      className="input-field pl-9 pr-4 py-2 text-xs rounded-xl w-full sm:w-64 bg-[var(--bg-primary)]"
                    />
                    {kziSearchQuery && (
                      <button onClick={() => setKziSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-bold">×</button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 bg-[var(--bg-primary)] p-1 rounded-xl border border-glass overflow-x-auto">
                    <button
                      onClick={() => setKziFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${kziFilter === 'all' ? 'bg-[var(--accent-gold)] text-slate-950 shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
                    >
                      Tous ({kziRegistrantsList?.length || 0})
                    </button>
                    <button
                      onClick={() => setKziFilter('kit')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${kziFilter === 'kit' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>KIT ({kziRegistrantsList?.filter(r => r.purchasedKit || r.bookingType === 'kit' || r.passSerial?.includes('KIT')).length || 0})</span>
                    </button>
                    <button
                      onClick={() => setKziFilter('bus')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${kziFilter === 'bus' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
                    >
                      <Bus className="w-3.5 h-3.5" />
                      <span>Bus ({kziRegistrantsList?.filter(r => r.transport?.toLowerCase().includes('bus') || r.bookingType === 'bus').length || 0})</span>
                    </button>
                    <button
                      onClick={() => setKziFilter('flight')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${kziFilter === 'flight' ? 'bg-blue-500 text-slate-950 shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Avion ({kziRegistrantsList?.filter(r => r.transport?.toLowerCase().includes('vol') || r.transport?.toLowerCase().includes('avion') || r.transport?.toLowerCase().includes('air') || r.bookingType === 'flight').length || 0})</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-glass">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-primary)] border-b border-glass text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider">
                      <th className="py-3 px-4">Pèlerin & Contact</th>
                      <th className="py-3 px-4">Ville & Arrivée</th>
                      <th className="py-3 px-4">📦 Achat KIT & Pass VIP</th>
                      <th className="py-3 px-4">🚌 / ✈️ Transport & Logement</th>
                      <th className="py-3 px-4 text-right">Statut & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass/40 text-xs font-medium">
                    {(kziRegistrantsList || [])
                      .filter(r => {
                        if (kziFilter === 'kit') return r.purchasedKit || r.bookingType === 'kit' || r.passSerial?.includes('KIT');
                        if (kziFilter === 'bus') return r.transport?.toLowerCase().includes('bus') || r.bookingType === 'bus';
                        if (kziFilter === 'flight') return r.transport?.toLowerCase().includes('vol') || r.transport?.toLowerCase().includes('avion') || r.transport?.toLowerCase().includes('air') || r.bookingType === 'flight';
                        return true;
                      })
                      .filter(r => {
                        if (!kziSearchQuery.trim()) return true;
                        const q = kziSearchQuery.toLowerCase();
                        return (
                          r.fullName.toLowerCase().includes(q) ||
                          r.city.toLowerCase().includes(q) ||
                          r.whatsapp.toLowerCase().includes(q) ||
                          (r.passSerial && r.passSerial.toLowerCase().includes(q)) ||
                          (r.kitType && r.kitType.toLowerCase().includes(q)) ||
                          (r.transport && r.transport.toLowerCase().includes(q))
                        );
                      })
                      .map((r) => (
                      <tr key={r.id} className="hover:bg-[var(--bg-tertiary)]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <span>{r.fullName}</span>
                            {r.bookingType === 'kit' && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black">KIT</span>}
                            {r.bookingType === 'bus' && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black">BUS</span>}
                            {r.bookingType === 'flight' && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-black">AVION</span>}
                          </div>
                          <a href={`https://wa.me/${r.whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-400 font-mono hover:underline inline-flex items-center gap-1 mt-0.5">
                            <span>📱 {r.whatsapp}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                          <div><strong className="text-[var(--text-primary)]">{r.city}</strong></div>
                          <div className="text-[11px] text-[var(--accent-gold)] font-medium">Arrivée : {r.arrivalDate}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {r.purchasedKit || r.bookingType === 'kit' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-[10px]">
                                <Package className="w-3 h-3" />
                                <span>Acheté • {r.kitCount || r.seatsCount || 1} KIT(s)</span>
                              </span>
                              <div className="text-[11px] font-bold text-[var(--text-primary)]">{r.kitType || 'KIT Officiel KZI 2026'}</div>
                              <div className="font-mono text-[10px] font-extrabold text-amber-400">{r.passSerial}</div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-medium">
                                Pass VIP Standard
                              </span>
                              <div className="font-mono text-[11px] font-extrabold text-amber-400/80">{r.passSerial}</div>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[var(--text-secondary)] max-w-xs">
                          <div className="flex items-center gap-1 font-bold text-[var(--text-primary)]">
                            {r.transport?.toLowerCase().includes('bus') ? <Bus className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : r.transport?.toLowerCase().includes('vol') || r.transport?.toLowerCase().includes('avion') ? <Plane className="w-3.5 h-3.5 text-blue-400 shrink-0" /> : null}
                            <span className="truncate">{r.transport}</span>
                          </div>
                          <div className="text-[10px] text-amber-300 font-bold mt-0.5">
                            Sièges/Places : {r.seatsCount || 1} place(s) {r.amountPaid && `• ${r.amountPaid}`}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">🏨 {r.lodgingOption}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <button
                              onClick={() => updateKziRegistrantStatus && updateKziRegistrantStatus(r.id, r.status === 'Confirmé - Logistique Planifiée' ? 'En attente de validation' : 'Confirmé - Logistique Planifiée')}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-colors flex items-center gap-1 ${
                                r.status === 'Confirmé - Logistique Planifiée'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-black'
                              }`}
                            >
                              <span>{r.status === 'Confirmé - Logistique Planifiée' ? 'Confirmé ✓' : 'En attente ⏳'}</span>
                            </button>
                            <button
                              onClick={() => deleteKziRegistrant && deleteKziRegistrant(r.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                              title="Supprimer cette inscription"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Middle Panel: Convention Welcome Info & Vision Editor */}
          <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
            <h3 className="text-base font-extrabold font-outfit text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Modifier le Thème et les Informations d'Accueil de la Convention Kzi</span>
            </h3>

            <form onSubmit={handleSaveKziWelcomeInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Thème Principal (français)</label>
                <input
                  type="text"
                  value={editThemeFr}
                  onChange={(e) => setEditThemeFr(e.target.value)}
                  placeholder="Ex: L'Effusion de l'Esprit - Joël 2:28"
                  className="input-field py-2.5 text-xs rounded-xl w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Dates et Période</label>
                <input
                  type="text"
                  value={editDatesFr}
                  onChange={(e) => setEditDatesFr(e.target.value)}
                  placeholder="Ex: Du 02 au 09 Août 2026"
                  className="input-field py-2.5 text-xs rounded-xl w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Lieu & Sanctuaire</label>
                <input
                  type="text"
                  value={editLocationFr}
                  onChange={(e) => setEditLocationFr(e.target.value)}
                  placeholder="Ex: Kolwezi • Manika Sport (Sanctuaire Central)"
                  className="input-field py-2.5 text-xs rounded-xl w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Texte de Vision & Accueil</label>
                <textarea
                  rows={2}
                  value={editVisionFr}
                  onChange={(e) => setEditVisionFr(e.target.value)}
                  placeholder="La 31ème Grande Convention Internationale..."
                  className="input-field py-2 text-xs rounded-xl w-full resize-none"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="btn-gold py-2.5 px-6 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg">
                  <Check className="w-4 h-4" />
                  <span>Enregistrer les Paramètres d'Accueil Kzi</span>
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Add Speaker Form + List */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
                <h3 className="text-base font-extrabold font-outfit text-[var(--text-primary)] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span>Ajouter un Orateur (Convention Kzi)</span>
                </h3>

                <form onSubmit={handleAddSpeakerSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={spkName}
                    onChange={(e) => setSpkName(e.target.value)}
                    placeholder="Nom de l'Orateur (ex: Pasteur Jean-Marc Joël)"
                    className="input-field py-2 text-xs rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    value={spkRoleFr}
                    onChange={(e) => setSpkRoleFr(e.target.value)}
                    placeholder="Rôle / Titre (ex: Pasteur Principal & Visionnaire)"
                    className="input-field py-2 text-xs rounded-xl"
                  />
                  <textarea
                    rows={2}
                    value={spkBioFr}
                    onChange={(e) => setSpkBioFr(e.target.value)}
                    placeholder="Biographie & Onction..."
                    className="input-field py-2 text-xs rounded-xl resize-none"
                  />
                  <div className="flex items-center gap-3 bg-[var(--bg-primary)] p-2.5 rounded-xl border border-glass">
                    {spkImage ? (
                      <img src={spkImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-amber-500/50 shrink-0 shadow-md" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)] shrink-0">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <label className="cursor-pointer bg-white/10 hover:bg-amber-500 hover:text-black text-white border border-white/20 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm w-full">
                        <Upload className="w-3.5 h-3.5 text-amber-400 group-hover:text-black" />
                        <span className="truncate">{spkImage ? 'Changer la Photo de l\'Orateur' : 'Charger une Photo (Upload)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSpeakerImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn-gold py-2.5 px-5 rounded-xl text-xs font-bold w-full flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Enregistrer l'Orateur</span>
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                  Orateurs Actuels ({speakers.length})
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {speakers.map(s => (
                    <div key={s.id} className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={s.imageUrl} alt={s.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <h5 className="text-xs font-bold text-[var(--text-primary)]">{s.name}</h5>
                          <span className="text-[10px] text-[var(--accent-gold)]">{s.roleFr}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => handleDirectFirebaseSave('convention_speakers', s, `✅ Orateur "${s.name}" synchronisé sur Firebase !`)} 
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all" 
                          title="Enregistrer / Synchroniser sur Firebase"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setEditingItem({ type: 'speaker', data: { ...s } })} 
                          className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black rounded-lg transition-all" 
                          title="Modifier les informations"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { deleteSpeaker(s.id); showFirebaseToast(`🗑️ Orateur "${s.name}" supprimé de Firebase !`); }} 
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" 
                          title="Supprimer de Firebase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Schedule Item Form + List */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
                <h3 className="text-base font-extrabold font-outfit text-[var(--text-primary)] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--accent-olive)]" />
                  <span>Ajouter une Session (Programme Kzi)</span>
                </h3>

                <form onSubmit={handleAddScheduleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Jour (1 à 8)</label>
                      <select value={schedDay} onChange={e => setSchedDay(Number(e.target.value))} className="input-field py-2 text-xs rounded-xl">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(d => (
                          <option key={d} value={d}>Jour {d} ({d + 1} Août)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Horaires</label>
                      <input type="text" value={schedTime} onChange={e => setSchedTime(e.target.value)} placeholder="14h00 - 16h30" className="input-field py-2 text-xs rounded-xl" required />
                    </div>
                  </div>
                  <input type="text" value={schedTitleFr} onChange={e => setSchedTitleFr(e.target.value)} placeholder="Titre de la session (ex: Plénière & Ateliers PROPHETIQUES)" className="input-field py-2 text-xs rounded-xl" required />
                  <textarea rows={2} value={schedDescFr} onChange={e => setSchedDescFr(e.target.value)} placeholder="Description & Enseignement..." className="input-field py-2 text-xs rounded-xl resize-none" />
                  <input type="text" value={schedSpeaker} onChange={e => setSchedSpeaker(e.target.value)} placeholder="Orateur en charge" className="input-field py-2 text-xs rounded-xl" />
                  <button type="submit" className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold w-full flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Enregistrer la Session</span>
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                  Programme Actuel ({schedule.length} sessions)
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {schedule.map(sc => (
                    <div key={sc.id} className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex items-center justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] font-black text-[10px]">Jour {sc.day} • {sc.time}</span>
                        <h5 className="text-xs font-bold text-[var(--text-primary)] mt-1">{sc.titleFr}</h5>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          type="button" 
                          onClick={() => handleDirectFirebaseSave('convention_schedule', sc, `✅ Session "${sc.titleFr}" synchronisée sur Firebase !`)} 
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all" 
                          title="Enregistrer / Synchroniser sur Firebase"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setEditingItem({ type: 'schedule', data: { ...sc } })} 
                          className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black rounded-lg transition-all" 
                          title="Modifier la session"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { deleteScheduleItem(sc.id); showFirebaseToast(`🗑️ Session "${sc.titleFr}" supprimée de Firebase !`); }} 
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" 
                          title="Supprimer de Firebase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS & LIVE BROADCAST TRIGGER SUITE */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-2 border-[var(--accent-gold)] bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-lg font-black font-outfit text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-gold)] animate-ping" />
                <span>Nouveau : Page Publique des Annonces & Médias (/announcements)</span>
              </h4>
              <p className="text-xs text-slate-300">
                Gérez vos annonces avec support d'images high-res, vidéos intégrées et fichiers d'instructions prophétiques sur le nouveau tableau de bord dédié.
              </p>
            </div>
            <a
              href="/announcements"
              className="btn-gold px-6 py-3.5 rounded-2xl font-black text-xs shrink-0 flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              <span>Accéder à la Page Annonces</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
              <h3 className="text-lg font-extrabold font-outfit text-[var(--text-primary)] flex items-center gap-2.5">
                <Radio className="w-6 h-6 text-red-500 animate-pulse" />
                <span>Publier une Alerte Direct ou Annonce Rapide</span>
              </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Cette notification apparaîtra instantanément avec un badge et un compteur sur les écrans de tous les utilisateurs de l'application mobile et PWA.
            </p>

            <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Catégorie de l'Alerte</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnnType('urgent')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${annType === 'urgent' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    🔴 Direct Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnType('event')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${annType === 'event' ? 'bg-[var(--accent-gold)] text-white border-amber-500 shadow-md' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    ⭐ Convention Kzi
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnType('general')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${annType === 'general' ? 'bg-[var(--accent-olive)] text-white border-[var(--accent-olive)] shadow-md' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass'}`}
                  >
                    📢 Annonce
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Identité de l'Émetteur (Signataire)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnnSender('Admin MGJ')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all truncate ${annSender === 'Admin MGJ' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass hover:text-white'}`}
                  >
                    🏛️ Admin MGJ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnSender('MediaMGJMonde')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all truncate ${annSender === 'MediaMGJMonde' ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass hover:text-white'}`}
                  >
                    📡 MediaMGJMonde
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnSender('Visionnaire MGJ')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all truncate ${annSender === 'Visionnaire MGJ' ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-glass hover:text-white'}`}
                  >
                    👑 Visionnaire MGJ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Titre de l'Alerte</label>
                <input
                  type="text"
                  value={annTitleFr}
                  onChange={(e) => setAnnTitleFr(e.target.value)}
                  placeholder="Ex: DIFFUSION EN DIRECT : Veillée de Feu et Prière Joël 2:28 !"
                  className="input-field py-2.5 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Message Détaillé</label>
                <textarea
                  rows={4}
                  value={annBodyFr}
                  onChange={(e) => setAnnBodyFr(e.target.value)}
                  placeholder="Ex: Connectez-vous dès maintenant sur YouTube et Facebook avec le Pasteur Élie Mbumba..."
                  className="input-field py-2.5 text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-1">Média Associé (Optionnel : Image, Vidéo ou Audio)</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[var(--bg-primary)] p-3 rounded-2xl border border-glass">
                  {annMediaUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--accent-gold)] shrink-0 bg-black flex items-center justify-center">
                      {annMediaType === 'image' ? (
                        <img src={annMediaUrl} alt="Media" className="w-full h-full object-cover" />
                      ) : annMediaType === 'video' ? (
                        <video src={annMediaUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] font-bold text-amber-400 text-center px-1">🎵 Audio</div>
                      )}
                      <button
                        type="button"
                        onClick={() => { setAnnMediaUrl(''); setAnnMediaType('none'); }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:scale-110"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)] shrink-0">
                      <Upload className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer bg-white/10 hover:bg-amber-500 hover:text-black text-white border border-white/20 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm w-full">
                      <Upload className="w-4 h-4 text-amber-400 group-hover:text-black shrink-0" />
                      <span className="truncate">{annMediaUrl ? `Changer le Média (${annMediaType.toUpperCase()})` : 'Charger Image, Vidéo ou Audio (Upload)'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={handleAnnMediaUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 rounded-2xl text-sm font-black font-outfit shadow-xl flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Diffuser l'Annonce à Tous (<strong className="underline">Push Immédiat</strong>)</span>
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold font-outfit text-[var(--text-primary)]">
              Annonces en Ligne ({announcements.length})
            </h3>
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {announcements.map(a => (
                <div key={a.id} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${a.category === 'prophetic' || a.category === 'urgent' ? 'bg-red-500 text-white' : a.category === 'event' ? 'bg-amber-500 text-black' : 'bg-[var(--accent-olive-glow)] text-[var(--accent-olive)]'}`}>
                        {a.category === 'prophetic' ? 'urgent' : a.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">{a.titleFr}</h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{a.contentFr}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] pt-1">
                      <span>Signataire: <strong className="text-[var(--text-primary)]">{a.authorName || 'Admin MGJ'}</strong></span>
                      <span>•</span>
                      <span>{new Date(a.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      type="button" 
                      onClick={() => handleDirectFirebaseSave('mgj_announcements', a, `✅ Annonce "${a.titleFr}" synchronisée sur Firebase !`)} 
                      className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all" 
                      title="Enregistrer / Synchroniser sur Firebase"
                    >
                      <CloudUpload className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingItem({ type: 'announcement', data: { ...a } })} 
                      className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black rounded-xl transition-all" 
                      title="Modifier l'annonce"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { deleteAnnouncement(a.id); showFirebaseToast(`🗑️ Annonce "${a.titleFr}" supprimée de Firebase !`); }} 
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all" 
                      title="Supprimer de Firebase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* TAB 4: SHOP PRODUCT & ORDER CONTROL SUITE */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
            <h3 className="text-base font-extrabold font-outfit text-[var(--text-primary)] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>Ajouter un Article à la Boutique MGJ</span>
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <input type="text" value={prodTitleFr} onChange={e => setProdTitleFr(e.target.value)} placeholder="Titre (ex: Livre : L'Effusion Prophétique Joël 2:28)" className="input-field py-2 text-xs rounded-xl" required />
              <textarea rows={2} value={prodDescFr} onChange={e => setProdDescFr(e.target.value)} placeholder="Description de l'article..." className="input-field py-2 text-xs rounded-xl resize-none" />
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Prix € (EUR)</label>
                  <input type="number" step="0.01" value={prodPriceEur} onChange={e => setProdPriceEur(Number(e.target.value))} className="input-field py-2 text-xs rounded-xl" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Prix $ (USD)</label>
                  <input type="number" step="0.01" value={prodPriceUsd} onChange={e => setProdPriceUsd(Number(e.target.value))} className="input-field py-2 text-xs rounded-xl" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Prix FC (Francs)</label>
                  <input type="number" step="500" value={prodPriceFc} onChange={e => setProdPriceFc(Number(e.target.value))} className="input-field py-2 text-xs rounded-xl" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Catégorie</label>
                  <select value={prodCat} onChange={e => setProdCat(e.target.value as any)} className="input-field py-2 text-xs rounded-xl">
                    <option value="books">Livres & E-Books</option>
                    <option value="apparel">Vêtements MGJ</option>
                    <option value="media">Médias & Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1">Photo Article</label>
                  <div className="flex items-center gap-2 bg-[var(--bg-primary)] p-1.5 rounded-xl border border-glass">
                    {prodImage ? (
                      <img src={prodImage} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-amber-500/50 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)] shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <label className="cursor-pointer bg-white/10 hover:bg-amber-500 hover:text-black text-white border border-white/20 py-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm w-full">
                        <Upload className="w-3 h-3 text-amber-400 group-hover:text-black shrink-0" />
                        <span className="truncate">{prodImage ? 'Changer Photo' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleShopImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-gold py-2.5 px-5 rounded-xl text-xs font-bold w-full flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Publier dans la Boutique</span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                Articles en Stock ({shopItems.length})
              </h4>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {shopItems.map(item => (
                  <div key={item.id} className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.titleFr} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-[var(--text-primary)]">{item.titleFr}</h5>
                        <span className="text-[10px] text-[var(--accent-gold)] font-black">{item.priceEur} € / {item.priceUsd} $ / {item.priceFc.toLocaleString('fr-FR')} FC</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        type="button" 
                        onClick={() => handleDirectFirebaseSave('shop_items', item, `✅ Article "${item.titleFr}" synchronisé sur Firebase !`)} 
                        className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all" 
                        title="Enregistrer / Synchroniser sur Firebase"
                      >
                        <CloudUpload className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingItem({ type: 'shop', data: { ...item } })} 
                        className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black rounded-lg transition-all" 
                        title="Modifier l'article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { deleteShopItem(item.id); showFirebaseToast(`🗑️ Article "${item.titleFr}" supprimé de Firebase !`); }} 
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" 
                        title="Supprimer de Firebase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-glass">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                Commandes Clients en Cours ({orders.length})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {orders.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-glass text-center text-xs text-[var(--text-secondary)]">
                    Aucune commande client pour l'instant.
                  </div>
                ) : (
                  orders.map(o => (
                    <div key={o.id} className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-glass flex items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-[var(--text-primary)]">Commande N° {o.id}</h5>
                        <span className="text-[10px] text-[var(--text-muted)]">{o.userEmail} • {o.status}</span>
                      </div>
                      <span className="text-sm font-black font-outfit text-[var(--accent-gold)]">{o.totalEur} €</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: FINANCIAL LEDGER (OFFERINGS & TITHES) */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[var(--bg-secondary)] to-[var(--bg-card)] border border-emerald-500/40">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Total Euro (EUR)</span>
              <div className="text-3xl font-black font-outfit text-white mt-1">
                {donations.filter(d => d.currency === 'EUR').reduce((a, b) => a + b.amount, 0).toFixed(2)} €
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Dîmes & Offrandes en ligne</span>
            </div>

            <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-[var(--bg-secondary)] to-[var(--bg-card)] border border-amber-500/40">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Total Dollar (USD)</span>
              <div className="text-3xl font-black font-outfit text-white mt-1">
                {donations.filter(d => d.currency === 'USD').reduce((a, b) => a + b.amount, 0).toFixed(2)} $
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Soutien International MGJ</span>
            </div>

            <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-[var(--bg-secondary)] to-[var(--bg-card)] border border-blue-500/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">Total Franc Congolais</span>
                <div className="text-2xl font-black font-outfit text-white mt-1">
                  {donations.filter(d => d.currency === 'FC').reduce((a, b) => a + b.amount, 0).toLocaleString('fr-FR')} FC
                </div>
              </div>
              <button
                onClick={handleDownloadFinancialReport}
                className="mt-3 btn-gold py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md w-full"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger Rapport TXT</span>
              </button>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-3xl border-glass">
            <div className="p-4 border-b border-glass flex items-center justify-between bg-[var(--bg-tertiary)]/50">
              <h3 className="font-outfit font-extrabold text-sm text-[var(--text-primary)]">
                Journal des Offrandes, Dîmes & Dons Convention ({donations.length})
              </h3>
              <span className="text-xs font-bold text-[var(--text-secondary)]">Mise à jour en temps réel</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-tertiary)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] border-b border-glass">
                    <th className="py-3.5 px-4">Donateur</th>
                    <th className="py-3.5 px-4">Type d'Offrande</th>
                    <th className="py-3.5 px-4">Montant</th>
                    <th className="py-3.5 px-4">Mode de Paiement</th>
                    <th className="py-3.5 px-4 text-right">Reçu N°</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass/40 text-xs font-medium">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Aucune offrande répertoriée. Effectuez un test depuis l'onglet Offrandes !
                      </td>
                    </tr>
                  ) : (
                    donations.map(don => (
                      <tr key={don.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">{don.userName}</td>
                        <td className="py-3.5 px-4 uppercase text-[var(--accent-olive)] font-extrabold">{don.type}</td>
                        <td className="py-3.5 px-4 font-black text-amber-400 text-sm">+{don.amount} {don.currency}</td>
                        <td className="py-3.5 px-4 text-[var(--text-secondary)]">{don.paymentMethod}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[var(--text-muted)]">{don.receiptNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Universal Edit & Save Modal (Direct Firebase Synchronizer) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#111827] border-2 border-[var(--accent-gold)] rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent-gold)] text-black flex items-center justify-center font-black shadow-lg">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                    Mise à Jour Directe Firebase
                  </span>
                  <h3 className="text-lg font-black font-outfit text-white">
                    Modifier {editingItem.type === 'speaker' ? "l'Orateur" : editingItem.type === 'schedule' ? "la Session" : editingItem.type === 'announcement' ? "l'Annonce" : "l'Article"}
                  </h3>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingItem(null)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SPEAKER EDIT FORM */}
            {editingItem.type === 'speaker' && (
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nom complet</label>
                  <input 
                    type="text" 
                    value={editingItem.data.name || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Rôle / Titre (FR)</label>
                  <input 
                    type="text" 
                    value={editingItem.data.roleFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, roleFr: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Biographie courte (FR)</label>
                  <textarea 
                    rows={3} 
                    value={editingItem.data.bioFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, bioFr: e.target.value } })} 
                    className="input-field py-2 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Photo URL ou Upload</label>
                  <div className="flex items-center gap-3">
                    {editingItem.data.imageUrl && (
                      <img src={editingItem.data.imageUrl} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-amber-400" />
                    )}
                    <input 
                      type="text" 
                      value={editingItem.data.imageUrl || ''} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: e.target.value } })} 
                      placeholder="https://..." 
                      className="input-field py-2.5 px-3 text-xs rounded-xl flex-1 bg-black/40 border-white/20 text-white font-mono" 
                    />
                    <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-black px-3 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: ev.target?.result as string } });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SCHEDULE EDIT FORM */}
            {editingItem.type === 'schedule' && (
              <div className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Jour (1 à 8)</label>
                    <select 
                      value={editingItem.data.day || 1} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, day: Number(e.target.value) } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(d => <option key={d} value={d}>Jour {d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Horaires</label>
                    <input 
                      type="text" 
                      value={editingItem.data.time || ''} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, time: e.target.value } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Titre de la session (FR)</label>
                  <input 
                    type="text" 
                    value={editingItem.data.titleFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, titleFr: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Orateur en charge</label>
                  <input 
                    type="text" 
                    value={editingItem.data.speaker || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, speaker: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Lieu / Salle</label>
                  <input 
                    type="text" 
                    value={editingItem.data.location || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, location: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                  />
                </div>
              </div>
            )}

            {/* ANNOUNCEMENT EDIT FORM */}
            {editingItem.type === 'announcement' && (
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Titre de l'annonce (FR)</label>
                  <input 
                    type="text" 
                    value={editingItem.data.titleFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, titleFr: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white font-bold" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Catégorie</label>
                    <select 
                      value={editingItem.data.category || 'general'} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white font-bold uppercase"
                    >
                      <option value="urgent">URGENT</option>
                      <option value="prophetic">PROPHÉTIQUE</option>
                      <option value="event">ÉVÉNEMENT</option>
                      <option value="general">GÉNÉRAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Signataire / Auteur</label>
                    <input 
                      type="text" 
                      value={editingItem.data.authorName || 'Admin MGJ'} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, authorName: e.target.value } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contenu / Message (FR)</label>
                  <textarea 
                    rows={4} 
                    value={editingItem.data.contentFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, contentFr: e.target.value } })} 
                    className="input-field py-2 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white resize-none" 
                  />
                </div>
              </div>
            )}

            {/* SHOP ITEM EDIT FORM */}
            {editingItem.type === 'shop' && (
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Titre de l'article (FR)</label>
                  <input 
                    type="text" 
                    value={editingItem.data.titleFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, titleFr: e.target.value } })} 
                    className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white font-bold" 
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Prix € (EUR)</label>
                    <input 
                      type="number" step="0.01" 
                      value={editingItem.data.priceEur || 0} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, priceEur: Number(e.target.value) } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Prix $ (USD)</label>
                    <input 
                      type="number" step="0.01" 
                      value={editingItem.data.priceUsd || 0} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, priceUsd: Number(e.target.value) } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Prix FC</label>
                    <input 
                      type="number" 
                      value={editingItem.data.priceFc || 0} 
                      onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, priceFc: Number(e.target.value) } })} 
                      className="input-field py-2.5 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Description (FR)</label>
                  <textarea 
                    rows={2} 
                    value={editingItem.data.descriptionFr || ''} 
                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, descriptionFr: e.target.value } })} 
                    className="input-field py-2 px-3 text-sm rounded-xl w-full bg-black/40 border-white/20 text-white resize-none" 
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setEditingItem(null)} 
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-300 hover:bg-white/10 transition-all"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const collectionMap: any = {
                    speaker: 'convention_speakers',
                    schedule: 'convention_schedule',
                    announcement: 'mgj_announcements',
                    shop: 'shop_items'
                  };
                  const colName = collectionMap[editingItem.type || 'speaker'];
                  if (editingItem.type === 'speaker') updateSpeaker(editingItem.data);
                  else if (editingItem.type === 'schedule') updateScheduleItem(editingItem.data);
                  else if (editingItem.type === 'announcement') updateAnnouncement(editingItem.data);
                  else if (editingItem.type === 'shop') updateShopItem(editingItem.data);
                  
                  handleDirectFirebaseSave(colName, editingItem.data, `✅ "${editingItem.data.titleFr || editingItem.data.name}" enregistré et synchronisé sur Firebase !`);
                  setEditingItem(null);
                }} 
                className="btn-gold px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer sur Firebase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Suite Copyright Foot */}
      <footer className="mt-12 py-6 text-center border-t border-glass text-xs font-bold text-[var(--text-secondary)]">
        <span>(c) Swazi Appli Lab sarl 2026 • Tous droits réservés / All rights reserved</span>
      </footer>

    </div>
    </div>
  );
};
