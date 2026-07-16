import '../../../domain/models/card.dart';
import '../models/card_response.dart';

/// Extension adding mapping capabilities to [Card].
extension CardDomainDtoMapper on Card {
  /// Maps domain [Card] model to a DTO [CardResponse] object.
  CardResponse toDto() {
    return CardResponse(
      id: id,
      name: name,
      type: type,
      description: description,
      race: race,
      attribute: attribute,
      archetype: archetype,
      imageUrl: imageUrl,
      imageUrlCropped: imageUrlCropped,
      frameType: frameType,
      atk: atk,
      def: def,
      level: level,
      linkVal: linkVal,
      scale: scale,
    );
  }
}
