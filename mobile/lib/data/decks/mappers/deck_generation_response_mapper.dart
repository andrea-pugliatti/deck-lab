import '../../../domain/models/deck_generation.dart';
import '../models/deck_generation_response.dart';
import 'deck_card_response_mapper.dart';

/// Extension adding mapping capabilities to [DeckGenerationResponse].
extension DeckGenerationResponseMapper on DeckGenerationResponse {
  /// Maps [DeckGenerationResponse] DTO to a domain [DeckGeneration] model.
  ///
  /// Recursively maps nested card DTO entries using the provided [baseUrl].
  DeckGeneration toDomain(String baseUrl) {
    return DeckGeneration(
      name: name,
      description: description,
      formatName: formatName,
      deckCards: deckCards.map((c) => c.toDomain(baseUrl)).toList(),
      validationWarnings: validationWarnings,
    );
  }
}
