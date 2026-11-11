import 'package:flutter/foundation.dart';
import '../data/models/product_model.dart';
import '../data/models/category_model.dart';
import '../data/models/order_model.dart';
import '../data/models/user_model.dart';
import '../data/services/api_service.dart';

class CartEntry {
  final Product product;
  int qty;
  String note;

  CartEntry({
    required this.product,
    this.qty = 1,
    this.note = '',
  });

  int get subtotal => product.price * qty;
}

class AppProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Product> _products = [];
  List<CategoryItem> _categories = [];
  List<OrderItem> _orders = [];
  final List<CartEntry> _cart = [];
  final Set<String> _favorites = {};

  UserModel _currentUser = UserModel(
    id: 'USR-2026-01',
    name: 'Warga Mandiri',
    email: 'warga.sumedang@pasardesa.id',
    phone: '081915194171',
    role: 'pembeli',
    shopName: 'Griya Tenun Lurik Lestari',
    shopId: 'shop-001',
  );

  bool _isLoading = false;
  String _selectedCategory = 'semua';
  String _selectedKecamatan = 'Semua Kecamatan';
  String _searchQuery = '';
  String _orderFilter = 'semua';
  String _currentRole = 'pembeli';
  String? _toastTitle;
  String? _toastMessage;
  final Set<String> _hiddenProductIds = {};

  // Getters
  String get currentRole => _currentRole;
  String? get toastTitle => _toastTitle;
  String? get toastMessage => _toastMessage;

  List<Product> get products {
    return _products.where((p) {
      if (_hiddenProductIds.contains(p.id)) return false;
      final matchCat = _selectedCategory == 'semua' || p.category == _selectedCategory;
      final matchKec = _selectedKecamatan == 'Semua Kecamatan' || p.kecamatan == _selectedKecamatan;
      final matchSearch = _searchQuery.isEmpty || 
          p.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.shopName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.description.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchCat && matchKec && matchSearch;
    }).toList();
  }

  List<Product> get allRawProducts => _products;
  List<Product> get sellerProducts => _products; // Displayed in seller mode
  List<OrderItem> get sellerOrders => _orders;   // Orders for seller shop
  bool isProductHidden(String id) => _hiddenProductIds.contains(id);
  List<CategoryItem> get categories => _categories;
  List<OrderItem> get orders {
    if (_orderFilter == 'semua') return _orders;
    if (_orderFilter == 'diproses') return _orders.where((o) => o.status == 'diproses').toList();
    if (_orderFilter == 'dikirim') return _orders.where((o) => o.status == 'dikirim').toList();
    if (_orderFilter == 'selesai') return _orders.where((o) => ['selesai', 'diambil'].contains(o.status)).toList();
    return _orders;
  }

  List<CartEntry> get cart => _cart;
  int get cartCount => _cart.fold(0, (sum, i) => sum + i.qty);
  int get cartSubtotal => _cart.fold(0, (sum, i) => sum + i.subtotal);
  Set<String> get favorites => _favorites;
  UserModel get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String get selectedCategory => _selectedCategory;
  String get selectedKecamatan => _selectedKecamatan;
  String get searchQuery => _searchQuery;
  String get orderFilter => _orderFilter;

  int get activeOrdersCount => _orders.where((o) => ['diproses', 'dikirim'].contains(o.status)).length;

  AppProvider() {
    initData();
  }

  Future<void> initData() async {
    _isLoading = true;
    notifyListeners();

    final fetchedProds = await _apiService.getProducts();
    final fetchedCats = await _apiService.getCategories();
    final fetchedOrds = await _apiService.getOrders();

    _products = fetchedProds;
    _categories = fetchedCats;
    _orders = fetchedOrds;
    _isLoading = false;
    notifyListeners();
  }

  void setSelectedCategory(String cat) {
    _selectedCategory = cat;
    notifyListeners();
  }

  void setSelectedKecamatan(String kec) {
    _selectedKecamatan = kec;
    notifyListeners();
  }

  void setSearchQuery(String q) {
    _searchQuery = q;
    notifyListeners();
  }

  void setOrderFilter(String filter) {
    _orderFilter = filter;
    notifyListeners();
  }

  void toggleFavorite(String productId) {
    if (_favorites.contains(productId)) {
      _favorites.remove(productId);
    } else {
      _favorites.add(productId);
    }
    notifyListeners();
  }

  // Cart Management
  void addToCart(Product product, {int qty = 1, String note = ''}) {
    final existingIndex = _cart.indexWhere((item) => item.product.id == product.id);
    if (existingIndex >= 0) {
      _cart[existingIndex].qty += qty;
    } else {
      _cart.add(CartEntry(product: product, qty: qty, note: note));
    }
    notifyListeners();
  }

  void updateCartQty(String productId, int newQty) {
    if (newQty <= 0) {
      _cart.removeWhere((item) => item.product.id == productId);
    } else {
      final index = _cart.indexWhere((item) => item.product.id == productId);
      if (index >= 0) {
        _cart[index].qty = newQty;
      }
    }
    notifyListeners();
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }

  // Checkout process
  Future<OrderItem?> checkoutCart({
    required String buyerName,
    required String phone,
    required String kecamatan,
    required String address,
    required String paymentMethod,
    required String shippingMethod,
    String? notes,
  }) async {
    if (_cart.isEmpty) return null;

    final items = _cart.map((entry) => {
      'productId': entry.product.id,
      'productName': entry.product.name,
      'price': entry.product.price,
      'qty': entry.qty,
      'note': entry.note,
    }).toList();

    final newOrder = await _apiService.createOrder(
      buyerName: buyerName,
      phone: phone,
      kecamatan: kecamatan,
      address: address,
      items: items,
      paymentMethod: paymentMethod,
      shippingMethod: shippingMethod,
      notes: notes,
    );

    if (newOrder != null) {
      _orders.insert(0, newOrder);
      clearCart();
      notifyListeners();
    }
    return newOrder;
  }

  // Real-time Status Sync & Confirm Receipt
  Future<void> confirmOrderReceived(String orderId) async {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index >= 0) {
      _orders[index] = _orders[index].copyWith(status: 'selesai');
      notifyListeners();
      await _apiService.updateOrderStatus(orderId, 'selesai');
    }
  }

  Future<void> updateOrderStatus(String orderId, String newStatus) async {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index >= 0) {
      _orders[index] = _orders[index].copyWith(status: newStatus);
      notifyListeners();
      await _apiService.updateOrderStatus(orderId, newStatus);
    }
  }

  // Switch role between Pembeli and Penjual
  void setRole(String role) {
    _currentRole = role;
    _currentUser = UserModel(
      id: _currentUser.id,
      name: _currentUser.name,
      email: _currentUser.email,
      phone: _currentUser.phone,
      role: role,
      shopName: _currentUser.shopName,
      shopId: _currentUser.shopId,
      isEmailVerified: _currentUser.isEmailVerified,
    );
    notifyListeners();
  }

  void toggleRole() {
    setRole(_currentRole == 'pembeli' ? 'penjual' : 'pembeli');
  }

  void triggerToast(String title, String message) {
    _toastTitle = title;
    _toastMessage = message;
    notifyListeners();

    Future.delayed(const Duration(seconds: 3), () {
      if (_toastTitle == title) {
        _toastTitle = null;
        _toastMessage = null;
        notifyListeners();
      }
    });
  }

  void clearToast() {
    _toastTitle = null;
    _toastMessage = null;
    notifyListeners();
  }

  void toggleProductHidden(String id) {
    if (_hiddenProductIds.contains(id)) {
      _hiddenProductIds.remove(id);
      triggerToast('Produk Aktif', 'Produk ditampilkan kembali di katalog desa.');
    } else {
      _hiddenProductIds.add(id);
      triggerToast('Produk Disembunyikan', 'Produk dinonaktifkan dari katalog belanja.');
    }
    notifyListeners();
  }

  void addProduct(Product product) {
    _products.insert(0, product);
    triggerToast('Produk Ditambahkan', '${product.name} berhasil dipublikasikan!');
    notifyListeners();
  }
}
