import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../core/widgets/desa_image.dart';
import '../providers/app_provider.dart';
import '../widgets/add_product_modal.dart';

class SellerDashboardScreen extends StatefulWidget {
  final int activeTab;
  final Function(int) onTabChange;

  const SellerDashboardScreen({
    super.key,
    required this.activeTab,
    required this.onTabChange,
  });

  @override
  State<SellerDashboardScreen> createState() => _SellerDashboardScreenState();
}

class _SellerDashboardScreenState extends State<SellerDashboardScreen> {
  final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

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

    switch (widget.activeTab) {
      case 0:
        return _buildDashboardTab(provider);
      case 1:
        return _buildProdukTab(provider);
      case 2:
        return _buildPesananTab(provider);
      case 3:
        return _buildTokoTab(provider);
      default:
        return _buildDashboardTab(provider);
    }
  }

  Widget _buildDashboardTab(AppProvider provider) {
    final newOrders = provider.orders.where((o) => o.status == 'diproses').toList();
    final activeProducts = provider.allRawProducts.where((p) => !provider.isProductHidden(p.id)).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Shop Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    provider.currentUser.shopName ?? 'Griya Tenun Lurik Lestari',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: DesaColors.primary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'Kelola operasional UMKM Sumedang',
                    style: TextStyle(fontSize: 11, color: DesaColors.muted),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: DesaColors.highlight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Toko Aktif',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // 3 KPI Metric Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  'Pesanan Baru',
                  '${newOrders.length}',
                  DesaColors.accent,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricCard(
                  'Produk Aktif',
                  '${activeProducts.length}',
                  DesaColors.primary,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildMetricCard(
                  'Omset Minggu',
                  'Rp 2,4 Jt',
                  DesaColors.highlight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Promo Add Product Banner
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: DesaColors.primary,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: DesaColors.primary.withValues(alpha: 0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Punya Produk Baru?',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      SizedBox(height: 3),
                      Text(
                        'Pasang foto dan jual ke warga desa',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: DesaColors.accent,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: _openAddProduct,
                  child: const Text(
                    '+ Tambah',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Recent Orders Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Pesanan Masuk Terbaru',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: DesaColors.primary,
                ),
              ),
              TextButton(
                onPressed: () => widget.onTabChange(2),
                child: const Text(
                  'Lihat Semua',
                  style: TextStyle(color: DesaColors.accent, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Orders preview list
          if (provider.orders.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: DesaColors.border),
              ),
              child: const Center(
                child: Text('Belum ada pesanan masuk', style: TextStyle(color: DesaColors.muted, fontSize: 12)),
              ),
            )
          else
            ...provider.orders.take(2).map((ord) {
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          ord.buyerName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: DesaColors.primary),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: ord.status == 'diproses' ? DesaColors.statusDiprosesBg : DesaColors.statusDikirimBg,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            ord.status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: ord.status == 'diproses' ? DesaColors.statusDiprosesInk : DesaColors.statusDikirimInk,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${ord.productName} (${ord.qty} pcs)',
                      style: const TextStyle(fontSize: 12, color: DesaColors.muted),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 10, color: DesaColors.muted, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProdukTab(AppProvider provider) {
    final prods = provider.allRawProducts;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Kelola Produk Toko (${prods.length})',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: DesaColors.primary,
                ),
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: DesaColors.accent,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                onPressed: _openAddProduct,
                icon: const Icon(Icons.add, size: 16, color: Colors.white),
                label: const Text('Tambah', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: prods.length,
            itemBuilder: (context, index) {
              final p = prods[index];
              final isHidden = provider.isProductHidden(p.id);

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: SizedBox(
                        width: 58,
                        height: 58,
                        child: DesaImage(imageUrl: p.imageUrl, fit: BoxFit.cover),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            p.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: DesaColors.primary),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            currencyFormat.format(p.price),
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: DesaColors.accent),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Stok: ${p.stock} pcs • ${p.kecamatan}',
                            style: const TextStyle(fontSize: 11, color: DesaColors.muted),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      children: [
                        Switch(
                          value: !isHidden,
                          activeThumbColor: DesaColors.highlight,
                          onChanged: (_) => provider.toggleProductHidden(p.id),
                        ),
                        Text(
                          isHidden ? 'Nonaktif' : 'Aktif',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: isHidden ? DesaColors.muted : DesaColors.highlight,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPesananTab(AppProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Daftar Pesanan Masuk',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: DesaColors.primary),
          ),
        ),
        Expanded(
          child: provider.orders.isEmpty
              ? const Center(
                  child: Text('Belum ada pesanan masuk', style: TextStyle(color: DesaColors.muted)),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: provider.orders.length,
                  itemBuilder: (context, index) {
                    final ord = provider.orders[index];

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '#${ord.id}',
                                style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: ord.status == 'selesai'
                                      ? DesaColors.statusSelesaiBg
                                      : ord.status == 'dikirim'
                                          ? DesaColors.statusDikirimBg
                                          : DesaColors.statusDiprosesBg,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  ord.status.toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: ord.status == 'selesai'
                                        ? DesaColors.statusSelesaiInk
                                        : ord.status == 'dikirim'
                                            ? DesaColors.statusDikirimInk
                                            : DesaColors.statusDiprosesInk,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            ord.buyerName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: DesaColors.primary),
                          ),
                          Text(
                            '${ord.address} • ${ord.phone}',
                            style: const TextStyle(fontSize: 11, color: DesaColors.muted),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            '${ord.productName} (${ord.qty}x)',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: DesaColors.primary),
                          ),
                          const Divider(height: 16),
                          Row(
                            children: [
                              if (ord.status == 'diproses')
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue[600],
                                      padding: const EdgeInsets.symmetric(vertical: 8),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      elevation: 0,
                                    ),
                                    onPressed: () {
                                      provider.updateOrderStatus(ord.id, 'dikirim');
                                      provider.triggerToast('Pesanan Dikirim', 'Status pesanan #${ord.id} diubah ke Dikirim');
                                    },
                                    child: const Text('Tandai Dikirim', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              if (ord.status == 'dikirim')
                                Expanded(
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: DesaColors.highlight,
                                      padding: const EdgeInsets.symmetric(vertical: 8),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      elevation: 0,
                                    ),
                                    onPressed: () {
                                      provider.updateOrderStatus(ord.id, 'selesai');
                                      provider.triggerToast('Pesanan Selesai', 'Status pesanan #${ord.id} berhasil diselesaikan');
                                    },
                                    child: const Text('Tandai Selesai', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              if (ord.status == 'diproses' || ord.status == 'dikirim')
                                const SizedBox(width: 8),
                              OutlinedButton.icon(
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                                onPressed: () {
                                  showDialog(
                                    context: context,
                                    builder: (_) => AlertDialog(
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                      title: const Text('Kontak Warga', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                                      content: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text('Nama: ${ord.buyerName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                          const SizedBox(height: 4),
                                          Text('Telepon: ${ord.phone}', style: const TextStyle(fontSize: 12)),
                                          const SizedBox(height: 4),
                                          Text('Alamat: ${ord.address}', style: const TextStyle(fontSize: 12)),
                                        ],
                                      ),
                                      actions: [
                                        TextButton(
                                          onPressed: () => Navigator.pop(context),
                                          child: const Text('Tutup'),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                                icon: const Icon(Icons.phone, size: 14, color: DesaColors.accent),
                                label: const Text('Info Kontak', style: TextStyle(color: DesaColors.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildTokoTab(AppProvider provider) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
            ),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: DesaColors.accent,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Center(child: Icon(Icons.storefront, color: Colors.white, size: 28)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        provider.currentUser.shopName ?? 'Griya Tenun Lurik Lestari',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: DesaColors.primary),
                      ),
                      const SizedBox(height: 3),
                      const Text(
                        'Kec. Sumedang Selatan, Kab. Sumedang',
                        style: TextStyle(fontSize: 11, color: DesaColors.muted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.edit_note, color: DesaColors.primary),
                  title: const Text('Kelola Data Toko', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  trailing: const Icon(Icons.chevron_right, size: 18),
                  onTap: () {
                    provider.triggerToast('Kelola Toko', 'Fitur edit data toko siap digunakan.');
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.swap_horiz_rounded, color: DesaColors.accent),
                  title: const Text('Ganti ke Mode Pembeli', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: DesaColors.accent)),
                  trailing: const Icon(Icons.chevron_right, size: 18, color: DesaColors.accent),
                  onTap: () {
                    provider.setRole('pembeli');
                    provider.triggerToast('Beralih Mode', 'Sekarang Anda berada di Mode Pembeli.');
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
