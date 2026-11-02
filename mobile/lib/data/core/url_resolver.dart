/// Optional Cloudflare R2 / CDN base URL for card artwork images in production.
const String customImagesBaseUrl = String.fromEnvironment('IMAGES_BASE_URL');

/// Resolves a relative image path into an absolute URL using the provided API base URL
/// or the Cloudflare R2 images domain (`https://images.decklab.games`) in production.
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

  if (customImagesBaseUrl.isNotEmpty) {
    final normalizedImgBase = customImagesBaseUrl.endsWith('/')
        ? customImagesBaseUrl.substring(0, customImagesBaseUrl.length - 1)
        : customImagesBaseUrl;
    return '$normalizedImgBase/$subPath$fileName';
  }

  var normalizedBase = baseUrl.endsWith('/')
      ? baseUrl.substring(0, baseUrl.length - 1)
      : baseUrl;
  if (normalizedBase.endsWith('/api')) {
    normalizedBase = normalizedBase.substring(0, normalizedBase.length - 4);
  }

  if (normalizedBase == 'https://api.decklab.games' ||
      normalizedBase == 'https://decklab.games') {
    return 'https://images.decklab.games/$subPath$fileName';
  }

  return '$normalizedBase/api/cards/images/$subPath$fileName';
}
