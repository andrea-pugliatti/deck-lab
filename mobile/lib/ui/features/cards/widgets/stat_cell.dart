import 'package:flutter/material.dart';

class StatCell extends StatelessWidget {
  final String title;
  final String val;

  const StatCell({super.key, required this.title, required this.val});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: tt.labelSmall!.copyWith(
            color: cs.onSurface.withValues(alpha: 0.38),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          val,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: tt.bodyMedium!.copyWith(
            color: cs.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
