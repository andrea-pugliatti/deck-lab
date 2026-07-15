import 'package:freezed_annotation/freezed_annotation.dart';

import 'deck_card_response.dart';

part 'validate_deck_request.freezed.dart';
part 'validate_deck_request.g.dart';

/// Request body DTO encapsulating parameters to validate a deck.
///
/// Sent to the POST `/api/decks/validate` endpoint.
@freezed
abstract class ValidateDeckRequest with _$ValidateDeckRequest {
  const factory ValidateDeckRequest({
    required String name,
    required String formatName,
    required List<DeckCardResponse> deckCards,
  }) = _ValidateDeckRequest;

  /// De-serializes JSON map data into a [ValidateDeckRequest] class.
  factory ValidateDeckRequest.fromJson(Map<String, dynamic> json) =>
      _$ValidateDeckRequestFromJson(json);
}
