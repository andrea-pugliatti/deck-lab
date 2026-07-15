import 'package:freezed_annotation/freezed_annotation.dart';

part 'deck_validation_response.freezed.dart';
part 'deck_validation_response.g.dart';

/// Client-side parsed validation response wrapping rule evaluations.
@freezed
abstract class DeckValidationResponse with _$DeckValidationResponse {
  const factory DeckValidationResponse({
    required bool isValid,
    @Default([]) List<String> errors,
  }) = _DeckValidationResponse;

  /// De-serializes JSON map data into a [DeckValidationResponse] class.
  factory DeckValidationResponse.fromJson(Map<String, dynamic> json) =>
      _$DeckValidationResponseFromJson(json);
}
