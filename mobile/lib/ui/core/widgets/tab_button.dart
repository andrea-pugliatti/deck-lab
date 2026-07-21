import 'package:flutter/material.dart';
import 'package:mobile/ui/core/theme/theme.dart';

enum TabButtonStyle {
  underline,
  pill,
}

class TabButton extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;
  final TabButtonStyle style;

  const TabButton({
    super.key,
    required this.label,
    required this.isActive,
    required this.onTap,
    this.style = TabButtonStyle.underline,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    switch (style) {
      case TabButtonStyle.underline:
        return InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: isActive ? DeckLabTheme.cyanAccent : Colors.transparent,
                  width: 2.0,
                ),
              ),
            ),
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: tt.labelSmall!.copyWith(
                fontWeight: FontWeight.bold,
                color: isActive
                    ? cs.onSurface
                    : cs.onSurface.withValues(alpha: 0.38),
                letterSpacing: 1.0,
              ),
            ),
          ),
        );
      case TabButtonStyle.pill:
        return InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isActive
                  ? cs.primary.withValues(alpha: 0.1)
                  : Colors.transparent,
              border: Border.all(
                color: isActive ? cs.primary : cs.onSurface.withValues(alpha: 0.24),
              ),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              label,
              style: tt.labelSmall!.copyWith(
                color: isActive ? cs.primary : cs.onSurface.withValues(alpha: 0.54),
                fontSize: 9,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        );
    }
  }
}
