import 'package:flutter/material.dart';

import '../theme/theme.dart';
import 'custom_button.dart';

/// Confirmation modal.
class ConfirmDialog extends StatelessWidget {
  final String title;
  final String message;
  final String confirmLabel;
  final String cancelLabel;
  final bool isConfirming;

  const ConfirmDialog({
    super.key,
    required this.title,
    required this.message,
    this.confirmLabel = 'Delete',
    this.cancelLabel = 'Cancel',
    this.isConfirming = false,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Dialog(
      backgroundColor: cs.surface,
      shape: RoundedRectangleBorder(
        borderRadius: .circular(16),
        side: const BorderSide(color: DeckLabTheme.borderDim),
      ),
      child: Padding(
        padding: const .all(24.0),
        child: Column(
          mainAxisSize: .min,
          crossAxisAlignment: .start,
          children: [
            Text(title, style: tt.headlineSmall!.copyWith(fontSize: 20)),
            const SizedBox(height: 12),
            Text(
              message,
              style: tt.bodyMedium!.copyWith(
                color: cs.onSurface.withValues(alpha: 0.7),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: .end,
              children: [
                CustomButton(
                  text: cancelLabel,
                  variant: 'outline',
                  size: 'sm',
                  onPressed: () => Navigator.of(context).pop(false),
                ),
                const SizedBox(width: 12),
                CustomButton(
                  text: confirmLabel,
                  variant: 'outline-error',
                  size: 'sm',
                  isLoading: isConfirming,
                  onPressed: () => Navigator.of(context).pop(true),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
