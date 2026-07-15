import '../../../domain/models/deck_card.dart';
import '../../core/url_resolver.dart';
import '../models/deck_card_response.dart';

/// Extension adding mapping capabilities to [DeckCardResponse].
extension DeckCardResponseMapper on DeckCardResponse {
  /// Maps [DeckCardResponse] DTO to a domain [DeckCard] model.
  ///
  /// Resolves the raw image URL to an absolute URL using [baseUrl].
  DeckCard toDomain(String baseUrl) {
    return DeckCard(
      id: id,
      cardId: cardId,
      name: name,
      type: type,
      description: description,
      race: race,
      attribute: attribute,
      archetype: archetype,
      imageUrl: resolveImageUrl(imageUrl, baseUrl),
      section: section,
      quantity: quantity,
    );
  }
}
