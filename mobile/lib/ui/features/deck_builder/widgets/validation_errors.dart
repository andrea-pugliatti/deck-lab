import 'package:flutter/material.dart';

class ValidationErrors extends StatelessWidget {
  final List<String> errors;

  const ValidationErrors({super.key, required this.errors});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: .infinity,
      padding: const .all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.error.withValues(alpha: 0.1),
        border: .all(
          color: Theme.of(context).colorScheme.error.withValues(alpha: 0.3),
        ),
        borderRadius: .circular(12),
      ),
      child: Column(
        crossAxisAlignment: .start,
        children: [
          Row(
            children: [
              Icon(
                Icons.warning_amber_rounded,
                color: Theme.of(context).colorScheme.error,
                size: 18,
              ),
              const SizedBox(width: 8),
              Text(
                'VALIDATION WARNINGS',
                style: Theme.of(context).textTheme.labelMedium!.copyWith(
                  color: Theme.of(context).colorScheme.error,
                  fontWeight: .bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...errors.map(
            (err) => Padding(
              padding: const .only(bottom: 4.0),
              child: Text(
                '• $err',
                style: Theme.of(context).textTheme.bodySmall!.copyWith(
                  color: Theme.of(context).colorScheme.error,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
