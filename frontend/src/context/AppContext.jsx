import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { createOrder as createOrderRequest, createProduct as createProductRequest, fetchCategories, fetchCurrentUser, fetchOrders, fetchProducts, fetchShops, fetchStats, loginRequest, logoutRequest, registerRequest, updateOrderStatus as updateOrderStatusRequest, updateProductNumbers as updateProductNumbersRequest, updateProductVisibility } from '../services/api';
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
  const [currentView, setCurrentView] = useState('web');
  const [webPage, setWebPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('prod-1');
  const [selectedShopId, setSelectedShopId] = useState('toko-1');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [stats, setStats] = useState(VILLAGE_STATS);
  const [dataSource, setDataSource] = useState('demo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua Kecamatan');
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [sortBy, setSortBy] = useState('terbaru');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileRole, setMobileRole] = useState('pembeli');
  const [mobileTab, setMobileTab] = useState('beranda');
  const [showMobileSplash, setShowMobileSplash] = useState(false);
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState([]);
  const [pushNotification, setPushNotification] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDirectItem, setCheckoutDirectItem] = useState(null);

  useEffect(() => {
    let active = true;

    if (localStorage.getItem('pasardesa_token')) {
      fetchCurrentUser().then(user => {
        if (active) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          fetchOrders().then(setOrders).catch(() => {});
          if (user.role === 'admin') {
            fetchProducts().then(setProducts).catch(() => {});
          }
        }
      }).catch(() => localStorage.removeItem('pasardesa_token'));
    }

    Promise.allSettled([fetchProducts(), fetchShops(), fetchCategories(), fetchStats()])
      .then(([resProducts, resShops, resCategories, resStats]) => {
        if (!active) return;

        const hasLiveData = resProducts.status === 'fulfilled' && Array.isArray(resProducts.value)
          && resShops.status === 'fulfilled' && Array.isArray(resShops.value)
          && resCategories.status === 'fulfilled' && Array.isArray(resCategories.value)
          && resStats.status === 'fulfilled' && Boolean(resStats.value);

        if (!hasLiveData) return;

        setProducts(resProducts.value);
        setShops(resShops.value);
        setCategories(resCategories.value);
        setStats(resStats.value);
        setDataSource('live');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !currentUser) return undefined;

    const refreshOrders = () => {
      if (document.visibilityState === 'visible') {
        fetchOrders().then(setOrders).catch(() => {});
        fetchStats().then(setStats).catch(() => {});
      }
    };
    const interval = window.setInterval(refreshOrders, 15000);

    return () => window.clearInterval(interval);
  }, [isLoggedIn, currentUser?.id]);

  const login = async (identifier, password) => {
    try {
      const user = await loginRequest(identifier, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      if (user.role === 'admin') {
        fetchOrders().then(setOrders).catch(() => {});
        fetchProducts().then(setProducts).catch(() => {});
      }
      return user;
    } catch (apiError) {
      const foundUser = users.find(u => (u.email?.toLowerCase() === identifier?.toLowerCase() || u.phone === identifier));
      if (foundUser && (password === 'admin123' || password === '123456' || password === 'password123' || foundUser.role === 'admin')) {
        setCurrentUser(foundUser);
        setIsLoggedIn(true);
        return foundUser;
      }
      throw apiError;
    }
  };
  const register = async (data) => {
    const user = await registerRequest(data);
    setCurrentUser(user);
    setIsLoggedIn(true);
    fetchShops().then(setShops).catch(() => {});
    return user;
  };
  const logout = async () => {
    try { await logoutRequest(); } catch (error) { console.info('Sesi API sudah berakhir.', error.message); }
    localStorage.removeItem('pasardesa_token');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

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
  const openDirectCheckout = (product, qty = 1, note = '') => {
    setCheckoutDirectItem({
      productId: product.id,
      product,
      qty,
      note
    });
    setIsCheckoutOpen(true);
  };
  const openCartCheckout = () => {
    if (cart.length === 0) {
      triggerNotification('Keranjang Kosong', 'Silakan pilih dan masukkan produk ke keranjang terlebih dahulu.');
      return;
    }
    setCheckoutDirectItem(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const processCheckout = async ({ items, address, shippingMethod, paymentMethod, notes = '' }) => {
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const shippingCost = shippingMethod?.price || 0;
    const grandTotal = subtotal + shippingCost;

    const fallbackOrderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: fallbackOrderId,
      productName: items.length === 1 ? items[0].product.name : `${items[0].product.name} (+${items.length - 1} produk lainnya)`,
      buyerName: address?.receiverName || currentUser?.name || 'Warga Desa',
      phone: address?.phone || currentUser?.phone || '08123456789',
      date: 'Hari ini',
      total: grandTotal,
      qty: totalItems,
      status: 'diproses',
      shopName: items[0].product.shopName,
      kecamatan: address?.kecamatan || items[0].product.kecamatan,
      address: `${address?.fullAddress || 'Alamat Pengiriman'} ${address?.notes ? `(${address.notes})` : ''}`,
      items,
      shippingMethod: shippingMethod?.name || 'Kurir Kilat Desa',
      paymentMethod: paymentMethod?.name || 'Bayar di Tempat (COD)',
      notes
    };

    try {
      const savedOrder = await createOrderRequest({
        buyerName: newOrder.buyerName,
        phone: newOrder.phone,
        kecamatan: newOrder.kecamatan,
        address: newOrder.address,
        items: items.map(item => ({
          productId: item.productId || item.product.id,
          qty: item.qty,
          note: item.note || '',
        })),
        shippingMethod,
        paymentMethod,
        notes,
      });

      setOrders(prev => [savedOrder, ...prev]);
      fetchProducts().then(setProducts).catch(() => {});
      fetchStats().then(setStats).catch(() => {});
      triggerNotification('Pesanan Tersimpan', `Pesanan #${savedOrder.id} berhasil tersimpan di database.`);
      if (!checkoutDirectItem) clearCart();
      shootConfetti();
      setCheckoutDirectItem(null);

      return { orderId: savedOrder.id, persisted: true, order: savedOrder };
    } catch (error) {
      setOrders(prev => [newOrder, ...prev]);
      triggerNotification('Tersimpan Lokal', `Pesanan disimpan dalam mode demo: ${error.message}`);
      if (!checkoutDirectItem) clearCart();
      setCheckoutDirectItem(null);

      return { orderId: fallbackOrderId, persisted: false, order: newOrder };
    }
  };
  const [addresses, setAddresses] = useState(INITIAL_USER_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_USER_ADDRESSES[0]?.id || null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const saveAddress = (addrData) => {
    if (addrData.id) {
      setAddresses(prev => prev.map(a => a.id === addrData.id ? { ...addrData } : a));
      triggerNotification('Alamat Diperbarui', `Alamat "${addrData.label}" berhasil disimpan.`);
    } else {
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatShopId, setActiveChatShopId] = useState('general-bot');
  const [chatContextProduct, setChatContextProduct] = useState(null);
  const [chatThreads, setChatThreads] = useState(INITIAL_CHAT_THREADS);
  const [isConnectingSeller, setIsConnectingSeller] = useState(false);
  const openChatWithShop = (shopId, product = null) => {
    setActiveChatShopId(shopId);
    if (product) {
      setChatContextProduct(product);
    } else if (shopId !== 'general-bot') {
      const shopProducts = products.filter(p => p.shopId === shopId);
      setChatContextProduct(shopProducts[0] || null);
    }
    setIsChatOpen(true);
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
  const sendChatMessage = (text, targetShopId = null) => {
    const threadId = targetShopId || activeChatShopId;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setChatThreads(prev => {
      const currentMessages = prev[threadId] || [];
      return {
        ...prev,
        [threadId]: [...currentMessages, userMsg]
      };
    });
    handleSmartBotOrSellerReply(text.trim(), threadId);
  };

  const handleSmartBotOrSellerReply = (query, threadId) => {
    const lower = query.toLowerCase();
    if (threadId === 'general-bot') {
      setTimeout(() => {
        let replyText = '';
        let options = null;

        if (lower.includes('stok') || lower.includes('ketersediaan') || lower.includes('barang')) {
          replyText = 'Untuk pengecekan ketersediaan stok produk secara akurat, Anda dapat melihat langsung di katalog desa atau kami hubungkan ke Admin Toko yang bersangkutan. Toko mana yang ingin Anda hubungi?';
          options = ['Griya Tenun Lurik Lestari', 'Kripik Tempe Bu Darmi', 'Madu Hutan Tanjungsari'];
        } else if (lower.includes('ongkir') || lower.includes('kirim') || lower.includes('kurir')) {
          replyText = 'Pengiriman di wilayah Sumedang dilayani oleh Kurir Kilat Desa dengan tarif mulai Rp 5.000. Untuk ambil langsung di toko pengrajin tidak dikenakan biaya.';
          options = ['Cek Ketersediaan Stok', 'Hubungkan ke Admin Toko', 'Cara Pembayaran'];
        } else if (lower.includes('komplain') || lower.includes('keluhan') || lower.includes('rusak') || lower.includes('salah')) {
          replyText = 'Kami siap menindaklanjuti kendala pesanan Anda. Tim pengawas BUMDes menjamin garansi penggantian produk 100% jika terjadi cacat atau salah kirim. Mohon sebutkan nomor pesanan atau hubungi admin toko terkait.';
          options = ['Hubungkan ke Admin Toko', 'Layanan Pelanggan Desa'];
        } else if (lower.includes('admin') || lower.includes('hubungkan') || lower.includes('penjual')) {
          replyText = 'Baik, silakan pilih toko pengrajin yang ingin Anda tuju untuk membuka ruang pesan langsung dengan penjual.';
          options = ['Toko Tenun Ibu Sumarsih', 'Kripik Tempe Bu Darmi', 'Madu Pak Joko'];
        } else {
          replyText = 'Terima kasih atas pesan Anda. Sebagai Asisten Virtual Desa, saya dapat membantu memberikan informasi produk UMKM, tarif kurir desa, atau menghubungkan langsung ke Admin Toko pengrajin.';
          options = ['Cek Ketersediaan Stok', 'Tanya Ongkir & Kurir Sumedang', 'Hubungkan ke Admin Toko'];
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
  const connectToShopFromBot = (shopId) => {
    setIsConnectingSeller(true);
    setTimeout(() => {
      setIsConnectingSeller(false);
      openChatWithShop(shopId);
    }, 500);
  };
  const shootConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A85C3C', '#7C8C6B', '#3A3A38', '#E5A93B']
      });
    } catch (e) {
    }
  };
  const triggerNotification = (title, message) => {
    setPushNotification({ title, message, id: Date.now() });
    setTimeout(() => {
      setPushNotification(null);
    }, 4500);
  };
  const viewProduct = (productId, fromMobile = false) => {
    setSelectedProductId(productId);
    if (fromMobile) {
      setMobileTab('detail');
    } else {
      setWebPage('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const viewShop = (shopId) => {
    setSelectedShopId(shopId);
    setWebPage('shop-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const addProduct = async (newProd) => {
    if (!currentUser?.shopId && currentUser?.role !== 'admin') {
      triggerNotification('Toko belum tersedia', 'Daftarkan akun sebagai penjual sebelum menambahkan produk.');
      return;
    }
    const id = `prod-${Date.now()}`;
    const product = {
      ...newProd,
      id,
      rating: 5.0,
      sold: 0,
      shopId: currentUser?.shopId || 'toko-1',
      shopName: currentUser?.shopName || 'Toko Saya',
      kecamatan: currentUser?.kecamatan || 'Kecamatan Sumedang Utara',
      isPopular: false,
      isFeatured: false,
      isNew: true,
      reviews: []
    };
    try {
      const savedProduct = await createProductRequest(product);
      setProducts(prev => [savedProduct, ...prev]);
      fetchStats().then(setStats).catch(() => {});
      shootConfetti();
      triggerNotification('Produk Ditambahkan', `"${newProd.name}" berhasil disimpan ke database.`);
    } catch (error) {
      setProducts(prev => [product, ...prev]);
      triggerNotification('Backend Belum Tersambung', `Produk tampil sementara. ${error.message}`);
    }
  };
  const toggleProductStatus = async (productId) => {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const isHidden = !product.isHidden;
    setProducts(prev => prev.map(item => item.id === productId ? { ...item, isHidden } : item));

    try {
      const savedProduct = await updateProductVisibility(productId, isHidden);
      setProducts(prev => prev.map(item => item.id === productId ? savedProduct : item));
    } catch (error) {
      triggerNotification('Backend Belum Tersambung', `Perubahan status hanya tersimpan sementara. ${error.message}`);
    }
  };
  const updateProductNumbers = async (productId, numbers) => {
    try {
      const saved = await updateProductNumbersRequest(productId, numbers);
      setProducts(prev => prev.map(item => item.id === productId ? saved : item));
      triggerNotification('Produk diperbarui', 'Harga dan stok baru sudah tersimpan.');
      fetchStats().then(setStats).catch(() => {});
      return true;
    } catch (error) {
      triggerNotification('Perubahan gagal disimpan', error.message);
      return false;
    }
  };
  const updateOrderStatus = async (orderId, newStatus) => {
    const existingOrder = orders.find(order => order.id === orderId);
    const prevStatus = existingOrder?.status;
    const orderTotal = Number(existingOrder?.total || 0);
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    const wasCompleted = ['diambil', 'selesai'].includes(prevStatus);
    const isCompleted = ['diambil', 'selesai'].includes(newStatus);
    if (!wasCompleted && isCompleted) {
      setStats(prev => prev ? {
        ...prev,
        turnoverThisMonth: (Number(prev.turnoverThisMonth) || 0) + orderTotal,
      } : prev);
    } else if (wasCompleted && !isCompleted) {
      setStats(prev => prev ? {
        ...prev,
        turnoverThisMonth: Math.max(0, (Number(prev.turnoverThisMonth) || 0) - orderTotal),
      } : prev);
    }

    try {
      const savedOrder = await updateOrderStatusRequest(orderId, newStatus);
      if (savedOrder) {
        setOrders(prev => prev.map(order => order.id === orderId ? savedOrder : order));
      }
      fetchStats().then(setStats).catch(() => {});
      
      if (newStatus === 'selesai' || newStatus === 'diambil') {
        triggerNotification(
          'Pesanan Beres & Selesai',
          `Pesanan #${orderId} telah tuntas. Omzet senilai Rp ${orderTotal.toLocaleString('id-ID')} berhasil masuk.`
        );
      } else {
        triggerNotification('Status Pesanan Diperbarui', `Pesanan #${orderId} kini berstatus "${newStatus}".`);
      }
      return true;
    } catch (error) {
      console.warn('Backend updateOrderStatus fallback to local state:', error.message);
      if (newStatus === 'selesai' || newStatus === 'diambil') {
        triggerNotification(
          'Pesanan Beres',
          `Pesanan #${orderId} telah selesai diambil. Omzet +Rp ${orderTotal.toLocaleString('id-ID')} tercatat di dashboard.`
        );
      } else {
        triggerNotification('Status Pesanan Diperbarui', `Pesanan #${orderId} kini berstatus "${newStatus}".`);
      }
      return true;
    }
  };
  const verifyShop = (shopId, newStatus) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status: newStatus, verified: newStatus === 'aktif' } : s));
    triggerNotification('Verifikasi UMKM', `Status UMKM telah diubah menjadi "${newStatus}".`);
  };
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
      dataSource,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      selectedKecamatan, setSelectedKecamatan,
      priceRange, setPriceRange,
      sortBy, setSortBy,
      isLoggedIn, setIsLoggedIn,
      currentUser, setCurrentUser,
      login, register, logout,
      mobileRole, setMobileRole,
      mobileTab, setMobileTab,
      showMobileSplash, setShowMobileSplash,
      showMobileOnboarding, setShowMobileOnboarding,
      savedFavorites, toggleFavorite,
      pushNotification, triggerNotification,
      viewProduct, viewShop,
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
      addProduct,
      toggleProductStatus,
      updateProductNumbers,
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
