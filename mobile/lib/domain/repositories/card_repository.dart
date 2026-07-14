import '../models/page.dart';
import '../models/card.dart';

/// Abstract contract for card catalog search operations.
abstract class CardRepository {
  /// Resolves raw filename to absolute asset URL.
  String resolveCardImageUrl(String fileName, {bool cropped = false});

  /// Queries all cards matching optional query parameters.
  Future<Page<Card>> fetchCards({
    String? query,
    String? type,
    String? attribute,
    String? race,
    String? archetype,
    int page = 0,
    int size = 20,
  });

  /// Queries detail of a card by its ID.
  Future<Card> fetchCardDetail(int id);

  /// Resolves valid metadata suggestions.
  Future<List<String>> fetchMetadataValues(String metadataPath);

  /// Admin endpoint to append catalog entity.
  Future<Card> createCard(Card card);

  /// Admin endpoint to edit catalog entity.
  Future<Card> updateCard(int id, Card card);

  /// Admin endpoint to remove catalog entity.
  Future<void> deleteCard(int id);
}
