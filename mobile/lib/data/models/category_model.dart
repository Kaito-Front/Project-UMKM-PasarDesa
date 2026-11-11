class CategoryItem {
  final String id;
  final String name;
  final String icon;

  CategoryItem({
    required this.id,
    required this.name,
    required this.icon,
  });

  factory CategoryItem.fromJson(Map<String, dynamic> json) {
    return CategoryItem(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      icon: json['icon']?.toString() ?? 'tag',
    );
  }
}
