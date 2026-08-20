import 'package:dio/dio.dart';

/// Parses descriptive error details from a [DioException].
String parseDioError(DioException e, {String defaultFallback = 'Network request failed'}) {
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
      final statusCode = e.response?.statusCode;
      if (statusCode != null) {
        return '$defaultFallback. Status: $statusCode';
      }
      return defaultFallback;
  }
}
