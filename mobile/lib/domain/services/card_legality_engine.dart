import '../enums/enums.dart';
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

  /// Evaluates deck compliance rules for structural constraints.
  static List<String> validateDeck(List<DeckCard> cards, String formatName) {
    final List<String> errors = [];
    final mainDeckCount = cards
        .where((c) => c.section == DeckSection.main)
        .fold(0, (sum, c) => sum + c.quantity);
    final extraDeckCount = cards
        .where((c) => c.section == DeckSection.extra)
        .fold(0, (sum, c) => sum + c.quantity);
    final sideDeckCount = cards
        .where((c) => c.section == DeckSection.side)
        .fold(0, (sum, c) => sum + c.quantity);

    if (mainDeckCount < 40) {
      errors.add('Main deck must contain at least 40 cards.');
    }
    if (mainDeckCount > 60) {
      errors.add('Main deck must contain at most 60 cards.');
    }
    if (extraDeckCount > 15) {
      errors.add('Extra deck must contain at most 15 cards.');
    }
    if (sideDeckCount > 15) {
      errors.add('Side deck must contain at most 15 cards.');
    }

    return errors;
  }
}
