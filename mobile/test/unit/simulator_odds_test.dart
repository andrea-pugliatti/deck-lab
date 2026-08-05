import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/domain/models/deck_detail.dart';
import 'package:mobile/domain/models/simulation_session.dart';
import 'package:mobile/ui/features/simulator/view_models/simulator_provider.dart';

void main() {
  group('Simulator Hypergeometric Odds Provider Tests', () {
    test(
      'Calculates probability odds correctly for 3 copies in a 40 card deck',
      () {
        final container = ProviderContainer();
        final notifier = container.read(simulatorProvider.notifier);

        // Construct a mock deck structure: 3 copies of Upstart Goblin, 37 copies of Normal Monster
        const mockDeck = DeckDetail(
          id: 1,
          name: 'Odds Test Deck',
          description: 'Test',
          formatName: Format.tcg,
          creatorUsername: 'tester',
          deckCards: [
            DeckCard(
              cardId: 101,
              name: 'Upstart Goblin',
              section: DeckSection.main,
              quantity: 3,
            ),
            DeckCard(
              cardId: 102,
              name: 'Jerry Beans Man',
              section: DeckSection.main,
              quantity: 37,
            ),
          ],
        );

        notifier.loadDeck(mockDeck);
        notifier.setDrawSize(5);
        notifier.selectTargetCardForOdds('Upstart Goblin');

        final state = container.read(simulatorProvider);

        // Expected hypergeometric probability: 1 - C(37, 5) / C(40, 5) approx 0.3376 (33.8%)
        expect(state.drawProbability, closeTo(0.3376, 0.001));
      },
    );

    test('Probability is 0.0 if target card is not in deck', () {
      final container = ProviderContainer();
      final notifier = container.read(simulatorProvider.notifier);

      const mockDeck = DeckDetail(
        id: 1,
        name: 'Odds Test Deck',
        description: 'Test',
        formatName: Format.tcg,
        creatorUsername: 'tester',
        deckCards: [
          DeckCard(
            cardId: 102,
            name: 'Jerry Beans Man',
            section: DeckSection.main,
            quantity: 40,
          ),
        ],
      );

      notifier.loadDeck(mockDeck);
      notifier.setDrawSize(5);
      notifier.selectTargetCardForOdds('Upstart Goblin');

      final state = container.read(simulatorProvider);
      expect(state.drawProbability, 0.0);
    });

    test('Probability is 1.0 if draw size equals or exceeds deck size', () {
      final container = ProviderContainer();
      final notifier = container.read(simulatorProvider.notifier);

      const mockDeck = DeckDetail(
        id: 1,
        name: 'Odds Test Deck',
        description: 'Test',
        formatName: Format.tcg,
        creatorUsername: 'tester',
        deckCards: [
          DeckCard(
            cardId: 101,
            name: 'Upstart Goblin',
            section: DeckSection.main,
            quantity: 3,
          ),
          DeckCard(
            cardId: 102,
            name: 'Jerry Beans Man',
            section: DeckSection.main,
            quantity: 5,
          ),
        ],
      );

      notifier.loadDeck(mockDeck);
      notifier.setDrawSize(10); // Draw size is 10, deck size is 8
      notifier.selectTargetCardForOdds('Upstart Goblin');

      final state = container.read(simulatorProvider);
      expect(state.drawProbability, 1.0);
    });
  });

  group('SimulationSession Domain Tests', () {
    const mockCards = [
      DeckCard(
        cardId: 1,
        name: 'Card A',
        section: DeckSection.main,
        quantity: 3,
      ),
      DeckCard(
        cardId: 2,
        name: 'Card B',
        section: DeckSection.main,
        quantity: 37,
      ),
    ];

    test('initial factory populates main deck and initializes zones', () {
      final session = SimulationSession.initial(mockCards, drawSize: 5);
      expect(session.mainDeck.length, 40);
      expect(session.hand, isEmpty);
      expect(session.field, isEmpty);
      expect(session.graveyard, isEmpty);
      expect(session.banished, isEmpty);
      expect(session.drawSize, 5);
      expect(session.drawProbability, 0.0);
    });

    test('shuffle rearranges cards deterministically with seeded Random', () {
      final session1 = SimulationSession.initial(
        mockCards,
        drawSize: 5,
        random: Random(42),
      ).shuffle(Random(42));
      final session2 = SimulationSession.initial(
        mockCards,
        drawSize: 5,
        random: Random(42),
      ).shuffle(Random(42));
      final session3 = SimulationSession.initial(
        mockCards,
        drawSize: 5,
        random: Random(42),
      ).shuffle(Random(999));

      // Seeds match -> exact same sequence of unique IDs
      expect(
        session1.mainDeck.map((c) => c.uniqId),
        session2.mainDeck.map((c) => c.uniqId),
      );
      // Different seed -> different sequence
      expect(
        session1.mainDeck.map((c) => c.uniqId),
        isNot(session3.mainDeck.map((c) => c.uniqId)),
      );
    });

    test('drawCards transfers top cards to hand', () {
      var session = SimulationSession.initial(
        mockCards,
        drawSize: 5,
        random: Random(42),
      ).shuffle(Random(42));
      final firstThree = session.mainDeck.take(3).toList();

      session = session.drawCards(3);

      expect(session.hand.length, 3);
      expect(session.mainDeck.length, 37);
      expect(session.hand, equals(firstThree));
    });

    test('moveCard transfers card instance between zones', () {
      var session = SimulationSession.initial(
        mockCards,
        drawSize: 5,
        random: Random(42),
      ).shuffle(Random(42));
      session = session.drawCards(5);

      final cardToMove = session.hand.first;
      session = session.moveCard(cardToMove, 'HAND', 'GRAVEYARD');

      expect(session.hand.contains(cardToMove), isFalse);
      expect(session.graveyard.contains(cardToMove), isTrue);
      expect(session.graveyard.length, 1);
    });

    test(
      'probability updates automatically on target or draw size changes',
      () {
        var session = SimulationSession.initial(mockCards, drawSize: 5);

        session = session.selectTargetCard('Card A');
        // expected prob for 3 targets, 40 deck, 5 sample size
        expect(session.drawProbability, closeTo(0.3376, 0.001));

        session = session.setDrawSize(6);
        // expected prob for 3 targets, 40 deck, 6 sample size
        // 1 - C(37, 6) / C(40, 6) = 1 - 2324784 / 3838380 approx 0.3943
        expect(session.drawProbability, closeTo(0.3943, 0.001));
      },
    );
  });
}
