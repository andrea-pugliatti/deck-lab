import 'package:freezed_annotation/freezed_annotation.dart';

import 'deck_card_response.dart';

part 'deck_generation_response.freezed.dart';
part 'deck_generation_response.g.dart';

/// DTO representing the result of a successfully generated deck.
@freezed
abstract class DeckGenerationResponse with _$DeckGenerationResponse {
  const factory DeckGenerationResponse({
    required String name,
    required String description,
    required String formatName,
    @Default([]) List<DeckCardResponse> deckCards,
    @Default([]) List<String> validationWarnings,
  }) = _DeckGenerationResponse;

  /// De-serializes JSON map data into a [DeckGenerationResponse] class.
  factory DeckGenerationResponse.fromJson(Map<String, dynamic> json) =>
      _$DeckGenerationResponseFromJson(json);
}
