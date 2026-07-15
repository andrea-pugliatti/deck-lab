// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_summary_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckSummaryResponse _$DeckSummaryResponseFromJson(Map<String, dynamic> json) =>
    _DeckSummaryResponse(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      description: json['description'] as String?,
      formatName: json['formatName'] as String,
      creatorUsername: json['creatorUsername'] as String?,
      updatedAt: json['updatedAt'] as String?,
      deckCards:
          (json['deckCards'] as List<dynamic>?)
              ?.map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$DeckSummaryResponseToJson(
  _DeckSummaryResponse instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'description': instance.description,
  'formatName': instance.formatName,
  'creatorUsername': instance.creatorUsername,
  'updatedAt': instance.updatedAt,
  'deckCards': instance.deckCards,
};
