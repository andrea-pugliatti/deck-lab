import 'package:flutter/material.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/features/cards/view_models/card_detail_provider.dart';

class ErrorState extends StatelessWidget {
  final CardDetailState state;
  final VoidCallback retry;

  const ErrorState({super.key, required this.state, required this.retry});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, color: cs.error, size: 48),
            const SizedBox(height: 16),
            Text(
              'Failed to load card details',
              style: tt.titleMedium!.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              state.error!,
              textAlign: TextAlign.center,
              style: tt.bodySmall!.copyWith(
                color: cs.onSurface.withValues(alpha: 0.54),
              ),
            ),
            const SizedBox(height: 24),
            CustomButton(text: 'Retry', onPressed: retry),
          ],
        ),
      ),
    );
  }
}
