// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_card_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckCardResponse _$DeckCardResponseFromJson(Map<String, dynamic> json) =>
    _DeckCardResponse(
      id: (json['id'] as num?)?.toInt(),
      cardId: (json['cardId'] as num).toInt(),
      name: json['name'] as String,
      type: $enumDecodeNullable(
        _$CardTypeEnumMap,
        json['type'],
        unknownValue: CardType.unknown,
      ),
      description: json['description'] as String?,
      race: $enumDecodeNullable(
        _$CardRaceEnumMap,
        json['race'],
        unknownValue: CardRace.unknown,
      ),
      attribute: $enumDecodeNullable(
        _$CardAttributeEnumMap,
        json['attribute'],
        unknownValue: CardAttribute.unknown,
      ),
      archetype: json['archetype'] as String?,
      imageUrl: json['imageUrl'] as String?,
      section: $enumDecode(_$DeckSectionEnumMap, json['section']),
      quantity: (json['quantity'] as num).toInt(),
    );

Map<String, dynamic> _$DeckCardResponseToJson(_DeckCardResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'cardId': instance.cardId,
      'name': instance.name,
      'type': _$CardTypeEnumMap[instance.type],
      'description': instance.description,
      'race': _$CardRaceEnumMap[instance.race],
      'attribute': _$CardAttributeEnumMap[instance.attribute],
      'archetype': instance.archetype,
      'imageUrl': instance.imageUrl,
      'section': _$DeckSectionEnumMap[instance.section]!,
      'quantity': instance.quantity,
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

const _$CardRaceEnumMap = {
  CardRace.aqua: 'Aqua',
  CardRace.beast: 'Beast',
  CardRace.beastWarrior: 'Beast-Warrior',
  CardRace.creatorGod: 'Creator God',
  CardRace.cyberse: 'Cyberse',
  CardRace.dinosaur: 'Dinosaur',
  CardRace.divineBeast: 'Divine-Beast',
  CardRace.dragon: 'Dragon',
  CardRace.fairy: 'Fairy',
  CardRace.fiend: 'Fiend',
  CardRace.fish: 'Fish',
  CardRace.illusion: 'Illusion',
  CardRace.insect: 'Insect',
  CardRace.machine: 'Machine',
  CardRace.plant: 'Plant',
  CardRace.psychic: 'Psychic',
  CardRace.pyro: 'Pyro',
  CardRace.reptile: 'Reptile',
  CardRace.rock: 'Rock',
  CardRace.seaSerpent: 'Sea Serpent',
  CardRace.spellcaster: 'Spellcaster',
  CardRace.thunder: 'Thunder',
  CardRace.warrior: 'Warrior',
  CardRace.wingedBeast: 'Winged Beast',
  CardRace.wyrm: 'Wyrm',
  CardRace.zombie: 'Zombie',
  CardRace.normal: 'Normal',
  CardRace.field: 'Field',
  CardRace.equip: 'Equip',
  CardRace.continuous: 'Continuous',
  CardRace.quickPlay: 'Quick-Play',
  CardRace.ritual: 'Ritual',
  CardRace.counter: 'Counter',
  CardRace.skill: 'Skill',
  CardRace.token: 'Token',
  CardRace.unknown: 'Unknown',
};

const _$CardAttributeEnumMap = {
  CardAttribute.light: 'LIGHT',
  CardAttribute.dark: 'DARK',
  CardAttribute.water: 'WATER',
  CardAttribute.fire: 'FIRE',
  CardAttribute.earth: 'EARTH',
  CardAttribute.wind: 'WIND',
  CardAttribute.divine: 'DIVINE',
  CardAttribute.unknown: 'UNKNOWN',
};

const _$DeckSectionEnumMap = {
  DeckSection.main: 'MAIN',
  DeckSection.extra: 'EXTRA',
  DeckSection.side: 'SIDE',
};
