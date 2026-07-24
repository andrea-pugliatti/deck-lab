import 'package:freezed_annotation/freezed_annotation.dart';

/// Yu-Gi-Oh! game format options.
@JsonEnum()
enum Format {
  @JsonValue('TCG')
  tcg('TCG'),
  @JsonValue('OCG')
  ocg('OCG'),
  @JsonValue('Goat')
  goat('Goat'),
  @JsonValue('Edison')
  edison('Edison'),
  @JsonValue('Speed Duel')
  speedDuel('Speed Duel'),
  @JsonValue('Custom')
  custom('Custom');

  final String value;
  const Format(this.value);

  static Format fromString(String? val) {
    if (val == null) return Format.tcg;
    return Format.values.firstWhere(
      (e) => e.value.toLowerCase() == val.toLowerCase(),
      orElse: () => Format.tcg,
    );
  }
}
