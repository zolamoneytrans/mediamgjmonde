import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { 
  HeartHandshake, 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  CheckCircle2, 
  Award, 
  Loader2,
  Sparkles,
  Download,
  Gift,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DonationsPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { createDonationRecord } = useAppData();

  const [selectedType, setSelectedType] = useState<'tithes' | 'offering' | 'kzi' | 'media'>('tithes');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'FC'>('EUR');
  const [paymentMethod, setPaymentMethod] = useState<'Carte Bancaire' | 'Mobile Money' | 'PayPal'>('Carte Bancaire');
  const [phoneOrCardNumber, setPhoneOrCardNumber] = useState(user ? user.phone : '+243 81 234 5678');
  
  const [loading, setLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);

  const presets = [10, 25, 50, 100, 500];

  const handleGivingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmt = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!finalAmt || finalAmt <= 0) return;

    setLoading(true);
    setTimeout(() => {
      createDonationRecord({
        userId: user ? user.uid : 'guest-donor',
        userName: user ? user.fullName : (lang === 'fr' ? 'Fidèle Anonyme' : 'Anonymous Faithful'),
        type: selectedType,
        amount: finalAmt,
        currency,
        paymentMethod
      });
      setLoading(false);
      const generatedRec = `REC-MGJ-${Math.floor(1000 + Math.random() * 9000)}`;
      setReceiptNumber(generatedRec);
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#eab308', '#6b8f2a', '#ff7800', '#34d399']
      });
    }, 1200);
  };

  const handleDownloadDigitalReceipt = () => {
    if (!receiptNumber) return;
    const finalAmt = customAmount ? parseFloat(customAmount) : selectedAmount;
    const element = document.createElement("a");
    const receiptText = `=====================================\n  REÇU D'OFFRANDE & DÎME - MGJ MONDE\n=====================================\nNuméro Reçu : ${receiptNumber}\nDate : ${new Date().toLocaleDateString('fr-FR')}\nDonateur : ${user ? user.fullName : 'Membre MGJ'}\nPoste : ${user ? user.ministryPosition : 'Intercesseur'}\n\nType d'Offrande : ${selectedType.toUpperCase()}\nMontant donné : ${finalAmt} ${currency}\nMode de Paiement : ${paymentMethod}\n\n« Que Dieu vous le rende au centuple selon ses richesses avec gloire ! »\n=====================================`;
    const file = new Blob([receiptText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Recu_Offrande_${receiptNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-slide-up" style={{ animationDuration: '0.3s' }}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-olive mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="text-xs font-black uppercase tracking-wider">{lang === 'fr' ? 'Soutien au Royaume' : 'Kingdom Giving'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-[var(--text-primary)]">
            {t('donations.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1">
            {t('donations.subtitle')}
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center rounded-2xl bg-[var(--bg-primary)] p-1 border border-glass self-start sm:self-center">
          {(['EUR', 'USD', 'FC'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                currency === curr
                  ? 'bg-[var(--accent-olive)] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Success Receipt Modal / Banner */}
      {receiptNumber && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-[var(--bg-card)] to-[var(--bg-secondary)] border border-emerald-500/50 shadow-2xl space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold font-outfit text-[var(--text-primary)]">
                  {lang === 'fr' ? 'Que le Dieu de Joël 2:28 vous bénisse au centuple !' : 'May the God of Joel 2:28 bless you a hundredfold!'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  {lang === 'fr' ? `Votre offrande a été enregistrée. Reçu N° : ${receiptNumber}` : `Your offering has been recorded. Receipt Number: ${receiptNumber}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDownloadDigitalReceipt}
                className="btn-gold py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Télécharger Reçu TXT' : 'Download Receipt'}</span>
              </button>
              <button
                onClick={() => setReceiptNumber(null)}
                className="btn-secondary py-2.5 px-4 text-xs font-bold rounded-xl"
              >
                {lang === 'fr' ? 'Autre Don' : 'New Gift'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Giving Form */}
      <form onSubmit={handleGivingSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left 2 Cols: Category + Amount + Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Giving Category */}
          <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
            <h3 className="text-sm font-extrabold font-outfit uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--accent-olive-glow)] text-[var(--accent-olive)] flex items-center justify-center text-xs">1</span>
              <span>{t('donations.selectType')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: 'tithes', label: t('donations.typeTithes'), desc: lang === 'fr' ? 'Fidélité au 10% biblique' : 'Faithful biblical tithe' },
                { id: 'offering', label: t('donations.typeOffering'), desc: lang === 'fr' ? 'Offrandes & actions de grâces' : 'Offerings & thanksgiving' },
                { id: 'kzi', label: t('donations.typeKzi'), desc: lang === 'fr' ? 'Parrainage Grande Convention Kzi' : 'Sponsorship Kzi Convention' },
                { id: 'media', label: t('donations.typeMedia'), desc: lang === 'fr' ? 'Extension de la diffusion TV & Web' : 'Media TV & Web expansion' }
              ].map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedType === type.id
                      ? 'bg-[var(--accent-olive-glow)] border-[var(--accent-olive)] shadow-md'
                      : 'bg-[var(--bg-primary)] border-glass hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[var(--text-primary)]">{type.label}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedType === type.id ? 'border-[var(--accent-olive)] bg-[var(--accent-olive)]' : 'border-glass'}`}>
                      {selectedType === type.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] mt-1 block">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Amount Selection */}
          <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
            <h3 className="text-sm font-extrabold font-outfit uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--accent-gold-glow)] text-[var(--accent-gold)] flex items-center justify-center text-xs">2</span>
              <span>{lang === 'fr' ? 'Montant de l\'Offrande' : 'Offering Amount'} ({currency})</span>
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {presets.map((amt) => {
                const displayAmt = currency === 'FC' ? amt * 2500 : amt;
                return (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => { setSelectedAmount(displayAmt); setCustomAmount(''); }}
                    className={`py-3 px-3 rounded-2xl font-black font-outfit text-sm transition-all ${
                      selectedAmount === displayAmt && !customAmount
                        ? 'bg-gradient-to-tr from-[var(--accent-gold)] to-amber-600 text-white shadow-lg scale-105'
                        : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-glass hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {displayAmt.toLocaleString('fr-FR')} {currency}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                {t('donations.customAmount')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Ex: 150"
                  className="input-field py-2.5 pl-4 pr-12 text-sm font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[var(--accent-gold)]">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="glass-card p-6 rounded-3xl bg-[var(--bg-secondary)] border border-glass space-y-4">
            <h3 className="text-sm font-extrabold font-outfit uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--accent-orange-glow)] text-[var(--accent-orange)] flex items-center justify-center text-xs">3</span>
              <span>{t('donations.paymentMethod')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Carte Bancaire', label: 'Carte Bancaire', sub: 'Visa / Mastercard', icon: CreditCard },
                { id: 'Mobile Money', label: 'Mobile Money', sub: 'M-Pesa / Orange / Airtel', icon: Smartphone },
                { id: 'PayPal', label: 'PayPal Express', sub: 'Paiement en ligne', icon: DollarSign }
              ].map((pm) => {
                const Icon = pm.icon;
                return (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === pm.id
                        ? 'bg-[var(--accent-orange-glow)] border-[var(--accent-orange)] shadow-md text-white'
                        : 'bg-[var(--bg-primary)] border-glass hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${paymentMethod === pm.id ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`} />
                    <span className="text-xs font-extrabold text-[var(--text-primary)]">{pm.label}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{pm.sub}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                {paymentMethod === 'Mobile Money'
                  ? (lang === 'fr' ? 'Numéro de Mobile Money (M-Pesa / Orange / Airtel)' : 'Mobile Money Number')
                  : (lang === 'fr' ? 'Numéro de carte ou téléphone de confirmation' : 'Card number or confirmation phone')}
              </label>
              <input
                type="text"
                value={phoneOrCardNumber}
                onChange={(e) => setPhoneOrCardNumber(e.target.value)}
                placeholder="+243 81 234 5678"
                className="input-field py-2.5 text-sm font-semibold"
                required
              />
            </div>
          </div>

        </div>

        {/* Right 1 Col: Summary Card */}
        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-tertiary)] border-[var(--accent-olive)]/40 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-glass pb-4">
            <Gift className="w-6 h-6 text-[var(--accent-gold)]" />
            <h3 className="font-outfit font-black text-lg text-[var(--text-primary)]">
              {lang === 'fr' ? 'Récapitulatif de l\'Offrande' : 'Offering Summary'}
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-glass/40">
              <span className="text-[var(--text-secondary)]">{lang === 'fr' ? 'Donateur :' : 'Donor:'}</span>
              <span className="font-bold text-[var(--text-primary)]">
                {user ? user.fullName : (lang === 'fr' ? 'Membre Anonyme' : 'Anonymous Member')}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-glass/40">
              <span className="text-[var(--text-secondary)]">{lang === 'fr' ? 'Catégorie :' : 'Category:'}</span>
              <span className="font-bold text-[var(--accent-olive)] uppercase">
                {selectedType}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-glass/40">
              <span className="text-[var(--text-secondary)]">{lang === 'fr' ? 'Mode Paiement :' : 'Payment:'}</span>
              <span className="font-bold text-[var(--text-primary)]">
                {paymentMethod}
              </span>
            </div>

            <div className="flex justify-between pt-3 text-lg font-black font-outfit">
              <span>Total :</span>
              <span className="text-[var(--accent-gold)]">
                {customAmount ? parseFloat(customAmount).toLocaleString('fr-FR') : selectedAmount.toLocaleString('fr-FR')} {currency}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              {lang === 'fr'
                ? 'Transaction 100% sécurisée et cryptée. Reçu instantané délivré pour chaque offrande.'
                : '100% secure and encrypted transaction. Instant digital receipt provided.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-2xl font-outfit font-black text-base shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{lang === 'fr' ? 'Envoi de l\'offrande en cours...' : 'Processing offering...'}</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-5 h-5" />
                <span>{t('donations.giveNowBtn')}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
