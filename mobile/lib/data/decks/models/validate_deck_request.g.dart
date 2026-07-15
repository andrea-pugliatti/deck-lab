// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'validate_deck_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ValidateDeckRequest _$ValidateDeckRequestFromJson(Map<String, dynamic> json) =>
    _ValidateDeckRequest(
      name: json['name'] as String,
      formatName: json['formatName'] as String,
      deckCards: (json['deckCards'] as List<dynamic>)
          .map((e) => DeckCardResponse.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ValidateDeckRequestToJson(
  _ValidateDeckRequest instance,
) => <String, dynamic>{
  'name': instance.name,
  'formatName': instance.formatName,
  'deckCards': instance.deckCards,
};
