import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth/auth_repository.dart';
import '../../data/core/api_client.dart';
import '../../data/core/session_storage.dart';
import '../../domain/repositories/auth_repository.dart';

/// Provider exposing the [SessionStorage] instance.
final sessionStorageProvider = Provider<SessionStorage>((ref) {
  return SessionStorage();
});

/// Provider exposing the singleton instance of the [ApiClient].
final apiClientProvider = Provider<ApiClient>((ref) {
  final client = ApiClient(sessionStorage: ref.watch(sessionStorageProvider));
  // Listen for session expiry from API interceptor and reset auth state
  client.onSessionExpired = () {
    // When session expires, clear active state parameters
    ref.read(accessTokenProvider.notifier).setToken(null);
  };
  // Sync in-memory access token changes
  ref.listen<String?>(accessTokenProvider, (previous, next) {
    client.setAccessToken(next);
  });
  return client;
});

/// Notifier managing in-memory access token state.
class AccessTokenNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  /// Sets the current access token.
  void setToken(String? token) {
    state = token;
  }
}

/// Provider exposing the in-memory short-lived access token.
final accessTokenProvider = NotifierProvider<AccessTokenNotifier, String?>(
  AccessTokenNotifier.new,
);

/// Provider exposing [AuthRepository] bound to [apiClientProvider] and [sessionStorageProvider].
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    apiClient: ref.watch(apiClientProvider),
    sessionStorage: ref.watch(sessionStorageProvider),
  );
});
