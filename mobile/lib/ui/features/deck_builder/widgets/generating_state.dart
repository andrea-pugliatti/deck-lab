import 'package:flutter/material.dart' hide Card;

class GeneratingState extends StatelessWidget {
  const GeneratingState({super.key});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Column(
      mainAxisAlignment: .center,
      children: [
        CircularProgressIndicator(color: cs.secondary),
        const SizedBox(height: 16),
        Text(
          'AI WIZARD GENERATING DECK...',
          style: tt.titleSmall!.copyWith(
            color: cs.secondary,
            letterSpacing: 1.0,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Resolving database cards and verifying rules...',
          style: tt.bodySmall!.copyWith(
            color: cs.onSurface.withValues(alpha: 0.54),
          ),
        ),
      ],
    );
  }
}
