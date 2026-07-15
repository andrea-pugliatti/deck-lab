// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card_suggestion_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CardSuggestionResponse _$CardSuggestionResponseFromJson(
  Map<String, dynamic> json,
) => _CardSuggestionResponse(
  name: json['name'] as String,
  section: json['section'] as String,
  synergyReason: json['synergyReason'] as String,
  cardId: (json['cardId'] as num).toInt(),
  type: json['type'] as String,
  imageUrl: json['imageUrl'] as String?,
);

Map<String, dynamic> _$CardSuggestionResponseToJson(
  _CardSuggestionResponse instance,
) => <String, dynamic>{
  'name': instance.name,
  'section': instance.section,
  'synergyReason': instance.synergyReason,
  'cardId': instance.cardId,
  'type': instance.type,
  'imageUrl': instance.imageUrl,
};
