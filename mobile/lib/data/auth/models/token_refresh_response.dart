import 'package:freezed_annotation/freezed_annotation.dart';

part 'token_refresh_response.freezed.dart';
part 'token_refresh_response.g.dart';

/// Data Transfer Object (DTO) wrapping refreshed credentials returned from the session rotation endpoint.
@freezed
abstract class TokenRefreshResponse with _$TokenRefreshResponse {
  /// Default constructor for [TokenRefreshResponse].
  const factory TokenRefreshResponse({
    /// The new short-lived JSON Web Token (JWT) access token.
    required String accessToken,

    /// The new rotated refresh token.
    required String refreshToken,

    /// The token type (e.g. Bearer).
    @Default('Bearer') String tokenType,
  }) = _TokenRefreshResponse;

  /// De-serializes JSON map data into a [TokenRefreshResponse] class.
  factory TokenRefreshResponse.fromJson(Map<String, dynamic> json) => _$TokenRefreshResponseFromJson(json);
}
