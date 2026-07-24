import 'package:freezed_annotation/freezed_annotation.dart';

/// Card elemental attributes.
@JsonEnum()
enum CardAttribute {
  @JsonValue('LIGHT')
  light('LIGHT'),
  @JsonValue('DARK')
  dark('DARK'),
  @JsonValue('WATER')
  water('WATER'),
  @JsonValue('FIRE')
  fire('FIRE'),
  @JsonValue('EARTH')
  earth('EARTH'),
  @JsonValue('WIND')
  wind('WIND'),
  @JsonValue('DIVINE')
  divine('DIVINE'),
  @JsonValue('UNKNOWN')
  unknown('UNKNOWN');

  final String value;
  const CardAttribute(this.value);

  static CardAttribute fromString(String? val) {
    if (val == null) return CardAttribute.unknown;
    return CardAttribute.values.firstWhere(
      (e) => e.value.toUpperCase() == val.toUpperCase(),
      orElse: () => CardAttribute.unknown,
    );
  }
}
