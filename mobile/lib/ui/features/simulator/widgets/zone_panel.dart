import 'package:flutter/material.dart';
import 'package:mobile/domain/models/simulator_card_instance.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';
import 'package:mobile/ui/features/simulator/widgets/zone_transfer_menu.dart';

import '../../../core/theme/theme.dart';

class ZonePanel extends StatelessWidget {
  final String title;
  final List<SimulatorCardInstance> cards;
  final String zoneKey;
  final SimulatorNotifier notifier;

  const ZonePanel({
    super.key,
    required this.title,
    required this.cards,
    required this.zoneKey,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    return Card(
      color: DeckLabTheme.darkSurface,
      shape: RoundedRectangleBorder(
        borderRadius: .circular(12),
        side: const BorderSide(color: DeckLabTheme.borderDim),
      ),
      child: Padding(
        padding: const .all(12.0),
        child: Column(
          crossAxisAlignment: .start,
          children: [
            Text(
              title,
              style: tt.labelSmall!.copyWith(
                color: cs.onSurface.withValues(alpha: 0.38),
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            if (cards.isEmpty)
              Container(
                height: 48,
                alignment: .center,
                child: Text(
                  'Empty Zone',
                  style: tt.bodyMedium!.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.24),
                    fontStyle: .italic,
                  ),
                ),
              )
            else
              SizedBox(
                height: 72,
                child: ListView.builder(
                  scrollDirection: .horizontal,
                  itemCount: cards.length,
                  itemBuilder: (context, index) {
                    final card = cards[index];
                    return Padding(
                      padding: const .only(right: 8.0),
                      child: GestureDetector(
                        onTap: () => notifier.setInspectedCard(card),
                        onLongPress: () => showModalBottomSheet(
                          context: context,
                          backgroundColor: DeckLabTheme.darkSurface,
                          shape: const RoundedRectangleBorder(
                            borderRadius: .vertical(top: .circular(16)),
                          ),
                          builder: (context) => ZoneTransferMenu(
                            card: card,
                            currentZone: zoneKey,
                            notifier: notifier,
                          ),
                        ),
                        child: Container(
                          width: 48,
                          height: 72,
                          decoration: BoxDecoration(
                            color: DeckLabTheme.darkSurfaceElevated,
                            borderRadius: .circular(4),
                            border: .all(color: DeckLabTheme.borderDim),
                          ),
                          child: ClipRRect(
                            borderRadius: .circular(4),
                            child: card.imageUrl != null
                                ? Image.network(
                                    card.imageUrl!,
                                    fit: .cover,
                                    errorBuilder: (_, _, _) => Icon(
                                      Icons.broken_image,
                                      size: 14,
                                      color: cs.onSurface.withValues(
                                        alpha: 0.24,
                                      ),
                                    ),
                                  )
                                : Icon(
                                    Icons.image_outlined,
                                    size: 14,
                                    color: cs.onSurface.withValues(alpha: 0.24),
                                  ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
