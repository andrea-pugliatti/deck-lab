import '../../../domain/models/deck_detail.dart';
import '../models/deck_detail_response.dart';
import 'deck_card_response_mapper.dart';

/// Extension adding mapping capabilities to [DeckDetailResponse].
extension DeckDetailResponseMapper on DeckDetailResponse {
  /// Maps [DeckDetailResponse] DTO to a domain [DeckDetail] model.
  ///
  /// Recursively maps nested card DTO entries using the provided [baseUrl].
  DeckDetail toDomain(String baseUrl) {
    return DeckDetail(
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
