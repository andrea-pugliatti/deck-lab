/// Domain model representing a Yu-Gi-Oh! card.
class Card {
  final int id;
  final String name;
  final String type;
  final String? description;
  final String? race;
  final String? attribute;
  final String? archetype;
  final String? imageUrl;
  final String? imageUrlCropped;
  final String? frameType;
  final int? atk;
  final int? def;
  final int? level;
  final int? linkVal;
  final int? scale;

  const Card({
    required this.id,
    required this.name,
    required this.type,
    this.description,
    this.race,
    this.attribute,
    this.archetype,
    this.imageUrl,
    this.imageUrlCropped,
    this.frameType,
    this.atk,
    this.def,
    this.level,
    this.linkVal,
    this.scale,
  });

  Card copyWith({
    int? id,
    String? name,
    String? type,
    String? description,
    String? race,
    String? attribute,
    String? archetype,
    String? imageUrl,
    String? imageUrlCropped,
    String? frameType,
    int? atk,
    int? def,
    int? level,
    int? linkVal,
    int? scale,
  }) {
    return Card(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      description: description ?? this.description,
      race: race ?? this.race,
      attribute: attribute ?? this.attribute,
      archetype: archetype ?? this.archetype,
      imageUrl: imageUrl ?? this.imageUrl,
      imageUrlCropped: imageUrlCropped ?? this.imageUrlCropped,
      frameType: frameType ?? this.frameType,
      atk: atk ?? this.atk,
      def: def ?? this.def,
      level: level ?? this.level,
      linkVal: linkVal ?? this.linkVal,
      scale: scale ?? this.scale,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Card &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          type == other.type &&
          description == other.description &&
          race == other.race &&
          attribute == other.attribute &&
          archetype == other.archetype &&
          imageUrl == other.imageUrl &&
          imageUrlCropped == other.imageUrlCropped &&
          frameType == other.frameType &&
          atk == other.atk &&
          def == other.def &&
          level == other.level &&
          linkVal == other.linkVal &&
          scale == other.scale;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      type.hashCode ^
      description.hashCode ^
      race.hashCode ^
      attribute.hashCode ^
      archetype.hashCode ^
      imageUrl.hashCode ^
      imageUrlCropped.hashCode ^
      frameType.hashCode ^
      atk.hashCode ^
      def.hashCode ^
      level.hashCode ^
      linkVal.hashCode ^
      scale.hashCode;
}
