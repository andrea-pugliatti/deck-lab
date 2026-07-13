import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_response.freezed.dart';
part 'auth_response.g.dart';

/// Data Transfer Object (DTO) wrapping credentials returned upon successful user authentication.
///
/// Encapsulates short-lived JWT access tokens and long-lived refresh tokens.
@freezed
abstract class AuthResponse with _$AuthResponse {
  /// Default constructor for [AuthResponse].
  const factory AuthResponse({
    required String accessToken,
    String? refreshToken,
    String? username,
  }) = _AuthResponse;

  /// De-serializes JSON map data into an [AuthResponse] class.
  factory AuthResponse.fromJson(Map<String, dynamic> json) => _$AuthResponseFromJson(json);
}
