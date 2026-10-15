import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  Star, 
  MapPin, 
  Store, 
  MessageCircle, 
  MessageSquare,
  ShoppingBag, 
  ShoppingCart,
  Zap,
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronLeft,
  Share2,
  Heart,
  ExternalLink,
  Plus,
  Minus
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

  const isFavorite = savedFavorites.includes(product.id);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      user: 'Warga / Pembeli Anda',
      rating: reviewRating,
      date: 'Hari ini',
      comment: reviewComment,
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
    alert('Terima kasih! Ulasan Anda telah berhasil ditambahkan.');
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
      alert('Tautan produk disalin ke clipboard!');
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      
      <div className="flex items-center gap-2 text-xs text-desa-text/60">
        <button 
          onClick={() => setWebPage('home')} 
          className="hover:text-desa-accent transition-colors"
        >
          Beranda
        </button>
        <span>/</span>
        <button 
          onClick={() => setWebPage('catalog')} 
          className="hover:text-desa-accent transition-colors"
        >
          Katalog
        </button>
        <span>/</span>
        <span className="text-desa-primary font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        
        <div className="lg:col-span-6 space-y-4">
          
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-desa-primary/20 shadow-md">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#3A3A38_0px,#3A3A38_2px,transparent_2px,transparent_7px)] opacity-60" />

            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-desa-primary hover:text-rose-600 transition-colors shadow"
              aria-label="Simpan ke favorit"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx 
                      ? 'border-desa-accent scale-105 shadow' 
                      : 'border-desa-primary/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          
          <div className="grid grid-cols-3 gap-3 p-4 bg-white/60 rounded-xl border border-desa-primary/10 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-desa-highlight shrink-0" />
              <span className="text-[11px] text-desa-text/80">Jaminan Asli Desa</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-desa-accent shrink-0" />
              <span className="text-[11px] text-desa-text/80">Kirim Seluruh RI</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-desa-primary shrink-0" />
              <span className="text-[11px] text-desa-text/80">Garansi Kualitas</span>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-6 space-y-6">
          
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-desa-accent bg-desa-accent/10 px-2.5 py-0.5 rounded-full">
                {product.categoryName}
              </span>
              <span className="text-xs text-desa-text/50">•</span>
              <span className="text-xs text-desa-text/70">{product.kecamatan}</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary leading-snug">
              {product.name}
            </h1>

            
            <div className="flex items-center gap-3 text-xs mt-3">
              <div className="flex items-center text-amber-500 font-semibold gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-desa-text/30">•</span>
              <span className="text-desa-text/70">{reviewsList.length} Ulasan</span>
              <span className="text-desa-text/30">•</span>
              <span className="text-desa-text/70">{product.sold} Terjual</span>
            </div>
          </div>

          
          <div className="p-5 rounded-2xl bg-white border border-desa-primary/15 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-desa-primary">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-desa-text/40 line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
              )}
            </div>
            <div className="text-xs text-desa-highlight font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-desa-highlight" />
              <span>Stok tersedia: {product.stock} unit</span>
            </div>
          </div>

          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-desa-primary">
                Jumlah:
              </span>
              <div className="flex items-center border border-desa-primary/30 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 text-desa-primary hover:bg-desa-bg rounded-l-xl transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-desa-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-2 text-desa-primary hover:bg-desa-bg rounded-r-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-desa-text/60">
                Total: <strong>Rp {(product.price * quantity).toLocaleString('id-ID')}</strong>
              </span>
            </div>

            <div>
              <input
                type="text"
                placeholder="Tambahkan catatan khusus untuk penjual (mis. warna/ukuran/kemasan)..."
                value={buyerNote}
                onChange={(e) => setBuyerNote(e.target.value)}
                className="w-full text-xs p-3 bg-white rounded-xl border border-desa-primary/20 focus:outline-none focus:border-desa-primary"
              />
            </div>
          </div>

          
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                onClick={() => addToCart(product, quantity, buyerNote)}
                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-desa-primary bg-white hover:bg-desa-bg text-desa-primary font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingCart className="w-5 h-5 text-desa-accent group-hover:scale-110 transition-transform" />
                <span>+ Tambah ke Keranjang</span>
              </button>

              <button
                onClick={() => openDirectCheckout(product, quantity, buyerNote)}
                className="flex-1 py-3.5 px-6 rounded-xl bg-desa-accent hover:bg-desa-accent/90 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Beli Sekarang / Checkout</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl border border-desa-primary/20 bg-white hover:bg-desa-bg text-desa-primary transition-all flex items-center justify-center shrink-0"
                title="Bagikan Tautan Produk"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            
            <button
              onClick={() => openChatWithShop(product.shopId, product)}
              className="w-full py-3 px-4 rounded-xl bg-desa-primary/5 hover:bg-desa-primary/10 border border-desa-primary/15 text-desa-primary text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-desa-accent" />
              <span>Tanya Ketersediaan Stok atau Komplain ke Admin {shop.name}</span>
            </button>
          </div>

          
          <div className="p-5 rounded-2xl bg-white border border-desa-primary/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={shop.avatar}
                alt={shop.owner}
                className="w-14 h-14 rounded-xl object-cover border border-desa-primary/10"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-sm text-desa-primary">
                    {shop.name}
                  </h4>
                  {shop.verified && (
                    <span className="text-[10px] bg-desa-highlight/15 text-desa-highlight font-bold px-1.5 py-0.2 rounded">
                      Resmi
                    </span>
                  )}
                </div>
                <p className="text-xs text-desa-text/60 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-desa-accent" />
                  <span>{shop.kecamatan}</span>
                </p>
                <div className="flex items-center gap-2 text-[11px] text-desa-text/70 mt-1">
                  <div className="flex items-center text-amber-600 font-semibold gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{shop.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{shop.reviewCount} ulasan toko</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openChatWithShop(shop.id, product)}
                className="px-3.5 py-2 rounded-xl bg-desa-primary/10 hover:bg-desa-primary/20 text-desa-primary text-xs font-semibold transition-all flex items-center gap-1"
                title="Chat Toko"
              >
                <MessageSquare className="w-3.5 h-3.5 text-desa-accent" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => viewShop(shop.id)}
                className="px-4 py-2 rounded-xl border border-desa-primary/30 text-desa-primary hover:bg-desa-primary hover:text-desa-light text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>Lihat Toko</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          
          <div className="space-y-3 pt-2">
            <h3 className="font-heading font-bold text-base text-desa-primary border-b border-desa-primary/15 pb-2">
              Deskripsi Produk
            </h3>
            <p className="text-sm text-desa-text/80 leading-relaxed whitespace-pre-line font-light">
              {product.description}
            </p>

            
            {product.specifications && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-desa-primary/15">
                <table className="w-full min-w-[24rem] text-xs">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-desa-bg/40' : 'bg-white'}>
                        <td className="py-2.5 px-4 font-semibold text-desa-primary/70 w-1/3 border-b border-desa-primary/10">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-desa-primary border-b border-desa-primary/10">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>

      
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-desa-primary/15 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-desa-primary/15 pb-4">
          <div>
            <h3 className="font-heading font-bold text-xl text-desa-primary">
              Ulasan Pembeli ({reviewsList.length})
            </h3>
            <p className="text-xs text-desa-text/70">
              Ulasan dan rating ini adalah data simulasi untuk pratinjau.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-3xl font-bold text-desa-primary">
              {product.rating.toFixed(1)}
            </span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        
        <form onSubmit={handleAddReview} className="bg-desa-bg/50 p-4 rounded-xl border border-desa-primary/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-desa-primary">Tulis Ulasan Anda:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform"
                > 
                  <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows="2"
            placeholder="Bagikan kesan Anda terhadap kualitas bahan, rasa, atau kecepatan kirim..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full p-3 rounded-lg bg-white border border-desa-primary/20 text-xs focus:outline-none focus:border-desa-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-primary/90 transition-all"
          >
            Kirim Ulasan
          </button>
        </form>

        
        <div className="space-y-4 divide-y divide-desa-primary/10">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-desa-primary">{rev.user}</span>
                <span className="text-desa-text/50">{rev.date}</span>
              </div>
              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-desa-text/80 leading-relaxed font-light">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>

      
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-desa-primary">
              Produk Lain dari {shop.name}
            </h3>
            <button
              onClick={() => viewShop(shop.id)}
              className="text-xs font-semibold text-desa-accent hover:underline flex items-center gap-1"
            >
              <span>Katalog Lengkap Toko</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

