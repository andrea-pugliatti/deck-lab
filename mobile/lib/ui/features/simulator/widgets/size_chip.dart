import 'package:flutter/material.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';

import '../../../core/theme/theme.dart';

class SizeChip extends StatelessWidget {
  final int size;
  final int activeSize;
  final SimulatorNotifier notifier;

  const SizeChip({
    super.key,
    required this.size,
    required this.activeSize,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    final active = size == activeSize;
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return ChoiceChip(
      label: Text(
        '$size',
        style: tt.labelSmall!.copyWith(
          color: active ? DeckLabTheme.darkBg : cs.onSurface,
          fontWeight: .bold,
        ),
      ),
      selected: active,
      selectedColor: cs.secondary,
      backgroundColor: DeckLabTheme.darkSurface,
      shape: RoundedRectangleBorder(borderRadius: .circular(4)),
      padding: .zero,
      onSelected: (_) => notifier.setDrawSize(size),
    );
  }
}
