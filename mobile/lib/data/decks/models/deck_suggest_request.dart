import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../domain/enums/enums.dart';
import 'card_entry.dart';

part 'deck_suggest_request.freezed.dart';
part 'deck_suggest_request.g.dart';

/// Request body DTO encapsulating parameters to request AI card suggestions.
///
/// Sent to the POST `/api/decks/ai/suggest` endpoint.
@freezed
abstract class DeckSuggestRequest with _$DeckSuggestRequest {
  const factory DeckSuggestRequest({
    required Format formatName,
    required List<CardEntry> currentCards,
  }) = _DeckSuggestRequest;

  /// De-serializes JSON map data into a [DeckSuggestRequest] class.
  factory DeckSuggestRequest.fromJson(Map<String, dynamic> json) =>
      _$DeckSuggestRequestFromJson(json);
}
