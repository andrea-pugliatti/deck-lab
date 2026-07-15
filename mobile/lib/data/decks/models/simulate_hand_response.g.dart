// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'simulate_hand_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SimulateHandResponse _$SimulateHandResponseFromJson(
  Map<String, dynamic> json,
) => _SimulateHandResponse(
  exactProbability: (json['exactProbability'] as num).toDouble(),
  atLeastProbability: (json['atLeastProbability'] as num).toDouble(),
);

Map<String, dynamic> _$SimulateHandResponseToJson(
  _SimulateHandResponse instance,
) => <String, dynamic>{
  'exactProbability': instance.exactProbability,
  'atLeastProbability': instance.atLeastProbability,
};
