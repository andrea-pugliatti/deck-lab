import 'package:flutter/material.dart';
import '../theme/theme.dart';

/// Button component.
class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final Widget? icon;
  final String variant;
  final String size;
  final bool isLoading;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.variant = 'primary',
    this.size = 'md',
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final (double py, double px, double fontSize) = switch (size) {
      'sm' => (6.0, 12.0, 12.0),
      'lg' => (16.0, 28.0, 16.0),
      _ => (12.0, 20.0, 14.0),
    };

    final (Color bg, Color fg, BorderSide border) = switch (variant) {
      'primary' => (DeckLabTheme.goldAccent, DeckLabTheme.darkBg, .none),
      'secondary' => (DeckLabTheme.cyanAccent, DeckLabTheme.darkBg, .none),
      'outline' => (
        Colors.transparent,
        Colors.white,
        const BorderSide(color: DeckLabTheme.borderDim),
      ),
      'outline-gold' => (
        Colors.transparent,
        DeckLabTheme.goldAccent,
        const BorderSide(color: DeckLabTheme.goldAccent),
      ),
      'outline-cyan' => (
        Colors.transparent,
        DeckLabTheme.cyanAccent,
        const BorderSide(color: DeckLabTheme.cyanAccent),
      ),
      'outline-error' => (
        Colors.transparent,
        DeckLabTheme.errorAccent,
        const BorderSide(color: DeckLabTheme.errorAccent),
      ),
      'ghost' => (Colors.transparent, const Color(0xFF94A3B8), .none),
      _ => (DeckLabTheme.goldAccent, DeckLabTheme.darkBg, .none),
    };

    final buttonStyle = ElevatedButton.styleFrom(
      backgroundColor: bg,
      foregroundColor: fg,
      shadowColor: bg.withValues(alpha: 0.12),
      elevation: variant.startsWith('outline') || variant == 'ghost' ? 0 : 4,
      padding: .symmetric(vertical: py, horizontal: px),
      shape: RoundedRectangleBorder(borderRadius: .circular(12), side: border),
    );

    final childWidget = isLoading
        ? SizedBox(
            height: fontSize + 2,
            width: fontSize + 2,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fg),
            ),
          )
        : Row(
            mainAxisSize: .min,
            mainAxisAlignment: .center,
            children: [
              if (icon != null) ...[icon!, const SizedBox(width: 8)],
              Text(
                text,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: .bold,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          );

    if (variant == 'ghost' || variant.startsWith('outline')) {
      return OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: buttonStyle,
        child: childWidget,
      );
    }

    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: buttonStyle,
      child: childWidget,
    );
  }
}
