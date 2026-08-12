import 'package:material_ui/material_ui.dart';

import '../../../core/theme/theme.dart';
import '../../../core/widgets/custom_button.dart';
import '../view_models/simulator_provider.dart';

/// Card widget component wrapping the probability calculator.
class ProbabilityCard extends StatelessWidget {
  final SimulatorState state;
  final SimulatorNotifier notifier;
  final String? card;
  final Function(String name) setCardAction;

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
        .where((c) => c.section == .main)
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
          crossAxisAlignment: .stretch,
          children: [
            Row(
              children: [
                Icon(Icons.functions, color: cs.primary, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'ODDS CALCULATOR',
                    overflow: .ellipsis,
                    style: tt.labelMedium!.copyWith(
                      color: cs.primary,
                      fontWeight: .bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Dropdown selector for target card
            DropdownButtonFormField<String>(
              isExpanded: true,
              initialValue: cardNames.contains(state.targetCardName)
                  ? state.targetCardName
                  : null,
              dropdownColor: DeckLabTheme.darkSurface,
              decoration: const InputDecoration(
                hintText: 'Target Card Name...',
                contentPadding: .symmetric(horizontal: 12, vertical: 8),
              ),
              items: cardNames.map((name) {
                return DropdownMenuItem<String>(
                  value: name,
                  child: Text(name, overflow: .ellipsis),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  setCardAction(val);
                }
              },
            ),
            const SizedBox(height: 12),

            // Controls for Draw Sample Size
            Row(
              mainAxisAlignment: .spaceBetween,
              children: [
                Text(
                  'Draw Sample Size:',
                  style: tt.bodySmall!.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.54),
                  ),
                ),
                Row(
                  children: [
                    CustomButton(
                      text: '5',
                      variant: state.drawSize != 5 ? 'outline' : 'primary',
                      onPressed: () => notifier.setDrawSize(5),
                    ),
                    const SizedBox(width: 8),
                    CustomButton(
                      text: '6',
                      variant: state.drawSize != 6 ? 'outline' : 'primary',
                      onPressed: () => notifier.setDrawSize(6),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Calculation Results Output Banner
            if (state.targetCardName != null) ...[
              Container(
                padding: const .all(12),
                decoration: BoxDecoration(
                  color: cs.primary.withValues(alpha: 0.1),
                  borderRadius: .circular(8),
                  border: .all(color: cs.primary.withValues(alpha: 0.3)),
                ),
                child: Column(
                  children: [
                    Text(
                      'Chance to draw ≥ 1 copy:',
                      style: tt.bodySmall!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.7),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '$percentage%',
                      style: tt.headlineMedium!.copyWith(
                        color: cs.primary,
                        fontWeight: .bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
