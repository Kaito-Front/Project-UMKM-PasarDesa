import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../core/widgets/bounceable.dart';
import '../core/widgets/desa_image.dart';
import '../data/models/product_model.dart';
import '../providers/app_provider.dart';
import '../screens/product_detail_screen.dart';

/// Modal Bottom Sheet matching MobileAppView.jsx lines 1215-1290
class ProductDetailSheet extends StatelessWidget {
  final Product product;

  const ProductDetailSheet({super.key, required this.product});

  static Future<void> show(BuildContext context, Product product) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ProductDetailSheet(product: product),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context, listen: false);
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 25,
            offset: Offset(0, -6),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Drag handle
              Center(
                child: Container(
                  width: 44,
                  height: 4.5,
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),

              // Category + Close X button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    product.category.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                      color: DesaColors.accent,
                    ),
                  ),
                  Bounceable(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      padding: const EdgeInsets.all(5),
                      decoration: const BoxDecoration(
                        color: DesaColors.bg,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.close, size: 16, color: DesaColors.primary),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Product Image (Aspect Video 16:9)
              AspectRatio(
                aspectRatio: 16 / 9,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: DesaImage(imageUrl: product.imageUrl, fit: BoxFit.cover),
                ),
              ),
              const SizedBox(height: 14),

              // Product Name & Price
              Text(
                product.name,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: DesaColors.primary,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                currencyFormat.format(product.price),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: DesaColors.accent,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 8),

              // Description
              Text(
                product.description,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 12,
                  height: 1.45,
                  color: DesaColors.text.withValues(alpha: 0.75),
                ),
              ),
              const SizedBox(height: 18),

              // Action Buttons: [+ Keranjang] and [Beli Sekarang]
              Row(
                children: [
                  Expanded(
                    child: Bounceable(
                      onTap: () {
                        provider.addToCart(product, qty: 1);
                        provider.triggerToast('Keranjang', '${product.name} ditambahkan');
                        Navigator.pop(context);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: DesaColors.primary.withValues(alpha: 0.25)),
                          color: Colors.white,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.shopping_bag_outlined, size: 16, color: DesaColors.primary),
                            SizedBox(width: 6),
                            Text(
                              '+ Keranjang',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: DesaColors.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Bounceable(
                      onTap: () {
                        provider.addToCart(product, qty: 1);
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => ProductDetailScreen(product: product)),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: DesaColors.accent,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(
                              color: DesaColors.accent.withValues(alpha: 0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            'Beli Sekarang',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
