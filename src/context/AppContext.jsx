import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  PRODUCTS as INITIAL_PRODUCTS, 
  SHOPS as INITIAL_SHOPS, 
  CATEGORIES as INITIAL_CATEGORIES, 
  MOCK_ORDERS as INITIAL_ORDERS,
  MOCK_ANNOUNCEMENTS as INITIAL_ANNOUNCEMENTS,
  MOCK_USERS as INITIAL_USERS,
  INITIAL_USER_ADDRESSES,
  INITIAL_CHAT_THREADS,
  VILLAGE_STATS
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & View Mode: 'web', 'mobile', 'admin'
  const [currentView, setCurrentView] = useState('web');
  
  // Web Pages: 'home', 'catalog', 'product-detail', 'shop-detail', 'auth', 'about'
  const [webPage, setWebPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('prod-1');
  const [selectedShopId, setSelectedShopId] = useState('toko-1');
  
  // Shared state for products, shops, etc.
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [stats, setStats] = useState(VILLAGE_STATS);

  // Search & Catalog filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedDusun, setSelectedDusun] = useState('Semua Dusun');
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [sortBy, setSortBy] = useState('terbaru');

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-1',
    name: 'Ibu Sumarsih',
    phone: '081234567890',
    email: 'sumarsih@pasardesa.id',
    role: 'keduanya', // 'pembeli', 'penjual', 'keduanya', 'admin'
    shopId: 'toko-1',
    shopName: 'Griya Tenun Lurik Lestari',
    dusun: 'Dusun Krajan (Pusat)'
  });

  // Mobile PWA State
  const [mobileRole, setMobileRole] = useState('pembeli');
  const [mobileTab, setMobileTab] = useState('beranda');
  const [showMobileSplash, setShowMobileSplash] = useState(false);
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState(['prod-1', 'prod-2']);
  const [pushNotification, setPushNotification] = useState(null);

  // ==========================================
  // FITUR 1: KERANJANG BELANJA & CHECKOUT
  // ==========================================
  const [cart, setCart] = useState([
    {
      id: 'cart-1',
      productId: 'prod-1',
      product: INITIAL_PRODUCTS[0],
      qty: 1,
      note: 'Ukuran standar kemeja pria'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDirectItem, setCheckoutDirectItem] = useState(null);

  const addToCart = (product, qty = 1, note = '') => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        if (note) updated[existingIndex].note = note;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}`,
            productId: product.id,
            product,
            qty,
            note
          }
        ];
      }
    });
    triggerNotification('Keranjang Diperbarui', `"${product.name}" (${qty} item) berhasil ditambahkan ke keranjang.`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    triggerNotification('Item Dihapus', 'Produk telah dikeluarkan dari keranjang belanja.');
  };

  const updateCartQty = (productId, deltaOrQty, isDirectValue = false) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = isDirectValue ? deltaOrQty : item.qty + deltaOrQty;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  // Buka checkout langsung untuk 1 produk (Beli Sekarang)
  const openDirectCheckout = (product, qty = 1, note = '') => {
    setCheckoutDirectItem({
      productId: product.id,
      product,
      qty,
      note
    });
    setIsCheckoutOpen(true);
  };

  // Buka checkout untuk semua barang di keranjang
  const openCartCheckout = () => {
    if (cart.length === 0) {
      triggerNotification('Keranjang Kosong', 'Silakan pilih dan masukkan produk ke keranjang terlebih dahulu.');
      return;
    }
    setCheckoutDirectItem(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Eksekusi checkout dan buat pesanan resmi
  const processCheckout = ({ items, address, shippingMethod, paymentMethod, notes = '' }) => {
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const shippingCost = shippingMethod?.price || 0;
    const grandTotal = subtotal + shippingCost;

    const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      productName: items.length === 1 ? items[0].product.name : `${items[0].product.name} (+${items.length - 1} produk lainnya)`,
      buyerName: address?.receiverName || currentUser?.name || 'Warga Desa',
      phone: address?.phone || currentUser?.phone || '08123456789',
      date: 'Hari ini',
      total: grandTotal,
      qty: totalItems,
      status: 'diproses',
      shopName: items[0].product.shopName,
      dusun: address?.dusun || items[0].product.dusun,
      address: `${address?.fullAddress || 'Alamat Dusun'} (${address?.notes || 'Patokan Rumah'})`,
      items,
      shippingMethod: shippingMethod?.name || 'Kurir Kilat Desa',
      paymentMethod: paymentMethod?.name || 'Bayar di Tempat (COD)',
      notes
    };

    setOrders(prev => [newOrder, ...prev]);

    // Jika checkout dari keranjang umum, bersihkan item yang dibeli
    if (!checkoutDirectItem) {
      clearCart();
    }

    shootConfetti();
    triggerNotification('Pesanan Berhasil Dibuat', `Pesanan #${orderId} telah masuk ke sistem dan diteruskan ke penjual.`);
    setIsCheckoutOpen(false);
    setCheckoutDirectItem(null);

    return orderId;
  };

  // ==========================================
  // FITUR 2: ALAMAT PENGGUNA & GOOGLE MAPS
  // ==========================================
  const [addresses, setAddresses] = useState(INITIAL_USER_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_USER_ADDRESSES[0]?.id || null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const saveAddress = (addrData) => {
    if (addrData.id) {
      // Update existing
      setAddresses(prev => prev.map(a => a.id === addrData.id ? { ...addrData } : a));
      triggerNotification('Alamat Diperbarui', `Alamat "${addrData.label}" berhasil disimpan.`);
    } else {
      // Add new
      const newAddr = {
        ...addrData,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0 ? true : !!addrData.isDefault
      };
      if (newAddr.isDefault) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddr));
      } else {
        setAddresses(prev => [...prev, newAddr]);
      }
      setSelectedAddressId(newAddr.id);
      triggerNotification('Alamat Ditambahkan', `Alamat baru "${newAddr.label}" siap digunakan.`);
    }
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const deleteAddress = (addrId) => {
    if (addresses.length <= 1) {
      triggerNotification('Perhatian', 'Minimal harus ada 1 alamat tersimpan.');
      return;
    }
    setAddresses(prev => prev.filter(a => a.id !== addrId));
    if (selectedAddressId === addrId) {
      const remaining = addresses.filter(a => a.id !== addrId);
      setSelectedAddressId(remaining[0]?.id || null);
    }
    triggerNotification('Alamat Dihapus', 'Alamat telah dihapus dari daftar pengiriman Anda.');
  };

  const setDefaultAddress = (addrId) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addrId })));
    setSelectedAddressId(addrId);
    triggerNotification('Alamat Utama', 'Alamat utama pengiriman berhasil diperbarui.');
  };

  // ==========================================
  // FITUR 3: CHATBOX (CHATBOT & ADMIN TOKO KATALOG)
  // ==========================================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatShopId, setActiveChatShopId] = useState('general-bot'); // 'general-bot' or shopId like 'toko-1'
  const [chatContextProduct, setChatContextProduct] = useState(null);
  const [chatThreads, setChatThreads] = useState(INITIAL_CHAT_THREADS);
  const [isConnectingSeller, setIsConnectingSeller] = useState(false);

  // Buka chatbox langsung terhubung ke toko & konteks produk spesifik
  const openChatWithShop = (shopId, product = null) => {
    setActiveChatShopId(shopId);
    if (product) {
      setChatContextProduct(product);
    } else if (shopId !== 'general-bot') {
      const shopProducts = products.filter(p => p.shopId === shopId);
      setChatContextProduct(shopProducts[0] || null);
    }
    setIsChatOpen(true);

    // Pastikan thread toko tersedia
    setChatThreads(prev => {
      if (!prev[shopId]) {
        const targetShop = shops.find(s => s.id === shopId) || { name: 'Penjual UMKM' };
        return {
          ...prev,
          [shopId]: [
            {
              id: `sys-${Date.now()}`,
              sender: 'bot',
              text: `Selamat datang di ruang obrolan ${targetShop.name}. Asisten bot siap membantu atau Anda dapat langsung bertanya ketersediaan barang kepada admin toko.`,
              time: 'Baru saja'
            }
          ]
        };
      }
      return prev;
    });
  };

  // Kirim pesan dalam chat
  const sendChatMessage = (text, targetShopId = null) => {
    const threadId = targetShopId || activeChatShopId;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    // Tambah pesan user ke thread
    setChatThreads(prev => {
      const currentMessages = prev[threadId] || [];
      return {
        ...prev,
        [threadId]: [...currentMessages, userMsg]
      };
    });

    // Otomatis respon cerdas: jika mode general-bot vs mode admin toko
    handleSmartBotOrSellerReply(text.trim(), threadId);
  };

  const handleSmartBotOrSellerReply = (query, threadId) => {
    const lower = query.toLowerCase();

    // Skenario 1: General Bot (Asisten Virtual Desa)
    if (threadId === 'general-bot') {
      setTimeout(() => {
        let replyText = '';
        let options = null;

        if (lower.includes('stok') || lower.includes('ketersediaan') || lower.includes('barang')) {
          replyText = 'Untuk pengecekan ketersediaan stok produk secara akurat, Anda dapat melihat langsung di katalog desa atau kami hubungkan ke Admin Toko yang bersangkutan. Toko mana yang ingin Anda hubungi?';
          options = ['Griya Tenun Lurik Lestari', 'Kripik Tempe Bu Darmi', 'Madu Hutan Karangrejo'];
        } else if (lower.includes('ongkir') || lower.includes('kirim') || lower.includes('kurir')) {
          replyText = 'Pengiriman dalam kawasan desa dilayani oleh Kurir Kilat Desa Mandiri dengan tarif tetap Rp 5.000 (tiba hari ini). Untuk ambil langsung di balai dusun atau toko pengrajin dikenakan biaya Rp 0 (Gratis).';
          options = ['Cek Ketersediaan Stok', 'Hubungkan ke Admin Toko', 'Cara Pembayaran'];
        } else if (lower.includes('komplain') || lower.includes('keluhan') || lower.includes('rusak') || lower.includes('salah')) {
          replyText = 'Kami siap menindaklanjuti kendala pesanan Anda. Tim pengawas BUMDes menjamin garansi penggantian produk 100% jika terjadi cacat atau salah kirim. Mohon sebutkan nomor pesanan atau hubungi admin toko terkait.';
          options = ['Hubungkan ke Admin Toko', 'Layanan Pelanggan Desa'];
        } else if (lower.includes('admin') || lower.includes('hubungkan') || lower.includes('penjual')) {
          replyText = 'Baik, silakan pilih toko pengrajin yang ingin Anda tuju untuk membuka ruang pesan langsung dengan penjual.';
          options = ['Toko Tenun Ibu Sumarsih', 'Kripik Tempe Bu Darmi', 'Madu Pak Joko'];
        } else {
          replyText = 'Terima kasih atas pesan Anda. Sebagai Asisten Virtual Desa, saya dapat membantu memberikan informasi produk UMKM, tarif kurir desa, atau menghubungkan langsung ke Admin Toko pengrajin.';
          options = ['Cek Ketersediaan Stok', 'Tanya Ongkir & Kurir Dusun', 'Hubungkan ke Admin Toko'];
        }

        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          quickOptions: options
        };

        setChatThreads(prev => ({
          ...prev,
          'general-bot': [...(prev['general-bot'] || []), botReply]
        }));
      }, 700);
      return;
    }

    // Skenario 2: Obrolan Toko Spesifik (Admin Toko)
    const targetShop = shops.find(s => s.id === threadId) || shops[0];

    setTimeout(() => {
      let sellerReply = '';
      if (lower.includes('ready') || lower.includes('stok') || lower.includes('ada')) {
        sellerReply = `Halo kak! Alhamdulillah produk di toko kami ${targetShop.name} saat ini ready stock siap dikirim langsung hari ini. Ada rincian ukuran atau jumlah khusus yang diinginkan?`;
      } else if (lower.includes('komplain') || lower.includes('rusak') || lower.includes('cacat') || lower.includes('pecah')) {
        sellerReply = `Kami memohon maaf yang sebesar-besarnya atas ketidaknyamanan tersebut kak. Kepercayaan warga adalah amanah bagi kami. Mohon sertakan foto barang dan nomor pesanan, kami segera ganti produk yang baru tanpa biaya tambahan.`;
      } else if (lower.includes('kustom') || lower.includes('pesan') || lower.includes('panjang') || lower.includes('warna')) {
        sellerReply = `Tentu bisa kak! Sebagai pengrajin lokal, kami menerima pesanan kustom (motif, ukuran panjang, atau kemasan hampers). Silakan tambahkan catatan saat checkout ya kak.`;
      } else {
        sellerReply = `Terima kasih telah menghubungi ${targetShop.name}. Pesan Anda sudah kami terima dan siap kami layani dengan sepenuh hati. Silakan lakukan checkout atau tanyakan hal lain bila diperlukan.`;
      }

      const replyMsg = {
        id: `sel-${Date.now()}`,
        sender: 'seller',
        senderName: targetShop.owner,
        text: sellerReply,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setChatThreads(prev => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), replyMsg]
      }));
    }, 900);
  };

  // Alihkan percakapan langsung dari bot ke toko tertentu
  const connectToShopFromBot = (shopId) => {
    setIsConnectingSeller(true);
    setTimeout(() => {
      setIsConnectingSeller(false);
      openChatWithShop(shopId);
    }, 500);
  };

  // Trigger celebratory confetti effect
  const shootConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A85C3C', '#7C8C6B', '#3A3A38', '#E5A93B']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Trigger push notification helper (Bebas emoji)
  const triggerNotification = (title, message) => {
    setPushNotification({ title, message, id: Date.now() });
    setTimeout(() => {
      setPushNotification(null);
    }, 4500);
  };

  // Switch to Product Detail
  const viewProduct = (productId, fromMobile = false) => {
    setSelectedProductId(productId);
    if (fromMobile) {
      setMobileTab('detail');
    } else {
      setWebPage('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Switch to Shop Detail
  const viewShop = (shopId) => {
    setSelectedShopId(shopId);
    setWebPage('shop-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Product (Bebas emoji)
  const addProduct = (newProd) => {
    const id = `prod-${Date.now()}`;
    const product = {
      ...newProd,
      id,
      rating: 5.0,
      sold: 0,
      shopId: currentUser?.shopId || 'toko-1',
      shopName: currentUser?.shopName || 'Toko Saya',
      dusun: currentUser?.dusun || 'Dusun Krajan',
      isPopular: false,
      isFeatured: false,
      isNew: true,
      reviews: []
    };
    setProducts(prev => [product, ...prev]);
    shootConfetti();
    triggerNotification('Produk Ditambahkan', `"${newProd.name}" berhasil dipublikasikan ke katalog desa.`);
  };

  // Toggle Product Active / Hidden
  const toggleProductStatus = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const isHidden = !p.isHidden;
        return { ...p, isHidden };
      }
      return p;
    }));
  };

  // Update Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    triggerNotification('Status Pesanan Diperbarui', `Pesanan #${orderId} kini berstatus "${newStatus}".`);
  };

  // UMKM Verification
  const verifyShop = (shopId, newStatus) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status: newStatus, verified: newStatus === 'aktif' } : s));
    triggerNotification('Verifikasi UMKM', `Status UMKM telah diubah menjadi "${newStatus}".`);
  };

  // Broadcast announcement (Bebas emoji)
  const broadcastAnnouncement = (ann) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: ann.title,
      date: 'Hari ini',
      target: ann.target || 'Seluruh Pengguna',
      excerpt: ann.excerpt,
      isUrgent: ann.isUrgent || false,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    triggerNotification('Pengumuman Terkirim', `Broadcast "${ann.title}" telah disiarkan ke semua pengguna.`);
  };

  // Toggle favorite
  const toggleFavorite = (productId) => {
    setSavedFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      webPage, setWebPage,
      selectedProductId, setSelectedProductId,
      selectedShopId, setSelectedShopId,
      products, setProducts,
      shops, setShops,
      categories, setCategories,
      orders, setOrders,
      announcements, setAnnouncements,
      users, setUsers,
      stats, setStats,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      selectedDusun, setSelectedDusun,
      priceRange, setPriceRange,
      sortBy, setSortBy,
      isLoggedIn, setIsLoggedIn,
      currentUser, setCurrentUser,
      mobileRole, setMobileRole,
      mobileTab, setMobileTab,
      showMobileSplash, setShowMobileSplash,
      showMobileOnboarding, setShowMobileOnboarding,
      savedFavorites, toggleFavorite,
      pushNotification, triggerNotification,
      viewProduct, viewShop,
      
      // Keranjang & Checkout
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      checkoutDirectItem,
      openDirectCheckout,
      openCartCheckout,
      processCheckout,

      // Alamat & Google Maps
      addresses,
      selectedAddressId,
      setSelectedAddressId,
      selectedAddress,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      isAddressModalOpen,
      setIsAddressModalOpen,
      editingAddress,
      setEditingAddress,

      // Chatbox & Admin Toko
      isChatOpen,
      setIsChatOpen,
      activeChatShopId,
      setActiveChatShopId,
      chatContextProduct,
      setChatContextProduct,
      chatThreads,
      openChatWithShop,
      sendChatMessage,
      connectToShopFromBot,
      isConnectingSeller,

      // Penjual & Admin
      addProduct,
      toggleProductStatus,
      updateOrderStatus,
      verifyShop,
      broadcastAnnouncement,
      shootConfetti
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
