import 'package:freezed_annotation/freezed_annotation.dart';

part 'validation_error_response.freezed.dart';
part 'validation_error_response.g.dart';

/// DTO representing parsed validation errors returned by the Spring controllers.
@freezed
abstract class ValidationErrorResponse with _$ValidationErrorResponse {
  const factory ValidationErrorResponse({
    required String message,
    required List<String> errors,
  }) = _ValidationErrorResponse;

  /// De-serializes JSON map data into a [ValidationErrorResponse] class.
  factory ValidationErrorResponse.fromJson(Map<String, dynamic> json) =>
      _$ValidationErrorResponseFromJson(json);
}
