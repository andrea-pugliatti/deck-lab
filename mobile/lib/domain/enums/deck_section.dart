import 'package:freezed_annotation/freezed_annotation.dart';

/// Deck section placement (Main, Extra, Side).
@JsonEnum()
enum DeckSection {
  @JsonValue('MAIN')
  main('MAIN'),
  @JsonValue('EXTRA')
  extra('EXTRA'),
  @JsonValue('SIDE')
  side('SIDE');

  final String value;
  const DeckSection(this.value);

  static DeckSection fromString(String? val) {
    if (val == null) return DeckSection.main;
    return DeckSection.values.firstWhere(
      (e) => e.value.toUpperCase() == val.toUpperCase(),
      orElse: () => DeckSection.main,
    );
  }
}
