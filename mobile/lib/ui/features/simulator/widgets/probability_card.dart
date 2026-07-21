import 'package:flutter/material.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';
import 'package:mobile/ui/features/simulator/widgets/size_chip.dart';

import '../../../core/theme/theme.dart';

class ProbabilityCard extends StatelessWidget {
  final SimulatorState state;
  final SimulatorNotifier notifier;
  final String? card;
  final ValueChanged<String?> setCardAction;

  const ProbabilityCard({
    super.key,
    required this.state,
    required this.notifier,
    this.card,
    required this.setCardAction,
  });

  @override
  Widget build(BuildContext context) {
    final deck = state.selectedDeck;
    if (deck == null) return const SizedBox.shrink();

    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    final cardNames = deck.deckCards
        .where((c) => c.section.toUpperCase() == 'MAIN')
        .map((c) => c.name)
        .toSet()
        .toList();

    final percentage = (state.drawProbability * 100).toStringAsFixed(1);

    return Card(
      color: DeckLabTheme.darkSurfaceElevated,
      shape: RoundedRectangleBorder(
        borderRadius: .circular(12),
        side: const BorderSide(color: DeckLabTheme.borderDim),
      ),
      child: Padding(
        padding: const .all(16.0),
        child: Column(
          crossAxisAlignment: .start,
          children: [
            Text(
              'ODDS CALCULATOR',
              style: tt.labelSmall!.copyWith(
                color: cs.primary,
                fontWeight: .bold,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    isExpanded: true,
                    initialValue: card,
                    dropdownColor: DeckLabTheme.darkSurface,
                    style: tt.bodySmall!.copyWith(color: cs.onSurface),
                    decoration: const InputDecoration(
                      contentPadding: .symmetric(horizontal: 10, vertical: 6),
                    ),
                    hint: Text(
                      'Target Card Name...',
                      style: tt.bodySmall!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.38),
                      ),
                    ),
                    onChanged: setCardAction,
                    items: cardNames.map((name) {
                      return DropdownMenuItem<String>(
                        value: name,
                        child: Text(name),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: .start,
                  children: [
                    Text(
                      'Draw Size',
                      style: tt.bodySmall!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.38),
                        fontSize: 10,
                      ),
                    ),
                    Row(
                      children: [
                        SizeChip(
                          size: 5,
                          activeSize: state.drawSize,
                          notifier: notifier,
                        ),
                        const SizedBox(width: 4),
                        SizeChip(
                          size: 6,
                          activeSize: state.drawSize,
                          notifier: notifier,
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            if (state.targetCardName != null) ...[
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: .spaceBetween,
                children: [
                  Text(
                    'Chance to draw ≥ 1 copy:',
                    style: tt.bodyMedium!.copyWith(
                      color: cs.onSurface.withValues(alpha: 0.7),
                    ),
                  ),
                  Text(
                    '$percentage%',
                    style: tt.titleLarge!.copyWith(
                      color: cs.secondary,
                      fontWeight: .bold,
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
