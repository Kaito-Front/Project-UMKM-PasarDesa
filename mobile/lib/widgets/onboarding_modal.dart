import 'package:flutter/material.dart';
import '../core/theme/desa_colors.dart';

class OnboardingModal extends StatefulWidget {
  final VoidCallback onClose;

  const OnboardingModal({super.key, required this.onClose});

  @override
  State<OnboardingModal> createState() => _OnboardingModalState();
}

class _OnboardingModalState extends State<OnboardingModal> {
  int _currentSlide = 0;

  final List<Map<String, dynamic>> _slides = [
    {
      'icon': Icons.shopping_bag_rounded,
      'color': DesaColors.accent,
      'title': 'Belanja Produk Asli Desa',
      'desc': 'Dapatkan kain lurik, olahan pangan, dan kerajinan langsung dari UMKM Kabupaten Sumedang.',
    },
    {
      'icon': Icons.local_shipping_rounded,
      'color': DesaColors.highlight,
      'title': 'Pantau Pesanan Real-Time',
      'desc': 'Lacak pengerjaan produk oleh pengrajin dan perjalanan kurir desa hingga pesanan tiba di rumah Anda.',
    },
    {
      'icon': Icons.storefront_rounded,
      'color': DesaColors.primary,
      'title': 'Buka Toko UMKM Anda',
      'desc': 'Warga desa dapat beralih ke mode penjual untuk memajang produk dan menerima pesanan masuk.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final slide = _slides[_currentSlide];

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Container(
        padding: const EdgeInsets.all(26),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: DesaColors.primary.withValues(alpha: 0.15)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Slide Icon Circle
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder: (child, anim) => ScaleTransition(scale: anim, child: child),
              child: Container(
                key: ValueKey<int>(_currentSlide),
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                  color: DesaColors.bg,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: (slide['color'] as Color).withValues(alpha: 0.2)),
                ),
                child: Center(
                  child: Icon(
                    slide['icon'] as IconData,
                    size: 38,
                    color: slide['color'] as Color,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Slide Title & Description
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              child: Column(
                key: ValueKey<int>(_currentSlide),
                children: [
                  Text(
                    slide['title'] as String,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: DesaColors.primary,
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    slide['desc'] as String,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12.5,
                      height: 1.45,
                      color: DesaColors.text.withValues(alpha: 0.75),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Slide Feature Visual Badge
                  if (_currentSlide == 0)
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      alignment: WrapAlignment.center,
                      children: [
                        _buildFeatureTag('Kain Lurik ATBM'),
                        _buildFeatureTag('Kripik Tempe'),
                        _buildFeatureTag('Madu Hutan'),
                        _buildFeatureTag('Besek Bambu'),
                      ],
                    )
                  else if (_currentSlide == 1)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: DesaColors.bg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: DesaColors.primary.withValues(alpha: 0.12)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('Dipesan', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: DesaColors.primary)),
                          Icon(Icons.arrow_right_alt, size: 14, color: DesaColors.accent),
                          Text('Diproses', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: DesaColors.accent)),
                          Icon(Icons.arrow_right_alt, size: 14, color: DesaColors.accent),
                          Text('Dikirim', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: DesaColors.highlight)),
                          Icon(Icons.arrow_right_alt, size: 14, color: DesaColors.accent),
                          Text('Selesai', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.green)),
                        ],
                      ),
                    )
                  else
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: DesaColors.primary.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: DesaColors.primary.withValues(alpha: 0.15)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.shopping_bag, size: 13, color: DesaColors.primary),
                          SizedBox(width: 4),
                          Text('Mode Belanja', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: DesaColors.primary)),
                          SizedBox(width: 8),
                          Icon(Icons.sync_alt, size: 13, color: DesaColors.accent),
                          SizedBox(width: 8),
                          Icon(Icons.storefront, size: 13, color: DesaColors.accent),
                          SizedBox(width: 4),
                          Text('Mode Jualan UMKM', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: DesaColors.accent)),
                        ],
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Animated Expanding Indicator Pills
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(3, (index) {
                final isActive = _currentSlide == index;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOutCubic,
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: isActive ? 26 : 8,
                  height: 6,
                  decoration: BoxDecoration(
                    color: isActive ? DesaColors.accent : Colors.grey[300],
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
            const SizedBox(height: 26),

            // Navigation Buttons
            Row(
              children: [
                if (_currentSlide > 0) ...[
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: DesaColors.primary.withValues(alpha: 0.25)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () {
                        setState(() => _currentSlide--);
                      },
                      child: const Text(
                        'Sebelumnya',
                        style: TextStyle(
                          color: DesaColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: DesaColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                    onPressed: () {
                      if (_currentSlide < 2) {
                        setState(() => _currentSlide++);
                      } else {
                        widget.onClose();
                      }
                    },
                    child: Text(
                      _currentSlide == 2 ? 'Mulai Sekarang' : 'Lanjut',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureTag(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: DesaColors.bg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: DesaColors.primary.withValues(alpha: 0.15)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 5,
            height: 5,
            decoration: const BoxDecoration(
              color: DesaColors.accent,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 5),
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: DesaColors.primary,
            ),
          ),
        ],
      ),
    );
  }
}
