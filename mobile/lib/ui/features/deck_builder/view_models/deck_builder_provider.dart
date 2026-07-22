import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers.dart';
import '../../../../domain/models/deck_card.dart';
import '../../../../domain/models/deck_detail.dart';
import '../../../../domain/models/card.dart';
import '../../../../domain/models/card_suggestion.dart';
import '../../../../domain/services/card_legality_engine.dart';

/// State representation of the active Deck Builder session.
class DeckBuilderState {
  final int? id;
  final String name;
  final String description;
  final String formatName;
  final List<DeckCard> cards;
  final bool isValidating;
  final List<String> validationErrors;
  final List<CardSuggestion> aiSuggestions;
  final bool isLoadingSuggestions;
  final bool isSaving;
  final bool isGenerating;
  final bool isLoading;
  final List<String> generationWarnings;
  final String? error;

  const DeckBuilderState({
    this.id,
    required this.name,
    required this.description,
    required this.formatName,
    required this.cards,
    required this.isValidating,
    required this.validationErrors,
    required this.aiSuggestions,
    required this.isLoadingSuggestions,
    required this.isSaving,
    required this.isGenerating,
    required this.isLoading,
    required this.generationWarnings,
    this.error,
  });

  DeckBuilderState copyWith({
    int? id,
    String? name,
    String? description,
    String? formatName,
    List<DeckCard>? cards,
    bool? isValidating,
    List<String>? validationErrors,
    List<CardSuggestion>? aiSuggestions,
    bool? isLoadingSuggestions,
    bool? isSaving,
    bool? isGenerating,
    bool? isLoading,
    List<String>? generationWarnings,
    String? error,
  }) {
    return DeckBuilderState(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      formatName: formatName ?? this.formatName,
      cards: cards ?? this.cards,
      isValidating: isValidating ?? this.isValidating,
      validationErrors: validationErrors ?? this.validationErrors,
      aiSuggestions: aiSuggestions ?? this.aiSuggestions,
      isLoadingSuggestions: isLoadingSuggestions ?? this.isLoadingSuggestions,
      isSaving: isSaving ?? this.isSaving,
      isGenerating: isGenerating ?? this.isGenerating,
      isLoading: isLoading ?? this.isLoading,
      generationWarnings: generationWarnings ?? this.generationWarnings,
      error: error,
    );
  }
}

/// State notifier implementing the deck editing state machine.
///
/// Manages add, remove, and quantity edits, format switches, validation rule calls,
/// AI suggestions retrieval, and wizard-driven generation.
class DeckBuilderNotifier extends Notifier<DeckBuilderState> {
  @override
  DeckBuilderState build() {
    return const DeckBuilderState(
      id: null,
      name: '',
      description: '',
      formatName: 'TCG',
      cards: [],
      isValidating: false,
      validationErrors: [],
      aiSuggestions: [],
      isLoadingSuggestions: false,
      isSaving: false,
      isGenerating: false,
      isLoading: false,
      generationWarnings: [],
      error: null,
    );
  }

  /// Initializes the builder state from an existing deck or defaults to empty.
  Future<void> initialize(int? deckId) async {
    if (deckId == null) {
      state = const DeckBuilderState(
        id: null,
        name: '',
        description: '',
        formatName: 'TCG',
        cards: [],
        isValidating: false,
        validationErrors: [],
        aiSuggestions: [],
        isLoadingSuggestions: false,
        isSaving: false,
        isGenerating: false,
        isLoading: false,
        generationWarnings: [],
        error: null,
      );
    } else {
      state = state.copyWith(isLoading: true, error: null);
      try {
        final repo = ref.read(deckRepositoryProvider);
        final initialDeck = await repo.fetchDeckDetail(deckId);
        state = DeckBuilderState(
          id: initialDeck.id,
          name: initialDeck.name,
          description: initialDeck.description ?? '',
          formatName: initialDeck.formatName,
          cards: initialDeck.deckCards,
          isValidating: false,
          validationErrors: [],
          aiSuggestions: [],
          isLoadingSuggestions: false,
          isSaving: false,
          isGenerating: false,
          isLoading: false,
          generationWarnings: [],
          error: null,
        );
        triggerValidation();
      } catch (e) {
        state = state.copyWith(isLoading: false, error: e.toString());
      }
    }
  }

  /// Updates draft deck title metadata.
  void updateName(String name) {
    state = state.copyWith(name: name);
  }

  /// Updates draft deck description strategy metadata.
  void updateDescription(String description) {
    state = state.copyWith(description: description);
  }

  /// Updates legality format rules and triggers recalculations.
  void updateFormat(String formatName) {
    state = state.copyWith(formatName: formatName);
    triggerValidation();
  }

  /// Adds a card definition to a specific deck section (MAIN, EXTRA, or SIDE).
  ///
  /// Enforces Yu-Gi-Oh! maximum copies limit: sum of card across all sections cannot exceed 3.
  void addCard(Card card, String section) {
    final normalizedSection = section.toUpperCase();

    if (!CardLegalityEngine.canAddCard(state.cards, card.id)) {
      state = state.copyWith(
        error:
            'Cannot add more copies. Maximum limit of 3 copies per card reached.',
      );
      return;
    }

    final updatedCards = List<DeckCard>.from(state.cards);
    final existingIdx = updatedCards.indexWhere(
      (c) =>
          c.cardId == card.id && c.section.toUpperCase() == normalizedSection,
    );

    if (existingIdx != -1) {
      final existing = updatedCards[existingIdx];
      updatedCards[existingIdx] = existing.copyWith(
        quantity: existing.quantity + 1,
      );
    } else {
      updatedCards.add(
        DeckCard(
          cardId: card.id,
          name: card.name,
          type: card.type,
          imageUrl: card.imageUrl,
          section: normalizedSection,
          quantity: 1,
        ),
      );
    }

    state = state.copyWith(cards: updatedCards, error: null);
    triggerValidation();
  }

  /// Decrements or removes a card copy in a section.
  void removeCard(int cardId, String section) {
    final normalizedSection = section.toUpperCase();
    final updatedCards = List<DeckCard>.from(state.cards);
    final idx = updatedCards.indexWhere(
      (c) => c.cardId == cardId && c.section.toUpperCase() == normalizedSection,
    );

    if (idx != -1) {
      final card = updatedCards[idx];
      if (card.quantity > 1) {
        updatedCards[idx] = card.copyWith(quantity: card.quantity - 1);
      } else {
        updatedCards.removeAt(idx);
      }
      state = state.copyWith(cards: updatedCards, error: null);
      triggerValidation();
    }
  }

  /// Triggers a deck validation request.
  Future<void> triggerValidation() async {
    if (state.cards.isEmpty) {
      state = state.copyWith(validationErrors: []);
      return;
    }

    state = state.copyWith(isValidating: true);
    try {
      final repo = ref.read(deckRepositoryProvider);
      final res = await repo.validateDeck(
        name: state.name,
        formatName: state.formatName,
        deckCards: state.cards,
      );
      state = state.copyWith(
        isValidating: false,
        validationErrors: res.isValid ? [] : res.errors,
      );
    } catch (e) {
      state = state.copyWith(
        isValidating: false,
        validationErrors: [e.toString()],
      );
    }
  }

  /// Submits the active deck configuration.
  ///
  /// Calls create or update depending on ID presence. Returns saved ID on success.
  Future<int?> saveDeck() async {
    if (state.name.trim().isEmpty) {
      state = state.copyWith(error: 'Deck name is required to save.');
      return null;
    }

    state = state.copyWith(isSaving: true, error: null);
    try {
      final repo = ref.read(deckRepositoryProvider);
      DeckDetail savedDeck;

      if (state.id != null) {
        savedDeck = await repo.updateDeck(
          state.id!,
          name: state.name,
          description: state.description,
          formatName: state.formatName,
          deckCards: state.cards,
        );
      } else {
        savedDeck = await repo.createDeck(
          name: state.name,
          description: state.description,
          formatName: state.formatName,
          deckCards: state.cards,
        );
      }

      state = state.copyWith(isSaving: false, id: savedDeck.id);
      return savedDeck.id;
    } catch (e) {
      state = state.copyWith(isSaving: false, error: e.toString());
      return null;
    }
  }

  /// Clears any transient errors.
  void clearError() {
    state = state.copyWith(error: null);
  }
}

/// Provider exposing the Deck Builder notifier state.
final deckBuilderProvider =
    NotifierProvider<DeckBuilderNotifier, DeckBuilderState>(
      DeckBuilderNotifier.new,
    );
