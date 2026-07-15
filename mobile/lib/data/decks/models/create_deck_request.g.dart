// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_deck_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CreateDeckRequest _$CreateDeckRequestFromJson(Map<String, dynamic> json) =>
    _CreateDeckRequest(
      name: json['name'] as String,
      description: json['description'] as String,
      formatName: json['formatName'] as String,
      deckCards: (json['deckCards'] as List<dynamic>)
          .map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$CreateDeckRequestToJson(_CreateDeckRequest instance) =>
    <String, dynamic>{
      'name': instance.name,
      'description': instance.description,
      'formatName': instance.formatName,
      'deckCards': instance.deckCards,
    };
