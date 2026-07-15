// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_card_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckCardResponse _$DeckCardResponseFromJson(Map<String, dynamic> json) =>
    _DeckCardResponse(
      id: (json['id'] as num?)?.toInt(),
      cardId: (json['cardId'] as num).toInt(),
      name: json['name'] as String,
      type: json['type'] as String?,
      description: json['description'] as String?,
      race: json['race'] as String?,
      attribute: json['attribute'] as String?,
      archetype: json['archetype'] as String?,
      imageUrl: json['imageUrl'] as String?,
      section: json['section'] as String,
      quantity: (json['quantity'] as num).toInt(),
    );

Map<String, dynamic> _$DeckCardResponseToJson(_DeckCardResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'cardId': instance.cardId,
      'name': instance.name,
      'type': instance.type,
      'description': instance.description,
      'race': instance.race,
      'attribute': instance.attribute,
      'archetype': instance.archetype,
      'imageUrl': instance.imageUrl,
      'section': instance.section,
      'quantity': instance.quantity,
    };
