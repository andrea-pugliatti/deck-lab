// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_detail_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckDetailResponse _$DeckDetailResponseFromJson(Map<String, dynamic> json) =>
    _DeckDetailResponse(
      id: (json['id'] as num?)?.toInt(),
      name: json['name'] as String,
      description: json['description'] as String?,
      formatName: $enumDecode(_$FormatEnumMap, json['formatName']),
      creatorUsername: json['creatorUsername'] as String?,
      updatedAt: json['updatedAt'] as String?,
      deckCards: (json['deckCards'] as List<dynamic>)
          .map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$DeckDetailResponseToJson(_DeckDetailResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'formatName': _$FormatEnumMap[instance.formatName]!,
      'creatorUsername': instance.creatorUsername,
      'updatedAt': instance.updatedAt,
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
