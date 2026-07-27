// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_suggest_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckSuggestRequest _$DeckSuggestRequestFromJson(Map<String, dynamic> json) =>
    _DeckSuggestRequest(
      formatName: $enumDecode(_$FormatEnumMap, json['formatName']),
      currentCards: (json['currentCards'] as List<dynamic>)
          .map((e) => CardEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$DeckSuggestRequestToJson(_DeckSuggestRequest instance) =>
    <String, dynamic>{
      'formatName': _$FormatEnumMap[instance.formatName]!,
      'currentCards': instance.currentCards,
    };

const _$FormatEnumMap = {
  Format.tcg: 'TCG',
  Format.ocg: 'OCG',
  Format.goat: 'Goat',
  Format.edison: 'Edison',
  Format.speedDuel: 'Speed Duel',
  Format.custom: 'Custom',
};
