import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/models/deck_detail.dart';
import '../../../core/providers.dart';
import 'deck_list_provider.dart';

/// State representation of the Deck Detail screen.
class DeckDetailState {
  final DeckDetail? deck;
  final bool isLoading;
  final bool isDeleting;
  final String? error;

  const DeckDetailState({
    this.deck,
    this.isLoading = false,
    this.isDeleting = false,
    this.error,
  });

  DeckDetailState copyWith({
    DeckDetail? deck,
    bool? isLoading,
    bool? isDeleting,
    String? error,
  }) {
    return DeckDetailState(
      deck: deck ?? this.deck,
      isLoading: isLoading ?? this.isLoading,
      isDeleting: isDeleting ?? this.isDeleting,
      error: error,
    );
  }
}

/// Notifier managing the detailed state, retrieval and deletion of a single deck view.
class DeckDetailNotifier extends Notifier<DeckDetailState> {
  final int deckId;
  DeckDetailNotifier(this.deckId);

  @override
  DeckDetailState build() {
    Future.microtask(() => loadDeck());
    return const DeckDetailState(isLoading: true);
  }

  /// Queries deck details from the repository.
  Future<void> loadDeck() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final repo = ref.read(deckRepositoryProvider);
      final deck = await repo.fetchDeckDetail(deckId);
      state = DeckDetailState(deck: deck, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  /// Permanently deletes the active deck blueprint and updates catalog listings.
  Future<bool> deleteDeck() async {
    state = state.copyWith(isDeleting: true, error: null);
    try {
      final repo = ref.read(deckRepositoryProvider);
      await repo.deleteDeck(deckId);
      ref.read(deckListProvider.notifier).fetchNextPage(isRefresh: true);
      state = state.copyWith(isDeleting: false);
      return true;
    } catch (e) {
      state = state.copyWith(isDeleting: false, error: e.toString());
      return false;
    }
  }
}

/// Provider family exposing individual deck detail states.
final deckDetailProvider =
    NotifierProvider.family<DeckDetailNotifier, DeckDetailState, int>((deckId) {
      return DeckDetailNotifier(deckId);
    });
