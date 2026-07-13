import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Tv, 
  Calendar, 
  Zap, 
  Crown, 
  Bookmark,
  Heart
} from 'lucide-react';

interface AboutMgjPageProps {
  setActivePage: (page: string) => void;
}

export const AboutMgjPage: React.FC<AboutMgjPageProps> = ({ setActivePage }) => {
  const { lang } = useLanguage();
  const [activePillar, setActivePillar] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const pillars = {
    A: {
      id: 'A',
      code: 'I.A',
      titleFr: 'CONFONDRE LES HAUTEURS',
      titleEn: 'CONFOUND THE MIGHTY & LOFTY',
      subtitleFr: 'Troubler le raisonnement humain par la gloire de Dieu',
      subtitleEn: 'Disrupting human reasoning through divine glory',
      icon: Crown,
      color: 'from-amber-500 via-yellow-600 to-amber-700 text-amber-300',
      border: 'border-amber-500/40 bg-amber-500/10',
      verseFr: '1 Corinthiens 1:26-29 • 2 Corinthiens 4:7 • Actes 4:13',
      verseEn: '1 Corinthians 1:26-29 • 2 Corinthians 4:7 • Acts 4:13',
      descFr: [
        'Dieu choisit et appelle des gens faibles (dans divers domaines), sans valeur aux yeux du monde, tout comme Pierre et Jean sans instruction spéciale.',
        'Dieu dépose dans ces vases de terre un trésor inestimable : Sa gloire et Son onction prophétique.',
        'Par leurs réalisations surnaturelles, l\'étonnement et l\'étourdissement des grands de ce monde deviennent énormes, réduisant au silence la fierté humaine afin que toute gloire revienne uniquement à DIEU.'
      ],
      descEn: [
        'God chooses and calls weak individuals of no worldly esteem, just like Peter and John without formal qualification.',
        'Into these earthen vessels, God pours a priceless treasure: His transcendent glory and prophetic anointing.',
        'Through supernatural achievements, the mighty of this world are astounded, silencing human boasting so all glory belongs exclusively to GOD.'
      ]
    },
    B: {
      id: 'B',
      code: 'I.B',
      titleFr: 'FORMER DES SERVITEURS',
      titleEn: 'EQUIP & TRAIN SERVANTS',
      subtitleFr: 'Modeler le chrétien selon le modèle du Royaume',
      subtitleEn: 'Molding believers according to Kingdom patterns',
      icon: Users,
      color: 'from-emerald-500 via-teal-600 to-emerald-700 text-emerald-300',
      border: 'border-emerald-500/40 bg-emerald-500/10',
      verseFr: 'Matthieu 28:18-19 • Ephésiens 4:3-16 • Colossiens 1:28',
      verseEn: 'Matthew 28:18-19 • Ephesians 4:3-16 • Colossians 1:28',
      descFr: [
        'Aider le chrétien à être modelé selon le moule de DIEU : Gagner les âmes à Christ et les délivrer de la servitude de Satan par la puissance du Saint-Esprit.',
        'Enseigner l\'identité spirituelle du croyant en Christ et sa place dans le Corps (appels, ministères, dons).',
        'Approfondir la relation et la communion avec le Seigneur Jésus par une prière intense, la consécration, et la communion fraternelle (Agapè) pour constituer un Royaume de Sacrificateurs (Apocalypse 5:9-10).'
      ],
      descEn: [
        'Guiding believers into God\'s mold: Winning souls for Christ and delivering the oppressed by the power of the Holy Spirit.',
        'Teaching spiritual identity in Christ and every believer\'s rightful place inside the Body (callings, ministries, spiritual gifts).',
        'Deepening communion with the Lord Jesus via fervent prayer, consecration, and brotherly fellowship (Agape) to build a Kingdom of Priests (Revelation 5:9-10).'
      ]
    },
    C: {
      id: 'C',
      code: 'I.C',
      titleFr: 'REFORMER SERVITEURS & NATIONS',
      titleEn: 'REFORM SERVANTS & NATIONS',
      subtitleFr: 'Changer la mentalité et renouveler l\'intelligence',
      subtitleEn: 'Transforming mindsets and renewing the understanding',
      icon: Zap,
      color: 'from-purple-500 via-indigo-600 to-purple-700 text-purple-300',
      border: 'border-purple-500/40 bg-purple-500/10',
      verseFr: 'Romains 12:2 • 2 Corinthiens 10:5-6 • Proverbes 23:7',
      verseEn: 'Romans 12:2 • 2 Corinthians 10:5-6 • Proverbs 23:7',
      descFr: [
        'Détruire et renverser tout faux raisonnement, toute mauvaise pensée de religion, de culture et de tradition humaine qui s\'opposent à la vraie connaissance du Christ.',
        'Rendre toute pensée captive à l\'obéissance et à l\'acceptation de Christ en désamorçant les freins spirituels qui empêchent les nations de croire.',
        'Renouveler l\'intelligence du chrétien et du serviteur obscurcie par le modèle du monde actuel afin de discerner parfaitement la volonté de Dieu (Romains 12:2). Tel l\'homme pense, tel il est (Proverbes 23:7).'
      ],
      descEn: [
        'Demolishing every false argument, religious dogma, and cultural tradition raised against the true knowledge of Christ.',
        'Taking every thought captive to the obedience of Christ by dismantling barriers that prevent nations from salvation.',
        'Renewing the understanding clouded by worldly systems to discern the perfect will of God (Romans 12:2). As a man thinketh in his heart, so is he (Proverbs 23:7).'
      ]
    },
    D: {
      id: 'D',
      code: 'I.D',
      titleFr: 'RESTAURER L\'ÉGLISE',
      titleEn: 'RESTORE THE CHURCH & LIVES',
      subtitleFr: 'Réparer, rebâtir et guérir les cœurs brisés',
      subtitleEn: 'Repairing, rebuilding, and healing broken lives',
      icon: Sparkles,
      color: 'from-blue-500 via-cyan-600 to-blue-700 text-blue-300',
      border: 'border-blue-500/40 bg-blue-500/10',
      verseFr: 'Jean 10:10 • Actes 10:38 • Genèse 3:1-24 • Néhémie',
      verseEn: 'John 10:10 • Acts 10:38 • Genesis 3:1-24 • Nehemiah',
      descFr: [
        'Par les expériences douloureuses (le rejet, la désolation, les blessures), l\'image de Dieu dans l\'homme a été souillée et les relations avec le Créateur ont été brisées.',
        'Jésus-Christ est venu restaurer, rétablir et réparer la vie de Ses brebis pour les conduire dans l\'abondance (Jean 10:10). Il allait de lieu en lieu faisant du bien et guérissant tous les opprimés (Actes 10:38).',
        'À l\'exemple de Néhémie qui a ôté l\'opprobre en rebâtissant la muraille de Jérusalem, la Génération Joël est ointe pour rebâtir les vies et restaurer l\'Église.'
      ],
      descEn: [
        'Through painful life experiences (rejection, desolation, wounds), the divine image in humanity was marred and relationship with God broken.',
        'Jesus Christ came to restore, rebuild, and repair His sheep to lead them into abundant life (John 10:10). He went around doing good and healing all the oppressed (Acts 10:38).',
        'Like Nehemiah who removed reproach by rebuilding the walls of Jerusalem, Generation Joel is anointed to rebuild lives and restore the Church.'
      ]
    }
  };

  const currentPillar = pillars[activePillar];
  const PillarIcon = currentPillar.icon;

  const actions = [
    {
      titleFr: 'Prière de Délivrance & Fervente',
      titleEn: 'Deliverance & Fervent Prayer',
      descFr: 'Prière de délivrance pour tous les nécessiteux et initiation à la prière ardente et efficace.'
    },
    {
      titleFr: 'Séminaires & Enseignements',
      titleEn: 'Seminars & Deep Teachings',
      descFr: 'Sessions de formation doctrinale et pratique dans divers domaines spirituels et sociaux.'
    },
    {
      titleFr: 'Évangélisation & Campagnes',
      titleEn: 'Evangelism & Crusades',
      descFr: 'Conquête des âmes par diverses méthodes d\'impact, dîners fraternels et campagnes de réveil.'
    },
    {
      titleFr: 'Communions Chrétiennes (Agapè)',
      titleEn: 'Christian Fellowship (Agape)',
      descFr: 'Renforcement des liens d\'amour dans les cellules, secteurs et grandes chorales (Shekinah, Joël Music House).'
    }
  ];

  const regularActivities = [
    'Rencontres hebdomadaires dynamiques dans chaque secteur et cellule de prière',
    'Veillées de prière prophétiques et intercession continue pour les nations',
    'Retraites spirituelles et montées d\'onction en montagne',
    'Réunions des Femmes Dynamiques pour l\'édification des mamans & prière des sœurs',
    'Conventions annuelles régionales dans différentes villes pour bénir les églises',
    'Grande Convention Annuelle Internationale de Kolwezi (KZI) chaque 1ère semaine du mois d\'Août'
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pb-20 overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-[15%] w-[500px] h-[500px] rounded-full bg-[var(--accent-gold)]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[5%] w-[600px] h-[600px] rounded-full bg-[var(--accent-olive)]/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[25%] w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Hero Banner Header */}
      <div className="relative z-10 border-b border-glass bg-gradient-to-b from-[var(--bg-secondary)]/90 to-[var(--bg-primary)] pt-8 pb-12 px-4 sm:px-8 text-center">
        <div className="max-w-5xl mx-auto space-y-5">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] text-xs sm:text-sm font-black tracking-widest uppercase shadow-md backdrop-blur-md">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>{lang === 'fr' ? 'Présentation & Vision Officielle' : 'Official Presentation & Vision'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit tracking-tight text-[var(--text-primary)]">
            {lang === 'fr' ? 'Ministères Génération Joël' : 'Generation Joel Ministries'} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--accent-olive)] via-[var(--accent-gold)] to-amber-300 bg-clip-text text-transparent">
              (M.G.J. Monde)
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[var(--text-secondary)] font-medium max-w-3xl mx-auto leading-relaxed">
            {lang === 'fr' 
              ? 'Fondée en Juillet 1994 sur base d\'une révélation et vision de l\'Éternel. Une œuvre prophétique inter-dénominationnelle au service des églises pour la conquête des nations à Christ.'
              : 'Founded in July 1994 based on a celestial vision from the Eternal. An interdenominational prophetic ministry dedicated to serving churches and winning nations to Christ.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-extrabold">
            <div className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-glass flex items-center gap-2">
              <span className="text-[var(--accent-gold)]">Joël 2:28</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-slate-300 italic">« L'Esprit sur toute chair »</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-glass flex items-center gap-2">
              <span className="text-[var(--accent-olive)]">Galates 5:25</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-slate-300 italic">« Si nous vivons par l'Esprit, marchons par l'Esprit »</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-16 relative z-10">
        
        {/* SECTION I & II: L'ŒUVRE & APPOINT AUX ÉGLISES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Presentation Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--accent-gold)]/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[var(--accent-gold)]">Section I</span>
                <h3 className="text-xl font-black font-outfit text-[var(--text-primary)]">
                  {lang === 'fr' ? 'Présentation de l\'Œuvre' : 'Presentation of the Ministry'}
                </h3>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              La <strong className="text-[var(--text-primary)]">« Génération Joël »</strong> a vu le jour en <strong className="text-[var(--accent-gold)]">juillet 1994</strong> sur base d'une vision céleste. Depuis lors, elle ne cesse de prendre de l'ampleur par l'implantation d'antennes et secteurs dans diverses provinces et nations.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Il s'agit d'hommes et de femmes qui ont donné leur vie à Jésus-Christ (Jean 1:12) et ont accepté d'être menés sous la <strong className="text-[var(--accent-olive)] font-bold">seule conduite du Saint-Esprit (Galates 5:16)</strong> afin d'influencer toutes les sphères de la société (chrétienne, sociale, politique, éducation).
            </p>
          </div>

          {/* Appoint aux Eglises Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--accent-olive)]/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-olive)]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[var(--accent-olive)]">Section II</span>
                <h3 className="text-xl font-black font-outfit text-[var(--text-primary)]">
                  {lang === 'fr' ? 'Appoint aux Églises & École des Ministères' : 'Support to Churches & School of Ministries'}
                </h3>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Toutes les églises locales et véritables forment le Corps du Christ (Église Universelle). <strong className="text-[var(--text-primary)]">N'étant pas une église locale fermée, mais une école des ministères</strong>, la Génération Joël rassemble des chrétiens de diverses communautés.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Elle est <strong className="text-[var(--accent-gold)]">d'appoint</strong> dans le sens qu'elle sert de main, d'aide et d'association spirituelle pour soutenir les églises locales selon leurs besoins en s'impliquant activement dans le réveil spirituel.
            </p>
          </div>

        </div>

        {/* SECTION III: LA VISION (LES 4 PILIERS DE L'ONCTION) */}
        <div className="space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--bg-tertiary)] border border-glass text-xs font-extrabold uppercase tracking-widest text-[var(--accent-gold)]">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Mandat Divin • 4 Piliers' : 'Divine Mandate • 4 Pillars'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'La Vision : Pourquoi DIEU nous a oints' : 'The Vision: Why GOD Anointed Us'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
              {lang === 'fr' 
                ? 'Sélectionnez l\'un des 4 piliers prophétiques pour explorer la profondeur du mandat confié par le Seigneur :' 
                : 'Select one of the 4 prophetic pillars to explore the depth of the divine mandate:'}
            </p>
          </div>

          {/* 4 Tabs Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {(['A', 'B', 'C', 'D'] as const).map((key) => {
              const p = pillars[key];
              const TabIcon = p.icon;
              const isActive = activePillar === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePillar(key)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    isActive 
                      ? `${p.border} shadow-xl scale-[1.03] ring-2 ring-[var(--accent-gold)]` 
                      : 'border-glass bg-[var(--bg-secondary)]/60 hover:bg-[var(--bg-tertiary)] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-black/40 text-[var(--accent-gold)]">
                      Pilier {key}
                    </span>
                    <TabIcon className={`w-5 h-5 ${isActive ? 'text-[var(--accent-gold)] animate-pulse' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black font-outfit leading-tight text-[var(--text-primary)]">
                    {lang === 'fr' ? p.titleFr : p.titleEn}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Detail Card */}
          <div className={`p-6 sm:p-10 rounded-3xl border ${currentPillar.border} backdrop-blur-2xl transition-all duration-300 shadow-2xl relative overflow-hidden space-y-6`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentPillar.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <PillarIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[var(--accent-gold)] uppercase tracking-widest">
                    Pilier Prophétique {currentPillar.id}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black font-outfit text-[var(--text-primary)]">
                    {lang === 'fr' ? currentPillar.titleFr : currentPillar.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {lang === 'fr' ? currentPillar.subtitleFr : currentPillar.subtitleEn}
                  </p>
                </div>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-amber-300 self-start sm:self-auto">
                📖 {lang === 'fr' ? currentPillar.verseFr : currentPillar.verseEn}
              </div>
            </div>

            <div className="space-y-4">
              {(lang === 'fr' ? currentPillar.descFr : currentPillar.descEn).map((paragraph, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* VISIONNAIRE & COUPLE PASTORAL SECTION */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-xs font-black uppercase tracking-widest border border-[var(--accent-gold)]/30">
              <Crown className="w-3.5 h-3.5" />
              <span>Direction Prophétique & Visionnaires</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-outfit text-[var(--text-primary)]">
              Le Visionnaire & Le Couple Pastoral
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Découvrez les instruments choisis par Dieu pour porter le flambeau spirituel du réveil Joël 2:28 à travers le monde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Reverend Reussite Ngoie Mandaku Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-[var(--accent-gold)]/60 hover:border-[var(--accent-gold)] bg-gradient-to-br from-[#1b2f0c]/60 via-[var(--bg-secondary)] to-[var(--bg-tertiary)] shadow-2xl flex flex-col justify-between space-y-6 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="w-32 h-36 sm:w-40 sm:h-44 rounded-3xl bg-gradient-to-tr from-[var(--accent-gold)] via-amber-400 to-amber-600 p-1 shadow-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[22px] bg-[var(--bg-primary)] overflow-hidden relative">
                    <img src="/speakers/reussite-mandaku.jpg" alt="Révérend Réussite Ngoie Mandaku" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--accent-gold)] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    <Crown className="w-3 h-3" />
                    <span>Visionnaire & Président</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black font-outfit text-white leading-tight">
                    Révérend Réussite NGOIE MANDAKU
                  </h4>
                  <p className="text-xs font-bold text-amber-400 font-outfit">
                    Fondateur des Ministères Génération Joël (1994)
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-glass pt-4">
                Porteur de l'onction du déversement spirituel de la fin des temps, le Révérend Réussite Ngoie Mandaku parcourt la RDC et les nations pour proclamer le message apostolique du réveil, la sanctification du peuple de Dieu et l'élévation des jeunes comme champions de Christ.
              </p>

              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="italic">« JÉSUS-CHRIST REVIENT BIENTÔT ! »</span>
                <span className="text-[var(--accent-gold)] font-black">Joël 2:28</span>
              </div>
            </div>

            {/* Pasteur Irene Mandaku Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/60 hover:border-emerald-400 bg-gradient-to-br from-emerald-950/40 via-[var(--bg-secondary)] to-[var(--bg-tertiary)] shadow-2xl flex flex-col justify-between space-y-6 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="w-32 h-36 sm:w-40 sm:h-44 rounded-3xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 p-1 shadow-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[22px] bg-[var(--bg-primary)] overflow-hidden relative">
                    <img src="/speakers/irene-mandaku.jpg" alt="Pasteur Irène Mandaku" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Épouse & Pasteur Principal</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black font-outfit text-white leading-tight">
                    Pasteur Irène MANDAKU
                  </h4>
                  <p className="text-xs font-bold text-emerald-400 font-outfit">
                    Pilier de l'Intercession & Encadrement Pastoral
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-glass pt-4">
                Mère spirituelle bien-aimée de toute la communauté MGJ Monde, Pasteur Irène Mandaku soutient avec fidélité, puissance et sagesse l'œuvre prophétique, supervisant l'encadrement des servantes, la prière d'intercession nationale et l'épanouissement des familles spirituelles.
              </p>

              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="italic">« Si nous vivons par l'Esprit, marchons par l'Esprit. »</span>
                <span className="text-emerald-400 font-black">Galates 5:25</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION IV: MOYENS D'ACTION & ACTIVITÉS RÉGULIÈRES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Moyens d'action */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-glass space-y-6">
            <div className="flex items-center gap-3 border-b border-glass pb-4">
              <Zap className="w-6 h-6 text-[var(--accent-gold)]" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-gold)]">Section IV</span>
                <h3 className="text-xl font-black font-outfit text-[var(--text-primary)]">
                  {lang === 'fr' ? 'Moyens d\'Action Prophétique' : 'Prophetic Means of Action'}
                </h3>
              </div>
            </div>
            <div className="space-y-4">
              {actions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[var(--bg-secondary)]/70 border border-glass flex flex-col gap-1">
                  <h4 className="text-sm font-black font-outfit text-[var(--text-primary)]">
                    {lang === 'fr' ? act.titleFr : act.titleEn}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {act.descFr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activités Régulières */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-glass space-y-6">
            <div className="flex items-center gap-3 border-b border-glass pb-4">
              <Calendar className="w-6 h-6 text-[var(--accent-olive)]" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-olive)]">Agenda MGJ</span>
                <h3 className="text-xl font-black font-outfit text-[var(--text-primary)]">
                  {lang === 'fr' ? 'Activités Régulières & Conventions' : 'Regular Activities & Conventions'}
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              {regularActivities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-glass">
                  <span className="w-6 h-6 rounded-lg bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/30 text-center">
              <p className="text-xs font-black text-amber-300 uppercase tracking-wide">
                🌟 Focus : Convention Internationale Kolwezi (KZI)
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                Chaque 1ère semaine du mois d'Août (Prochaine édition : 02 - 09 Août 2026)
              </p>
            </div>
          </div>

        </div>

        {/* CONTACT & BUREAU ADMINISTRATIF */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-glass bg-[var(--bg-secondary)]/60 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Bureau Administratif & Contacts' : 'Administrative Office & Contacts'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {lang === 'fr' ? 'Ministères Génération Joël • Siège National & Contacts Directs' : 'Generation Joel Ministries • National Headquarters'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-glass space-y-2 text-center">
              <MapPin className="w-6 h-6 text-red-400 mx-auto" />
              <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">Adresse du Bureau</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-tight">
                1805/1825, Chaussée de KASENGA ; Bel Air ; KAMPEMBA / LUBUMBASHI <br />
                <span className="text-[var(--accent-gold)] font-bold">Réf. 1er Niveau Étage (Arrêt Fina)</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-glass space-y-2 text-center">
              <Phone className="w-6 h-6 text-emerald-400 mx-auto" />
              <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">Secrétariat MGJ</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-tight font-mono font-bold">
                +(243) 99 117 38 83 <br />
                +(243) 81 14 12 111
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-glass space-y-2 text-center">
              <Globe className="w-6 h-6 text-blue-400 mx-auto" />
              <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">Sites Web Officiels</h4>
              <p className="text-xs text-blue-400 font-bold leading-tight">
                www.generationjoel.org <br />
                www.reussitengoiemandaku.com
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-glass space-y-2 text-center">
              <Mail className="w-6 h-6 text-[var(--accent-gold)] mx-auto" />
              <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">Courriel (Email)</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-tight font-bold">
                mgjoelvision@hotmail.fr <br />
                contact@swaziapplilab.com
              </p>
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('live')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--accent-olive)] to-[#385415] hover:opacity-95 text-white font-black font-outfit shadow-xl flex items-center justify-center gap-3"
          >
            <Tv className="w-5 h-5 text-amber-300" />
            <span>{lang === 'fr' ? 'Rejoindre le Direct MGJ' : 'Join MGJ Live Stream'}</span>
          </button>

          <button
            onClick={() => setActivePage('kzi')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-[var(--accent-gold)] to-amber-600 hover:opacity-95 text-slate-950 font-black font-outfit shadow-xl flex items-center justify-center gap-3"
          >
            <Calendar className="w-5 h-5 text-slate-950" />
            <span>{lang === 'fr' ? 'Voir la Convention KZI 2026' : 'See KZI Convention 2026'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default AboutMgjPage;
