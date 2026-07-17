import 'package:flutter/material.dart';

/// Empty State for lists.
class EmptyState extends StatelessWidget {
  final String text;
  final IconData icon;

  const EmptyState({super.key, required this.text, required this.icon});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Container(
        height: 400,
        alignment: .center,
        child: Column(
          mainAxisAlignment: .center,
          children: [
            Icon(icon, size: 64, color: Colors.white24),
            const SizedBox(height: 16),
            Text(
              text,
              style: TextStyle(
                fontFamily: 'Cinzel',
                fontSize: 18,
                fontWeight: .bold,
                color: Colors.white70,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Try adjusting filters or search parameters',
              style: TextStyle(color: Colors.white38, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}
