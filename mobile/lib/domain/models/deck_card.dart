import '../enums/enums.dart';

/// Domain model representing a card instance within a deck layout.
class DeckCard {
  final int? id;
  final int cardId;
  final String name;
  final CardType? type;
  final String? description;
  final CardRace? race;
  final CardAttribute? attribute;
  final String? archetype;
  final String? imageUrl;
  final DeckSection section;
  final int quantity;

  const DeckCard({
    this.id,
    required this.cardId,
    required this.name,
    this.type,
    this.description,
    this.race,
    this.attribute,
    this.archetype,
    this.imageUrl,
    required this.section,
    required this.quantity,
  });

  DeckCard copyWith({
    int? id,
    int? cardId,
    String? name,
    CardType? type,
    String? description,
    CardRace? race,
    CardAttribute? attribute,
    String? archetype,
    String? imageUrl,
    DeckSection? section,
    int? quantity,
  }) {
    return DeckCard(
      id: id ?? this.id,
      cardId: cardId ?? this.cardId,
      name: name ?? this.name,
      type: type ?? this.type,
      description: description ?? this.description,
      race: race ?? this.race,
      attribute: attribute ?? this.attribute,
      archetype: archetype ?? this.archetype,
      imageUrl: imageUrl ?? this.imageUrl,
      section: section ?? this.section,
      quantity: quantity ?? this.quantity,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DeckCard &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          cardId == other.cardId &&
          name == other.name &&
          type == other.type &&
          description == other.description &&
          race == other.race &&
          attribute == other.attribute &&
          archetype == other.archetype &&
          imageUrl == other.imageUrl &&
          section == other.section &&
          quantity == other.quantity;

  @override
  int get hashCode =>
      id.hashCode ^
      cardId.hashCode ^
      name.hashCode ^
      type.hashCode ^
      description.hashCode ^
      race.hashCode ^
      attribute.hashCode ^
      archetype.hashCode ^
      imageUrl.hashCode ^
      section.hashCode ^
      quantity.hashCode;
}
