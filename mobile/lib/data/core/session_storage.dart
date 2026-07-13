import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure key-value session credentials persistence service.
class SessionStorage {
  static const String _refreshTokenKey = 'refreshToken';
  static const String _usernameKey = 'authenticatedUsername';

  final FlutterSecureStorage _secureStorage;

  /// Default constructor initializing keychain storage.
  SessionStorage({FlutterSecureStorage? secureStorage})
    : _secureStorage =
          secureStorage ??
          const FlutterSecureStorage(
            mOptions: FixedMacOsOptions(usesDataProtectionKeychain: false),
          );

  /// Saves the long-lived refresh token.
  Future<void> saveRefreshToken(String token) async {
    await _secureStorage.write(key: _refreshTokenKey, value: token);
  }

  /// Retrieves the saved refresh token.
  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: _refreshTokenKey);
  }

  /// Deletes the saved refresh token.
  Future<void> deleteRefreshToken() async {
    await _secureStorage.delete(key: _refreshTokenKey);
  }

  /// Asserts if refresh token exists in secure storage.
  Future<bool> hasRefreshToken() async {
    return await _secureStorage.containsKey(key: _refreshTokenKey);
  }

  /// Saves the username.
  Future<void> saveUsername(String username) async {
    await _secureStorage.write(key: _usernameKey, value: username);
  }

  /// Retrieves the saved username.
  Future<String?> getUsername() async {
    return await _secureStorage.read(key: _usernameKey);
  }

  /// Deletes the saved username.
  Future<void> deleteUsername() async {
    await _secureStorage.delete(key: _usernameKey);
  }

  /// Wipes all credentials and tokens.
  Future<void> clearSession() async {
    await _secureStorage.delete(key: _refreshTokenKey);
    await _secureStorage.delete(key: _usernameKey);
  }
}

/// Custom macOS options subclass to work around a naming mismatch bug in
/// flutter_secure_storage (where Dart expects 'usesDataProtectionKeychain' and
/// Swift expects 'useDataProtectionKeyChain'). Setting this to false allows
/// the app to write to the macOS keychain without requiring Keychain Sharing
/// entitlements/code signing in development.
class FixedMacOsOptions extends MacOsOptions {
  /// Default constructor disabling data protection keychain.
  const FixedMacOsOptions({super.usesDataProtectionKeychain = false});

  @override
  Map<String, String> toMap() {
    final map = super.toMap();
    final value = map['usesDataProtectionKeychain'];
    if (value != null) {
      map['useDataProtectionKeyChain'] = value;
    }
    return map;
  }
}
