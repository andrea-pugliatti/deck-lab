import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'session_storage.dart';

/// Customized network client leveraging Dio for DeckLab API communications.
///
/// Implements auto-configuration of base URLs, set-cookie extraction, manual header
/// injection for cookies, rate-limit throttling (429), and queued token rotation (401).
class ApiClient {
  // --- Network Headers & Cookies ---
  static const String headerAuthorization = 'Authorization';
  static const String headerCookie = 'Cookie';
  static const String headerSetCookie = 'set-cookie';
  static const String cookieRefreshToken = 'refreshToken';

  // --- Backend Endpoints ---
  static const String pathAuthPrefix = '/api/auth/';
  static const String pathLogin = '/api/auth/login';
  static const String pathRegister = '/api/auth/register';
  static const String pathRefresh = '/api/auth/refresh';
  static const String pathLogout = '/api/auth/logout';

  // --- JSON Keys ---
  static const String keyAccessToken = 'accessToken';

  // --- Base URL configuration ---
  static const String prodBaseUrl = 'https://decklab.games/api';
  static const String localAndroidBaseUrl = 'http://10.0.2.2:8080';
  static const String localIosBaseUrl = 'http://localhost:8080';

  /// Underlying Dio HTTP client instance.
  final Dio dio;

  /// Underlying secure credentials storage service.
  final SessionStorage sessionStorage;

  /// Callback executed when the authenticated session is cleared (e.g. refresh failed, logout).
  VoidCallback? onSessionExpired;

  /// Current in-memory access token (ephemeral, not persisted).
  String? _accessToken;

  /// Default constructor initializing Dio with interceptors.
  ApiClient({Dio? dio, SessionStorage? sessionStorage})
    : dio = dio ?? Dio(),
      sessionStorage = sessionStorage ?? SessionStorage() {
    _initializeDio();
  }

  /// Sets the active in-memory access token.
  void setAccessToken(String? token) {
    _accessToken = token;
  }

  /// Retrieves the active in-memory access token.
  String? get accessToken => _accessToken;

  /// Resolves the default backend base URL dynamically based on the platform and build mode.
  ///
  /// In release mode, resolves to the production URL.
  /// For Android emulator context, resolves to `http://10.0.2.2:8080`.
  /// For iOS simulator or web context, resolves to `http://localhost:8080`.
  static String get defaultBaseUrl {
    if (kReleaseMode) {
      return prodBaseUrl;
    }
    if (!kIsWeb && Platform.isAndroid) {
      return localAndroidBaseUrl;
    }
    return localIosBaseUrl;
  }

  void _initializeDio() {
    dio.options.baseUrl = defaultBaseUrl;
    dio.options.connectTimeout = const Duration(seconds: 10);
    dio.options.receiveTimeout = const Duration(seconds: 10);

    dio.interceptors.add(
      QueuedInterceptorsWrapper(
        onRequest: (options, handler) async {
          final isAuthPath = options.path.contains(pathAuthPrefix);
          if (_accessToken != null && !isAuthPath) {
            options.headers[headerAuthorization] = 'Bearer $_accessToken';
          }

          final isRefresh = options.path.endsWith(pathRefresh);
          final isLogout = options.path.endsWith(pathLogout);
          if (isRefresh || isLogout) {
            final refreshToken = await sessionStorage.getRefreshToken();
            if (refreshToken != null) {
              options.headers[headerCookie] =
                  '$cookieRefreshToken=$refreshToken';
            }
          }

          return handler.next(options);
        },
        onResponse: (response, handler) async {
          final setCookieHeaders = response.headers[headerSetCookie];
          if (setCookieHeaders != null && setCookieHeaders.isNotEmpty) {
            final extractedToken = _extractCookieValue(
              setCookieHeaders,
              cookieRefreshToken,
            );
            if (extractedToken != null) {
              await sessionStorage.saveRefreshToken(extractedToken);
            }
          }

          return handler.next(response);
        },
        onError: (err, handler) async {
          if (err.response?.statusCode == 401) {
            final path = err.requestOptions.path;

            final isAuthBase =
                path.endsWith(pathLogin) ||
                path.endsWith(pathRegister) ||
                path.endsWith(pathRefresh);

            if (!isAuthBase) {
              try {
                final rotatedToken = await refreshSession();
                if (rotatedToken != null) {
                  // Retry the failed request with the new access token
                  final options = err.requestOptions;
                  options.headers[headerAuthorization] = 'Bearer $rotatedToken';

                  // Clone request and resolve response
                  final retryRes = await dio.fetch(options);
                  return handler.resolve(retryRes);
                }
              } catch (refreshErr) {
                // Refresh failed or replay attacked. Clear session and propagate error
                await clearSession();
                if (onSessionExpired != null) {
                  onSessionExpired!();
                }
                return handler.next(
                  DioException(
                    requestOptions: err.requestOptions,
                    error: 'Session expired, login required.',
                    type: DioExceptionType.badResponse,
                    response: err.response,
                  ),
                );
              }
            }
          }

          if (err.response?.statusCode == 429) {
            return handler.next(
              DioException(
                requestOptions: err.requestOptions,
                error: 'Too many requests. Please try again later.',
                type: DioExceptionType.badResponse,
                response: err.response,
              ),
            );
          }

          return handler.next(err);
        },
      ),
    );
  }

  /// Parses a specific cookie name from the response Set-Cookie headers.
  String? _extractCookieValue(List<String> setCookies, String cookieName) {
    for (final cookie in setCookies) {
      if (cookie.startsWith('$cookieName=')) {
        final segments = cookie.split(';');
        final keyVal = segments[0];
        return keyVal.substring('$cookieName='.length);
      }
    }
    return null;
  }

  /// Rotates/refreshes the active session tokens.
  ///
  /// Sends a POST to `/api/auth/refresh` using the stored secure refresh token.
  /// Returns the newly mapped access token, or null if session is unauthenticated.
  Future<String?> refreshSession() async {
    final hasRefreshToken = await sessionStorage.hasRefreshToken();
    if (!hasRefreshToken) return null;

    try {
      final response = await dio.post(pathRefresh);
      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        final newAccessToken = data[keyAccessToken] as String?;
        if (newAccessToken != null) {
          setAccessToken(newAccessToken);
          return newAccessToken;
        }
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 401 || e.response?.statusCode == 403) {
        await clearSession();
        rethrow;
      }
    }
    return null;
  }

  /// Wipes all session details, tokens, and credentials from memory and secure storage.
  Future<void> clearSession() async {
    _accessToken = null;
    await sessionStorage.clearSession();
  }
}
