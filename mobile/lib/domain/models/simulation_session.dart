import 'dart:math';

import '../services/hypergeometric_calculator.dart';
import 'deck_card.dart';
import 'simulator_card_instance.dart';

/// Immutable domain entity representing the state and transitions of a card simulation session.
class SimulationSession {
  final List<SimulatorCardInstance> mainDeck;
  final List<SimulatorCardInstance> hand;
  final List<SimulatorCardInstance> field;
  final List<SimulatorCardInstance> graveyard;
  final List<SimulatorCardInstance> banished;
  final int drawSize;
  final String? targetCardName;
  final double drawProbability;
  final List<DeckCard> initialMainCards;

  const SimulationSession({
    required this.mainDeck,
    required this.hand,
    required this.field,
    required this.graveyard,
    required this.banished,
    required this.drawSize,
    this.targetCardName,
    required this.drawProbability,
    required this.initialMainCards,
  });

  /// Factory creating an initial simulation session populated from a list of deck cards.
  factory SimulationSession.initial(
    List<DeckCard> deckCards, {
    int drawSize = 5,
    Random? random,
  }) {
    final List<SimulatorCardInstance> tempMain = [];
    final mainCards = deckCards
        .where((c) => c.section.toUpperCase() == 'MAIN')
        .toList();

    for (final card in mainCards) {
      for (int i = 0; i < card.quantity; i++) {
        tempMain.add(SimulatorCardInstance.fromDomain(card, i));
      }
    }

    final session = SimulationSession(
      mainDeck: tempMain,
      hand: const [],
      field: const [],
      graveyard: const [],
      banished: const [],
      drawSize: drawSize,
      targetCardName: null,
      drawProbability: 0.0,
      initialMainCards: mainCards,
    );

    return session.shuffle(random);
  }

  /// Returns a new session instance with the main deck shuffled.
  SimulationSession shuffle([Random? random]) {
    if (mainDeck.isEmpty) return this;
    final list = List<SimulatorCardInstance>.from(mainDeck);
    final rng = random ?? Random();

    // Fisher-Yates shuffle
    for (int i = list.length - 1; i > 0; i--) {
      final n = rng.nextInt(i + 1);
      final temp = list[i];
      list[i] = list[n];
      list[n] = temp;
    }

    return _copyWith(mainDeck: list);
  }

  /// Returns a new session instance after drawing [count] cards from top of deck to hand.
  SimulationSession drawCards(int count) {
    if (mainDeck.isEmpty || count <= 0) return this;

    final deckList = List<SimulatorCardInstance>.from(mainDeck);
    final handList = List<SimulatorCardInstance>.from(hand);

    final actualCount = min(count, deckList.length);
    for (int i = 0; i < actualCount; i++) {
      handList.add(deckList.removeAt(0));
    }

    return _copyWith(mainDeck: deckList, hand: handList);
  }

  /// Returns a new session instance after transferring a card instance between zones.
  SimulationSession moveCard(
    SimulatorCardInstance card,
    String fromZone,
    String toZone,
  ) {
    final from = fromZone.toUpperCase();
    final to = toZone.toUpperCase();
    if (from == to) return this;

    // Remove from source list
    List<SimulatorCardInstance> fromList = _getZoneList(from);
    final idx = fromList.indexWhere((c) => c.uniqId == card.uniqId);
    if (idx == -1) return this;
    fromList.removeAt(idx);

    // Insert to target list
    List<SimulatorCardInstance> toList = _getZoneList(to);
    if (to == 'DECK_TOP') {
      toList.insert(0, card);
    } else if (to == 'DECK_BOTTOM') {
      toList.add(card);
    } else {
      toList.add(card);
    }

    // Construct and return new state mapping modified lists
    return _copyWith(
      mainDeck: (from == 'DECK_TOP' || from == 'DECK_BOTTOM')
          ? fromList
          : (to == 'DECK_TOP' || to == 'DECK_BOTTOM')
          ? toList
          : mainDeck,
      hand: from == 'HAND'
          ? fromList
          : to == 'HAND'
          ? toList
          : hand,
      field: from == 'FIELD'
          ? fromList
          : to == 'FIELD'
          ? toList
          : field,
      graveyard: from == 'GRAVEYARD'
          ? fromList
          : to == 'GRAVEYARD'
          ? toList
          : graveyard,
      banished: from == 'BANISHED'
          ? fromList
          : to == 'BANISHED'
          ? toList
          : banished,
    );
  }

  /// Returns a new session instance with adjusted draw size constraint.
  SimulationSession setDrawSize(int size) {
    return _copyWith(drawSize: size);
  }

  /// Returns a new session instance with the target card name selected.
  SimulationSession selectTargetCard(String? cardName) {
    return _copyWith(targetCardName: cardName);
  }

  List<SimulatorCardInstance> _getZoneList(String zone) => switch (zone) {
    'DECK_TOP' || 'DECK_BOTTOM' => List<SimulatorCardInstance>.from(mainDeck),
    'HAND' => List<SimulatorCardInstance>.from(hand),
    'FIELD' => List<SimulatorCardInstance>.from(field),
    'GRAVEYARD' => List<SimulatorCardInstance>.from(graveyard),
    'BANISHED' => List<SimulatorCardInstance>.from(banished),
    _ => [],
  };

  /// Private helper method to clone session properties and automatically recalculate probability.
  SimulationSession _copyWith({
    List<SimulatorCardInstance>? mainDeck,
    List<SimulatorCardInstance>? hand,
    List<SimulatorCardInstance>? field,
    List<SimulatorCardInstance>? graveyard,
    List<SimulatorCardInstance>? banished,
    int? drawSize,
    String? targetCardName,
    List<DeckCard>? initialMainCards,
  }) {
    final nextMainDeck = mainDeck ?? this.mainDeck;
    final nextHand = hand ?? this.hand;
    final nextField = field ?? this.field;
    final nextGraveyard = graveyard ?? this.graveyard;
    final nextBanished = banished ?? this.banished;
    final nextDrawSize = drawSize ?? this.drawSize;
    final nextTargetCardName = targetCardName ?? this.targetCardName;
    final nextInitialMainCards = initialMainCards ?? this.initialMainCards;

    double nextDrawProbability = 0.0;
    if (nextTargetCardName != null && nextTargetCardName.isNotEmpty) {
      final N = nextInitialMainCards.fold(0, (sum, c) => sum + c.quantity);

      final targetMatch = nextInitialMainCards.where(
        (c) => c.name.toLowerCase() == nextTargetCardName.toLowerCase(),
      );
      final K = targetMatch.isEmpty ? 0 : targetMatch.first.quantity;

      nextDrawProbability = HypergeometricCalculator.calculateProbability(
        populationSize: N,
        successCopies: K,
        sampleSize: nextDrawSize,
      );
    }

    return SimulationSession(
      mainDeck: nextMainDeck,
      hand: nextHand,
      field: nextField,
      graveyard: nextGraveyard,
      banished: nextBanished,
      drawSize: nextDrawSize,
      targetCardName: nextTargetCardName,
      drawProbability: nextDrawProbability,
      initialMainCards: nextInitialMainCards,
    );
  }
}
