import 'package:flutter/material.dart';

import '../../../core/theme/theme.dart';

class TabButton extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const TabButton({
    super.key,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const .symmetric(vertical: 16.0),
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
          textAlign: .center,
          style: TextStyle(
            fontSize: 12,
            fontWeight: .bold,
            color: isActive ? Colors.white : Colors.white38,
            letterSpacing: 1.0,
          ),
        ),
      ),
    );
  }
}
