import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/ui/features/simulator/widgets/action_toolbar.dart';
import 'package:mobile/ui/features/simulator/widgets/card_inspector.dart';
import 'package:mobile/ui/features/simulator/widgets/deck_selector.dart';
import 'package:mobile/ui/features/simulator/widgets/probability_card.dart';
import 'package:mobile/ui/features/simulator/widgets/zone_panel.dart';

import '../../../core/providers.dart';
import '../../../core/theme/theme.dart';
import '../../auth/view_models/auth_provider.dart';
import '../../dashboard/view_models/deck_list_provider.dart';
import '../view_models/simulator_provider.dart';

/// Standalone Hand Simulator workspace.
///
/// Houses interactive deck selectors, drawing/shuffling controls, multi-zone transfers,
/// deck explorers, card inspectors, and starting hand probability calculators.
class HandSimulatorScreen extends ConsumerStatefulWidget {
  const HandSimulatorScreen({super.key});

  @override
  ConsumerState<HandSimulatorScreen> createState() =>
      _HandSimulatorScreenState();
}

class _HandSimulatorScreenState extends ConsumerState<HandSimulatorScreen> {
  String? _targetCardForOdds;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final activeUsername = ref.read(authProvider).value;
      ref
          .read(deckListProvider.notifier)
          .setActiveTab(activeUsername != null ? 'USER' : 'ALL');
    });
  }

  void _selectDeck(int deckId) async {
    try {
      final deckDetail = await ref
          .read(deckRepositoryProvider)
          .fetchDeckDetail(deckId);
      if (!mounted) return;
      ref.read(simulatorProvider.notifier).loadDeck(deckDetail);
      setState(() {
        _targetCardForOdds = null;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load simulator deck: $e'),
            backgroundColor: DeckLabTheme.errorAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    ref.listen<AsyncValue<String?>>(authProvider, (previous, next) {
      final prevUser = previous?.value;
      final nextUser = next.value;
      if (nextUser != prevUser) {
        ref
            .read(deckListProvider.notifier)
            .setActiveTab(nextUser != null ? 'USER' : 'ALL');
      }
    });

    final deckListState = ref.watch(deckListProvider);
    final simState = ref.watch(simulatorProvider);
    final notifier = ref.read(simulatorProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'HAND SIMULATOR',
          style: tt.titleMedium!.copyWith(letterSpacing: 1.5, fontSize: 16),
        ),
      ),
      body: Column(
        children: [
          // Deck Selector Section
          DeckSelector(
            listState: deckListState,
            simState: simState,
            selectDeckAction: (id) => _selectDeck(id),
            username: ref.read(authProvider).value,
            notifier: ref.read(deckListProvider.notifier),
          ),

          if (simState.selectedDeck == null)
            Expanded(
              child: Center(
                child: Padding(
                  padding: const .all(24.0),
                  child: Column(
                    mainAxisAlignment: .center,
                    children: [
                      Icon(
                        Icons.casino,
                        size: 64,
                        color: cs.onSurface.withValues(alpha: 0.24),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Select a deck  above to begin the starting hand simulation.',
                        textAlign: .center,
                        style: tt.bodyMedium!.copyWith(
                          color: cs.onSurface.withValues(alpha: 0.7),
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const .all(16.0),
                  child: Column(
                    crossAxisAlignment: .stretch,
                    children: [
                      // Action Controls Toolbar
                      ActionToolbar(state: simState, notifier: notifier),
                      const SizedBox(height: 16),

                      // Starting Hand Probability Calculator Card
                      ProbabilityCard(
                        state: simState,
                        notifier: notifier,
                        card: _targetCardForOdds,
                        setCardAction: (name) {
                          setState(() {
                            _targetCardForOdds = name;
                          });
                          notifier.selectTargetCardForOdds(name);
                        },
                      ),
                      const SizedBox(height: 16),

                      // Card Zones
                      ZonePanel(
                        title: 'HAND ZONE (${simState.hand.length})',
                        cards: simState.hand,
                        zoneKey: 'HAND',
                        notifier: notifier,
                      ),
                      const SizedBox(height: 12),
                      ZonePanel(
                        title: 'FIELD ZONE (${simState.field.length})',
                        cards: simState.field,
                        zoneKey: 'FIELD',
                        notifier: notifier,
                      ),
                      const SizedBox(height: 12),
                      ZonePanel(
                        title: 'GRAVEYARD (${simState.graveyard.length})',
                        cards: simState.graveyard,
                        zoneKey: 'GRAVEYARD',
                        notifier: notifier,
                      ),
                      const SizedBox(height: 12),
                      ZonePanel(
                        title: 'BANISHED (${simState.banished.length})',
                        cards: simState.banished,
                        zoneKey: 'BANISHED',
                        notifier: notifier,
                      ),
                      const SizedBox(height: 24),

                      // Card Inspector Overlay
                      if (simState.inspectedCard != null)
                        CardInspector(
                          card: simState.inspectedCard!,
                          notifier: notifier,
                        ),
                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
