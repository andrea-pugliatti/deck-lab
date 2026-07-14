import 'package:dio/dio.dart';

import '../../domain/models/auth_session.dart';
import '../../domain/repositories/auth_repository.dart';
import '../core/api_client.dart';
import '../core/session_storage.dart';
import 'models/auth_response.dart';
import 'models/login_request.dart';
import 'models/register_request.dart';

/// Repository abstracting user authentication network endpoints.
///
/// Communicates directly with `/api/auth/` paths and handles token local propagation.
class AuthRepositoryImpl implements AuthRepository {
  /// Mapped API Client instance.
  final ApiClient apiClient;

  /// Mapped credentials storage service instance.
  final SessionStorage sessionStorage;

  /// Default constructor for [AuthRepositoryImpl].
  AuthRepositoryImpl({required this.apiClient, required this.sessionStorage});

  /// Submits user credentials to POST `/api/auth/login`.
  ///
  /// Persists session tokens and username upon success.
  /// Throws standard [Exception] if credentials fail or rate limits are exceeded.
  @override
  Future<AuthSession> login(String username, String password) async {
    try {
      final request = LoginRequest(username: username, password: password);
      final response = await apiClient.dio.post(
        '/api/auth/login',
        data: request.toJson(),
      );

      if (response.statusCode == 200) {
        final authRes = AuthResponse.fromJson(
          response.data as Map<String, dynamic>,
        );
        apiClient.setAccessToken(authRes.accessToken);
        if (authRes.username != null) {
          await sessionStorage.saveUsername(authRes.username!);
        }
        return AuthSession(
          accessToken: authRes.accessToken,
          refreshToken: authRes.refreshToken,
          username: authRes.username,
        );
      }
      throw Exception('Invalid login response from server.');
    } on DioException catch (e) {
      final message = _parseError(e);
      throw Exception(message);
    }
  }

  /// Registers a new user account via POST `/api/auth/register`.
  ///
  /// Sets active session details upon success.
  /// Throws [Exception] with validation feedback on errors.
  @override
  Future<AuthSession> register(
    String username,
    String password,
    String email,
  ) async {
    try {
      final request = RegisterRequest(
        username: username,
        password: password,
        email: email,
      );
      final response = await apiClient.dio.post(
        '/api/auth/register',
        data: request.toJson(),
      );

      if (response.statusCode == 200) {
        final authRes = AuthResponse.fromJson(
          response.data as Map<String, dynamic>,
        );
        apiClient.setAccessToken(authRes.accessToken);
        if (authRes.username != null) {
          await sessionStorage.saveUsername(authRes.username!);
        }
        return AuthSession(
          accessToken: authRes.accessToken,
          refreshToken: authRes.refreshToken,
          username: authRes.username,
        );
      }
      throw Exception('Invalid registration response from server.');
    } on DioException catch (e) {
      final message = _parseError(e);
      throw Exception(message);
    }
  }

  /// Revokes active user credentials via POST `/api/auth/logout`.
  ///
  /// Wipes all memory and secure database tokens.
  @override
  Future<void> logout() async {
    try {
      // POST is submitted to inform the backend database to revoke the session
      await apiClient.dio.post('/api/auth/logout');
    } finally {
      // Always wipe credentials locally even if network is offline
      await apiClient.clearSession();
    }
  }

  /// Evaluates if secure storage credentials exist to perform silent log-in.
  ///
  /// Returns username if success, null if credentials do not exist or are expired.
  @override
  Future<String?> trySilentLogin() async {
    try {
      final accessToken = await apiClient.refreshSession();
      if (accessToken != null) {
        return await sessionStorage.getUsername();
      }
    } catch (_) {
      // Silent refresh failed, ignore and force regular login redirect
    }
    return null;
  }

  /// Private helper method to parse error details from a [DioException].
  String _parseError(DioException e) {
    if (e.error != null) {
      return e.error.toString();
    }
    switch (e.response?.data) {
      case {'errors': List errorsList} when errorsList.isNotEmpty:
        return errorsList.join(', ');
      case {'message': var msg}:
        return msg.toString();
      case {'error': var err}:
        return err.toString();
      default:
        return 'Connection failed. Status: ${e.response?.statusCode}';
    }
  }
}
