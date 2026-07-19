import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/ui/features/cards/widgets/error_state.dart';
import 'package:mobile/ui/features/cards/widgets/stats_grid.dart';

import '../../../core/theme/theme.dart';
import '../view_models/card_detail_provider.dart';

/// Screen presenting the detailed stats, description text, and full artwork of a single card.
class CardDetailScreen extends ConsumerWidget {
  final int cardId;

  const CardDetailScreen({super.key, required this.cardId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(cardDetailProvider(cardId));
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    if (state.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: DeckLabTheme.cyanAccent),
        ),
      );
    }

    if (state.error != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('CARD DETAIL')),
        body: ErrorState(
          state: state,
          retry: () => ref.read(cardDetailProvider(cardId).notifier).loadCard(),
        ),
      );
    }

    final card = state.card;
    if (card == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('CARD DETAIL')),
        body: Center(
          child: Text(
            'Card not found',
            style: tt.bodyMedium!.copyWith(color: cs.onSurface),
          ),
        ),
      );
    }

    final isMonster = card.atk != null || card.def != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          card.name.toUpperCase(),
          style: tt.titleMedium!.copyWith(fontSize: 14),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: .stretch,
          children: [
            // Card Banner
            Container(
              height: 320,
              color: DeckLabTheme.darkBg,
              padding: const .symmetric(vertical: 24.0),
              child: Center(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: .circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: DeckLabTheme.cyanAccent.withValues(alpha: 0.1),
                        blurRadius: 20,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: .circular(6),
                    child: card.imageUrl != null
                        ? Image.network(
                            card.imageUrl!,
                            fit: BoxFit.contain,
                            errorBuilder: (_, _, _) => Icon(
                              Icons.broken_image,
                              size: 64,
                              color: cs.onSurface.withValues(alpha: 0.24),
                            ),
                          )
                        : Icon(
                            Icons.image,
                            size: 64,
                            color: cs.onSurface.withValues(alpha: 0.24),
                          ),
                  ),
                ),
              ),
            ),

            // Main Content
            Padding(
              padding: const .all(20.0),
              child: Column(
                crossAxisAlignment: .start,
                children: [
                  // Formats / Archetype
                  Row(
                    mainAxisAlignment: .spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          card.type.toUpperCase(),
                          overflow: TextOverflow.ellipsis,
                          style: tt.labelSmall!.copyWith(
                            color: cs.secondary,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      if (card.archetype != null)
                        Container(
                          padding: const .symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: DeckLabTheme.goldAccent.withValues(
                              alpha: 0.1,
                            ),
                            border: .all(
                              color: DeckLabTheme.goldAccent.withValues(
                                alpha: 0.2,
                              ),
                            ),
                            borderRadius: .circular(6),
                          ),
                          child: Text(
                            card.archetype!.toUpperCase(),
                            style: tt.labelSmall!.copyWith(
                              color: cs.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Monster Stats Grid
                  if (isMonster) ...[
                    StatsGrid(card: card),
                    const SizedBox(height: 24),
                  ],

                  // Description
                  Text(
                    'DESCRIPTION / EFFECT',
                    style: tt.labelMedium!.copyWith(
                      letterSpacing: 1.0,
                      color: cs.onSurface.withValues(alpha: 0.6),
                    ),
                  ),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text(
                    card.description ??
                        'No card text/effect details available.',
                    style: tt.bodyMedium!.copyWith(
                      color: cs.onSurface.withValues(alpha: 0.7),
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
