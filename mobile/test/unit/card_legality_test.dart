import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/domain/services/card_legality_engine.dart';

void main() {
  group('CardLegalityEngine Unit Tests', () {
    test('totalCopiesOf returns cumulative card count across all sections', () {
      const cards = [
        DeckCard(
          cardId: 101,
          name: 'Monster A',
          section: DeckSection.main,
          quantity: 2,
        ),
        DeckCard(
          cardId: 101,
          name: 'Monster A',
          section: DeckSection.side,
          quantity: 1,
        ),
        DeckCard(
          cardId: 102,
          name: 'Monster B',
          section: DeckSection.main,
          quantity: 3,
        ),
      ];

      expect(CardLegalityEngine.totalCopiesOf(cards, 101), 3);
      expect(CardLegalityEngine.totalCopiesOf(cards, 102), 3);
      expect(CardLegalityEngine.totalCopiesOf(cards, 999), 0);
    });

    test('canAddCard returns true if total copies of card is less than 3', () {
      const cards = [
        DeckCard(
          cardId: 101,
          name: 'Monster A',
          section: DeckSection.main,
          quantity: 2,
        ),
        DeckCard(
          cardId: 102,
          name: 'Monster B',
          section: DeckSection.main,
          quantity: 1,
        ),
      ];

      expect(CardLegalityEngine.canAddCard(cards, 101), isTrue);
      expect(CardLegalityEngine.canAddCard(cards, 102), isTrue);
      expect(CardLegalityEngine.canAddCard(cards, 999), isTrue);
    });

    test('canAddCard returns false if total copies of card is 3 or more', () {
      const cards = [
        DeckCard(
          cardId: 101,
          name: 'Monster A',
          section: DeckSection.main,
          quantity: 2,
        ),
        DeckCard(
          cardId: 101,
          name: 'Monster A',
          section: DeckSection.side,
          quantity: 1,
        ),
      ];

      expect(CardLegalityEngine.canAddCard(cards, 101), isFalse);
    });
  });
}
