import '../enums/enums.dart';

/// Domain model representing a single card recommended by AI synergies.
class CardSuggestion {
  final String name;
  final DeckSection section;
  final String synergyReason;
  final int cardId;
  final CardType type;
  final String? imageUrl;

  const CardSuggestion({
    required this.name,
    required this.section,
    required this.synergyReason,
    required this.cardId,
    required this.type,
    this.imageUrl,
  });

  CardSuggestion copyWith({
    String? name,
    DeckSection? section,
    String? synergyReason,
    int? cardId,
    CardType? type,
    String? imageUrl,
  }) {
    return CardSuggestion(
      name: name ?? this.name,
      section: section ?? this.section,
      synergyReason: synergyReason ?? this.synergyReason,
      cardId: cardId ?? this.cardId,
      type: type ?? this.type,
      imageUrl: imageUrl ?? this.imageUrl,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CardSuggestion &&
          runtimeType == other.runtimeType &&
          name == other.name &&
          section == other.section &&
          synergyReason == other.synergyReason &&
          cardId == other.cardId &&
          type == other.type &&
          imageUrl == other.imageUrl;

  @override
  int get hashCode =>
      name.hashCode ^
      section.hashCode ^
      synergyReason.hashCode ^
      cardId.hashCode ^
      type.hashCode ^
      imageUrl.hashCode;
}
