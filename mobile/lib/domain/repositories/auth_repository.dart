import '../models/auth_session.dart';

/// Abstract contract for authentication domain operations.
abstract class AuthRepository {
  /// Submits credentials for session validation.
  Future<AuthSession> login(String username, String password);

  /// Submits credential details for new user creation.
  Future<AuthSession> register(String username, String password, String email);

  /// Revokes credentials and destroys active session locally and remotely.
  Future<void> logout();

  /// Checks if stored credentials allow automatic silent validation.
  Future<String?> trySilentLogin();
}
