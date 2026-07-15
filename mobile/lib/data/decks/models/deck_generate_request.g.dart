// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_generate_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckGenerateRequest _$DeckGenerateRequestFromJson(Map<String, dynamic> json) =>
    _DeckGenerateRequest(
      archetype: json['archetype'] as String,
      strategy: json['strategy'] as String,
      formatName: json['formatName'] as String,
      customPrompt: json['customPrompt'] as String?,
    );

Map<String, dynamic> _$DeckGenerateRequestToJson(
  _DeckGenerateRequest instance,
) => <String, dynamic>{
  'archetype': instance.archetype,
  'strategy': instance.strategy,
  'formatName': instance.formatName,
  'customPrompt': instance.customPrompt,
};
