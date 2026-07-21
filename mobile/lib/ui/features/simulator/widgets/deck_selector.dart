import 'package:flutter/material.dart';
import 'package:mobile/ui/core/widgets/tab_button.dart';
import 'package:mobile/ui/features/dashboard/view_models/deck_list_provider.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';

import '../../../core/theme/theme.dart';

class DeckSelector extends StatelessWidget {
  final DeckListState listState;
  final SimulatorState simState;
  final Function(int) selectDeckAction;
  final String? username;
  final DeckListNotifier notifier;

  const DeckSelector({
    super.key,
    required this.listState,
    required this.simState,
    required this.selectDeckAction,
    this.username,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    final userDecks = listState.decks;
    final activeUsername = username;
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return Container(
      padding: const .all(16),
      color: DeckLabTheme.darkSurface,
      child: Column(
        crossAxisAlignment: .start,
        children: [
          Row(
            mainAxisAlignment: .spaceBetween,
            children: [
              Text(
                'SELECT WORKSPACE DECK BLUEPRINT',
                style: tt.labelSmall!.copyWith(
                  color: cs.primary,
                  fontWeight: .bold,
                  letterSpacing: 0.5,
                ),
              ),
              if (activeUsername != null)
                Row(
                  mainAxisSize: .min,
                  children: [
                    TabButton(
                      label: 'MY DECKS',
                      isActive: listState.activeTab == 'USER',
                      style: .pill,
                      onTap: () => notifier.setActiveTab('USER'),
                    ),
                    const SizedBox(width: 8),
                    TabButton(
                      label: 'COMMUNITY',
                      isActive: listState.activeTab == 'ALL',
                      style: .pill,
                      onTap: () => notifier.setActiveTab('ALL'),
                    ),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 8),
          DropdownButtonFormField<int>(
            key: ValueKey('${listState.activeTab}_${userDecks.length}'),
            initialValue: simState.selectedDeck?.id,
            dropdownColor: DeckLabTheme.darkSurface,
            style: tt.bodyMedium!.copyWith(color: cs.onSurface),
            decoration: const InputDecoration(
              contentPadding: .symmetric(horizontal: 12, vertical: 8),
            ),
            hint: Text(
              'Choose deck...',
              style: tt.bodyMedium!.copyWith(
                color: cs.onSurface.withValues(alpha: 0.38),
              ),
            ),
            onChanged: (id) => {if (id != null) selectDeckAction(id)},
            items: userDecks.map((deck) {
              return DropdownMenuItem<int>(
                value: deck.id,
                child: Text(
                  '${deck.name.toUpperCase()} (${deck.formatName.toUpperCase()})',
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
