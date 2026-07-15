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
  formatName: json['formatName'] as String,
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
  'formatName': instance.formatName,
  'deckCards': instance.deckCards,
  'validationWarnings': instance.validationWarnings,
};
