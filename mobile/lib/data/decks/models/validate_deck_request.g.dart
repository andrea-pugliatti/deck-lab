// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'validate_deck_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ValidateDeckRequest _$ValidateDeckRequestFromJson(Map<String, dynamic> json) =>
    _ValidateDeckRequest(
      name: json['name'] as String,
      formatName: $enumDecode(_$FormatEnumMap, json['formatName']),
      deckCards: (json['deckCards'] as List<dynamic>)
          .map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ValidateDeckRequestToJson(
  _ValidateDeckRequest instance,
) => <String, dynamic>{
  'name': instance.name,
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
