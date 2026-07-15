import 'package:freezed_annotation/freezed_annotation.dart';

part 'simulate_hand_request.freezed.dart';
part 'simulate_hand_request.g.dart';

/// Request parameters for the starting hand calculations.
@freezed
abstract class SimulateHandRequest with _$SimulateHandRequest {
  const factory SimulateHandRequest({
    required int deckSize,
    required int targetCopies,
    required int drawSize,
    @Default(1) int successThreshold,
  }) = _SimulateHandRequest;

  /// De-serializes JSON map data into a [SimulateHandRequest] class.
  factory SimulateHandRequest.fromJson(Map<String, dynamic> json) =>
      _$SimulateHandRequestFromJson(json);
}
