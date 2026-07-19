import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/models/card.dart';
import '../../../core/providers.dart';

/// State representation of the Card Detail screen.
class CardDetailState {
  final Card? card;
  final bool isLoading;
  final String? error;

  const CardDetailState({this.card, this.isLoading = false, this.error});

  CardDetailState copyWith({Card? card, bool? isLoading, String? error}) {
    return CardDetailState(
      card: card ?? this.card,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Notifier managing the detailed state of a single card view.
class CardDetailNotifier extends Notifier<CardDetailState> {
  final int cardId;
  CardDetailNotifier(this.cardId);

  @override
  CardDetailState build() {
    Future.microtask(() => loadCard());
    return const CardDetailState(isLoading: true);
  }

  Future<void> loadCard() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final repo = ref.read(cardRepositoryProvider);
      final card = await repo.fetchCardDetail(cardId);
      state = CardDetailState(card: card, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

/// Provider family exposing individual card detail states.
final cardDetailProvider =
    NotifierProvider.family<CardDetailNotifier, CardDetailState, int>((cardId) {
      return CardDetailNotifier(cardId);
    });
