import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../core/widgets/desa_image.dart';
import '../providers/app_provider.dart';
import 'product_detail_screen.dart';

class CatalogScreen extends StatelessWidget {
  const CatalogScreen({super.key});

  static const List<String> _sumedangKecamatan = [
    'Semua Kecamatan',
    'Kecamatan Sumedang Utara',
    'Kecamatan Sumedang Selatan',
    'Kecamatan Cimalaka',
    'Kecamatan Tanjungsari',
    'Kecamatan Jatinangor',
    'Kecamatan Cimanggung',
    'Kecamatan Paseh',
    'Kecamatan Conggeang',
    'Kecamatan Buahdua',
    'Kecamatan Darmaraja',
    'Kecamatan Wado',
    'Kecamatan Jatigede',
    'Kecamatan Situraja',
    'Kecamatan Cisitu',
    'Kecamatan Sukasari',
  ];

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

    return Scaffold(
      backgroundColor: DesaColors.bg,
      appBar: AppBar(
        backgroundColor: DesaColors.bg,
        elevation: 0,
        title: const Text(
          'Katalog Produk Desa',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: DesaColors.primary),
        ),
      ),
      body: Column(
        children: [
          // Search & Filter Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Cari kain lurik, keripik, madu...',
                      hintStyle: const TextStyle(fontSize: 12, color: DesaColors.muted),
                      prefixIcon: const Icon(Icons.search, size: 20, color: DesaColors.muted),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: DesaColors.border),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: DesaColors.border),
                      ),
                    ),
                    onChanged: (val) => provider.setSearchQuery(val),
                  ),
                ),
                const SizedBox(width: 8),

                // Kecamatan Dropdown
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: DesaColors.border),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: provider.selectedKecamatan,
                      icon: const Icon(Icons.location_on_outlined, color: DesaColors.accent, size: 18),
                      items: _sumedangKecamatan.map((kec) {
                        return DropdownMenuItem(
                          value: kec,
                          child: Text(
                            kec == 'Semua Kecamatan' ? 'Wilayah' : kec.replaceAll('Kecamatan ', ''),
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: DesaColors.primary),
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) provider.setSelectedKecamatan(val);
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // Categories Horizontal Chips
          SizedBox(
            height: 42,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: provider.categories.length,
              separatorBuilder: (context, index) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final cat = provider.categories[index];
                final isSelected = provider.selectedCategory == cat.id;

                return ChoiceChip(
                  label: Text(cat.name),
                  selected: isSelected,
                  onSelected: (_) => provider.setSelectedCategory(cat.id),
                  selectedColor: DesaColors.primary,
                  backgroundColor: Colors.white,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : DesaColors.primary,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: isSelected ? DesaColors.primary : DesaColors.border,
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 12),

          // Product Grid
          Expanded(
            child: provider.products.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.search_off, size: 48, color: DesaColors.muted),
                        const SizedBox(height: 12),
                        const Text(
                          'Tidak ada produk yang cocok',
                          style: TextStyle(fontWeight: FontWeight.bold, color: DesaColors.primary),
                        ),
                        const SizedBox(height: 4),
                        TextButton(
                          onPressed: () {
                            provider.setSelectedCategory('semua');
                            provider.setSelectedKecamatan('Semua Kecamatan');
                            provider.setSearchQuery('');
                          },
                          child: const Text('Reset Filter', style: TextStyle(color: DesaColors.accent)),
                        ),
                      ],
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.72,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                    ),
                    itemCount: provider.products.length,
                    itemBuilder: (context, index) {
                      final product = provider.products[index];

                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ProductDetailScreen(product: product),
                            ),
                          );
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.03),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Image with Hero
                              Expanded(
                                flex: 6,
                                child: ClipRRect(
                                  borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                                  child: Hero(
                                    tag: 'product-${product.id}',
                                    child: DesaImage(
                                      imageUrl: product.imageUrl,
                                      fit: BoxFit.cover,
                                      width: double.infinity,
                                    ),
                                  ),
                                ),
                              ),

                              // Info
                              Expanded(
                                flex: 5,
                                child: Padding(
                                  padding: const EdgeInsets.all(10.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            product.shopName,
                                            style: const TextStyle(fontSize: 10, color: DesaColors.muted),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            product.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                              color: DesaColors.primary,
                                              height: 1.25,
                                            ),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),

                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            currencyFormat.format(product.price),
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w900,
                                              fontSize: 13,
                                              color: DesaColors.accent,
                                              fontFeatures: [FontFeature.tabularFigures()],
                                            ),
                                          ),
                                          InkWell(
                                            onTap: () {
                                              provider.addToCart(product);
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  content: Text('${product.name} dimasukkan ke keranjang'),
                                                  duration: const Duration(seconds: 1),
                                                  behavior: SnackBarBehavior.floating,
                                                ),
                                              );
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.all(5),
                                              decoration: BoxDecoration(
                                                color: DesaColors.primary,
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: const Icon(Icons.add_shopping_cart, size: 14, color: Colors.white),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
