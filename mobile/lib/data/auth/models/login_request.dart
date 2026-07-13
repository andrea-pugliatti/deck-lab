import 'package:freezed_annotation/freezed_annotation.dart';

part 'login_request.freezed.dart';
part 'login_request.g.dart';

/// Request body transfer object encapsulating user login credentials.
///
/// Sent to the POST `/api/auth/login` endpoint for session validation.
@freezed
abstract class LoginRequest with _$LoginRequest {
  /// Default constructor for [LoginRequest].
  const factory LoginRequest({
    /// The unique username identifier chosen by the user.
    required String username,

    /// The password credentials matching the chosen username.
    required String password,
  }) = _LoginRequest;

  /// De-serializes JSON map data into a [LoginRequest] class.
  factory LoginRequest.fromJson(Map<String, dynamic> json) => _$LoginRequestFromJson(json);
}
