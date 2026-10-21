import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import { 
  Star, 
  MapPin, 
  ShoppingBag, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Share2,
  Heart,
  ExternalLink,
  Plus,
  Minus,
  MessageSquare,
  Check
} from 'lucide-react';

export default function ProductDetailPage() {
  const { 
    products, 
    shops, 
    selectedProductId, 
    viewShop, 
    addToCart,
    openDirectCheckout,
    openChatWithShop,
    setWebPage,
    savedFavorites,
    toggleFavorite 
  } = useApp();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const shop = shops.find(s => s.id === product.shopId) || shops[0];
  const relatedProducts = products.filter(p => p.shopId === product.shopId && p.id !== product.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buyerNote, setBuyerNote] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorite = savedFavorites.includes(product.id);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      user: 'Warga / Pembeli Terverifikasi',
      rating: reviewRating,
      date: 'Hari ini',
      comment: reviewComment,
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, buyerNote);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Lihat ${product.name} di Pasar Desa!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan produk berhasil disalin!');
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-desa-muted">
        <button 
          onClick={() => setWebPage('home')} 
          className="hover:text-desa-accent transition-colors"
        >
          Beranda
        </button>
        <span className="text-desa-border">/</span>
        <button 
          onClick={() => setWebPage('catalog')} 
          className="hover:text-desa-accent transition-colors"
        >
          Katalog
        </button>
        <span className="text-desa-border">/</span>
        <span className="text-desa-primary font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Sticky Column: Gallery & Guarantees */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-desa-border shadow-xs">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                initial={{ opacity: 0.6, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.22 }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-desa-muted hover:text-rose-600 transition-colors shadow-xs"
              aria-label="Simpan ke favorit"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </motion.button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-18 h-18 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx 
                      ? 'border-desa-accent shadow-xs scale-102' 
                      : 'border-desa-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Trust Value Propositions */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-desa-border text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-desa-highlight shrink-0" />
              <span className="text-[11px] text-desa-muted">Jaminan Karya Asli</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-desa-accent shrink-0" />
              <span className="text-[11px] text-desa-muted">Kirim Seluruh RI</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-desa-primary shrink-0" />
              <span className="text-[11px] text-desa-muted">Garansi Kualitas</span>
            </div>
          </div>

          {/* Technical Specifications */}
          {product.specifications && (
            <div className="p-4 bg-white rounded-xl border border-desa-border space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-desa-muted">
                Spesifikasi Teknis Produk
              </h4>
              <div className="divide-y divide-desa-border text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="py-2 flex justify-between items-center">
                    <span className="text-desa-muted">{spec.label}</span>
                    <span className="font-medium text-desa-primary text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Title, Pricing, Actions & Story */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-desa-accent">
                {product.categoryName}
              </span>
              <span className="text-desa-border">•</span>
              <span className="text-desa-muted">{product.kecamatan}</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs mt-3 text-desa-muted">
              <div className="flex items-center text-amber-600 font-semibold gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-desa-border">•</span>
              <span>{reviewsList.length} Ulasan</span>
              <span className="text-desa-border">•</span>
              <span>{product.sold} Terjual</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-xl bg-white border border-desa-border space-y-1.5">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-desa-primary">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-desa-subtle line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            <div className="text-xs text-desa-highlight font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-desa-highlight" />
              <span>Stok tersisa: {product.stock} unit (Binaan BUMDes)</span>
            </div>
          </div>

          {/* Quantity & Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-desa-muted">
                Jumlah Pesanan:
              </span>
              <div className="flex items-center border border-desa-border rounded-lg bg-white">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 text-desa-primary hover:bg-desa-bg rounded-l-lg transition-colors"
                  aria-label="Kurangi kuantitas"
                >
                  <Minus className="w-3.5 h-3.5" />
                </motion.button>
                <span className="px-4 text-xs font-bold text-desa-primary">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-2 text-desa-primary hover:bg-desa-bg rounded-r-lg transition-colors"
                  aria-label="Tambah kuantitas"
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              <span className="text-xs text-desa-muted">
                Subtotal: <strong className="text-desa-primary">Rp {(product.price * quantity).toLocaleString('id-ID')}</strong>
              </span>
            </div>

            <div>
              <input
                type="text"
                placeholder="Catatan pesanan (ukuran, warna, instruksi kemasan pengiriman)..."
                value={buyerNote}
                onChange={(e) => setBuyerNote(e.target.value)}
                className="w-full text-xs p-3 bg-white rounded-lg border border-desa-border focus:outline-none focus:border-desa-primary"
              />
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-stretch gap-3 pt-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs ${
                justAdded 
                  ? 'bg-desa-highlight text-white border-desa-highlight'
                  : 'border-desa-border bg-white text-desa-primary hover:bg-desa-bg'
              }`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span 
                    key="added" 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Berhasil Ditambahkan!</span>
                  </motion.span>
                ) : (
                  <motion.span 
                    key="add" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-desa-accent" />
                    <span>+ Tambah Keranjang</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openDirectCheckout(product, quantity, buyerNote)}
              className="flex-1 py-3 px-4 rounded-lg bg-desa-accent hover:bg-desa-accent/90 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Beli Sekarang</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-3 rounded-lg border border-desa-border bg-white text-desa-muted hover:text-desa-primary hover:bg-desa-bg transition-colors flex items-center justify-center shrink-0"
              title="Bagikan Tautan Produk"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Shop Card */}
          <div className="p-4 rounded-xl bg-white border border-desa-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={shop.avatar}
                alt={shop.owner}
                className="w-12 h-12 rounded-lg object-cover border border-desa-border"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-sm text-desa-primary">
                    {shop.name}
                  </h4>
                  {shop.verified && (
                    <span className="text-[10px] bg-desa-highlight/10 text-desa-highlight font-semibold px-1.5 py-0.2 rounded">
                      Resmi
                    </span>
                  )}
                </div>
                <p className="text-xs text-desa-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-desa-accent" />
                  <span>{shop.kecamatan}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => openChatWithShop(shop.id, product)}
                className="px-3 py-1.5 rounded-lg border border-desa-border text-desa-primary text-xs font-medium hover:bg-desa-bg transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-desa-accent" />
                <span>Chat Toko</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => viewShop(shop.id)}
                className="px-3 py-1.5 rounded-lg bg-desa-primary text-white text-xs font-medium hover:bg-desa-primary/90 transition-colors flex items-center gap-1"
              >
                <span>Kunjungi</span>
                <ExternalLink className="w-3 h-3" />
              </motion.button>
            </div>
          </div>

          {/* Product Story & Description */}
          <div className="space-y-3 pt-2">
            <h3 className="font-heading font-bold text-base text-desa-primary border-b border-desa-border pb-2">
              Tentang Produk & Filosofi Bahan
            </h3>
            <p className="text-sm text-desa-muted leading-relaxed whitespace-pre-line font-normal">
              {product.description}
            </p>
          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <section className="bg-white rounded-xl p-6 sm:p-8 border border-desa-border space-y-6">
        <div className="flex items-center justify-between border-b border-desa-border pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-desa-primary">
              Ulasan Pembeli ({reviewsList.length})
            </h3>
            <p className="text-xs text-desa-muted">
              Ulasan otentik dari warga dan penikmat produk lokal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-desa-primary">
              {product.rating.toFixed(1)}
            </span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-desa-bg/50 p-4 rounded-xl border border-desa-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-desa-primary">Tulis Ulasan Anda:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1"
                > 
                  <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </motion.button>
              ))}
            </div>
          </div>
          <textarea
            rows="2"
            placeholder="Bagikan kesan Anda tentang kualitas bahan, kemasan, atau pelayanan UMKM..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full p-3 rounded-lg bg-white border border-desa-border text-xs focus:outline-none focus:border-desa-primary"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 rounded-lg bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors"
          >
            Kirim Ulasan
          </motion.button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4 divide-y divide-desa-border">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-desa-primary">{rev.user}</span>
                <span className="text-desa-subtle">{rev.date}</span>
              </div>
              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-desa-muted leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-desa-border pb-2">
            <h3 className="font-heading font-bold text-lg text-desa-primary">
              Karya Lain dari {shop.name}
            </h3>
            <button
              onClick={() => viewShop(shop.id)}
              className="text-xs font-semibold text-desa-accent hover:underline flex items-center gap-1"
            >
              <span>Katalog Lengkap Toko</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
