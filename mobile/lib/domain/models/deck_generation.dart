import 'deck_card.dart';

/// Domain model representing the result of a successfully generated deck.
class DeckGeneration {
  final String name;
  final String description;
  final String formatName;
  final List<DeckCard> deckCards;
  final List<String> validationWarnings;

  const DeckGeneration({
    required this.name,
    required this.description,
    required this.formatName,
    this.deckCards = const [],
    this.validationWarnings = const [],
  });

  DeckGeneration copyWith({
    String? name,
    String? description,
    String? formatName,
    List<DeckCard>? deckCards,
    List<String>? validationWarnings,
  }) {
    return DeckGeneration(
      name: name ?? this.name,
      description: description ?? this.description,
      formatName: formatName ?? this.formatName,
      deckCards: deckCards ?? this.deckCards,
      validationWarnings: validationWarnings ?? this.validationWarnings,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DeckGeneration &&
          runtimeType == other.runtimeType &&
          name == other.name &&
          description == other.description &&
          formatName == other.formatName &&
          _listEquals(deckCards, other.deckCards) &&
          _listEquals(validationWarnings, other.validationWarnings);

  @override
  int get hashCode =>
      name.hashCode ^
      description.hashCode ^
      formatName.hashCode ^
      deckCards.hashCode ^
      validationWarnings.hashCode;

  bool _listEquals<T>(List<T> a, List<T> b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}
