import 'package:freezed_annotation/freezed_annotation.dart';

import 'deck_card_response.dart';

part 'create_deck_request.freezed.dart';
part 'create_deck_request.g.dart';

/// Request body DTO encapsulating parameters to create a new deck.
///
/// Sent to the POST `/api/decks` endpoint.
@freezed
abstract class CreateDeckRequest with _$CreateDeckRequest {
  const factory CreateDeckRequest({
    required String name,
    required String description,
    required String formatName,
    required List<DeckCardResponse> deckCards,
  }) = _CreateDeckRequest;

  /// De-serializes JSON map data into a [CreateDeckRequest] class.
  factory CreateDeckRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateDeckRequestFromJson(json);
}
