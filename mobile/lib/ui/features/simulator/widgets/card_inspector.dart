import 'package:flutter/material.dart';
import 'package:mobile/domain/models/simulator_card_instance.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';

import '../../../core/theme/theme.dart';

class CardInspector extends StatelessWidget {
  final SimulatorCardInstance card;
  final SimulatorNotifier notifier;

  const CardInspector({super.key, required this.card, required this.notifier});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Card(
      color: DeckLabTheme.darkSurfaceElevated,
      shape: RoundedRectangleBorder(
        borderRadius: .circular(12),
        side: BorderSide(color: cs.secondary, width: 1.0),
      ),
      child: Padding(
        padding: const .all(16.0),
        child: Row(
          crossAxisAlignment: .start,
          children: [
            Container(
              width: 56,
              height: 84,
              decoration: BoxDecoration(
                color: DeckLabTheme.darkSurface,
                borderRadius: .circular(4),
              ),
              child: card.imageUrl != null
                  ? Image.network(card.imageUrl!, fit: .cover)
                  : Icon(
                      Icons.image,
                      color: cs.onSurface.withValues(alpha: 0.24),
                    ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: .start,
                children: [
                  Row(
                    mainAxisAlignment: .spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          card.name.toUpperCase(),
                          style: tt.bodyMedium!.copyWith(
                            fontWeight: .bold,
                            color: cs.onSurface,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          Icons.close,
                          size: 16,
                          color: cs.onSurface.withValues(alpha: 0.54),
                        ),
                        onPressed: () => notifier.setInspectedCard(null),
                      ),
                    ],
                  ),
                  Text(
                    card.type ?? 'Monster',
                    style: tt.labelSmall!.copyWith(
                      color: cs.primary,
                      fontWeight: .bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
