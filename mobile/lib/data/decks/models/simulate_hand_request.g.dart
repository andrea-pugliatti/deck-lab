// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'simulate_hand_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SimulateHandRequest _$SimulateHandRequestFromJson(Map<String, dynamic> json) =>
    _SimulateHandRequest(
      deckSize: (json['deckSize'] as num).toInt(),
      targetCopies: (json['targetCopies'] as num).toInt(),
      drawSize: (json['drawSize'] as num).toInt(),
      successThreshold: (json['successThreshold'] as num?)?.toInt() ?? 1,
    );

Map<String, dynamic> _$SimulateHandRequestToJson(
  _SimulateHandRequest instance,
) => <String, dynamic>{
  'deckSize': instance.deckSize,
  'targetCopies': instance.targetCopies,
  'drawSize': instance.drawSize,
  'successThreshold': instance.successThreshold,
};
