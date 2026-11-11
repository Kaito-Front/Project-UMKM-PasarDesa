import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../providers/app_provider.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  static const List<String> _sumedangKecamatan = [
    'Kecamatan Sumedang Utara',
    'Kecamatan Sumedang Selatan',
    'Kecamatan Cimalaka',
    'Kecamatan Tanjungsari',
    'Kecamatan Jatinangor',
    'Kecamatan Cimanggung',
    'Kecamatan Paseh',
    'Kecamatan Conggeang',
    'Kecamatan Buahdua',
    'Kecamatan Tanjungkerta',
    'Kecamatan Tanjungmedar',
    'Kecamatan Surian',
    'Kecamatan Tomo',
    'Kecamatan Ujungjaya',
    'Kecamatan Jatigede',
    'Kecamatan Darmaraja',
    'Kecamatan Wado',
    'Kecamatan Jatinunggal',
    'Kecamatan Cisitu',
    'Kecamatan Situraja',
    'Kecamatan Ganeas',
    'Kecamatan Cisarua',
    'Kecamatan Sukasari',
    'Kecamatan Pamulihan',
    'Kecamatan Rancakalong',
    'Kecamatan Cibugel',
  ];

  void _showCheckoutSheet(BuildContext context, AppProvider provider) {
    String selectedKec = _sumedangKecamatan[0];
    final addressCtrl = TextEditingController(text: 'Dusun Mekarsari RT 02/RW 03');
    final nameCtrl = TextEditingController(text: provider.currentUser.name);
    final phoneCtrl = TextEditingController(text: provider.currentUser.phone);
    String selectedPayment = 'Bayar di Tempat (COD)';
    String selectedShipping = 'Kurir Kilat Desa Sumedang';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);

            return Container(
              padding: EdgeInsets.only(
                top: 20,
                left: 20,
                right: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              decoration: const BoxDecoration(
                color: DesaColors.bg,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: DesaColors.border,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Checkout Pesanan Desa',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: DesaColors.primary),
                    ),
                    const Text(
                      'Pengiriman resmi dikelola BUMDes & Kurir Desa Sumedang',
                      style: TextStyle(fontSize: 12, color: DesaColors.muted),
                    ),
                    const SizedBox(height: 16),

                    // Nama Penerima
                    TextField(
                      controller: nameCtrl,
                      decoration: InputDecoration(
                        labelText: 'Nama Lengkap Penerima',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: DesaColors.border)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Telepon
                    TextField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Nomor WhatsApp / HP',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: DesaColors.border)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Dropdown Kecamatan
                    DropdownButtonFormField<String>(
                      initialValue: selectedKec,
                      decoration: InputDecoration(
                        labelText: 'Kecamatan Sumedang',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: DesaColors.border)),
                      ),
                      items: _sumedangKecamatan.map((kec) => DropdownMenuItem(value: kec, child: Text(kec, style: const TextStyle(fontSize: 13)))).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedKec = val);
                      },
                    ),
                    const SizedBox(height: 12),

                    // Alamat Lengkap
                    TextField(
                      controller: addressCtrl,
                      maxLines: 2,
                      decoration: InputDecoration(
                        labelText: 'Alamat Detail (Dusun, RT/RW, Patokan)',
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: DesaColors.border)),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Total & Konfirmasi Bayar
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Pembayaran:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text(
                          currencyFormat.format(provider.cartSubtotal),
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: DesaColors.accent),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: DesaColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: () async {
                          Navigator.pop(ctx);
                          final order = await provider.checkoutCart(
                            buyerName: nameCtrl.text.trim(),
                            phone: phoneCtrl.text.trim(),
                            kecamatan: selectedKec,
                            address: '${addressCtrl.text.trim()}, $selectedKec, Kabupaten Sumedang',
                            paymentMethod: selectedPayment,
                            shippingMethod: selectedShipping,
                          );

                          if (order != null && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Pesanan #${order.id} berhasil dibuat! Buka tab Pesanan untuk melacak.'),
                                backgroundColor: DesaColors.highlight,
                                behavior: SnackBarBehavior.floating,
                                duration: const Duration(seconds: 4),
                              ),
                            );
                          }
                        },
                        child: const Text(
                          'Pesan Sekarang (BUMDes Verified)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

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
          'Keranjang Belanja',
          style: TextStyle(color: DesaColors.primary, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        actions: [
          if (provider.cart.isNotEmpty)
            TextButton(
              onPressed: () => provider.clearCart(),
              child: const Text('Kosongkan', style: TextStyle(color: DesaColors.accent, fontWeight: FontWeight.bold)),
            ),
        ],
      ),
      body: provider.cart.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: DesaColors.primary.withValues(alpha: 0.08),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.shopping_bag_outlined, size: 36, color: DesaColors.primary),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Keranjang Belanja Masih Kosong',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: DesaColors.primary),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Jelajahi karya pengrajin & UMKM Sumedang untuk mulai berbelanja.',
                    style: TextStyle(fontSize: 12, color: DesaColors.muted),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: provider.cart.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = provider.cart[index];
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: DesaColors.border),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: CachedNetworkImage(
                                imageUrl: item.product.imageUrl,
                                width: 64,
                                height: 64,
                                fit: BoxFit.cover,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.product.name,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: DesaColors.primary),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    item.product.shopName,
                                    style: const TextStyle(fontSize: 11, color: DesaColors.muted),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    currencyFormat.format(item.product.price),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                      color: DesaColors.accent,
                                      fontFeatures: [FontFeature.tabularFigures()],
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Qty Stepper
                            Row(
                              children: [
                                InkWell(
                                  onTap: () => provider.updateCartQty(item.product.id, item.qty - 1),
                                  child: Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      color: DesaColors.surfaceMuted,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(Icons.remove, size: 16),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10),
                                  child: Text(
                                    '${item.qty}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontFeatures: [FontFeature.tabularFigures()],
                                    ),
                                  ),
                                ),
                                InkWell(
                                  onTap: () => provider.updateCartQty(item.product.id, item.qty + 1),
                                  child: Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      color: DesaColors.surfaceMuted,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(Icons.add, size: 16),
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

                // Cart Bottom Bar
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(top: BorderSide(color: DesaColors.border.withValues(alpha: 0.6))),
                  ),
                  child: SafeArea(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('Total Pembayaran', style: TextStyle(fontSize: 11, color: DesaColors.muted)),
                            Text(
                              currencyFormat.format(provider.cartSubtotal),
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 18,
                                color: DesaColors.primary,
                                fontFeatures: [FontFeature.tabularFigures()],
                              ),
                            ),
                          ],
                        ),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: DesaColors.accent,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: 0,
                          ),
                          onPressed: () => _showCheckoutSheet(context, provider),
                          child: const Text(
                            'Checkout',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
