import '../../../domain/models/card.dart';
import '../../core/url_resolver.dart';
import '../models/card_response.dart';

/// Extension adding mapping capabilities to [CardResponse].
extension CardResponseDomainMapper on CardResponse {
  /// Maps [CardResponse] DTO to a domain [Card] model.
  ///
  /// Resolves the raw and cropped image URLs to absolute URLs using [baseUrl].
  Card toDomain(String baseUrl) {
    return Card(
      id: id,
      name: name,
      type: type,
      description: description,
      race: race,
      attribute: attribute,
      archetype: archetype,
      imageUrl: resolveImageUrl(imageUrl, baseUrl),
      imageUrlCropped: resolveImageUrl(imageUrlCropped, baseUrl),
      frameType: frameType,
      atk: atk,
      def: def,
      level: level,
      linkVal: linkVal,
      scale: scale,
    );
  }
}
