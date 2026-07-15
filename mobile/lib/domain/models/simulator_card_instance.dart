import 'deck_card.dart';

/// Instanced card representation for the hand simulator workspace.
class SimulatorCardInstance {
  final String uniqId;
  final int cardId;
  final String name;
  final String? type;
  final String? imageUrl;
  final String section;

  const SimulatorCardInstance({
    required this.uniqId,
    required this.cardId,
    required this.name,
    this.type,
    this.imageUrl,
    required this.section,
  });

  /// Factory creator wrapping a deck card details.
  factory SimulatorCardInstance.fromDomain(DeckCard card, int index) {
    return SimulatorCardInstance(
      uniqId: '${card.cardId}_${card.section}_$index',
      cardId: card.cardId,
      name: card.name,
      type: card.type,
      imageUrl: card.imageUrl,
      section: card.section,
    );
  }
}
