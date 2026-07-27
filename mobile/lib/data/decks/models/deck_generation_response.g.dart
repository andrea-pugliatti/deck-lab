// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_generation_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckGenerationResponse _$DeckGenerationResponseFromJson(
  Map<String, dynamic> json,
) => _DeckGenerationResponse(
  name: json['name'] as String,
  description: json['description'] as String,
  formatName: $enumDecode(_$FormatEnumMap, json['formatName']),
  deckCards:
      (json['deckCards'] as List<dynamic>?)
          ?.map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  validationWarnings:
      (json['validationWarnings'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList() ??
      const [],
);

Map<String, dynamic> _$DeckGenerationResponseToJson(
  _DeckGenerationResponse instance,
) => <String, dynamic>{
  'name': instance.name,
  'description': instance.description,
  'formatName': _$FormatEnumMap[instance.formatName]!,
  'deckCards': instance.deckCards,
  'validationWarnings': instance.validationWarnings,
};

const _$FormatEnumMap = {
  Format.tcg: 'TCG',
  Format.ocg: 'OCG',
  Format.goat: 'Goat',
  Format.edison: 'Edison',
  Format.speedDuel: 'Speed Duel',
  Format.custom: 'Custom',
};
