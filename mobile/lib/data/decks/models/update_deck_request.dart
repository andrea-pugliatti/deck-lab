import 'package:freezed_annotation/freezed_annotation.dart';

import 'deck_card_response.dart';

part 'update_deck_request.freezed.dart';
part 'update_deck_request.g.dart';

/// Request body DTO encapsulating parameters to update an existing deck.
///
/// Sent to the PUT `/api/decks/{id}` endpoint.
@freezed
abstract class UpdateDeckRequest with _$UpdateDeckRequest {
  const factory UpdateDeckRequest({
    required int id,
    required String name,
    required String description,
    required String formatName,
    required List<DeckCardResponse> deckCards,
  }) = _UpdateDeckRequest;

  /// De-serializes JSON map data into an [UpdateDeckRequest] class.
  factory UpdateDeckRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateDeckRequestFromJson(json);
}
