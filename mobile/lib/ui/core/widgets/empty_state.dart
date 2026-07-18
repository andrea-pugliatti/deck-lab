import 'package:flutter/material.dart';

/// Empty State for lists.
class EmptyState extends StatelessWidget {
  final String text;
  final IconData icon;

  const EmptyState({super.key, required this.text, required this.icon});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Container(
        height: 400,
        alignment: .center,
        child: Column(
          mainAxisAlignment: .center,
          children: [
            Icon(icon, size: 64, color: cs.onSurface.withValues(alpha: 0.24)),
            const SizedBox(height: 16),
            Text(
              text,
              style: tt.titleLarge!.copyWith(
                fontSize: 18,
                color: cs.onSurface.withValues(alpha: 0.7),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting filters or search parameters',
              style: tt.bodySmall!.copyWith(
                color: cs.onSurface.withValues(alpha: 0.38),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
