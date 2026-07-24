import 'package:freezed_annotation/freezed_annotation.dart';

/// Strategy playstyle options for AI deck generation.
@JsonEnum()
enum Strategy {
  @JsonValue('None')
  none('None'),
  @JsonValue('Combo')
  combo('Combo'),
  @JsonValue('Control')
  control('Control'),
  @JsonValue('Aggro')
  aggro('Aggro'),
  @JsonValue('Midrange')
  midrange('Midrange'),
  @JsonValue('Going Second')
  goingSecond('Going Second'),
  @JsonValue('Stall/Burn')
  stallBurn('Stall/Burn'),
  @JsonValue('Pure')
  pure('Pure');

  final String value;
  const Strategy(this.value);

  static Strategy fromString(String? val) {
    if (val == null) return Strategy.none;
    return Strategy.values.firstWhere(
      (e) => e.value.toLowerCase() == val.toLowerCase(),
      orElse: () => Strategy.none,
    );
  }
}
