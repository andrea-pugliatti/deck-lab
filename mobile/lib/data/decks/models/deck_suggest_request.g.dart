// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_suggest_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckSuggestRequest _$DeckSuggestRequestFromJson(Map<String, dynamic> json) =>
    _DeckSuggestRequest(
      formatName: json['formatName'] as String,
      currentCards: (json['currentCards'] as List<dynamic>)
          .map((e) => CardEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$DeckSuggestRequestToJson(_DeckSuggestRequest instance) =>
    <String, dynamic>{
      'formatName': instance.formatName,
      'currentCards': instance.currentCards,
    };
