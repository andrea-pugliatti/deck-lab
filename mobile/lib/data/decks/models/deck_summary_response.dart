import 'package:freezed_annotation/freezed_annotation.dart';

import 'deck_card_response.dart';

part 'deck_summary_response.freezed.dart';
part 'deck_summary_response.g.dart';

/// DTO representing a summary of a deck blueprint.
///
/// Exposes high-level details for index listings without fetching full card descriptions.
@freezed
abstract class DeckSummaryResponse with _$DeckSummaryResponse {
  const DeckSummaryResponse._();

  const factory DeckSummaryResponse({
    required int id,
    required String name,
    String? description,
    required String formatName,
    String? creatorUsername,
    String? updatedAt,
    @Default([]) List<DeckCardResponse> deckCards,
  }) = _DeckSummaryResponse;

  int get mainDeckCount => deckCards
      .where((card) => card.section.toUpperCase() == 'MAIN')
      .fold(0, (sum, card) => sum + card.quantity);

  int get extraDeckCount => deckCards
      .where((card) => card.section.toUpperCase() == 'EXTRA')
      .fold(0, (sum, card) => sum + card.quantity);

  int get sideDeckCount => deckCards
      .where((card) => card.section.toUpperCase() == 'SIDE')
      .fold(0, (sum, card) => sum + card.quantity);

  int get totalCardsCount => mainDeckCount + extraDeckCount + sideDeckCount;

  /// De-serializes JSON map data into a [DeckSummaryResponse] class.
  factory DeckSummaryResponse.fromJson(Map<String, dynamic> json) =>
      _$DeckSummaryResponseFromJson(json);
}
