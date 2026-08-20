/// Resolves a relative image path into an absolute URL using the provided API base URL.
String? resolveImageUrl(String? path, String baseUrl) {
  if (path == null) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  final uri = Uri.parse(path);
  final fileName = uri.pathSegments.isNotEmpty ? uri.pathSegments.last : '';
  if (fileName.isEmpty) return null;
  final isCropped = uri.pathSegments.contains('cropped');
  final subPath = isCropped ? 'cropped/' : '';

  var normalizedBase = baseUrl.endsWith('/')
      ? baseUrl.substring(0, baseUrl.length - 1)
      : baseUrl;
  if (normalizedBase.endsWith('/api')) {
    normalizedBase = normalizedBase.substring(0, normalizedBase.length - 4);
  }

  return '$normalizedBase/api/cards/images/$subPath$fileName';
}
