import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Custom theme configuration and palette definitions for the DeckLab mobile app.
///
/// Encapsulates color palettes, fonts, borders, and widget styling rules
/// matching the web application design language.
class DeckLabTheme {
  // Prevent instantiation.
  DeckLabTheme._();

  static const Color darkBg = Color(0xFF151922);
  static const Color darkSurface = Color(0xFF202632);
  static const Color darkSurfaceElevated = Color(0xFF2A3140);
  static const Color goldAccent = Color(0xFFE2C56F);
  static const Color goldHover = Color(0xFFF7E099);
  static const Color cyanAccent = Color(0xFF5FE3D9);
  static const Color cyanHover = Color(0xFF83F1E9);
  static const Color borderDim = Color(0xFF323A49);
  static const Color borderGlow = Color(0xFF4299E1);
  static const Color errorAccent = Color(0xFFEF4444);

  // Dark theme definition for the application container.
  static ThemeData get darkTheme {
    final baseTextTheme = ThemeData.dark().textTheme;

    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: darkBg,
      primaryColor: goldAccent,
      colorScheme: const ColorScheme.dark().copyWith(
        primary: goldAccent,
        secondary: cyanAccent,
        surface: darkSurface,
        onSurface: Colors.white,
        error: errorAccent,
      ),
      textTheme: GoogleFonts.outfitTextTheme(baseTextTheme).copyWith(
        displayLarge: GoogleFonts.cinzel(
          textStyle: baseTextTheme.displayLarge?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        displayMedium: GoogleFonts.cinzel(
          textStyle: baseTextTheme.displayMedium?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        displaySmall: GoogleFonts.cinzel(
          textStyle: baseTextTheme.displaySmall?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        headlineLarge: GoogleFonts.cinzel(
          textStyle: baseTextTheme.headlineLarge?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        headlineMedium: GoogleFonts.cinzel(
          textStyle: baseTextTheme.headlineMedium?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        titleLarge: GoogleFonts.cinzel(
          textStyle: baseTextTheme.titleLarge?.copyWith(
            color: goldAccent,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkSurface,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkSurface,
        labelStyle: const TextStyle(color: Colors.white70),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderDim),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderDim),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: cyanAccent, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: errorAccent),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: errorAccent, width: 1.5),
        ),
      ),
      dividerTheme: const DividerThemeData(color: borderDim, thickness: 1),
    );
  }
}
