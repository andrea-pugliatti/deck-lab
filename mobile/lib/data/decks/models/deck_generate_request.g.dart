// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_generate_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckGenerateRequest _$DeckGenerateRequestFromJson(Map<String, dynamic> json) =>
    _DeckGenerateRequest(
      archetype: json['archetype'] as String,
      strategy: $enumDecode(_$StrategyEnumMap, json['strategy']),
      formatName: $enumDecode(_$FormatEnumMap, json['formatName']),
      customPrompt: json['customPrompt'] as String?,
    );

Map<String, dynamic> _$DeckGenerateRequestToJson(
  _DeckGenerateRequest instance,
) => <String, dynamic>{
  'archetype': instance.archetype,
  'strategy': _$StrategyEnumMap[instance.strategy]!,
  'formatName': _$FormatEnumMap[instance.formatName]!,
  'customPrompt': instance.customPrompt,
};

const _$StrategyEnumMap = {
  Strategy.none: 'None',
  Strategy.combo: 'Combo',
  Strategy.control: 'Control',
  Strategy.aggro: 'Aggro',
  Strategy.midrange: 'Midrange',
  Strategy.goingSecond: 'Going Second',
  Strategy.stallBurn: 'Stall/Burn',
  Strategy.pure: 'Pure',
};

const _$FormatEnumMap = {
  Format.tcg: 'TCG',
  Format.ocg: 'OCG',
  Format.goat: 'Goat',
  Format.edison: 'Edison',
  Format.speedDuel: 'Speed Duel',
  Format.custom: 'Custom',
};
