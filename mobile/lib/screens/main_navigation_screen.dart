import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../providers/app_provider.dart';
import 'home_screen.dart';
import 'catalog_screen.dart';
import 'orders_screen.dart';
import 'profile_screen.dart';
import 'cart_screen.dart';
import 'seller_dashboard_screen.dart';
import 'chat_ai_screen.dart';
import '../widgets/splash_overlay.dart';
import '../widgets/onboarding_modal.dart';
import '../widgets/push_toast.dart';
import '../widgets/add_product_modal.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _buyerIndex = 0;
  int _sellerIndex = 0;
  bool _showSplash = true;
  bool _showOnboarding = false;

  void _onBuyerTabTapped(int index) {
    setState(() => _buyerIndex = index);
  }

  void _onSellerTabTapped(int index) {
    setState(() => _sellerIndex = index);
  }

  void _openAddProduct() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AddProductModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final isPenjual = provider.currentRole == 'penjual';

    final buyerScreens = [
      HomeScreen(onNavigateTab: _onBuyerTabTapped),
      const CatalogScreen(),
      const OrdersScreen(),
      ProfileScreen(
        onOpenOnboarding: () => setState(() => _showOnboarding = true),
        onOpenSplash: () => setState(() => _showSplash = true),
      ),
    ];

    return Scaffold(
      backgroundColor: DesaColors.bg,

      // Top App Bar with Dual-Mode Capsule Switcher
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: DesaColors.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.storefront_rounded, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Pasar Desa',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    color: DesaColors.primary,
                    letterSpacing: -0.2,
                  ),
                ),
                Text(
                  isPenjual ? 'MODE TOKO PENJUAL' : 'MODE PEMBELI',
                  style: const TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w800,
                    color: DesaColors.muted,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Mode Switcher Capsule (Belanja vs Jualan)
          Container(
            margin: const EdgeInsets.symmetric(vertical: 10),
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: DesaColors.bg,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: DesaColors.primary.withValues(alpha: 0.15)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Belanja Pill
                GestureDetector(
                  onTap: () {
                    provider.setRole('pembeli');
                    setState(() => _buyerIndex = 0);
                    provider.triggerToast('Beralih Mode', 'Sekarang Anda berada di Mode Pembeli');
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    curve: Curves.easeOutCubic,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: !isPenjual ? DesaColors.primary : Colors.transparent,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: !isPenjual
                          ? [
                              BoxShadow(
                                color: DesaColors.primary.withValues(alpha: 0.25),
                                blurRadius: 4,
                                offset: const Offset(0, 1),
                              )
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.shopping_bag_outlined,
                          size: 13,
                          color: !isPenjual ? Colors.white : DesaColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Belanja',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: !isPenjual ? Colors.white : DesaColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Jualan Pill
                GestureDetector(
                  onTap: () {
                    provider.setRole('penjual');
                    setState(() => _sellerIndex = 0);
                    provider.triggerToast('Beralih Mode', 'Sekarang Anda berada di Mode Penjual UMKM');
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    curve: Curves.easeOutCubic,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isPenjual ? DesaColors.accent : Colors.transparent,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: isPenjual
                          ? [
                              BoxShadow(
                                color: DesaColors.accent.withValues(alpha: 0.25),
                                blurRadius: 4,
                                offset: const Offset(0, 1),
                              )
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.storefront_rounded,
                          size: 13,
                          color: isPenjual ? Colors.white : DesaColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Jualan',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isPenjual ? Colors.white : DesaColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // AI Chat Button
          IconButton(
            icon: const Icon(Icons.auto_awesome, color: DesaColors.accent, size: 21),
            tooltip: 'Tanya Asisten AI Desa',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ChatAiScreen()),
              );
            },
          ),
          const SizedBox(width: 4),
        ],
      ),

      // Stack: Body + Push Notification Toast + Onboarding + Splash
      body: Stack(
        children: [
          // Active Mode Screen (Buyer vs Seller)
          isPenjual
              ? SellerDashboardScreen(
                  activeTab: _sellerIndex,
                  onTabChange: _onSellerTabTapped,
                )
              : IndexedStack(
                  index: _buyerIndex,
                  children: buyerScreens,
                ),

          // Floating Top Push Toast
          if (provider.toastTitle != null)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: PushToastBanner(
                title: provider.toastTitle!,
                message: provider.toastMessage ?? '',
                onDismiss: () => provider.clearToast(),
              ),
            ),

          // Onboarding Dialog
          if (_showOnboarding)
            OnboardingModal(
              onClose: () => setState(() => _showOnboarding = false),
            ),

          // Splash Overlay
          if (_showSplash)
            SplashOverlay(
              onDismiss: () => setState(() => _showSplash = false),
            ),
        ],
      ),

      // Floating Action Button: Cart in Buyer mode, Add Product in Seller mode
      floatingActionButton: isPenjual
          ? FloatingActionButton.extended(
              backgroundColor: DesaColors.highlight,
              elevation: 4,
              onPressed: _openAddProduct,
              icon: const Icon(Icons.add, color: Colors.white, size: 20),
              label: const Text(
                'Tambah Produk',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13),
              ),
            )
          : provider.cartCount > 0
              ? FloatingActionButton.extended(
                  backgroundColor: DesaColors.primary,
                  elevation: 4,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const CartScreen()),
                    );
                  },
                  icon: const Icon(Icons.shopping_bag, color: Colors.white, size: 20),
                  label: Row(
                    children: [
                      const Text('Keranjang', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13)),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: DesaColors.accent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${provider.cartCount}',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                )
              : null,

      // Dynamic Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: DesaColors.border.withValues(alpha: 0.8))),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: isPenjual
                  ? [
                      _buildNavItem(0, Icons.trending_up, Icons.trending_up, 'Dashboard', isPenjual: true),
                      _buildNavItem(1, Icons.inventory_2_rounded, Icons.inventory_2_outlined, 'Produk', isPenjual: true),
                      _buildNavItem(2, Icons.shopping_bag_rounded, Icons.shopping_bag_outlined, 'Pesanan', isPenjual: true),
                      _buildNavItem(3, Icons.storefront_rounded, Icons.storefront_outlined, 'Toko', isPenjual: true),
                    ]
                  : [
                      _buildNavItem(0, Icons.home_rounded, Icons.home_outlined, 'Beranda'),
                      _buildNavItem(1, Icons.category_rounded, Icons.category_outlined, 'Katalog'),
                      _buildNavItem(
                        2,
                        Icons.local_shipping_rounded,
                        Icons.local_shipping_outlined,
                        'Pesanan',
                        badgeCount: provider.activeOrdersCount,
                      ),
                      _buildNavItem(3, Icons.person_rounded, Icons.person_outline, 'Akun'),
                    ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData activeIcon, IconData inactiveIcon, String label, {int badgeCount = 0, bool isPenjual = false}) {
    final currentIndex = isPenjual ? _sellerIndex : _buyerIndex;
    final isSelected = currentIndex == index;
    final activeColor = isPenjual ? DesaColors.accent : DesaColors.primary;

    return InkWell(
      onTap: () => isPenjual ? _onSellerTabTapped(index) : _onBuyerTabTapped(index),
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? activeColor.withValues(alpha: 0.08) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  isSelected ? activeIcon : inactiveIcon,
                  color: isSelected ? activeColor : DesaColors.muted,
                  size: 22,
                ),
                if (badgeCount > 0)
                  Positioned(
                    top: -4,
                    right: -6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                      decoration: BoxDecoration(
                        color: DesaColors.accent,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                      child: Text(
                        '$badgeCount',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: activeColor,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
