class OrderItem {
  final String id;
  final String productName;
  final String buyerName;
  final String phone;
  final String date;
  final int total;
  final int qty;
  final String status; // diproses, dikirim, selesai, diambil, ditolak
  final String shopName;
  final String kecamatan;
  final String address;
  final String? shippingMethod;
  final String? paymentMethod;
  final String? waybillNumber;

  OrderItem({
    required this.id,
    required this.productName,
    required this.buyerName,
    required this.phone,
    required this.date,
    required this.total,
    required this.qty,
    required this.status,
    required this.shopName,
    required this.kecamatan,
    required this.address,
    this.shippingMethod = 'Kurir Kilat Desa',
    this.paymentMethod = 'Bayar di Tempat (COD)',
    this.waybillNumber,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    final rawId = json['id']?.toString() ?? 'ORD-001';
    return OrderItem(
      id: rawId,
      productName: json['productName']?.toString() ?? json['product_name']?.toString() ?? 'Pesanan Produk Desa',
      buyerName: json['buyerName']?.toString() ?? json['buyer_name']?.toString() ?? 'Warga Desa',
      phone: json['phone']?.toString() ?? '081915194171',
      date: json['date']?.toString() ?? 'Hari ini',
      total: json['total'] is int ? json['total'] : int.tryParse(json['total']?.toString() ?? '0') ?? 0,
      qty: json['qty'] is int ? json['qty'] : int.tryParse(json['qty']?.toString() ?? '1') ?? 1,
      status: json['status']?.toString() ?? 'diproses',
      shopName: json['shopName']?.toString() ?? json['shop_name']?.toString() ?? 'Sentra UMKM',
      kecamatan: json['kecamatan']?.toString() ?? 'Sumedang',
      address: json['address']?.toString() ?? 'Kabupaten Sumedang, Jawa Barat',
      shippingMethod: json['shippingMethod']?.toString() ?? 'Kurir Kilat Desa',
      paymentMethod: json['paymentMethod']?.toString() ?? 'Bayar di Tempat (COD)',
      waybillNumber: json['waybillNumber']?.toString() ?? 'SMD-EXP-${rawId.replaceAll(RegExp(r'[^0-9]'), '')}',
    );
  }

  int get stepProgress {
    switch (status) {
      case 'diproses':
        return 2;
      case 'dikirim':
        return 3;
      case 'selesai':
      case 'diambil':
        return 4;
      case 'ditolak':
        return 0;
      default:
        return 1;
    }
  }

  String get statusLabel {
    switch (status) {
      case 'diproses':
        return 'Diproses Pengrajin';
      case 'dikirim':
        return 'Dalam Pengiriman Kurir';
      case 'selesai':
        return 'Pesanan Selesai';
      case 'diambil':
        return 'Sudah Diambil';
      case 'ditolak':
        return 'Pesanan Dibatalkan';
      default:
        return 'Pesanan Masuk';
    }
  }

  OrderItem copyWith({String? status}) {
    return OrderItem(
      id: id,
      productName: productName,
      buyerName: buyerName,
      phone: phone,
      date: date,
      total: total,
      qty: qty,
      status: status ?? this.status,
      shopName: shopName,
      kecamatan: kecamatan,
      address: address,
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
      waybillNumber: waybillNumber,
    );
  }
}
