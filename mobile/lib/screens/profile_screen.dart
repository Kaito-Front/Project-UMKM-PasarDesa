import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../providers/app_provider.dart';
import 'chat_ai_screen.dart';

class ProfileScreen extends StatelessWidget {
  final VoidCallback? onOpenOnboarding;
  final VoidCallback? onOpenSplash;

  const ProfileScreen({
    super.key,
    this.onOpenOnboarding,
    this.onOpenSplash,
  });

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.currentUser;
    final isSeller = provider.currentRole == 'penjual';

    return Scaffold(
      backgroundColor: DesaColors.bg,
      appBar: AppBar(
        backgroundColor: DesaColors.bg,
        elevation: 0,
        title: const Text(
          'Akun Profil Warga',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: DesaColors.primary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // User Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: DesaColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: DesaColors.primary,
                    child: Text(
                      user.name.isNotEmpty ? user.name[0] : 'W',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.name,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: DesaColors.primary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user.phone,
                          style: const TextStyle(fontSize: 12, color: DesaColors.muted),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: DesaColors.highlight.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Warga Terverifikasi',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: DesaColors.highlight),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Role Toggle Button
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSeller ? DesaColors.primary : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isSeller ? DesaColors.primary : DesaColors.border),
              ),
              child: Row(
                children: [
                  Icon(
                    isSeller ? Icons.store : Icons.shopping_bag_outlined,
                    color: isSeller ? Colors.white : DesaColors.primary,
                    size: 24,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isSeller ? 'Mode Toko Penjual Aktif' : 'Buka Dashboard Toko Penjual',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: isSeller ? Colors.white : DesaColors.primary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          isSeller 
                              ? user.shopName ?? 'Griya Tenun Lurik Lestari' 
                              : 'Beralih ke mode penjual UMKM Sumedang',
                          style: TextStyle(
                            fontSize: 11,
                            color: isSeller ? Colors.white.withValues(alpha: 0.75) : DesaColors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Switch(
                    value: isSeller,
                    activeThumbColor: DesaColors.accent,
                    onChanged: (val) {
                      provider.setRole(val ? 'penjual' : 'pembeli');
                      provider.triggerToast('Beralih Mode', val ? 'Mode Toko Penjual diaktifkan' : 'Mode Pembeli diaktifkan');
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Settings & Info List
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: DesaColors.border),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.help_outline, color: DesaColors.accent),
                    title: const Text('Tampilkan Panduan Onboarding', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Pelajari cara belanja dan buka toko UMKM', style: TextStyle(fontSize: 11, color: DesaColors.muted)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: DesaColors.muted),
                    onTap: onOpenOnboarding,
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.animation, color: DesaColors.primary),
                    title: const Text('Tampilkan Splash Screen', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Animasi logo Palet Lurik Kontemporer', style: TextStyle(fontSize: 11, color: DesaColors.muted)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: DesaColors.muted),
                    onTap: onOpenSplash,
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.auto_awesome, color: DesaColors.accent),
                    title: const Text('Asisten AI Desa Sumedang', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Konsultasi produk dan rekomendasi BUMDes', style: TextStyle(fontSize: 11, color: DesaColors.muted)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: DesaColors.muted),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ChatAiScreen()),
                      );
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.phone_android, color: DesaColors.highlight),
                    title: const Text('Status Versi Aplikasi', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Pasar Desa Mobile v1.2.0 (Lurik Kontemporer)', style: TextStyle(fontSize: 11, color: DesaColors.muted)),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: DesaColors.highlight.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text('v1.2.0', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: DesaColors.highlight)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
