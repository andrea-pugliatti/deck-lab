// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_deck_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_UpdateDeckRequest _$UpdateDeckRequestFromJson(Map<String, dynamic> json) =>
    _UpdateDeckRequest(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      description: json['description'] as String,
      formatName: $enumDecode(_$FormatEnumMap, json['formatName']),
      deckCards: (json['deckCards'] as List<dynamic>)
          .map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$UpdateDeckRequestToJson(_UpdateDeckRequest instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'formatName': _$FormatEnumMap[instance.formatName]!,
      'deckCards': instance.deckCards,
    };

const _$FormatEnumMap = {
  Format.tcg: 'TCG',
  Format.ocg: 'OCG',
  Format.goat: 'Goat',
  Format.edison: 'Edison',
  Format.speedDuel: 'Speed Duel',
  Format.custom: 'Custom',
};
