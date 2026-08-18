import 'package:material_ui/material_ui.dart';

import 'custom_button.dart';

/// Reusable Error State widget displaying an error icon, title, error message,
/// and an optional retry action button.
class ErrorState extends StatelessWidget {
  final String title;
  final String? message;
  final IconData icon;
  final VoidCallback? onRetry;
  final String retryLabel;

  const ErrorState({
    super.key,
    this.title = 'Failed to load data',
    this.message,
    this.icon = Icons.error_outline,
    this.onRetry,
    this.retryLabel = 'Retry',
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Container(
        height: 400,
        alignment: Alignment.center,
        padding: const .all(24.0),
        child: Column(
          mainAxisAlignment: .center,
          children: [
            Icon(icon, size: 64, color: cs.error),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: .center,
              style: tt.titleLarge!.copyWith(
                fontSize: 18,
                color: cs.onSurface.withValues(alpha: 0.87),
              ),
            ),
            if (message != null && message!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                message!,
                textAlign: .center,
                style: tt.bodySmall!.copyWith(
                  color: cs.onSurface.withValues(alpha: 0.54),
                ),
              ),
            ],
            if (onRetry != null) ...[
              const SizedBox(height: 20),
              CustomButton(
                text: retryLabel,
                icon: const Icon(Icons.refresh, size: 18),
                onPressed: onRetry,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
