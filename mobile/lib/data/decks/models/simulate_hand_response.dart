import 'package:freezed_annotation/freezed_annotation.dart';

part 'simulate_hand_response.freezed.dart';
part 'simulate_hand_response.g.dart';

/// Computed results returned by the odds calculation engine.
@freezed
abstract class SimulateHandResponse with _$SimulateHandResponse {
  const factory SimulateHandResponse({
    required double exactProbability,
    required double atLeastProbability,
  }) = _SimulateHandResponse;

  /// De-serializes JSON map data into a [SimulateHandResponse] class.
  factory SimulateHandResponse.fromJson(Map<String, dynamic> json) =>
      _$SimulateHandResponseFromJson(json);
}
