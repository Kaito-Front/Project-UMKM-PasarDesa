import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/desa_colors.dart';
import '../providers/app_provider.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final Set<String> _expandedOrders = {};

  Widget _buildStepIndicator(int currentStep) {
    const steps = [
      {'num': 1, 'label': 'Diterima'},
      {'num': 2, 'label': 'Diproses'},
      {'num': 3, 'label': 'Dikirim'},
      {'num': 4, 'label': 'Selesai'},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
      decoration: BoxDecoration(
        color: DesaColors.surfaceMuted.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: steps.map((s) {
          final stepNum = s['num'] as int;
          final label = s['label'] as String;
          final isDone = stepNum < currentStep;
          final isCurrent = stepNum == currentStep;

          return Expanded(
            child: Column(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: isDone 
                        ? DesaColors.accent 
                        : isCurrent 
                            ? DesaColors.primary 
                            : Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isDone || isCurrent ? Colors.transparent : DesaColors.border,
                      width: 1.5,
                    ),
                    boxShadow: isCurrent ? [
                      BoxShadow(color: DesaColors.primary.withValues(alpha: 0.25), blurRadius: 6, spreadRadius: 1)
                    ] : null,
                  ),
                  child: Center(
                    child: isDone
                        ? const Icon(Icons.check, size: 16, color: Colors.white)
                        : Text(
                            '$stepNum',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: isCurrent ? Colors.white : DesaColors.muted,
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: isCurrent ? FontWeight.w900 : FontWeight.w600,
                    color: isCurrent ? DesaColors.primary : isDone ? DesaColors.accent : DesaColors.muted,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        }).toList(),
      ),
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
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Pesanan Saya',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: DesaColors.primary),
            ),
            Text(
              'Pelacakan status pengerjaan & pengiriman real-time',
              style: TextStyle(fontSize: 11, color: DesaColors.muted),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: DesaColors.primary),
            onPressed: () => provider.initData(),
            tooltip: 'Segarkan Pesanan',
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs (Semua, Diproses, Dikirim, Selesai)
          Container(
            height: 46,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                {'id': 'semua', 'label': 'Semua'},
                {'id': 'diproses', 'label': 'Diproses'},
                {'id': 'dikirim', 'label': 'Dikirim'},
                {'id': 'selesai', 'label': 'Selesai'},
              ].map((tab) {
                final isSelected = provider.orderFilter == tab['id'];
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(tab['label']!),
                    selected: isSelected,
                    onSelected: (_) => provider.setOrderFilter(tab['id']!),
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
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 8),

          // Orders List
          Expanded(
            child: provider.orders.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: DesaColors.primary.withValues(alpha: 0.08),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.local_shipping_outlined, size: 30, color: DesaColors.primary),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Tidak Ada Pesanan',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: DesaColors.primary),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Belum ada transaksi di kategori filter ini.',
                          style: TextStyle(fontSize: 12, color: DesaColors.muted),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: provider.orders.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 14),
                    itemBuilder: (context, index) {
                      final order = provider.orders[index];
                      final isExpanded = _expandedOrders.contains(order.id);

                      Color statusBg = DesaColors.statusDiprosesBg;
                      Color statusInk = DesaColors.statusDiprosesInk;
                      if (order.status == 'dikirim') {
                        statusBg = DesaColors.statusDikirimBg;
                        statusInk = DesaColors.statusDikirimInk;
                      } else if (order.status == 'selesai' || order.status == 'diambil') {
                        statusBg = DesaColors.statusSelesaiBg;
                        statusInk = DesaColors.statusSelesaiInk;
                      } else if (order.status == 'ditolak') {
                        statusBg = DesaColors.statusBatalBg;
                        statusInk = DesaColors.statusBatalInk;
                      }

                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: DesaColors.border.withValues(alpha: 0.8)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.03),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Order ID & Status Badge
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: DesaColors.surfaceMuted,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        '#${order.id}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 11,
                                          color: DesaColors.primary,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      order.date,
                                      style: const TextStyle(fontSize: 11, color: DesaColors.muted),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: statusBg,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    order.statusLabel,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: statusInk,
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 12),

                            // 4-Stage Progress Stepper
                            if (order.status != 'ditolak') ...[
                              _buildStepIndicator(order.stepProgress),
                              const SizedBox(height: 12),
                            ],

                            // Product Name & Shop
                            Text(
                              order.productName,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: DesaColors.primary),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              '${order.shopName} • ${order.qty} pcs',
                              style: const TextStyle(fontSize: 12, color: DesaColors.muted),
                            ),

                            const SizedBox(height: 12),
                            const Divider(height: 1, color: DesaColors.border),
                            const SizedBox(height: 10),

                            // Total & Action Button
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Total Pesanan', style: TextStyle(fontSize: 10, color: DesaColors.muted)),
                                    Text(
                                      currencyFormat.format(order.total),
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w900,
                                        color: DesaColors.primary,
                                        fontFeatures: [FontFeature.tabularFigures()],
                                      ),
                                    ),
                                  ],
                                ),

                                Row(
                                  children: [
                                    // Accordion toggle button
                                    IconButton(
                                      icon: Icon(
                                        isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                                        color: DesaColors.muted,
                                        size: 22,
                                      ),
                                      onPressed: () {
                                        setState(() {
                                          if (isExpanded) {
                                            _expandedOrders.remove(order.id);
                                          } else {
                                            _expandedOrders.add(order.id);
                                          }
                                        });
                                      },
                                    ),

                                    // Confirm Receipt Button if Dikirim
                                    if (order.status == 'dikirim')
                                      ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: DesaColors.highlight,
                                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                          elevation: 0,
                                        ),
                                        onPressed: () async {
                                          await provider.confirmOrderReceived(order.id);
                                          if (context.mounted) {
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(
                                                content: Text('Terima kasih! Pesanan #${order.id} telah selesai diterima.'),
                                                backgroundColor: DesaColors.highlight,
                                                behavior: SnackBarBehavior.floating,
                                              ),
                                            );
                                          }
                                        },
                                        child: const Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.check_circle_outline, size: 15, color: Colors.white),
                                            SizedBox(width: 4),
                                            Text('Diterima', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                                          ],
                                        ),
                                      ),
                                  ],
                                ),
                              ],
                            ),

                            // Expanded Details
                            if (isExpanded) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: DesaColors.surfaceMuted,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Penerima: ${order.buyerName} (${order.phone})', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 4),
                                    Text('Alamat: ${order.address}', style: const TextStyle(fontSize: 11, color: DesaColors.text)),
                                    const SizedBox(height: 4),
                                    Text('Kecamatan: ${order.kecamatan}', style: const TextStyle(fontSize: 11, color: DesaColors.text)),
                                    const SizedBox(height: 4),
                                    Text('Surat Jalan: ${order.waybillNumber ?? 'SMD-EXP'}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: DesaColors.accent)),
                                  ],
                                ),
                              ),
                            ],
                          ],
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
