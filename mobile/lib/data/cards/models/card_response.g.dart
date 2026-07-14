// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CardResponse _$CardResponseFromJson(Map<String, dynamic> json) =>
    _CardResponse(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      type: json['type'] as String,
      description: json['description'] as String?,
      race: json['race'] as String?,
      attribute: json['attribute'] as String?,
      archetype: json['archetype'] as String?,
      imageUrl: json['imageUrl'] as String?,
      imageUrlCropped: json['imageUrlCropped'] as String?,
      frameType: json['frameType'] as String?,
      atk: (json['atk'] as num?)?.toInt(),
      def: (json['def'] as num?)?.toInt(),
      level: (json['level'] as num?)?.toInt(),
      linkVal: (json['linkVal'] as num?)?.toInt(),
      scale: (json['scale'] as num?)?.toInt(),
    );

Map<String, dynamic> _$CardResponseToJson(_CardResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'description': instance.description,
      'race': instance.race,
      'attribute': instance.attribute,
      'archetype': instance.archetype,
      'imageUrl': instance.imageUrl,
      'imageUrlCropped': instance.imageUrlCropped,
      'frameType': instance.frameType,
      'atk': instance.atk,
      'def': instance.def,
      'level': instance.level,
      'linkVal': instance.linkVal,
      'scale': instance.scale,
    };
