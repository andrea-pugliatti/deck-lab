// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card_suggestion_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CardSuggestionResponse _$CardSuggestionResponseFromJson(
  Map<String, dynamic> json,
) => _CardSuggestionResponse(
  name: json['name'] as String,
  section: $enumDecode(_$DeckSectionEnumMap, json['section']),
  synergyReason: json['synergyReason'] as String,
  cardId: (json['cardId'] as num).toInt(),
  type: $enumDecode(
    _$CardTypeEnumMap,
    json['type'],
    unknownValue: CardType.unknown,
  ),
  imageUrl: json['imageUrl'] as String?,
);

Map<String, dynamic> _$CardSuggestionResponseToJson(
  _CardSuggestionResponse instance,
) => <String, dynamic>{
  'name': instance.name,
  'section': _$DeckSectionEnumMap[instance.section]!,
  'synergyReason': instance.synergyReason,
  'cardId': instance.cardId,
  'type': _$CardTypeEnumMap[instance.type]!,
  'imageUrl': instance.imageUrl,
};

const _$DeckSectionEnumMap = {
  DeckSection.main: 'MAIN',
  DeckSection.extra: 'EXTRA',
  DeckSection.side: 'SIDE',
};

const _$CardTypeEnumMap = {
  CardType.normalMonster: 'Normal Monster',
  CardType.effectMonster: 'Effect Monster',
  CardType.ritualMonster: 'Ritual Monster',
  CardType.ritualEffectMonster: 'Ritual Effect Monster',
  CardType.fusionMonster: 'Fusion Monster',
  CardType.synchroMonster: 'Synchro Monster',
  CardType.xyzMonster: 'XYZ Monster',
  CardType.linkMonster: 'Link Monster',
  CardType.spellCard: 'Spell Card',
  CardType.trapCard: 'Trap Card',
  CardType.token: 'Token',
  CardType.skillCard: 'Skill Card',
  CardType.pendulumEffectMonster: 'Pendulum Effect Monster',
  CardType.pendulumNormalMonster: 'Pendulum Normal Monster',
  CardType.synchroPendulumEffectMonster: 'Synchro Pendulum Effect Monster',
  CardType.xyzPendulumEffectMonster: 'XYZ Pendulum Effect Monster',
  CardType.pendulumEffectFusionMonster: 'Pendulum Effect Fusion Monster',
  CardType.tunerMonster: 'Tuner Monster',
  CardType.geminiMonster: 'Gemini Monster',
  CardType.spiritMonster: 'Spirit Monster',
  CardType.toonMonster: 'Toon Monster',
  CardType.unionEffectMonster: 'Union Effect Monster',
  CardType.flipEffectMonster: 'Flip Effect Monster',
  CardType.flipTunerEffectMonster: 'Flip Tuner Effect Monster',
  CardType.pendulumTunerEffectMonster: 'Pendulum Tuner Effect Monster',
  CardType.specialSummonMonster: 'Special Summon Monster',
  CardType.pendulumFlipEffectMonster: 'Pendulum Flip Effect Monster',
  CardType.pendulumEffectSpecialSummonMonster:
      'Pendulum Effect Special Summon Monster',
  CardType.synchroTunerMonster: 'Synchro Tuner Monster',
  CardType.normalTunerMonster: 'Normal Tuner Monster',
  CardType.pendulumEffectRitualMonster: 'Pendulum Effect Ritual Monster',
  CardType.unknown: 'Unknown',
};
