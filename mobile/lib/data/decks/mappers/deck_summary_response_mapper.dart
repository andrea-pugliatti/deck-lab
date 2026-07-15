import '../../../domain/models/deck_summary.dart';
import '../models/deck_summary_response.dart';
import 'deck_card_response_mapper.dart';

/// Extension adding mapping capabilities to [DeckSummaryResponse].
extension DeckSummaryResponseMapper on DeckSummaryResponse {
  /// Maps [DeckSummaryResponse] DTO to a domain [DeckSummary] model.
  ///
  /// Recursively maps nested card DTO entries using the provided [baseUrl].
  DeckSummary toDomain(String baseUrl) {
    return DeckSummary(
      id: id,
      name: name,
      description: description,
      formatName: formatName,
      creatorUsername: creatorUsername,
      updatedAt: updatedAt,
      deckCards: deckCards.map((c) => c.toDomain(baseUrl)).toList(),
    );
  }
}
