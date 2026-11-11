class ApiConstants {
  // Gunakan 10.0.2.2 untuk Android Emulator, atau 172.16.12.234 untuk HP fisik via Wi-Fi/LAN
  static const String emulatorBaseUrl = 'http://10.0.2.2:8000/api';
  static const String lanBaseUrl = 'http://172.16.12.234:8000/api';

  // Default aktif untuk emulator
  static String activeBaseUrl = emulatorBaseUrl;

  static const String products = '/products';
  static const String categories = '/categories';
  static const String shops = '/shops';
  static const String orders = '/orders';
  static const String stats = '/stats';
  static const String chatAi = '/chat/ai';
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';
}
