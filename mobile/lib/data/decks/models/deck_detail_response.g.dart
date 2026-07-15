// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_detail_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckDetailResponse _$DeckDetailResponseFromJson(Map<String, dynamic> json) =>
    _DeckDetailResponse(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      description: json['description'] as String?,
      formatName: json['formatName'] as String,
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
      'formatName': instance.formatName,
      'creatorUsername': instance.creatorUsername,
      'updatedAt': instance.updatedAt,
      'deckCards': instance.deckCards,
    };
