import 'deck_card.dart';

/// Domain model representing a detailed deck blueprint.
class DeckDetail {
  final int id;
  final String name;
  final String? description;
  final String formatName;
  final String? creatorUsername;
  final String? updatedAt;
  final List<DeckCard> deckCards;

  const DeckDetail({
    required this.id,
    required this.name,
    this.description,
    required this.formatName,
    this.creatorUsername,
    this.updatedAt,
    required this.deckCards,
  });

  List<DeckCard> get mainDeckCards =>
      deckCards.where((card) => card.section.toUpperCase() == 'MAIN').toList();

  List<DeckCard> get extraDeckCards =>
      deckCards.where((card) => card.section.toUpperCase() == 'EXTRA').toList();

  List<DeckCard> get sideDeckCards =>
      deckCards.where((card) => card.section.toUpperCase() == 'SIDE').toList();

  int get mainDeckCount =>
      mainDeckCards.fold(0, (sum, card) => sum + card.quantity);

  int get extraDeckCount =>
      extraDeckCards.fold(0, (sum, card) => sum + card.quantity);

  int get sideDeckCount =>
      sideDeckCards.fold(0, (sum, card) => sum + card.quantity);

  int get totalCardsCount => mainDeckCount + extraDeckCount + sideDeckCount;

  DeckDetail copyWith({
    int? id,
    String? name,
    String? description,
    String? formatName,
    String? creatorUsername,
    String? updatedAt,
    List<DeckCard>? deckCards,
  }) {
    return DeckDetail(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      formatName: formatName ?? this.formatName,
      creatorUsername: creatorUsername ?? this.creatorUsername,
      updatedAt: updatedAt ?? this.updatedAt,
      deckCards: deckCards ?? this.deckCards,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DeckDetail &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          description == other.description &&
          formatName == other.formatName &&
          creatorUsername == other.creatorUsername &&
          updatedAt == other.updatedAt &&
          _listEquals(deckCards, other.deckCards);

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      description.hashCode ^
      formatName.hashCode ^
      creatorUsername.hashCode ^
      updatedAt.hashCode ^
      deckCards.hashCode;

  bool _listEquals<T>(List<T> a, List<T> b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}
