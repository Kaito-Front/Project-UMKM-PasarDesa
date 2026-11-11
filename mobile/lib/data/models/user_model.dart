class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role; // 'pembeli', 'penjual', 'admin'
  final String? shopName;
  final String? shopId;
  final bool isEmailVerified;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.role = 'pembeli',
    this.shopName,
    this.shopId,
    this.isEmailVerified = true,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? 'USR-01',
      name: json['name']?.toString() ?? 'Warga Sumedang',
      email: json['email']?.toString() ?? 'warga@pasardesa.id',
      phone: json['phone']?.toString() ?? '081915194171',
      role: json['role']?.toString() ?? 'pembeli',
      shopName: json['shopName']?.toString() ?? (json['shop'] != null ? json['shop']['name'] : null),
      shopId: json['shopId']?.toString() ?? (json['shop'] != null ? json['shop']['id']?.toString() : null),
      isEmailVerified: json['isEmailVerified'] ?? json['email_verified_at'] != null,
    );
  }
}
