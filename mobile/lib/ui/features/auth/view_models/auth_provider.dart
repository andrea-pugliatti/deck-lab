import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers.dart';

/// Notifier managing user authentication session states.
///
/// Implements cold-start silent login checks, login form submission, registration,
/// and secure logout workflows.
class AuthNotifier extends AsyncNotifier<String?> {
  @override
  FutureOr<String?> build() async {
    // Link local token changes to session active stats
    ref.listen(accessTokenProvider, (previous, next) {
      if (next == null) {
        state = const AsyncValue.data(null);
      }
    });

    // Check secure storage for cached credentials
    final repo = ref.read(authRepositoryProvider);
    final silentUser = await repo.trySilentLogin();
    if (silentUser != null) {
      // Sync dynamic network token mapping
      final client = ref.read(apiClientProvider);
      ref.read(accessTokenProvider.notifier).setToken(client.accessToken);
      return silentUser;
    }
    return null;
  }

  Future<void> login(String username, String password) async {
    state = const AsyncValue.loading();
    try {
      final repo = ref.read(authRepositoryProvider);
      final res = await repo.login(username, password);
      ref.read(accessTokenProvider.notifier).setToken(res.accessToken);
      state = AsyncValue.data(res.username ?? username);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> register(String username, String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final repo = ref.read(authRepositoryProvider);
      final res = await repo.register(username, password, email);
      ref.read(accessTokenProvider.notifier).setToken(res.accessToken);
      state = AsyncValue.data(res.username ?? username);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    try {
      await ref.read(authRepositoryProvider).logout();
    } finally {
      ref.read(accessTokenProvider.notifier).setToken(null);
      state = const AsyncValue.data(null);
    }
  }
}

/// Provider exposing the active authentication notifier state (username, or null if guest).
final authProvider = AsyncNotifierProvider<AuthNotifier, String?>(
  AuthNotifier.new,
);
