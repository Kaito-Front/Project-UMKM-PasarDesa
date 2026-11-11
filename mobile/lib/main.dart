import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'core/theme/desa_colors.dart';
import 'providers/app_provider.dart';
import 'screens/main_navigation_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Clean status bar overlay matching Oatmilk ground
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: const PasarDesaApp(),
    ),
  );
}

class PasarDesaApp extends StatelessWidget {
  const PasarDesaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pasar Desa Sumedang',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: DesaColors.bg,
        fontFamily: GoogleFonts.workSans().fontFamily,
        colorScheme: ColorScheme.fromSeed(
          seedColor: DesaColors.primary,
          primary: DesaColors.primary,
          secondary: DesaColors.accent,
          surface: DesaColors.surface,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: DesaColors.bg,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: IconThemeData(color: DesaColors.primary),
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}
