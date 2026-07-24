import 'package:freezed_annotation/freezed_annotation.dart';

/// Card classification types.
@JsonEnum()
enum CardType {
  @JsonValue('Normal Monster')
  normalMonster('Normal Monster'),
  @JsonValue('Effect Monster')
  effectMonster('Effect Monster'),
  @JsonValue('Ritual Monster')
  ritualMonster('Ritual Monster'),
  @JsonValue('Ritual Effect Monster')
  ritualEffectMonster('Ritual Effect Monster'),
  @JsonValue('Fusion Monster')
  fusionMonster('Fusion Monster'),
  @JsonValue('Synchro Monster')
  synchroMonster('Synchro Monster'),
  @JsonValue('XYZ Monster')
  xyzMonster('XYZ Monster'),
  @JsonValue('Link Monster')
  linkMonster('Link Monster'),
  @JsonValue('Spell Card')
  spellCard('Spell Card'),
  @JsonValue('Trap Card')
  trapCard('Trap Card'),
  @JsonValue('Token')
  token('Token'),
  @JsonValue('Skill Card')
  skillCard('Skill Card'),
  @JsonValue('Pendulum Effect Monster')
  pendulumEffectMonster('Pendulum Effect Monster'),
  @JsonValue('Pendulum Normal Monster')
  pendulumNormalMonster('Pendulum Normal Monster'),
  @JsonValue('Synchro Pendulum Effect Monster')
  synchroPendulumEffectMonster('Synchro Pendulum Effect Monster'),
  @JsonValue('XYZ Pendulum Effect Monster')
  xyzPendulumEffectMonster('XYZ Pendulum Effect Monster'),
  @JsonValue('Pendulum Effect Fusion Monster')
  pendulumEffectFusionMonster('Pendulum Effect Fusion Monster'),
  @JsonValue('Tuner Monster')
  tunerMonster('Tuner Monster'),
  @JsonValue('Gemini Monster')
  geminiMonster('Gemini Monster'),
  @JsonValue('Spirit Monster')
  spiritMonster('Spirit Monster'),
  @JsonValue('Toon Monster')
  toonMonster('Toon Monster'),
  @JsonValue('Union Effect Monster')
  unionEffectMonster('Union Effect Monster'),
  @JsonValue('Flip Effect Monster')
  flipEffectMonster('Flip Effect Monster'),
  @JsonValue('Flip Tuner Effect Monster')
  flipTunerEffectMonster('Flip Tuner Effect Monster'),
  @JsonValue('Pendulum Tuner Effect Monster')
  pendulumTunerEffectMonster('Pendulum Tuner Effect Monster'),
  @JsonValue('Special Summon Monster')
  specialSummonMonster('Special Summon Monster'),
  @JsonValue('Pendulum Flip Effect Monster')
  pendulumFlipEffectMonster('Pendulum Flip Effect Monster'),
  @JsonValue('Pendulum Effect Special Summon Monster')
  pendulumEffectSpecialSummonMonster('Pendulum Effect Special Summon Monster'),
  @JsonValue('Synchro Tuner Monster')
  synchroTunerMonster('Synchro Tuner Monster'),
  @JsonValue('Normal Tuner Monster')
  normalTunerMonster('Normal Tuner Monster'),
  @JsonValue('Pendulum Effect Ritual Monster')
  pendulumEffectRitualMonster('Pendulum Effect Ritual Monster'),
  @JsonValue('Unknown')
  unknown('Unknown');

  final String value;
  const CardType(this.value);

  static CardType fromString(String? val) {
    if (val == null || val.trim().isEmpty) return CardType.unknown;
    final trimmed = val.trim();
    return CardType.values.firstWhere(
      (e) => e.value.toLowerCase() == trimmed.toLowerCase(),
      orElse: () => CardType.unknown,
    );
  }
}
