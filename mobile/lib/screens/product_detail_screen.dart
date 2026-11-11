import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../core/widgets/lurik_divider.dart';
import '../core/widgets/desa_image.dart';
import '../data/models/product_model.dart';
import '../providers/app_provider.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> with SingleTickerProviderStateMixin {
  int _qty = 1;
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 180),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.94).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    final provider = Provider.of<AppProvider>(context);
    final isFav = provider.favorites.contains(widget.product.id);

    return Scaffold(
      backgroundColor: DesaColors.bg,
      appBar: AppBar(
        backgroundColor: DesaColors.bg,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: DesaColors.primary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.product.name,
          style: const TextStyle(
            color: DesaColors.primary,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          IconButton(
            icon: Icon(
              isFav ? Icons.favorite : Icons.favorite_border,
              color: isFav ? DesaColors.accent : DesaColors.muted,
            ),
            onPressed: () => provider.toggleFavorite(widget.product.id),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Hero Image with Zoom Transition
            Hero(
              tag: 'product-${widget.product.id}',
              child: AspectRatio(
                aspectRatio: 1.15,
                child: Container(
                  color: Colors.white,
                  child: DesaImage(
                    imageUrl: widget.product.imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),

            const LurikDivider(height: 3),

            // Product Meta & Content
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Shop & Verified Village Badge
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: DesaColors.highlight.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: DesaColors.highlight.withValues(alpha: 0.3)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.verified, size: 13, color: DesaColors.highlight),
                            SizedBox(width: 4),
                            Text(
                              'Otentik BUMDes Sumedang',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: DesaColors.highlight),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, size: 18, color: Colors.amber),
                          const SizedBox(width: 3),
                          Text(
                            '${widget.product.rating} (${widget.product.reviewCount} ulasan)',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: DesaColors.muted),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // Product Title
                  Text(
                    widget.product.name,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: DesaColors.primary,
                      height: 1.25,
                      letterSpacing: -0.3,
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Price (Tabular Figures)
                  Text(
                    currencyFormat.format(widget.product.price),
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: DesaColors.accent,
                      fontFeatures: [FontFeature.tabularFigures()],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Shop Info Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: DesaColors.border),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: DesaColors.primary,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.storefront, color: Colors.white, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.product.shopName,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: DesaColors.primary),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${widget.product.desa != null ? '${widget.product.desa}, ' : ''}${widget.product.kecamatan}',
                                style: const TextStyle(fontSize: 12, color: DesaColors.muted),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Description
                  const Text(
                    'Deskripsi Produk',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: DesaColors.primary),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.product.description,
                    style: const TextStyle(fontSize: 14, color: DesaColors.text, height: 1.6),
                  ),

                  const SizedBox(height: 24),

                  // Quantity Selector
                  Row(
                    children: [
                      const Text(
                        'Kuantitas:',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: DesaColors.primary),
                      ),
                      const Spacer(),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: DesaColors.border),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 18),
                              onPressed: _qty > 1 ? () => setState(() => _qty--) : null,
                            ),
                            Text(
                              '$_qty',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                fontFeatures: [FontFeature.tabularFigures()],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.add, size: 18),
                              onPressed: _qty < widget.product.stock ? () => setState(() => _qty++) : null,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 100), // Bottom padding for sticky actions
                ],
              ),
            ),
          ],
        ),
      ),

      // Sticky Bottom Action Bar
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: DesaColors.border.withValues(alpha: 0.6))),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Add to Cart Button
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: DesaColors.primary, width: 1.5),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () {
                    provider.addToCart(widget.product, qty: _qty);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('$_qty ${widget.product.name} dimasukkan ke keranjang'),
                        backgroundColor: DesaColors.primary,
                        behavior: SnackBarBehavior.floating,
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.shopping_bag_outlined, color: DesaColors.primary, size: 18),
                      SizedBox(width: 6),
                      Text(
                        'Keranjang',
                        style: TextStyle(fontWeight: FontWeight.bold, color: DesaColors.primary, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Buy Now Button
              Expanded(
                flex: 1,
                child: ScaleTransition(
                  scale: _scaleAnimation,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: DesaColors.accent,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                    onPressed: () {
                      provider.addToCart(widget.product, qty: _qty);
                      Navigator.pop(context); // Back to caller and user can tap cart
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Produk siap dicheckout dari keranjang!'),
                          backgroundColor: DesaColors.accent,
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    child: const Text(
                      'Beli Sekarang',
                      style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
