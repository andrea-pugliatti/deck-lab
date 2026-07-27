import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/enums/enums.dart';
import '../../../../domain/models/card.dart';
import '../../../../domain/models/card_suggestion.dart';
import '../../../../domain/models/deck_card.dart';
import '../../../../domain/models/deck_detail.dart';
import '../../../../domain/services/card_legality_engine.dart';
import '../../../core/providers.dart';

/// State representation of the active Deck Builder session.
class DeckBuilderState {
  final int? id;
  final String name;
  final String description;
  final Format formatName;
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
    Format? formatName,
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

/// Manages add, remove, and quantity edits, format switches, validation rule calls,
/// AI suggestions retrieval, and wizard-driven generation.
class DeckBuilderNotifier extends Notifier<DeckBuilderState> {
  @override
  DeckBuilderState build() {
    return const DeckBuilderState(
      id: null,
      name: '',
      description: '',
      formatName: Format.tcg,
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
        formatName: Format.tcg,
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
        triggerAiSuggestions();
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
  void updateFormat(Format formatName) {
    state = state.copyWith(formatName: formatName);
    triggerValidation();
    triggerAiSuggestions();
  }

  /// Adds a card definition to a specific deck section.
  ///
  /// Enforces Yu-Gi-Oh! maximum copies limit: sum of card across all sections cannot exceed 3.
  void addCard(Card card, DeckSection section) {
    if (!CardLegalityEngine.canAddCard(state.cards, card.id)) {
      state = state.copyWith(
        error:
            'Cannot add more copies. Maximum limit of 3 copies per card reached.',
      );
      return;
    }

    final updatedCards = List<DeckCard>.from(state.cards);
    final existingIdx = updatedCards.indexWhere(
      (c) => c.cardId == card.id && c.section == section,
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
          section: section,
          quantity: 1,
        ),
      );
    }

    state = state.copyWith(cards: updatedCards, error: null);
    triggerValidation();
    triggerAiSuggestions();
  }

  /// Decrements or removes a card copy in a section.
  void removeCard(int cardId, DeckSection section) {
    final updatedCards = List<DeckCard>.from(state.cards);
    final idx = updatedCards.indexWhere(
      (c) => c.cardId == cardId && c.section == section,
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
      triggerAiSuggestions();
    }
  }

  /// Explicitly sets the quantity copy count for a card in a section.
  void updateCardQuantity(int cardId, DeckSection section, int quantity) {
    if (quantity <= 0) {
      final updatedCards = List<DeckCard>.from(state.cards)
        ..removeWhere((c) => c.cardId == cardId && c.section == section);
      state = state.copyWith(cards: updatedCards, error: null);
      triggerValidation();
      triggerAiSuggestions();
      return;
    }

    if (quantity > 3) {
      state = state.copyWith(
        error: 'Quantity cannot exceed 3 copies per card rule.',
      );
      return;
    }

    final otherSectionsCount = state.cards
        .where((c) => c.cardId == cardId && c.section != section)
        .fold(0, (sum, c) => sum + c.quantity);

    if (otherSectionsCount + quantity > 3) {
      state = state.copyWith(
        error:
            'Total copies across Main, Extra, and Side cannot exceed 3 copies.',
      );
      return;
    }

    final updatedCards = List<DeckCard>.from(state.cards);
    final idx = updatedCards.indexWhere(
      (c) => c.cardId == cardId && c.section == section,
    );

    if (idx != -1) {
      updatedCards[idx] = updatedCards[idx].copyWith(quantity: quantity);
      state = state.copyWith(cards: updatedCards, error: null);
      triggerValidation();
      triggerAiSuggestions();
    }
  }

  /// Evaluates current deck compliance rules.
  Future<void> triggerValidation() async {
    state = state.copyWith(isValidating: true);
    final errors = CardLegalityEngine.validateDeck(
      state.cards,
      state.formatName.value,
    );
    state = state.copyWith(isValidating: false, validationErrors: errors);
  }

  /// Fetches AI suggestions matching current cards list.
  Future<void> triggerAiSuggestions() async {
    if (state.cards.isEmpty) {
      state = state.copyWith(aiSuggestions: []);
      return;
    }

    state = state.copyWith(isLoadingSuggestions: true);
    try {
      final repo = ref.read(deckRepositoryProvider);
      final suggestions = await repo.fetchAiSuggestions(
        formatName: state.formatName,
        currentCards: state.cards,
      );
      state = state.copyWith(
        isLoadingSuggestions: false,
        aiSuggestions: suggestions,
      );
    } catch (e) {
      state = state.copyWith(
        isLoadingSuggestions: false,
        error: 'Failed to load AI suggestions: $e',
      );
    }
  }

  /// Generates a deck list using archetype parameters via AI Wizard.
  Future<void> triggerAiGeneration({
    required String archetype,
    required Strategy strategy,
    String? customPrompt,
  }) async {
    state = state.copyWith(isGenerating: true, error: null);
    try {
      final repo = ref.read(deckRepositoryProvider);
      final res = await repo.generateAiDeck(
        archetype: archetype,
        strategy: strategy,
        formatName: state.formatName,
        customPrompt: customPrompt,
      );

      state = state.copyWith(
        isGenerating: false,
        name: res.name,
        description: res.description,
        cards: res.deckCards,
        generationWarnings: res.validationWarnings,
        error: null,
      );

      triggerValidation();
      triggerAiSuggestions();
    } catch (e) {
      state = state.copyWith(
        isGenerating: false,
        error: 'Failed to generate AI deck: $e',
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

/// Riverpod notifier provider exposing [DeckBuilderNotifier].
final deckBuilderProvider =
    NotifierProvider<DeckBuilderNotifier, DeckBuilderState>(
      DeckBuilderNotifier.new,
    );
