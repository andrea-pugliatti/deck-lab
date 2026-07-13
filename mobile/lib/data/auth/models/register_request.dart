import 'package:freezed_annotation/freezed_annotation.dart';

part 'register_request.freezed.dart';
part 'register_request.g.dart';

/// Request body transfer object encapsulating registration details.
///
/// Sent to the POST `/api/auth/register` endpoint to create a new user account.
@freezed
abstract class RegisterRequest with _$RegisterRequest {
  /// Default constructor for [RegisterRequest].
  const factory RegisterRequest({
    /// The unique username identifier chosen by the user (min 3, max 50 characters).
    required String username,

    /// A valid email address matching user identity constraints.
    required String email,

    /// The password credentials chosen for registration (min 6, max 100 characters).
    required String password,
  }) = _RegisterRequest;

  /// De-serializes JSON map data into a [RegisterRequest] class.
  factory RegisterRequest.fromJson(Map<String, dynamic> json) => _$RegisterRequestFromJson(json);
}
