import '../../../domain/models/card_suggestion.dart';
import '../../core/url_resolver.dart';
import '../models/card_suggestion_response.dart';

/// Extension adding mapping capabilities to [CardSuggestionResponse].
extension CardSuggestionResponseMapper on CardSuggestionResponse {
  /// Maps [CardSuggestionResponse] DTO to a domain [CardSuggestion] object.
  ///
  /// Resolves the raw image URL to an absolute URL using [baseUrl].
  CardSuggestion toDomain(String baseUrl) {
    return CardSuggestion(
      name: name,
      section: section,
      synergyReason: synergyReason,
      cardId: cardId,
      type: type,
      imageUrl: resolveImageUrl(imageUrl, baseUrl),
    );
  }
}
