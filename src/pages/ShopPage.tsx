import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Filter, 
  Tag, 
  DollarSign, 
  Loader2,
  BookOpen,
  Shirt,
  Disc
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShopPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { shopItems, cart, addCartItem, removeCartItem, updateCartQuantity, clearCart, createOrder } = useAppData();

  const [activeCategory, setActiveCategory] = useState<'all' | 'books' | 'apparel' | 'media'>('all');
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'FC'>('EUR');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Delivery simulation fields
  const [deliveryAddress, setDeliveryAddress] = useState('Kinshasa / Gombe - Sanctuaire Central');
  const [deliveryPhone, setDeliveryPhone] = useState(user ? user.phone : '+243 81 000 0000');

  const filteredItems = activeCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === activeCategory);

  const formatPrice = (item: { priceEur: number; priceUsd: number; priceFc: number }) => {
    if (currency === 'EUR') return `${item.priceEur.toFixed(2)} €`;
    if (currency === 'USD') return `${item.priceUsd.toFixed(2)} $`;
    return `${item.priceFc.toLocaleString('fr-FR')} FC`;
  };

  const getCartTotal = () => {
    const totalEur = cart.reduce((acc, item) => acc + (item.product.priceEur * item.quantity), 0);
    const totalUsd = cart.reduce((acc, item) => acc + (item.product.priceUsd * item.quantity), 0);
    const totalFc = cart.reduce((acc, item) => acc + (item.product.priceFc * item.quantity), 0);
    if (currency === 'EUR') return `${totalEur.toFixed(2)} €`;
    if (currency === 'USD') return `${totalUsd.toFixed(2)} $`;
    return `${totalFc.toLocaleString('fr-FR')} FC`;
  };

  const handleAddToCart = (product: any) => {
    addCartItem(product);
    setIsCartOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const order = await createOrder(
        user ? user.email : 'commande.invite@mediamgj.org',
        user ? user.fullName : 'Membre MGJ'
      );
      setIsCheckingOut(false);
      setCheckoutSuccess(order.id);
      setIsCartOpen(false);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#eab308', '#6b8f2a', '#ff7800']
      });
    } catch (err) {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-slide-up relative" style={{ animationDuration: '0.3s' }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-gold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-xs font-black uppercase tracking-wider">{lang === 'fr' ? 'Boutique Officielle' : 'Official Bookstore'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-[var(--text-primary)]">
            {t('shop.title')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1">
            {t('shop.subtitle')}
          </p>
        </div>

        {/* Currency Switch & Cart Button */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center rounded-2xl bg-[var(--bg-primary)] p-1 border border-glass">
            {(['EUR', 'USD', 'FC'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  currency === curr
                    ? 'bg-[var(--accent-gold)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-gold py-2.5 px-4 rounded-2xl flex items-center gap-2 shadow-lg relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">{t('shop.cartTitle')}</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center animate-pulse">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Checkout Success Banner */}
      {checkoutSuccess && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-[var(--bg-secondary)] border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                {lang === 'fr' ? 'Félicitations ! Votre commande est validée.' : 'Congratulations! Your order is confirmed.'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                {lang === 'fr' ? `Numéro de suivi : ${checkoutSuccess}. Un e-mail de confirmation et de reçu vous a été transmis.` : `Tracking Number: ${checkoutSuccess}. A confirmation and receipt email has been sent.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCheckoutSuccess(null)}
            className="btn-secondary py-2 px-4 text-xs font-bold rounded-xl shrink-0"
          >
            {lang === 'fr' ? 'Continuer mes achats' : 'Continue Shopping'}
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          {t('shop.filterAll')}
        </button>
        <button
          onClick={() => setActiveCategory('books')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'books'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('shop.filterBooks')}</span>
        </button>
        <button
          onClick={() => setActiveCategory('apparel')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'apparel'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>{t('shop.filterApparel')}</span>
        </button>
        <button
          onClick={() => setActiveCategory('media')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeCategory === 'media'
              ? 'bg-[var(--accent-olive)] text-white shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-glass hover:text-[var(--text-primary)]'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>{t('shop.filterMedia')}</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden rounded-3xl border-glass flex flex-col justify-between group hover:border-[var(--accent-gold)] transition-all">
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-[var(--bg-tertiary)]">
                <img
                  src={item.imageUrl}
                  alt={lang === 'fr' ? item.titleFr : item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-black shadow-md border border-white/10">
                    {formatPrice(item)}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold uppercase tracking-wider">
                    {lang === 'fr' ? 'En Stock' : 'In Stock'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-outfit font-extrabold text-base sm:text-lg text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-gold)] transition-colors">
                  {lang === 'fr' ? item.titleFr : item.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {lang === 'fr' ? item.descFr : item.descEn}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 mt-auto">
              <button
                onClick={() => handleAddToCart(item)}
                className="btn-primary w-full py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[var(--accent-gold)] group-hover:to-amber-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('shop.addToCart')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Cart & Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-slide-up" style={{ animationDuration: '0.2s' }}>
          <div className="glass-panel w-full max-w-md h-full flex flex-col justify-between bg-[var(--bg-secondary)] border-l border-glass shadow-2xl overflow-hidden p-6 relative">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-glass">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-6 h-6 text-[var(--accent-gold)]" />
                  <h3 className="text-xl font-bold font-outfit text-[var(--text-primary)]">
                    {t('shop.cartTitle')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
                    {t('shop.emptyCart')}
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-glass flex items-center justify-between gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={lang === 'fr' ? item.product.titleFr : item.product.titleEn}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 overflow-hidden space-y-1">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {lang === 'fr' ? item.product.titleFr : item.product.titleEn}
                        </h4>
                        <span className="text-xs font-black text-[var(--accent-gold)] block">
                          {formatPrice(item.product)}
                        </span>
                      </div>

                      {/* Qty Selector */}
                      <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-glass shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[var(--text-primary)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeCartItem(item.product.id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Footer & Checkout Simulation Form */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckoutSubmit} className="pt-4 border-t border-glass space-y-4">
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-secondary)] mb-1">
                      {lang === 'fr' ? 'Adresse de Livraison / Sanctuaire MGJ' : 'Delivery Address / MGJ Sanctuary'}
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field py-2 text-xs rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-secondary)] mb-1">
                      {lang === 'fr' ? 'Téléphone du Réceptionniste' : 'Recipient Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                      className="input-field py-2 text-xs rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-glass">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">
                    {t('shop.total')}
                  </span>
                  <span className="text-lg font-black font-outfit text-[var(--accent-gold)]">
                    {getCartTotal()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="btn-gold w-full py-3.5 rounded-2xl text-sm font-bold font-outfit shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{lang === 'fr' ? 'Enregistrement de la commande...' : 'Processing order...'}</span>
                    </>
                  ) : (
                    <span>{t('shop.checkoutBtn')}</span>
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
