import 'package:flutter/material.dart';
import '../theme/desa_colors.dart';

class LurikDivider extends StatelessWidget {
  final double height;
  final Color primaryColor;
  final Color secondaryColor;

  const LurikDivider({
    super.key,
    this.height = 3.0,
    this.primaryColor = DesaColors.primary,
    this.secondaryColor = DesaColors.border,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width: double.infinity,
      child: CustomPaint(
        painter: _LurikPainter(
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
        ),
      ),
    );
  }
}

class _LurikPainter extends CustomPainter {
  final Color primaryColor;
  final Color secondaryColor;

  _LurikPainter({
    required this.primaryColor,
    required this.secondaryColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint1 = Paint()..color = primaryColor;
    final paint2 = Paint()..color = secondaryColor;

    double x = 0;
    bool isPrimary = true;
    const double stripeWidth = 5.0;

    while (x < size.width) {
      canvas.drawRect(
        Rect.fromLTWH(x, 0, stripeWidth, size.height),
        isPrimary ? paint1 : paint2,
      );
      x += stripeWidth;
      isPrimary = !isPrimary;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
