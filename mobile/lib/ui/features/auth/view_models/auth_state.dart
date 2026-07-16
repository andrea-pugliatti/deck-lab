/// Immutable representation of the user authentication state within the app view layer.
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final String? username;
  final String? errorMessage;

  const AuthState({
    required this.isAuthenticated,
    required this.isLoading,
    this.username,
    this.errorMessage,
  });
}
