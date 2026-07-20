import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/features/dashboard/widgets/deck_section.dart';

import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/confirm_dialog.dart';
import '../../../core/widgets/custom_button.dart';
import '../../auth/view_models/auth_provider.dart';
import '../../simulator/view_models/simulator_provider.dart';
import '../view_models/deck_detail_provider.dart';

/// Screen presenting the cards composition and details of a single deck blueprint.
class DeckDetailScreen extends ConsumerWidget {
  final int deckId;

  const DeckDetailScreen({super.key, required this.deckId});

  void _deleteDeck(BuildContext context, WidgetRef ref) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => const ConfirmDialog(
        title: 'Delete Deck',
        message:
            'Are you sure you want to delete this deck? This action is permanent.',
      ),
    );

    if (confirm == true) {
      final success = await ref
          .read(deckDetailProvider(deckId).notifier)
          .deleteDeck();
      if (!context.mounted) return;
      if (success) {
        context.pop();
      } else {
        final state = ref.read(deckDetailProvider(deckId));
        if (state.error != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to delete deck: ${state.error}'),
              backgroundColor: DeckLabTheme.errorAccent,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeUsername = ref.watch(authProvider).value;
    final state = ref.watch(deckDetailProvider(deckId));
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    if (state.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: DeckLabTheme.goldAccent),
        ),
      );
    }

    if (state.error != null && state.deck == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('DECK DETAIL')),
        body: Center(
          child: Padding(
            padding: const .all(24.0),
            child: Column(
              mainAxisAlignment: .center,
              children: [
                Icon(Icons.error_outline, color: cs.error, size: 48),
                const SizedBox(height: 16),
                Text(
                  'Failed to load deck',
                  style: tt.titleMedium!.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  state.error!,
                  textAlign: .center,
                  style: tt.bodySmall!.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.54),
                  ),
                ),
                const SizedBox(height: 24),
                CustomButton(
                  text: 'Retry',
                  onPressed: () {
                    ref.read(deckDetailProvider(deckId).notifier).loadDeck();
                  },
                ),
              ],
            ),
          ),
        ),
      );
    }

    final deck = state.deck;
    if (deck == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('DECK DETAIL')),
        body: Center(
          child: Text(
            'Deck not found',
            style: tt.bodyMedium!.copyWith(color: cs.onSurface),
          ),
        ),
      );
    }

    final isOwner =
        activeUsername != null && deck.creatorUsername == activeUsername;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.home);
            }
          },
        ),
        title: Text(
          deck.name.toUpperCase(),
          style: tt.titleMedium!.copyWith(fontSize: 16),
        ),
        actions: [
          if (isOwner) ...[
            IconButton(
              icon: const Icon(
                Icons.edit_outlined,
                color: DeckLabTheme.goldAccent,
              ),
              onPressed: () => context.push(AppRoutes.deckEdit(deck.id)),
            ),
            IconButton(
              icon: state.isDeleting
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: DeckLabTheme.errorAccent,
                      ),
                    )
                  : const Icon(
                      Icons.delete_outline,
                      color: DeckLabTheme.errorAccent,
                    ),
              onPressed: state.isDeleting
                  ? null
                  : () => _deleteDeck(context, ref),
            ),
          ],
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: .start,
          children: [
            // Deck Header
            Container(
              padding: const .all(20.0),
              color: DeckLabTheme.darkSurface,
              child: Column(
                crossAxisAlignment: .start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const .symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: DeckLabTheme.goldAccent.withValues(alpha: 0.1),
                          border: .all(
                            color: DeckLabTheme.goldAccent.withValues(
                              alpha: 0.2,
                            ),
                          ),
                          borderRadius: .circular(6),
                        ),
                        child: Text(
                          deck.formatName.toUpperCase(),
                          style: tt.labelSmall!.copyWith(
                            color: cs.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'created by ${deck.creatorUsername ?? "Anonymous"}',
                          overflow: TextOverflow.ellipsis,
                          style: tt.bodySmall!.copyWith(
                            color: cs.onSurface.withValues(alpha: 0.54),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (deck.description != null && deck.description!.isNotEmpty)
                    Text(
                      deck.description!,
                      style: tt.bodyMedium!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.7),
                        height: 1.5,
                      ),
                    )
                  else
                    Text(
                      'No strategy description provided.',
                      style: tt.bodyMedium!.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.3),
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  const SizedBox(height: 20),
                  CustomButton(
                    text: 'Simulate Starting Hands',
                    icon: const Icon(Icons.casino, size: 16),
                    variant: 'outline-cyan',
                    onPressed: () {
                      ref.read(simulatorProvider.notifier).loadDeck(deck);
                      context.go(AppRoutes.simulator);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Sections Lists
            DeckSection(
              title: 'MAIN DECK',
              cards: deck.mainDeckCards,
              count: deck.mainDeckCount,
              indicatorColor: DeckLabTheme.mainDeckAccent,
            ),
            DeckSection(
              title: 'EXTRA DECK',
              cards: deck.extraDeckCards,
              count: deck.extraDeckCount,
              indicatorColor: DeckLabTheme.extraDeckAccent,
            ),
            DeckSection(
              title: 'SIDE DECK',
              cards: deck.sideDeckCards,
              count: deck.sideDeckCount,
              indicatorColor: DeckLabTheme.sideDeckAccent,
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}
