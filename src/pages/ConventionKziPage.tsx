import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { KziRegistrant } from '../types/models';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Download, 
  Award,
  Users,
  Layers,
  ArrowRight,
  Phone,
  MessageSquare,
  Shield,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Bus,
  Plane,
  Hotel,
  Plus,
  Minus,
  Loader2,
  ShieldCheck,
  Building2,
  Navigation,
  Check,
  Tag,
  AlertTriangle,
  QrCode,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KitItem {
  id: string;
  nameFr: string;
  nameEn: string;
  priceUsd: number;
  priceFc: number;
  imageUrl: string;
  hasSize?: boolean;
}

const OFFICIAL_KIT_ITEMS: KitItem[] = [
  {
    id: 'kit-pass-vip',
    nameFr: 'KIT Officiel (Pass VIP & Siège Numéroté)',
    nameEn: 'Official KIT (VIP Pass & Seat Number)',
    priceUsd: 25,
    priceFc: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    hasSize: false
  }
];

export const ConventionKziPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { 
    speakers, 
    schedule, 
    kziRegistrantsCount, 
    isUserRegisteredKzi, 
    registerForKzi,
    kziWelcomeInfo,
    addKziRegistrant,
    kziRegistrantsList
  } = useAppData();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [justRegistered, setJustRegistered] = useState(false);

  // Kit Store state
  const [kitSelections, setKitSelections] = useState<{ [id: string]: { qty: number; size: string } }>({});
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'FC'>('USD');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<'kit' | 'reservation' | 'arrival'>('kit');

  // Reservation state (Bus, Flight, Lodging)
  const [resType, setResType] = useState<'bus' | 'flight' | 'hotel'>('bus');
  const [busOption, setBusOption] = useState<'mgj' | 'mulykap'>('mgj');
  const [resDeparture, setResDeparture] = useState('Lubumbashi (Siège Central - Navette)');
  const [resPersons, setResPersons] = useState(1);
  const [resHotelOption, setResHotelOption] = useState('Internat Umoja (Réservé par l\'organisation MGJ - Site officiel)');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [bookingSerial, setBookingSerial] = useState<string | null>(null);

  // Arrival & Participation Confirmation Form State (Signaler son arrivée & participation)
  const [regFullName, setRegFullName] = useState(user?.fullName || '');
  const [regWhatsapp, setRegWhatsapp] = useState(user?.phone || '+243 99 ');
  const [regCity, setRegCity] = useState('Lubumbashi');
  const [regArrivalDate, setRegArrivalDate] = useState('02/08/2026');
  const [regDepartureDate, setRegDepartureDate] = useState('09/08/2026');
  const [regTransport, setRegTransport] = useState('Bus officiel MGJ (35 000 FC)');
  const [regLodging, setRegLodging] = useState('Internat Umoja (Réservé par l\'organisation MGJ)');
  const [regSeatsCount, setRegSeatsCount] = useState(1);
  const [arrivalReported, setArrivalReported] = useState(false);
  const [assignedRegistrant, setAssignedRegistrant] = useState<KziRegistrant | null>(null);

  // Realistic Payment state
  const [payMethod, setPayMethod] = useState<'card' | 'mobile'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [mobileOp, setMobileOp] = useState<'M-Pesa' | 'Orange' | 'Airtel'>('M-Pesa');
  const [mobilePhone, setMobilePhone] = useState(user ? user.phone : '+243 81 234 5678');
  const [mobilePin, setMobilePin] = useState('');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessReceipt, setPaySuccessReceipt] = useState<string | null>(null);

  // Countdown timer state target: Aug 02, 2026 05:30:00
  const [timeLeft, setTimeLeft] = useState({ days: 142, hours: 14, mins: 32, secs: 45 });

  useEffect(() => {
    const targetDate = new Date('2026-08-02T05:30:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, mins, secs });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#ffffff', '#eab308']
    });
  };

  const handleRegisterBasic = () => {
    registerForKzi();
    setJustRegistered(true);
    triggerConfetti();
  };

  const handleReportArrivalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regWhatsapp.trim()) return;

    const created = addKziRegistrant({
      fullName: regFullName,
      whatsapp: regWhatsapp,
      city: regCity,
      arrivalDate: regArrivalDate,
      departureDate: regDepartureDate,
      transport: regTransport,
      lodgingOption: regLodging,
      seatsCount: regSeatsCount,
      bookingType: 'arrival'
    });

    setAssignedRegistrant(created);
    setArrivalReported(true);
    setJustRegistered(true);
    triggerConfetti();
  };

  // Kit methods
  const updateKitItem = (id: string, delta: number) => {
    setKitSelections(prev => {
      const current = prev[id] || { qty: 0, size: 'L' };
      const newQty = Math.max(0, current.qty + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...current, qty: newQty } };
    });
  };

  const updateKitSize = (id: string, size: string) => {
    setKitSelections(prev => {
      const current = prev[id] || { qty: 1, size: 'L' };
      return { ...prev, [id]: { ...current, size } };
    });
  };

  const calculateKitTotal = () => {
    let total = 0;
    Object.entries(kitSelections).forEach(([id, selection]) => {
      const item = OFFICIAL_KIT_ITEMS.find(i => i.id === id);
      if (item) {
        total += selectedCurrency === 'USD' ? item.priceUsd * selection.qty : item.priceFc * selection.qty;
      }
    });
    return total > 0 ? total : (selectedCurrency === 'USD' ? 25 : 65000);
  };

  const calculateReservationTotal = () => {
    if (resType === 'bus') {
      const unitCost = busOption === 'mgj' ? (selectedCurrency === 'USD' ? 14 : 35000) : (selectedCurrency === 'USD' ? 20 : 50000);
      return unitCost * resPersons;
    } else if (resType === 'flight') {
      const unitCost = selectedCurrency === 'USD' ? 200 : 560000;
      return unitCost * resPersons;
    } else {
      // Hotel or Umoja option
      if (resHotelOption.includes('Umoja')) return 0;
      return (selectedCurrency === 'USD' ? 65 : 180000) * resPersons;
    }
  };

  const openCheckout = (target: 'kit' | 'reservation' | 'arrival') => {
    setCheckoutTarget(target);
    setPaySuccessReceipt(null);
    setShowCheckoutModal(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPay(true);

    setTimeout(() => {
      setIsProcessingPay(false);
      const receiptNum = `KZI-2026-REC-${Math.floor(100000 + Math.random() * 900000)}`;
      const serialNum = `KZI-2026-VIP-${checkoutTarget === 'kit' ? 'KIT' : resType === 'flight' ? 'AIR' : 'BUS'}-${Math.floor(100 + Math.random() * 400)}`;
      
      setPaySuccessReceipt(receiptNum);
      if (checkoutTarget === 'reservation') {
        setBookingRef(receiptNum);
        setBookingSerial(serialNum);
        setBookingSubmitted(true);
        addKziRegistrant({
          fullName: regFullName || user?.fullName || 'Délégation Transport Kzi',
          whatsapp: regWhatsapp || user?.phone || '+243 99 022 8048',
          city: regCity || 'Lubumbashi',
          arrivalDate: '02/08/2026',
          departureDate: '09/08/2026',
          transport: resType === 'bus' ? (busOption === 'mgj' ? 'Bus officiel MGJ (35 000 FC)' : 'Bus Mulykap Express (50 000 FC)') : 'Vol Aérien & Navette (200 USD)',
          lodgingOption: regLodging || 'Internat Umoja (Réservé par MGJ)',
          seatsCount: resPersons,
          passSerial: serialNum,
          purchasedKit: false,
          amountPaid: `${calculateReservationTotal()} ${selectedCurrency}`,
          bookingType: resType === 'bus' ? 'bus' : 'flight'
        });
      } else if (checkoutTarget === 'kit') {
        setBookingSerial(serialNum);
        addKziRegistrant({
          fullName: regFullName || user?.fullName || 'Pèlerin Kzi 2026',
          whatsapp: regWhatsapp || user?.phone || '+243 99 022 8048',
          city: regCity || 'Lubumbashi',
          arrivalDate: '02/08/2026',
          departureDate: '09/08/2026',
          transport: regTransport || 'À confirmer sur WhatsApp',
          lodgingOption: regLodging || 'Internat Umoja (Réservé par MGJ)',
          seatsCount: 1,
          passSerial: serialNum,
          purchasedKit: true,
          kitType: `KIT Convention KZI 2026 (${calculateKitTotal()} ${selectedCurrency})`,
          kitCount: 1,
          amountPaid: `${calculateKitTotal()} ${selectedCurrency}`,
          bookingType: 'kit'
        });
      }
      registerForKzi();
      triggerConfetti();
    }, 1800);
  };

  const handleDownloadQRPass = () => {
    const serialToDownload = assignedRegistrant?.passSerial || bookingSerial || `KZI-2026-VIP-SEAT-${Math.floor(100 + Math.random() * 400)}`;
    const textContent = `=====================================================
   PASS VIP & SIÈGE NUMÉROTÉ - CONVENTION KZI 2026
=====================================================
Titulaire     : ${regFullName || user?.fullName || 'Serviteur de Dieu'}
Contact       : ${regWhatsapp || user?.phone || '+243...'}
Numéro Série  : ${serialToDownload}
Statut Pass   : ACCÈS VIP CONFIRMÉ (Siège réservé)
Dates         : ${kziWelcomeInfo?.datesFr || 'Du 02 au 09 Août 2026'}
Lieu          : ${kziWelcomeInfo?.locationFr || 'Kolwezi • Manika Sport'}
Transport     : ${regTransport}
Hébergement   : ${regLodging}
=====================================================
Présentez ce code QR ou ce numéro de série au secrétariat
de l'Internat Umoja ou à l'accueil VIP de Manika Sport.
Ministères Génération Joël (MGJ Monde) • Joël 2:28
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PASS_VIP_KZI_2026_${serialToDownload}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReceipt = () => {
    const receiptToDownload = paySuccessReceipt || bookingRef || 'REC-KZI-99988';
    const textContent = `=====================================================
   REÇU OFFICIEL DE TRANSACTION - KZI 2026
=====================================================
Numéro Reçu   : ${receiptToDownload}
Date          : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Pèlerin       : ${regFullName || user?.fullName || 'Serviteur de Dieu'}
Objet Payé    : ${checkoutTarget === 'kit' ? 'Achat KIT Officiel & Pass VIP Numéroté' : `Réservation ${resType.toUpperCase()} (${resPersons} place(s))` }
Montant Total : ${checkoutTarget === 'kit' ? `${calculateKitTotal().toLocaleString('fr-FR')} ${selectedCurrency}` : `${calculateReservationTotal().toLocaleString('fr-FR')} ${selectedCurrency}`}
Moyen Paiement: ${payMethod === 'card' ? 'Carte Bancaire Sécurisée' : `Mobile Money (${mobileOp})`}
=====================================================
Merci pour votre contribution à l'œuvre de Dieu !
Swazi Pay & Administration Financière MGJ Monde
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RECU_PAIEMENT_KZI_${receiptToDownload}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredSchedule = schedule.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-3 sm:px-6 animate-fade-in">
      
      {/* 1. HERO CONVENTION KZI BANNER & ADMIN CONTROLLED WELCOME */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122008] via-[#1a2f0c] to-[#0f172a] border-2 border-[var(--accent-gold)] shadow-2xl p-6 sm:p-12 text-white">
        
        {/* Background Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>{lang === 'fr' ? 'Évènement International MGJ Monde • Édition 2026' : 'MGJ International Event • 2026 Edition'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit tracking-tight leading-tight">
              {lang === 'fr' ? 'Grande Convention Internationale' : 'Grand International Convention'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                KZI 2026
              </span>
            </h1>

            <p className="text-base sm:text-xl font-bold text-amber-300/90 font-outfit tracking-wide">
              {kziWelcomeInfo?.themeFr || 'Thème : L\'Effusion de l\'Esprit — Joël 2:28'}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {kziWelcomeInfo?.visionTextFr || 'La 31ème Grande Convention Internationale KZI 2026 est le grand rassemblement solennel et apostolique des Ministères Génération Joël (MGJ Monde). Des milliers de pèlerins se réunissent pour recevoir le baptême du feu et l\'imposition des mains.'}
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-extrabold">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{kziWelcomeInfo?.datesFr || 'Du 02 au 09 Août 2026'}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-extrabold">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>{kziWelcomeInfo?.locationFr || 'Kolwezi • Manika Sport'}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-extrabold text-emerald-300">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{kziRegistrantsCount.toLocaleString('fr-FR')} {lang === 'fr' ? 'Pèlerins Inscrits' : 'Registered Pilgrims'}</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock Panel */}
          <div className="w-full lg:w-auto flex flex-col items-center bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-[var(--accent-gold)]/50 shadow-2xl shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Compte à Rebours KZI 2026' : 'KZI 2026 Countdown'}</span>
            </span>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/30 w-16 sm:w-20">
                <span className="text-2xl sm:text-4xl font-black font-outfit text-white block leading-none">{timeLeft.days}</span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-400 mt-1 block">Jours</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/30 w-16 sm:w-20">
                <span className="text-2xl sm:text-4xl font-black font-outfit text-white block leading-none">{timeLeft.hours}</span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-400 mt-1 block">Heures</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/30 w-16 sm:w-20">
                <span className="text-2xl sm:text-4xl font-black font-outfit text-white block leading-none">{timeLeft.mins}</span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-400 mt-1 block">Min</span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-amber-500/30 w-16 sm:w-20 animate-pulse">
                <span className="text-2xl sm:text-4xl font-black font-outfit text-amber-300 block leading-none">{timeLeft.secs}</span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-amber-400 mt-1 block">Sec</span>
              </div>
            </div>

            <div className="mt-6 w-full">
              <a
                href="#signalement-arrivee"
                className="btn-gold w-full py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <UserCheck className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Signaler Mon Arrivée & Participation' : 'Confirm My Arrival & Attendance'}</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. SECTION OBLIGATOIRE : SIGNALER SON ARRIVÉE ET CONFIRMER SA PARTICIPATION (v. Signaler son arrivée) */}
      <div id="signalement-arrivee" className="glass-card p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1b2f0c]/90 via-[#132009]/95 to-[#0f172a]/95 border-2 border-emerald-500/60 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/15">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Étape Obligatoire pour la Prise en Charge Logistique</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-outfit text-white">
              {lang === 'fr' ? 'Signaler son Arrivée & Confirmer sa Participation' : 'Report Arrival & Confirm Attendance'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'fr'
                ? 'À l\'attention des délégations en provenance d\'autres villes ou de l\'étranger (Lubumbashi, Likasi, Kipushi, Kinshasa, Kasumbalesa, Europe...) : Vous êtes priés de signaler obligatoirement vos dates d\'arrivée et votre participation afin de permettre au Comité d\'Administration et de Logistique de planifier votre accueil, bus et hébergement à Kolwezi.'
                : 'Attention to all participants arriving from other cities or abroad: You are strictly required to confirm your arrival dates and attendance to allow the Admin & Logistics Committee to plan your transport and lodging.'}
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-500/40 text-center shrink-0 max-w-xs w-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
              {lang === 'fr' ? 'Direct Admin WhatsApp' : 'Direct Admin WhatsApp'}
            </span>
            <div className="text-lg font-black font-mono text-white mb-2">+243 99 022 8048</div>
            <a
              href="https://wa.me/243990228048?text=Bonjour%20l'Administration%20MGJ,%20je%20souhaite%20signaler%20mon%20arriv%C3%A9e%20pour%20la%20Grande%20Convention%20Kzi%202026."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacter sur WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Confirmation Form or Registered Badge */}
        {arrivalReported && assignedRegistrant ? (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-emerald-950/80 border-2 border-emerald-400 flex flex-col md:flex-row items-center justify-between gap-6 animate-scale-in">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-2xl">
                <QrCode className="w-9 h-9 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Participation Confirmée & Enregistrée
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-outfit text-white">
                  {assignedRegistrant.fullName} • <span className="text-amber-400 font-mono">{assignedRegistrant.passSerial}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Ville : <strong>{assignedRegistrant.city}</strong> • Arrivée : <strong>{assignedRegistrant.arrivalDate}</strong> • Transport : <strong>{assignedRegistrant.transport}</strong>
                </p>
                <p className="text-[11px] text-emerald-300 font-bold mt-1">
                  ✓ Votre signalement a été transmis en temps réel sur le tableau de bord des Administrateurs & de la Logistique.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={handleDownloadQRPass}
                className="btn-gold py-3.5 px-6 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Télécharger Badge Pass VIP QR' : 'Download VIP Pass Badge'}</span>
              </button>
              <button
                onClick={() => setArrivalReported(false)}
                className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs w-full sm:w-auto text-center"
              >
                {lang === 'fr' ? 'Modifier Signalement' : 'Edit Arrival Report'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReportArrivalSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300 uppercase">
                {lang === 'fr' ? '1. Nom & Prénom du Pèlerin' : '1. Full Name'}
              </label>
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Ex: Pasteur Jean-Marc Joël"
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300 uppercase">
                {lang === 'fr' ? '2. Numéro WhatsApp (Contact Logistique)' : '2. WhatsApp Number'}
              </label>
              <input
                type="tel"
                value={regWhatsapp}
                onChange={(e) => setRegWhatsapp(e.target.value)}
                placeholder="+243 99 000 0000"
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300 uppercase">
                {lang === 'fr' ? '3. Ville / Pays de Provenance' : '3. Origin City / Country'}
              </label>
              <select
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl text-white"
              >
                <option className="bg-slate-900" value="Lubumbashi">Lubumbashi (Siège Central)</option>
                <option className="bg-slate-900" value="Likasi">Likasi</option>
                <option className="bg-slate-900" value="Kipushi">Kipushi</option>
                <option className="bg-slate-900" value="Kinshasa">Kinshasa</option>
                <option className="bg-slate-900" value="Kasumbalesa">Kasumbalesa</option>
                <option className="bg-slate-900" value="Sakania">Sakania</option>
                <option className="bg-slate-900" value="Fungurume">Fungurume</option>
                <option className="bg-slate-900" value="Kolwezi (Résident)">Kolwezi (Résident local)</option>
                <option className="bg-slate-900" value="Paris / Europe">Paris / Bruxelles / Europe</option>
                <option className="bg-slate-900" value="Johannesburg / RSA">Johannesburg / Afrique du Sud</option>
                <option className="bg-slate-900" value="Autre Ville / Étranger">Autre Ville / Étranger</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-amber-300 uppercase">
                {lang === 'fr' ? '4. Date Prévue d\'Arrivée à Kolwezi' : '4. Expected Arrival Date'}
              </label>
              <select
                value={regArrivalDate}
                onChange={(e) => setRegArrivalDate(e.target.value)}
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-amber-500/40 w-full rounded-2xl text-amber-300"
              >
                <option className="bg-slate-900" value="31/07/2026">Vendredi 31 Juillet 2026 (Avance Logistique)</option>
                <option className="bg-slate-900" value="01/08/2026">Samedi 01 Août 2026 (Veille de la Convention)</option>
                <option className="bg-slate-900" value="02/08/2026">Dimanche 02 Août 2026 (Jour d'Ouverture Solennelle)</option>
                <option className="bg-slate-900" value="03/08/2026">Lundi 03 Août 2026 (Jour 2)</option>
                <option className="bg-slate-900" value="04/08/2026">Mardi 04 Août 2026 (Jour 3)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300 uppercase">
                {lang === 'fr' ? '5. Date de Départ / Retour' : '5. Expected Departure Date'}
              </label>
              <select
                value={regDepartureDate}
                onChange={(e) => setRegDepartureDate(e.target.value)}
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl text-white"
              >
                <option className="bg-slate-900" value="09/08/2026">Dimanche 09 Août 2026 (Fin & Clôture)</option>
                <option className="bg-slate-900" value="10/08/2026">Lundi 10 Août 2026 (Lendemain de clôture)</option>
                <option className="bg-slate-900" value="11/08/2026">Mardi 11 Août 2026</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300 uppercase">
                {lang === 'fr' ? '6. Moyen de Transport Choisi' : '6. Selected Transport Option'}
              </label>
              <select
                value={regTransport}
                onChange={(e) => setRegTransport(e.target.value)}
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl text-white"
              >
                <option className="bg-slate-900" value="Bus officiel MGJ (35 000 FC)">🚌 Bus réservé par MGJ (35 000 FC - Au départ de Lubumbashi)</option>
                <option className="bg-slate-900" value="Bus Mulykap Express (50 000 FC)">🚌 Bus Mulykap Express (50 000 FC - Confort VIP)</option>
                <option className="bg-slate-900" value="Vol direct & Navette (200 USD)">✈️ Billet d'Avion & Navette Aéroport (200 $ USD Aller simple)</option>
                <option className="bg-slate-900" value="Voiture Personnelle / Autre">🚘 Voiture Personnelle / Moyen Privé</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-black text-slate-300 uppercase">
                {lang === 'fr' ? '7. Option de Logement / Hébergement à Kolwezi (iv. Logement)' : '7. Lodging Option in Kolwezi'}
              </label>
              <select
                value={regLodging}
                onChange={(e) => setRegLodging(e.target.value)}
                className="input-field py-3.5 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl text-white"
              >
                <option className="bg-slate-900" value="Site d'accueil officiel : L'Internat Umoja (Réservé par l'organisation MGJ)">
                  🏡 Site d'accueil officiel : L'Internat Umoja (Réservé par l'organisation MGJ - Hébergement communautaire)
                </option>
                <option className="bg-slate-900" value="Autres options : Hôtel VIP 5 Étoiles (À la charge et aux frais individuels du participant)">
                  🏢 Autres options : Hôtel VIP 5 Étoiles (120$/nuit - À la charge individuelle)
                </option>
                <option className="bg-slate-900" value="Autres options : Hôtel Confort Standard (À la charge et aux frais individuels du participant)">
                  🏢 Autres options : Hôtel Standard Confort (65$/nuit - À la charge individuelle)
                </option>
                <option className="bg-slate-900" value="Autres options : Guest House / Appartement meublé (À la charge individuelle)">
                  🏢 Autres options : Guest House ou Appartement (À la charge individuelle et selon bourse)
                </option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="btn-gold w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl hover:scale-105 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{lang === 'fr' ? 'Valider et Signaler Mon Arrivée' : 'Submit & Confirm Arrival'}</span>
              </button>
            </div>

          </form>
        )}
      </div>

      {/* 3. ACHETER LE KIT (Pass VIP avec Numéro de Série correspondant au Siège N°) - i. Acheter le KIT */}
      <div className="space-y-6">
        <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c2c0d] via-[#101908] to-[var(--bg-secondary)] border-2 border-[var(--accent-gold)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-black uppercase tracking-wider">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{lang === 'fr' ? 'Pass VIP Numéroté • Places Limitées & Fixes' : 'Numbered VIP Pass • Limited Fixed Places'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
              {lang === 'fr' ? 'Acheter le KIT Officiel (Pass VIP & Siège Numéroté)' : 'Purchase Official KIT (VIP Pass & Seat Number)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'fr'
                ? 'L\'achat du KIT Officiel équivaut à l\'acquisition du Pass VIP de la Convention. Chaque KIT attribué possède un Numéro de Série unique (ex: KZI-2026-VIP-A042) qui correspond exactement à votre Siège VIP réservé et fixe au premier rang dans l\'enceinte de la Grande Convention. (Places VIP limitées aux 500 premiers pèlerins).'
                : 'Purchasing the Official KIT is equivalent to reserving a VIP Pass. Each KIT includes a unique Serial Number corresponding exactly to your fixed VIP seat at the convention.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <div className="flex items-center rounded-2xl bg-black/60 p-1.5 border border-white/15">
              {(['USD', 'FC'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedCurrency === curr ? 'bg-[var(--accent-gold)] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {calculateKitTotal() > 0 ? (
              <button
                onClick={() => openCheckout('kit')}
                className="btn-gold py-3.5 px-6 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all animate-bounce"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{lang === 'fr' ? 'Valider le KIT & Siège (' : 'Order Kit & Seat ('}{calculateKitTotal().toLocaleString('fr-FR')} {selectedCurrency})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  updateKitItem('kit-pass-vip', 1);
                  openCheckout('kit');
                }}
                className="btn-gold py-3.5 px-6 rounded-2xl text-xs font-black flex items-center gap-2 shadow-2xl hover:scale-105 transition-all bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 animate-pulse"
              >
                <Award className="w-5 h-5 text-slate-950 shrink-0" />
                <span>
                  {lang === 'fr' 
                    ? `Acheter le Pass VIP (${selectedCurrency === 'USD' ? '25 USD' : '65 000 FC'})` 
                    : `Buy VIP Pass (${selectedCurrency === 'USD' ? '25 USD' : '65,000 FC'})`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. RÉSERVER BUS, BILLET D'AVION & LOGEMENT (ii. Réserver bus, iii. Billet d'avion, iv. Logement) */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#18260b]/90 via-[#101908]/95 to-[#1c140a]/95 border-2 border-[var(--accent-gold)]/50 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Navigation className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Transport & Hébergement Officiels' : 'Official Transport & Lodging'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white mt-1">
              {lang === 'fr' ? 'Réservation : Bus, Vol Aérien & Hébergement à Kolwezi' : 'Reservation: Bus, Flight & Lodging in Kolwezi'}
            </h2>
          </div>

          <div className="flex items-center rounded-2xl bg-black/60 p-1.5 border border-white/15">
            {[
              { id: 'bus', label: '🚌 Réserver Bus', icon: Bus },
              { id: 'flight', label: '✈️ Billet d\'Avion', icon: Plane },
              { id: 'hotel', label: '🏡 Logement', icon: Hotel }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setResType(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    resType === tab.id
                      ? 'bg-[var(--accent-gold)] text-slate-950 shadow-lg scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {bookingSubmitted && bookingRef ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/80 border-2 border-emerald-400 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-xl">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black font-outfit text-white">
                  {lang === 'fr' ? 'Réservation Logistique Confirmée & Payée !' : 'Logistical Booking Confirmed & Paid!'}
                </h3>
                <p className="text-xs text-slate-300">
                  Ref Reçu : <span className="font-mono font-bold text-amber-400">{bookingRef}</span> • Numéro Siège : <strong className="text-emerald-400 font-mono">{bookingSerial}</strong>
                </p>
                <p className="text-xs text-slate-300">
                  Option : <strong>{resType === 'bus' ? (busOption === 'mgj' ? 'Bus officiel MGJ (35 000 FC)' : 'Bus Mulykap Express (50 000 FC)') : resType === 'flight' ? 'Billet d\'Avion & Navette (200$ USD)' : resHotelOption}</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleDownloadReceipt}
                className="btn-gold py-3.5 px-6 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Télécharger Reçu & Voucher' : 'Download Receipt & Voucher'}</span>
              </button>
              <button
                onClick={() => setBookingSubmitted(false)}
                className="py-3.5 px-4 rounded-2xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 w-full sm:w-auto text-center"
              >
                {lang === 'fr' ? 'Autre Réservation' : 'New Booking'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-6 lg:col-span-2">
              
              {/* Option 1: Bus Booking Details (ii. Réserver bus) */}
              {resType === 'bus' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/40 text-sm space-y-2">
                    <span className="text-xs font-black uppercase text-amber-400 block tracking-wider">
                      🚌 Options de Bus (Au départ de Lubumbashi / Villes voisines) :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setBusOption('mgj')}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          busOption === 'mgj'
                            ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-xl scale-[1.02]'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-outfit font-black text-base text-emerald-400">
                          <span>Bus Réservé par MGJ</span>
                          <span>35 000 FC</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Bus officiel de la délégation de l'organisation. Ambiance de prière et d'intercession pendant le trajet.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBusOption('mulykap')}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          busOption === 'mulykap'
                            ? 'bg-amber-950/80 border-amber-400 text-white shadow-xl scale-[1.02]'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-outfit font-black text-base text-amber-400">
                          <span>Bus Mulykap Express</span>
                          <span>50 000 FC</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Bus partenaire VIP climatisé de la compagnie Mulykap Express pour un confort de voyage maximal.
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Option 2: Flight Booking Details (iii. Billet d'avion & navette) */}
              {resType === 'flight' && (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/60 to-black/60 border border-blue-400/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-black text-xs uppercase tracking-wider border border-blue-500/40">
                      ✈️ Vol direct & Navette Aéroportuaire VIP
                    </span>
                    <span className="text-2xl font-black font-outfit text-amber-400">200 $ USD / passager</span>
                  </div>
                  <h4 className="text-lg font-black font-outfit text-white">
                    Billet d'Avion Aller Simple (Lubumbashi ✈ Kolwezi) + Navette incluse
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Réservation du billet d'avion pour rejoindre Kolwezi en moins d'une heure. Une navette climatisée de l'organisation vous attendra directement à l'aéroport de Kolwezi pour vous conduire au site d'accueil de l'Internat Umoja ou à votre hôtel.
                  </p>
                </div>
              )}

              {/* Option 3: Lodging & Housing Details (iv. Logement & Hébergement) */}
              {resType === 'hotel' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/15 space-y-3">
                    <span className="text-xs font-black uppercase text-amber-400 block tracking-wider">
                      🏡 Conditions d'Hébergement & Logement à Kolwezi :
                    </span>
                    <div className="space-y-3 pt-1 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-1">
                        <strong className="text-emerald-300 block font-outfit text-sm">
                          1. Site d'Accueil Officiel : L'Internat Umoja (Réservé par l'organisation MGJ)
                        </strong>
                        <p className="text-slate-300 text-xs">
                          L'Internat Umoja a été réservé par l'organisation pour héberger fraternellement les délégations officiellement inscrites et signalées à temps.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/60 border border-white/15 space-y-1">
                        <strong className="text-amber-400 block font-outfit text-sm">
                          2. Autres Options individuelles (Hôtels, Appartements ou Guest Houses)
                        </strong>
                        <p className="text-slate-300 text-xs">
                          Les réservations d'hôtels VIP 5 Étoiles, d'appartements meublés ou de Guest Houses restent à la charge individuelle et aux frais de chaque participant selon sa bourse.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    {resType === 'hotel' ? 'Choix de votre Logement :' : 'Ville de Départ / Navette :'}
                  </label>
                  {resType === 'hotel' ? (
                    <select
                      value={resHotelOption}
                      onChange={(e) => setResHotelOption(e.target.value)}
                      className="input-field py-3 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                    >
                      <option className="bg-slate-900" value="Site d'accueil officiel : L'Internat Umoja (Réservé par MGJ)">
                        🏡 Site d'accueil officiel : L'Internat Umoja (Réservé par l'organisation MGJ)
                      </option>
                      <option className="bg-slate-900" value="Hôtel VIP 5 Étoiles à Kolwezi (120$/nuit - À charge individuelle)">
                        🏢 Hôtel VIP 5 Étoiles (120$ / nuit - À la charge individuelle)
                      </option>
                      <option className="bg-slate-900" value="Hôtel Standard Confort (65$/nuit - À charge individuelle)">
                        🏢 Hôtel Standard Confort (65$ / nuit - À la charge individuelle)
                      </option>
                      <option className="bg-slate-900" value="Guest House / Appartement meublé (À charge individuelle)">
                        🏢 Guest House / Appartement meublé (À la charge individuelle)
                      </option>
                    </select>
                  ) : (
                    <select
                      value={resDeparture}
                      onChange={(e) => setResDeparture(e.target.value)}
                      className="input-field py-3 text-sm font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                    >
                      <option className="bg-slate-900" value="Lubumbashi (Siège Central - Départ / Navette)">Lubumbashi (Siège Central - Départ / Navette)</option>
                      <option className="bg-slate-900" value="Likasi (Gare Centrale / Espace MGJ)">Likasi (Gare Centrale / Espace MGJ)</option>
                      <option className="bg-slate-900" value="Kipushi (Centre ville)">Kipushi (Centre ville)</option>
                      <option className="bg-slate-900" value="Kasumbalesa (Frontière / Point de rassemblement)">Kasumbalesa (Frontière / Point de rassemblement)</option>
                      <option className="bg-slate-900" value="Kinshasa (Aéroport Ndjili - Vol Affrété)">Kinshasa (Aéroport Ndjili - Vol Affrété)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    {lang === 'fr' ? 'Nombre de Places / Personnes :' : 'Number of Persons / Seats:'}
                  </label>
                  <div className="flex items-center gap-3 bg-black/60 border border-white/20 rounded-2xl p-2 px-4">
                    <button
                      type="button"
                      onClick={() => setResPersons(Math.max(1, resPersons - 1))}
                      className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-outfit font-black text-lg text-amber-400">
                      {resPersons} {lang === 'fr' ? 'place(s)' : 'seat(s)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setResPersons(resPersons + 1)}
                      className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'fr'
                    ? 'Le secrétariat de l\'Administration (+243 99 022 8048) vous contacte immédiatement dès validation pour vous remettre votre billet électronique de bus/avion ou voucher de logement.'
                    : 'The administration office (+243 99 022 8048) will contact you immediately upon validation to deliver your bus/flight ticket or lodging voucher.'}
                </span>
              </div>
            </div>

            {/* Price & Action Panel */}
            <div className="bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-[var(--accent-gold)] space-y-6 flex flex-col justify-between shadow-2xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                  {lang === 'fr' ? 'Validation & Paiement Sécurisé' : 'Validation & Secure Payment'}
                </span>
                <h4 className="text-xl font-black font-outfit text-white">
                  {resType === 'bus' && (busOption === 'mgj' ? 'Bus MGJ (35 000 FC / place)' : 'Bus Mulykap (50 000 FC / place)')}
                  {resType === 'flight' && 'Vol Direct & Navette (200 $ / place)'}
                  {resType === 'hotel' && 'Réservation Logement Kolwezi'}
                </h4>
                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-base font-bold">
                  <span className="text-slate-300">Total à Payer :</span>
                  <span className="text-2xl font-black font-outfit text-amber-400">
                    {resType === 'bus' ? `${(busOption === 'mgj' ? 35000 : 50000) * resPersons} FC` : resType === 'flight' ? `${200 * resPersons} $ USD` : 'Selon Option choisie'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openCheckout('reservation')}
                className="btn-gold w-full py-4 rounded-2xl font-outfit font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl hover:scale-105 transition-transform"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{lang === 'fr' ? 'Payer et Réserver ma Place' : 'Confirm & Pay Booking'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. SPEAKERS / ORATEURS DE LA CONVENTION (vi. Grande Convention Kzi - Contrôlé par Admin) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[var(--accent-gold)]">
              {lang === 'fr' ? 'Onction & Ministère • Orateurs Confirmés' : 'Anointing & Ministry • Confirmed Speakers'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-[var(--text-primary)] mt-1">
              {t('kzi.speakersTitle')}
            </h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-bold bg-[var(--bg-secondary)] px-3.5 py-1.5 rounded-full border border-glass self-start">
            {speakers.length} {lang === 'fr' ? 'orateurs gérés par l\'Administration' : 'speakers controlled by Admin'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="glass-card overflow-hidden rounded-3xl border-glass flex flex-col justify-between group hover:border-[var(--accent-gold)] transition-all bg-[var(--bg-secondary)] shadow-xl">
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={speaker.imageUrl}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-5">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-[var(--accent-gold)] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {lang === 'fr' ? speaker.roleFr : speaker.roleEn}
                      </span>
                      <h3 className="text-xl font-extrabold font-outfit text-white mt-2 leading-tight">
                        {speaker.name}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {lang === 'fr' ? speaker.bioFr : speaker.bioEn}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-0">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-olive)]">
                  <Layers className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Plénières, Ateliers & Prédication' : 'Plenaries, Workshops & Sermon'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DÉROULEMENT & SESSIONS / PROGRAMME DE LA SEMAINE (vi. Grande Convention Kzi - Contrôlé par Admin) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[var(--accent-olive)]">
              {lang === 'fr' ? 'Programme Complet • Du 02 au 09 Août 2026' : 'Full Schedule • August 02 to 09, 2026'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-[var(--text-primary)] mt-1">
              {t('kzi.scheduleTitle')}
            </h2>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto gap-1.5 max-w-full rounded-2xl bg-[var(--bg-primary)] p-1.5 border border-glass self-start sm:self-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((dayNum) => {
              const fullTitle = t(`kzi.day${dayNum}` as any);
              const shortTabName = fullTitle.split(' - ')[0] || fullTitle;
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 ${
                    selectedDay === dayNum
                      ? 'bg-[var(--accent-olive)] text-white shadow-lg scale-[1.02]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  {shortTabName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-[var(--accent-gold)]/40 bg-gradient-to-r from-[var(--accent-olive)]/20 via-black/40 to-transparent flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-lg">
              J{selectedDay}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                {lang === 'fr' ? `Programme Officiel — Jour ${selectedDay} sur 8` : `Official Schedule — Day ${selectedDay} of 8`}
              </span>
              <h3 className="text-lg sm:text-xl font-black font-outfit text-white">
                {t(`kzi.day${selectedDay}` as any)}
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((item) => (
              <div key={item.id} className="glass-card p-5 sm:p-6 rounded-2xl border-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--accent-olive)] transition-all bg-[var(--bg-secondary)]">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-glass shrink-0 text-center">
                    <Clock className="w-5 h-5 text-[var(--accent-gold)] mx-auto mb-1" />
                    <span className="text-xs font-black text-[var(--text-primary)] whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                      {lang === 'fr' ? item.titleFr : item.titleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {lang === 'fr' ? item.descFr : item.descEn}
                    </p>
                  </div>
                </div>

                {item.speakerName && (
                  <div className="px-3.5 py-2 rounded-xl bg-[var(--accent-olive-glow)] border border-glass text-xs font-extrabold text-[var(--accent-olive)] shrink-0 flex items-center gap-2 shadow-sm">
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>{item.speakerName}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-3xl glass-card border border-glass text-slate-400 text-sm font-bold">
              Programme en cours de mise à jour par le secrétariat administratif pour le Jour {selectedDay}.
            </div>
          )}
        </div>
      </div>

      {/* 7. CONTACTS OFFICIELS & COMITÉ D'ORGANISATION */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--accent-gold)]/40 bg-gradient-to-br from-[#1b2f0c]/80 via-[#101908]/90 to-[#0f172a]/95 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Contacts Officiels & Permanence KZI' : 'Official Contacts & KZI Committee'}</span>
            </div>
            <h3 className="text-2xl font-black font-outfit text-white mt-1">
              {lang === 'fr' ? 'Comité d\'Administration et Logistique' : 'Convention Organizers & Committee'}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[var(--accent-gold)] text-slate-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
            Kolwezi 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 hover:border-[var(--accent-gold)] transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                1. Administration & Inscription
              </span>
              <h4 className="text-lg font-black font-outfit text-white">Papa Ghislain KABALE</h4>
              <p className="text-xs text-slate-300 font-medium">Supervision administrative, signalement des arrivées et accueil des délégations.</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300">+243 990 228 048</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243990228048" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all"><Phone className="w-3.5 h-3.5" /></a>
                  <a href="https://wa.me/243990228048" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"><MessageSquare className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 hover:border-[var(--accent-gold)] transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                2. Directeur de la Convention
              </span>
              <h4 className="text-lg font-black font-outfit text-white">Pasteur Jeremie KONGOLO</h4>
              <p className="text-xs text-slate-300 font-medium">Coordination générale, direction spirituelle et supervision du programme apostolique.</p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300">+243 999 793 081</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243999793081" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all"><Phone className="w-3.5 h-3.5" /></a>
                  <a href="https://wa.me/243999793081" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"><MessageSquare className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 hover:border-[var(--accent-gold)] transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
                3. Logistique & Hébergement
              </span>
              <h4 className="text-lg font-black font-outfit text-white">Papa Adellard</h4>
              <p className="text-xs text-slate-300 font-medium">Logistique transport (Bus MGJ, Mulykap, Avion) et affectation hébergement (Internat Umoja).</p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300">+243 997 113 225</span>
                <div className="flex gap-1.5">
                  <a href="tel:+243997113225" className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black transition-all"><Phone className="w-3.5 h-3.5" /></a>
                  <a href="https://wa.me/243997113225" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"><MessageSquare className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border-2 border-[var(--accent-gold)] shadow-2xl relative max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1c2c0d] via-[#15230c] to-[#0f172a]">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)] text-slate-950 flex items-center justify-center font-black shadow-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Paiement Sécurisé Swazi Pay • KZI 2026
                </span>
                <h3 className="text-xl font-black font-outfit text-white">
                  {checkoutTarget === 'kit' ? 'Validation Commande KIT & Pass VIP' : `Paiement ${resType.toUpperCase()} - Kolwezi`}
                </h3>
              </div>
            </div>

            {paySuccessReceipt ? (
              <div className="space-y-6 text-center py-4 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black font-outfit text-white">
                    Paiement Validé avec Succès !
                  </h4>
                  <p className="text-xs font-mono text-amber-400 font-bold">
                    Reçu N° : {paySuccessReceipt} • Siège N° : {bookingSerial || 'KZI-2026-VIP-A042'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left text-xs space-y-2 text-slate-300 font-medium">
                  <p className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Transaction vérifiée en direct • Administration Financière MGJ</span>
                  </p>
                  <p>
                    {checkoutTarget === 'kit'
                      ? `Total Payé : ${calculateKitTotal().toLocaleString('fr-FR')} ${selectedCurrency}. Votre Pass VIP numéroté (Siège N° ${bookingSerial}) est désormais actif dans l'application.`
                      : `Réservation ${resType.toUpperCase()} confirmée pour ${resPersons} personne(s). Voucher et numéro de siège disponibles.`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="btn-gold py-3.5 rounded-2xl font-outfit font-black text-sm flex items-center justify-center gap-2 shadow-xl flex-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Reçu & Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="py-3.5 px-6 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 text-sm"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-6">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between text-sm font-bold text-white">
                  <span>Montant à régler :</span>
                  <span className="text-xl font-black font-outfit text-amber-400">
                    {checkoutTarget === 'kit'
                      ? `${calculateKitTotal().toLocaleString('fr-FR')} ${selectedCurrency}`
                      : `${calculateReservationTotal().toLocaleString('fr-FR')} ${selectedCurrency}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                      payMethod === 'card'
                        ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-amber-300 shadow-lg'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-black">Carte Bancaire / Visa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('mobile')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                      payMethod === 'mobile'
                        ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-amber-300 shadow-lg'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs font-black">Mobile Money (M-Pesa/Orange)</span>
                  </button>
                </div>

                {payMethod === 'card' ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Numéro de Carte</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8841"
                        className="input-field py-3 text-sm font-mono font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08 / 28"
                          className="input-field py-3 text-sm font-mono font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="742"
                          className="input-field py-3 text-sm font-mono font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Opérateur Mobile Money</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['M-Pesa', 'Orange', 'Airtel'] as const).map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setMobileOp(op)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                              mobileOp === op
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                                : 'bg-black/40 text-slate-300 border-white/10 hover:text-white'
                            }`}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Numéro de Téléphone</label>
                      <input
                        type="tel"
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                        placeholder="+243 81 234 5678"
                        className="input-field py-3 text-sm font-mono font-bold bg-black/60 border-white/20 w-full rounded-2xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Code PIN de validation mobile</span>
                      </label>
                      <input
                        type="password"
                        value={mobilePin}
                        onChange={(e) => setMobilePin(e.target.value)}
                        placeholder="••••"
                        maxLength={6}
                        className="input-field py-3 text-sm font-mono font-bold bg-black/60 border-[var(--accent-gold)]/40 text-amber-300 w-full rounded-2xl"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessingPay}
                  className="btn-gold w-full py-4 rounded-2xl font-outfit font-black text-base flex items-center justify-center gap-2 shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isProcessingPay ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                      <span>Validation du paiement...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-slate-950" />
                      <span>Valider & Effectuer le Paiement</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
