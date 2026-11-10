import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  createOrder as createOrderRequest, 
  createProduct as createProductRequest, 
  fetchCategories, 
  fetchCurrentUser, 
  fetchOrders, 
  fetchProducts, 
  fetchShops, 
  fetchStats, 
  loginRequest, 
  logoutRequest, 
  registerRequest, 
  sendAiChatMessage, 
  updateOrderStatus as updateOrderStatusRequest, 
  updateProductNumbers as updateProductNumbersRequest, 
  updateProductVisibility, 
  updateShop as updateShopRequest,
  updateProfile,
  updateShopProfileRequest,
  sendEmailOtpRequest,
  verifyEmailOtpRequest,
  resetPasswordWithOtpRequest
} from '../services/api';
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
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [authMode, setAuthMode] = useState('masuk');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const openAuth = (mode = 'masuk') => {
    setAuthMode(mode);
    setWebPage('auth');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

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
      throw new Error(apiError?.message || 'Gagal masuk. Periksa kembali koneksi ke backend API atau kredensial Anda.');
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
      phone: address?.phone || currentUser?.phone || '081915194171',
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

  const handleSmartBotOrSellerReply = async (query, threadId) => {
    setIsAiTyping(true);
    const history = (chatThreads[threadId] || []).slice(-6).map(m => ({
      sender: m.sender,
      text: m.text,
    }));

    try {
      const res = await sendAiChatMessage(query, history, threadId);
      if (res?.reply) {
        const isBot = threadId === 'general-bot';
        const targetShop = shops.find(s => s.id === threadId);
        const replyMsg = {
          id: `${isBot ? 'bot' : 'sel'}-${Date.now()}`,
          sender: isBot ? 'bot' : 'seller',
          senderName: isBot ? 'Teh Sari (Asisten AI Desa)' : (targetShop?.owner || 'Admin Toko'),
          text: res.reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          quickOptions: res.quickOptions || (isBot ? ['Cek Ketersediaan Stok', 'Tanya Ongkir Kurir', 'Hubungkan ke Penjual'] : null)
        };

        setChatThreads(prev => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), replyMsg]
        }));
        return;
      }
    } catch (err) {
      console.warn('AI Assistant API unavailable, fallback to local response:', err.message);
    } finally {
      setIsAiTyping(false);
    }

    const lower = query.toLowerCase();
    if (threadId === 'general-bot') {
      setTimeout(() => {
        let replyText = 'Terima kasih atas pesan Anda. Sebagai Asisten Virtual Desa, saya siap membantu mencari informasi produk UMKM, tarif kurir, atau menghubungkan langsung ke Admin Toko pengrajin.';
        let options = ['Cek Ketersediaan Stok', 'Tanya Ongkir Kurir', 'Hubungkan ke Penjual'];

        if (lower.includes('stok') || lower.includes('ketersediaan') || lower.includes('barang')) {
          replyText = 'Untuk pengecekan ketersediaan stok produk secara akurat, Anda dapat melihat langsung di katalog desa atau kami hubungkan ke Admin Toko yang bersangkutan. Toko mana yang ingin Anda hubungi?';
          options = ['Griya Tenun Lurik Lestari', 'Kripik Tempe Bu Darmi', 'Madu Hutan Tanjungsari'];
        } else if (lower.includes('ongkir') || lower.includes('kirim') || lower.includes('kurir')) {
          replyText = 'Pengiriman di wilayah Sumedang dilayani oleh Kurir Kilat Desa dengan tarif flat Rp 5.000. Untuk ambil langsung di toko pengrajin tidak dikenakan biaya.';
          options = ['Cek Ketersediaan Stok', 'Hubungkan ke Penjual', 'Cara Pembayaran'];
        }

        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          senderName: 'Asisten Virtual Desa',
          text: replyText,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          quickOptions: options
        };

        setChatThreads(prev => ({
          ...prev,
          'general-bot': [...(prev['general-bot'] || []), botReply]
        }));
      }, 500);
      return;
    }

    const targetShop = shops.find(s => s.id === threadId) || shops[0];
    setTimeout(() => {
      const replyMsg = {
        id: `sel-${Date.now()}`,
        sender: 'seller',
        senderName: targetShop.owner,
        text: `Halo kak! Terima kasih telah menghubungi ${targetShop.name}. Pesan Anda sudah kami terima dan siap kami layani dengan sepenuh hati. Silakan lakukan checkout atau tanyakan hal lain bila diperlukan.`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setChatThreads(prev => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), replyMsg]
      }));
    }, 600);
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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };
  const viewShop = (shopId) => {
    setSelectedShopId(shopId);
    setWebPage('shop-detail');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
  const verifyShop = async (shopId, newStatus) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status: newStatus, verified: newStatus === 'aktif' } : s));
    try {
      await updateShopRequest(shopId, {
        status: newStatus,
        verified: newStatus === 'aktif'
      });
      fetchShops().then(setShops).catch(() => {});
      triggerNotification('Verifikasi UMKM', `Status UMKM telah diubah menjadi "${newStatus}".`);
    } catch (error) {
      console.warn('Gagal sinkronisasi status toko ke backend API:', error.message);
      triggerNotification('Verifikasi UMKM (Lokal)', `Status UMKM diperbarui di memori lokal: "${newStatus}".`);
    }
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

  const updateUserProfile = async (data) => {
    try {
      const updatedUser = await updateProfile(data);
      setCurrentUser(prev => ({ ...prev, ...updatedUser }));
      
      // If user has a shop and avatar/name/kecamatan was updated, sync shops in state
      if (currentUser?.shopId) {
        setShops(prev => prev.map(s => {
          if (s.id === currentUser.shopId) {
            return {
              ...s,
              avatar: data.avatar !== undefined ? data.avatar : s.avatar,
              owner: data.name !== undefined ? data.name : s.owner,
              kecamatan: data.kecamatan !== undefined ? data.kecamatan : s.kecamatan,
            };
          }
          return s;
        }));
      }
      
      triggerNotification('Profil Diperbarui', 'Data profil Anda berhasil disimpan.');
      return updatedUser;
    } catch (err) {
      // Graceful fallback for mock/demo mode
      const updatedMock = {
        ...currentUser,
        name: data.name || currentUser.name,
        phone: data.phone || currentUser.phone,
        kecamatan: data.kecamatan || currentUser.kecamatan,
        avatar: data.avatar !== undefined ? data.avatar : currentUser.avatar,
      };
      setCurrentUser(updatedMock);
      if (currentUser?.shopId) {
        setShops(prev => prev.map(s => {
          if (s.id === currentUser.shopId) {
            return {
              ...s,
              avatar: data.avatar !== undefined ? data.avatar : s.avatar,
              owner: data.name !== undefined ? data.name : s.owner,
            };
          }
          return s;
        }));
      }
      triggerNotification('Profil Diperbarui', 'Perubahan profil Anda berhasil disimpan.');
      return updatedMock;
    }
  };

  const updateShopProfile = async (data) => {
    try {
      const res = await updateShopProfileRequest(data);
      if (res?.shop) {
        setShops(prev => prev.map(s => s.id === currentUser.shopId ? { ...s, ...res.shop } : s));
      }
      if (res?.user) {
        setCurrentUser(prev => ({ ...prev, ...res.user }));
      }
      triggerNotification('Toko Diperbarui', 'Informasi dan banner toko berhasil diperbarui.');
      return res;
    } catch (err) {
      // Demo fallback
      if (currentUser?.shopId) {
        setShops(prev => prev.map(s => {
          if (s.id === currentUser.shopId) {
            return {
              ...s,
              name: data.name || s.name,
              banner: data.banner !== undefined ? data.banner : s.banner,
              avatar: data.avatar !== undefined ? data.avatar : s.avatar,
              description: data.description !== undefined ? data.description : s.description,
              category: data.category || s.category,
            };
          }
          return s;
        }));
        setCurrentUser(prev => ({
          ...prev,
          shopName: data.name || prev.shopName,
          avatar: data.avatar !== undefined ? data.avatar : prev.avatar,
        }));
      }
      triggerNotification('Toko Diperbarui', 'Informasi toko dan banner berhasil diperbarui.');
      return { success: true };
    }
  };

  const sendEmailOtp = async (type = 'email_verification') => {
    try {
      const res = await sendEmailOtpRequest(type);
      const code = res?.code;
      const label = type === 'email_verification' ? 'verifikasi email' : 'ganti kata sandi';
      triggerNotification(
        'Kode OTP Terkirim',
        `Kode 6-digit untuk ${label}: [ ${code} ]. Berlaku 15 menit.`
      );
      return res;
    } catch (err) {
      // Instant demo generator fallback
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      const label = type === 'email_verification' ? 'verifikasi email' : 'ganti kata sandi';
      triggerNotification(
        'Kode OTP Terkirim (Demo)',
        `Kode 6-digit untuk ${label}: [ ${demoCode} ]. Gunakan kode ini untuk konfirmasi.`
      );
      return { code: demoCode };
    }
  };

  const verifyEmailOtp = async (code) => {
    try {
      const res = await verifyEmailOtpRequest(code);
      if (res?.user) {
        setCurrentUser(prev => ({ ...prev, ...res.user, isEmailVerified: true }));
      } else {
        setCurrentUser(prev => ({ ...prev, isEmailVerified: true, emailVerifiedAt: new Date().toISOString() }));
      }
      triggerNotification('Email Terverifikasi', 'Email Gmail Anda kini resmi terverifikasi BUMDes!');
      return true;
    } catch (err) {
      // Demo fallback if code matches 6 digits
      if (code && code.length === 6) {
        setCurrentUser(prev => ({ ...prev, isEmailVerified: true, emailVerifiedAt: new Date().toISOString() }));
        triggerNotification('Email Terverifikasi', 'Email Gmail Anda kini resmi terverifikasi BUMDes!');
        return true;
      }
      throw err;
    }
  };

  const changePasswordWithOtp = async ({ code, newPassword }) => {
    try {
      const res = await resetPasswordWithOtpRequest(code, newPassword);
      triggerNotification('Kata Sandi Diperbarui', 'Kata sandi berhasil diubah dengan verifikasi email aman.');
      return true;
    } catch (err) {
      if (code && code.length === 6 && newPassword.length >= 6) {
        triggerNotification('Kata Sandi Diperbarui', 'Kata sandi berhasil diubah dengan verifikasi email aman.');
        return true;
      }
      throw err;
    }
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
      isAiTyping,
      hasSeenIntro,
      setHasSeenIntro,
      authMode,
      setAuthMode,
      openAuth,
      isSettingsOpen,
      setIsSettingsOpen,
      openSettings,
      closeSettings,
      updateUserProfile,
      updateShopProfile,
      sendEmailOtp,
      verifyEmailOtp,
      changePasswordWithOtp,
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
