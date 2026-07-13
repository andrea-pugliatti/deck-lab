/// Domain model representing an authenticated user session.
class AuthSession {
  final String accessToken;
  final String? refreshToken;
  final String? username;

  const AuthSession({
    required this.accessToken,
    this.refreshToken,
    this.username,
  });

  AuthSession copyWith({
    String? accessToken,
    String? refreshToken,
    String? username,
  }) {
    return AuthSession(
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
      username: username ?? this.username,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthSession &&
          runtimeType == other.runtimeType &&
          accessToken == other.accessToken &&
          refreshToken == other.refreshToken &&
          username == other.username;

  @override
  int get hashCode =>
      accessToken.hashCode ^ refreshToken.hashCode ^ username.hashCode;
}
