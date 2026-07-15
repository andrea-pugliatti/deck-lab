import '../models/deck_card.dart';

/// Basic client-side card legality rules validation.
class CardLegalityEngine {
  // Prevent instantiation
  CardLegalityEngine._();

  /// Calculates total copies of a card with [cardId] across all sections of a deck.
  static int totalCopiesOf(List<DeckCard> cards, int cardId) {
    return cards
        .where((c) => c.cardId == cardId)
        .fold(0, (sum, c) => sum + c.quantity);
  }

  /// Asserts if a card can be added to the current collection under universal Yu-Gi-Oh! constraints.
  ///
  /// Total card copies across all deck sections must not exceed 3.
  static bool canAddCard(List<DeckCard> cards, int cardId) {
    return totalCopiesOf(cards, cardId) < 3;
  }
}
