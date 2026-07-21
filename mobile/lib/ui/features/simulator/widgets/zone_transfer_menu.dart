import 'package:flutter/material.dart';
import 'package:mobile/domain/models/simulator_card_instance.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';

class ZoneTransferMenu extends StatelessWidget {
  final SimulatorCardInstance card;
  final String currentZone;
  final SimulatorNotifier notifier;

  const ZoneTransferMenu({
    super.key,
    required this.card,
    required this.currentZone,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    final options = <String, String>{
      'HAND': 'Move to Hand',
      'FIELD': 'Move to Field',
      'GRAVEYARD': 'Move to Graveyard',
      'BANISHED': 'Move to Banished',
      'DECK_TOP': 'Move to Top of the Deck',
      'DECK_BOTTOM': 'Move to Bottom of the Deck',
    };
    options.remove(currentZone);

    return SafeArea(
      child: Column(
        mainAxisSize: .min,
        children: [
          Padding(
            padding: const .all(16.0),
            child: Text(
              'TRANSFER: ${card.name.toUpperCase()}',
              style: tt.titleSmall!.copyWith(
                color: cs.secondary,
                fontWeight: .bold,
              ),
            ),
          ),
          const Divider(height: 1),
          ...options.entries.map(
            (entry) => ListTile(
              title: Text(
                entry.value,
                style: tt.bodyMedium!.copyWith(color: cs.onSurface),
              ),
              onTap: () {
                notifier.moveCard(card, currentZone, entry.key);
                Navigator.of(context).pop();
              },
            ),
          ),
        ],
      ),
    );
  }
}
