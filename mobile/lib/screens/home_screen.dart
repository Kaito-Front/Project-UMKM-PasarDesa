import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../core/widgets/desa_image.dart';
import '../core/widgets/lurik_divider.dart';
import '../providers/app_provider.dart';
import 'product_detail_screen.dart';
import 'chat_ai_screen.dart';

class HomeScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const HomeScreen({super.key, required this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

    return Scaffold(
      backgroundColor: DesaColors.bg,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Input Field
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Cari kain lurik, kripik, madu...',
                  hintStyle: const TextStyle(fontSize: 12, color: DesaColors.muted),
                  prefixIcon: const Icon(Icons.search, size: 20, color: DesaColors.accent),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: DesaColors.primary.withValues(alpha: 0.15)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: DesaColors.primary.withValues(alpha: 0.15)),
                  ),
                ),
                onSubmitted: (val) {
                  provider.setSearchQuery(val);
                  onNavigateTab(1); // Jump to catalog
                },
              ),
            ),

            // Hero Banner: Info Desa & Sentra UMKM 26 Kecamatan
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [DesaColors.primary, Color(0xFF2C2C2A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: DesaColors.primary.withValues(alpha: 0.25),
                      blurRadius: 14,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Text(
                        '✨ Info Desa • Sentra UMKM 26 Kecamatan',
                        style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFFC1CCB3)),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Karya Otentik Pengrajin\nDesa Sumedang',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Kain lurik ATBM, keripik tempe Cimalaka, dan madu hutan lereng Tampomas langsung dari warga desa.',
                      style: TextStyle(fontSize: 11.5, color: Colors.white.withValues(alpha: 0.8), height: 1.4),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: DesaColors.accent,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      onPressed: () => onNavigateTab(1),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('Jelajahi Katalog', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 12)),
                          SizedBox(width: 6),
                          Icon(Icons.arrow_forward_rounded, size: 14, color: Colors.white),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Kategori Produk Horizontal Scroll
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Kategori Produk',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: DesaColors.primary),
                  ),
                  GestureDetector(
                    onTap: () => onNavigateTab(1),
                    child: const Text('Lihat Semua', style: TextStyle(fontSize: 11.5, color: DesaColors.accent, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            SizedBox(
              height: 38,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: provider.categories.length,
                separatorBuilder: (context, index) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = provider.categories[index];
                  final isSelected = provider.selectedCategory == cat.id;
                  return InkWell(
                    onTap: () {
                      provider.setSelectedCategory(cat.id);
                      onNavigateTab(1);
                    },
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? DesaColors.accent : DesaColors.primary.withValues(alpha: 0.15),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: isSelected ? DesaColors.accent : DesaColors.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            cat.name,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                              color: isSelected ? DesaColors.accent : DesaColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 18),
            const LurikDivider(height: 2),
            const SizedBox(height: 14),

            // Section: Rekomendasi Warga (Grid 2-Column Matching MobileAppView.jsx)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Rekomendasi Warga',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: DesaColors.primary),
                  ),
                  Text(
                    '${provider.products.length} produk',
                    style: const TextStyle(fontSize: 11, color: DesaColors.muted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // 2-Column Product Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.64,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: provider.products.length,
                itemBuilder: (context, index) {
                  final p = provider.products[index];
                  final isFav = provider.favorites.contains(p.id);

                  return GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ProductDetailScreen(product: p)),
                      );
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: DesaColors.primary.withValues(alpha: 0.12)),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF3A3A38).withValues(alpha: 0.08),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Image + Favorite Heart Button
                          Expanded(
                            flex: 5,
                            child: Stack(
                              children: [
                                ClipRRect(
                                  borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                                  child: SizedBox(
                                    width: double.infinity,
                                    height: double.infinity,
                                    child: DesaImage(imageUrl: p.imageUrl, fit: BoxFit.cover),
                                  ),
                                ),
                                Positioned(
                                  top: 6,
                                  right: 6,
                                  child: GestureDetector(
                                    onTap: () => provider.toggleFavorite(p.id),
                                    child: Container(
                                      padding: const EdgeInsets.all(5),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.9),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        isFav ? Icons.favorite : Icons.favorite_border,
                                        size: 15,
                                        color: isFav ? Colors.red[600] : DesaColors.primary,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Product Info
                          Padding(
                            padding: const EdgeInsets.fromLTRB(10, 8, 10, 4),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  p.shopName,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 9.5, color: DesaColors.accent, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  p.name,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11.5,
                                    color: DesaColors.primary,
                                    height: 1.25,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  currencyFormat.format(p.price),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 12.5,
                                    color: DesaColors.primary,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const Spacer(),

                          // Action Buttons: + Keranjang & Beli
                          Padding(
                            padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                            child: Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton(
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(vertical: 6),
                                      side: BorderSide(color: DesaColors.primary.withValues(alpha: 0.2)),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    onPressed: () {
                                      provider.addToCart(p, qty: 1);
                                      provider.triggerToast('Keranjang', '${p.name} ditambahkan');
                                    },
                                    child: const Icon(Icons.shopping_bag_outlined, size: 14, color: DesaColors.primary),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: DesaColors.accent,
                                      padding: const EdgeInsets.symmetric(vertical: 6),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      elevation: 0,
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                    ),
                                    onPressed: () {
                                      provider.addToCart(p, qty: 1);
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => ProductDetailScreen(product: p)),
                                      );
                                    },
                                    child: const Text('Beli', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 20),

            // AI Consultation Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ChatAiScreen()),
                  );
                },
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: DesaColors.border),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: DesaColors.accent.withValues(alpha: 0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.auto_awesome, color: DesaColors.accent, size: 22),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Butuh Rekomendasi Oleh-Oleh?',
                              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: DesaColors.primary),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Tanyakan pada Asisten AI Desa seputar produk khas Sumedang.',
                              style: TextStyle(fontSize: 10.5, color: DesaColors.muted),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios, size: 14, color: DesaColors.muted),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
