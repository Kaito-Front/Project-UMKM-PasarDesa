class Product {
  final String id;
  final String name;
  final int price;
  final int stock;
  final String category;
  final String kecamatan;
  final String? desa;
  final String shopName;
  final String imageUrl;
  final String description;
  final double rating;
  final int reviewCount;
  final bool isVerified;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.stock,
    required this.category,
    required this.kecamatan,
    this.desa,
    required this.shopName,
    required this.imageUrl,
    required this.description,
    this.rating = 4.9,
    this.reviewCount = 28,
    this.isVerified = true,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Produk Desa',
      price: json['price'] is int ? json['price'] : int.tryParse(json['price']?.toString() ?? '0') ?? 0,
      stock: json['stock'] is int ? json['stock'] : int.tryParse(json['stock']?.toString() ?? '10') ?? 10,
      category: json['category']?.toString() ?? 'kuliner',
      kecamatan: json['kecamatan']?.toString() ?? 'Sumedang',
      desa: json['desa']?.toString(),
      shopName: json['shopName']?.toString() ?? (json['shop'] != null ? (json['shop']['name']?.toString() ?? 'Sentra UMKM') : 'Sentra UMKM'),
      imageUrl: json['image']?.toString() ?? json['imageUrl']?.toString() ?? 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=600&q=80',
      description: json['description']?.toString() ?? 'Produk otentik kerajinan dan pangan khas desa Kabupaten Sumedang.',
      rating: (json['rating'] is num) ? (json['rating'] as num).toDouble() : 4.9,
      reviewCount: json['reviewCount'] is int ? json['reviewCount'] : 24,
      isVerified: json['isVerified'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'stock': stock,
      'category': category,
      'kecamatan': kecamatan,
      'desa': desa,
      'shopName': shopName,
      'image': imageUrl,
      'description': description,
      'rating': rating,
      'reviewCount': reviewCount,
      'isVerified': isVerified,
    };
  }
}
