import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../theme/desa_colors.dart';

class DesaImage extends StatelessWidget {
  final String imageUrl;
  final BoxFit fit;
  final double? width;
  final double? height;

  const DesaImage({
    super.key,
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
  });

  String _resolveLocalAsset(String url) {
    if (url.contains('kain-lurik')) return 'assets/images/kain-lurik.jpg';
    if (url.contains('kripik-tempe')) return 'assets/products/kripik-tempe.jpg';
    if (url.contains('madu-hutan')) return 'assets/products/madu-hutan.jpg';
    if (url.contains('besek-bambu')) return 'assets/products/besek-bambu.jpg';
    if (url.contains('kopi-robusta')) return 'assets/products/kopi-robusta.jpg';
    if (url.contains('gula-aren')) return 'assets/products/gula-aren.jpg';
    if (url.contains('pwa-')) return 'assets/images/pwa-192x192.png';
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final localAsset = _resolveLocalAsset(imageUrl);
    if (localAsset.isNotEmpty) {
      return Image.asset(
        localAsset,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => _fallbackWidget(),
      );
    }

    if (imageUrl.startsWith('assets/')) {
      return Image.asset(
        imageUrl,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => _fallbackWidget(),
      );
    }

    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) => Container(
        color: DesaColors.surfaceMuted,
        child: const Center(
          child: CircularProgressIndicator(strokeWidth: 2, color: DesaColors.accent),
        ),
      ),
      errorWidget: (context, url, error) => _fallbackWidget(),
    );
  }

  Widget _fallbackWidget() {
    return Container(
      width: width,
      height: height,
      color: DesaColors.surfaceMuted,
      child: const Center(
        child: Icon(Icons.storefront, color: DesaColors.muted, size: 28),
      ),
    );
  }
}
