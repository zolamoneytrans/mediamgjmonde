import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Share2, 
  Copy, 
  Check,
  Calendar,
  Send,
  Phone,
  MessageSquare,
  Shield
} from 'lucide-react';

interface ContactsPageProps {
  setActivePage?: (page: string) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ setActivePage }) => {
  const { lang, t } = useLanguage();
  const [copiedPhone, setCopiedPhone] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const contactChannels = [
    {
      id: 'secretariat',
      titleFr: 'Secrétariat Général & Permanence',
      titleEn: 'General Secretariat & Office',
      descFr: 'Pour tout renseignement, audience pastorale ou orientation spirituelle.',
      descEn: 'For inquiries, pastoral appointments, or spiritual guidance.',
      value: '+243 99 117 38 83',
      actionType: 'tel',
      actionUrl: 'tel:+243991173883',
      buttonFr: 'Appeler Maintenant',
      buttonEn: 'Call Now',
      icon: PhoneCall,
      colorClass: 'from-emerald-900/40 to-emerald-950/30 border-emerald-500/40 text-emerald-400',
      badgeFr: 'Ligne Directe',
      badgeEn: 'Direct Line'
    },
    {
      id: 'whatsapp',
      titleFr: 'WhatsApp Prière & Intercession',
      titleEn: 'WhatsApp Prayer & Intercession Line',
      descFr: 'Envoyez vos sujets de prière, témoignages et demandes d\'intercession 24/7.',
      descEn: 'Send your prayer requests, testimonies, and intercession requests 24/7.',
      value: '+243 81 14 12 111',
      actionType: 'whatsapp',
      actionUrl: 'https://wa.me/243811412111?text=Shalom%20Minist%C3%A8res%20G%C3%A9n%C3%A9ration%20Jo%C3%ABl%2C%20je%20vous%20contacte%20depuis%20l%27application%20officielle.',
      buttonFr: 'Écrire sur WhatsApp',
      buttonEn: 'Chat on WhatsApp',
      icon: MessageCircle,
      colorClass: 'from-green-900/40 to-[var(--bg-secondary)] border-green-500/40 text-green-400',
      badgeFr: 'Réponse Rapide',
      badgeEn: 'Fast Response'
    },
    {
      id: 'email',
      titleFr: 'Courrier Électronique Officiel',
      titleEn: 'Official Email Address',
      descFr: 'Pour les invitations officielles, partenariats et correspondances administratives.',
      descEn: 'For official invitations, partnerships, and administrative correspondence.',
      value: 'mgjoelvision@hotmail.fr',
      actionType: 'mail',
      actionUrl: 'mailto:mgjoelvision@hotmail.fr?subject=Contact%20depuis%20l%27application%20MediaMondeMJG',
      buttonFr: 'Envoyer un E-mail',
      buttonEn: 'Send Email',
      icon: Mail,
      colorClass: 'from-amber-900/30 to-[var(--bg-secondary)] border-[var(--accent-gold)]/40 text-[var(--accent-gold)]',
      badgeFr: 'Administration',
      badgeEn: 'Administration'
    },
    {
      id: 'hq',
      titleFr: 'Siège Administratif Central',
      titleEn: 'Central Administrative Headquarters',
      descFr: 'Bureau de Coordination Internationale & École des Ministères.',
      descEn: 'International Coordination Office & School of Ministries.',
      value: '1805/1825, Chaussée de Kasenga, Q. Bel Air, C. Kampemba, Lubumbashi, RDC',
      actionType: 'map',
      actionUrl: 'https://www.google.com/maps/search/?api=1&query=Chaussee+de+Kasenga+Lubumbashi+Bel+Air',
      buttonFr: 'Ouvrir sur Google Maps',
      buttonEn: 'Open in Google Maps',
      icon: MapPin,
      colorClass: 'from-purple-950/40 to-[var(--bg-secondary)] border-purple-500/40 text-purple-400',
      badgeFr: 'Siège International',
      badgeEn: 'International HQ'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b2f0c] via-[var(--bg-secondary)] to-[#1e1435] p-6 sm:p-10 border border-[var(--accent-gold)]/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--accent-gold)]/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[var(--accent-gold)]/40 text-[11px] font-black uppercase tracking-widest text-[var(--accent-gold)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{lang === 'fr' ? 'Permanence & Assistance Spirituelle' : 'Pastoral Care & Support'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
            {lang === 'fr' ? 'Contacts & Permanence MGJ' : 'MGJ Contacts & Headquarters'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'fr'
              ? 'L\'équipe pastorale, le secrétariat et l\'intercession du Révérend Réussite Ngoie Mandaku sont à votre écoute. Cliquez sur n\'importe quel canal pour appeler ou écrire directement.'
              : 'The pastoral team, secretariat, and intercession center of Rev. Réussite Ngoie Mandaku are here to serve you. Click any channel below to call or write directly.'}
          </p>
        </div>
      </div>

      {/* Quick Clickable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.id}
              className={`glass-panel rounded-3xl p-6 sm:p-8 border-2 shadow-xl bg-gradient-to-br transition-all hover:scale-[1.02] duration-300 flex flex-col justify-between ${channel.colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-extrabold uppercase tracking-widest">
                    {lang === 'fr' ? channel.badgeFr : channel.badgeEn}
                  </span>
                </div>

                <h3 className="text-xl font-black font-outfit text-[var(--text-primary)] mb-1">
                  {lang === 'fr' ? channel.titleFr : channel.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                  {lang === 'fr' ? channel.descFr : channel.descEn}
                </p>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-glass font-mono text-xs sm:text-sm text-slate-200 break-all flex items-center justify-between gap-2 mb-6">
                  <span>{channel.value}</span>
                  <button
                    onClick={() => handleCopy(channel.value, channel.id)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--accent-gold)] shrink-0 transition-colors"
                    title="Copier"
                  >
                    {copiedPhone === channel.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <a
                href={channel.actionUrl}
                target={channel.actionType === 'map' || channel.actionType === 'whatsapp' ? '_blank' : '_self'}
                rel="noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-[var(--accent-gold)] text-slate-950 font-black text-xs sm:text-sm font-outfit flex items-center justify-center gap-2 shadow-xl hover:bg-amber-400 active:scale-95 transition-all"
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                <span>{lang === 'fr' ? channel.buttonFr : channel.buttonEn}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Organisateurs de la Grande Convention KZI */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--accent-gold)]/40 bg-gradient-to-br from-[#1b2f0c]/80 via-[#121d0a]/90 to-[#22160b]/90 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Équipe d\'Organisation & Accueil' : 'Convention Organizing Committee'}</span>
            </div>
            <h3 className="text-2xl font-black font-outfit text-white mt-1">
              {lang === 'fr' ? 'Comité de la Grande Convention KZI' : 'Grand Convention KZI Committee'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {lang === 'fr' ? 'Pour tout détail concernant le déroulement, la logistique et l\'administration à Kolwezi.' : 'For any inquiry regarding event logistics, reception, and administration in Kolwezi.'}
            </p>
          </div>
          <button
            onClick={() => setActivePage && setActivePage('convention')}
            className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-400 transition-all shrink-0 shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>{lang === 'fr' ? 'Voir Page Convention' : 'Convention Page'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Administration */}
          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-[var(--accent-gold)] transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                1. Administration
              </span>
              <h4 className="text-lg font-black font-outfit text-white">
                Papa Ghislain KABALE
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                {lang === 'fr' ? 'Inscriptions, accueil des délégations et secrétariat administratif.' : 'Registrations, delegation reception & administrative secretariat.'}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">+243 990 228 048</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243990228048" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all" title="Appeler">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://wa.me/243990228048" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all" title="WhatsApp">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">+243 841 065 500</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243841065500" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all" title="Appeler">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://wa.me/243841065500" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all" title="WhatsApp">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Directeur */}
          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-[var(--accent-gold)] transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                2. Directeur de la Convention
              </span>
              <h4 className="text-lg font-black font-outfit text-white">
                Pasteur Jeremie Kongolo
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                {lang === 'fr' ? 'Direction de la convention, coordination générale et programme.' : 'Convention direction, general coordination & event program.'}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">+243 999 793 081</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243999793081" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all" title="Appeler">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://wa.me/243999793081" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all" title="WhatsApp">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Logistique */}
          <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 hover:border-[var(--accent-gold)] transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
                3. Logistique & Hébergement
              </span>
              <h4 className="text-lg font-black font-outfit text-white">
                Papa Adellard
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                {lang === 'fr' ? 'Logistique sur site à Kolwezi, transport, hébergement et accueil.' : 'On-site logistics in Kolwezi, transport, lodging & hospitality.'}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">+243 997 113 225</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243997113225" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all" title="Appeler">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://wa.me/243997113225" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all" title="WhatsApp">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pastoral Hours & Website Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-glass bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-tertiary)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-black font-outfit text-[var(--text-primary)]">
              {lang === 'fr' ? 'Horaires d\'Accueil Spirituel' : 'Spiritual Care Hours'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-lg">
              {lang === 'fr'
                ? 'Du Lundi au Vendredi : 08h30 - 17h00 • Samedi : 09h00 - 14h00 • Culte en direct et prière 24/7 en ligne.'
                : 'Monday to Friday: 08:30 AM - 05:00 PM • Saturday: 09:00 AM - 02:00 PM • 24/7 Live stream and prayer online.'}
            </p>
          </div>
        </div>

        <a
          href="https://www.generationjoel.org"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Globe className="w-4 h-4 text-[var(--accent-gold)]" />
          <span>www.generationjoel.org</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
