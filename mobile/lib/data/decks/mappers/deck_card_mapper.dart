import '../../../domain/models/deck_card.dart';
import '../models/deck_card_response.dart';

/// Extension adding mapping capabilities to [DeckCard].
extension DeckCardMapper on DeckCard {
  /// Maps domain [DeckCard] model to a DTO [DeckCardResponse] object.
  DeckCardResponse toDto() {
    return DeckCardResponse(
      id: id,
      cardId: cardId,
      name: name,
      type: type,
      description: description,
      race: race,
      attribute: attribute,
      archetype: archetype,
      imageUrl: imageUrl,
      section: section,
      quantity: quantity,
    );
  }
}
