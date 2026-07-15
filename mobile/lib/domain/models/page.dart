/// Generic data container wrapping paginated lists.
///
/// Supports both nested pagination formats and flat Spring Boot page representations.
class Page<T> {
  final List<T> content;
  final int number;
  final int size;
  final int totalElements;
  final int totalPages;

  const Page({
    required this.content,
    required this.number,
    required this.size,
    required this.totalElements,
    required this.totalPages,
  });

  /// De-serializes JSON map data into a [Page] class.
  ///
  /// Leverages [fromJsonT] to parse individual list elements generically.
  factory Page.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    final rawContent = json['content'] as List<dynamic>? ?? [];
    final content = rawContent.map((item) => fromJsonT(item)).toList();

    // Check if the response wraps page info in a sub-object (HATEOAS/HAL format)
    if (json['page'] is Map<String, dynamic>) {
      final pageMeta = json['page'] as Map<String, dynamic>;
      return Page(
        content: content,
        number: pageMeta['number'] as int? ?? 0,
        size: pageMeta['size'] as int? ?? 0,
        totalElements: pageMeta['totalElements'] as int? ?? 0,
        totalPages: pageMeta['totalPages'] as int? ?? 0,
      );
    }

    // Fall back to flat Spring Boot pagination properties at the root level
    return Page(
      content: content,
      number: json['number'] as int? ?? 0,
      size: json['size'] as int? ?? 0,
      totalElements: json['totalElements'] as int? ?? 0,
      totalPages: json['totalPages'] as int? ?? 0,
    );
  }
}
