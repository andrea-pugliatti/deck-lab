import 'package:freezed_annotation/freezed_annotation.dart';

part 'deck_card_response.freezed.dart';
part 'deck_card_response.g.dart';

/// DTO representing an individual card slot in a deck.
///
/// Encapsulates card specifications and quantity configurations.
@freezed
abstract class DeckCardResponse with _$DeckCardResponse {
  const factory DeckCardResponse({
    int? id,
    required int cardId,
    required String name,
    String? type,
    String? description,
    String? race,
    String? attribute,
    String? archetype,
    String? imageUrl,
    required String section,
    required int quantity,
  }) = _DeckCardResponse;

  /// De-serializes JSON map data into a [DeckCardResponse] class.
  factory DeckCardResponse.fromJson(Map<String, dynamic> json) =>
      _$DeckCardResponseFromJson(json);
}
