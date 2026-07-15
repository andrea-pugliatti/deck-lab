import 'package:freezed_annotation/freezed_annotation.dart';

part 'card_suggestion_response.freezed.dart';
part 'card_suggestion_response.g.dart';

/// DTO representing a single card recommended by AI synergies.
@freezed
abstract class CardSuggestionResponse with _$CardSuggestionResponse {
  const factory CardSuggestionResponse({
    required String name,
    required String section,
    required String synergyReason,
    required int cardId,
    required String type,
    String? imageUrl,
  }) = _CardSuggestionResponse;

  /// De-serializes JSON map data into a [CardSuggestionResponse] class.
  factory CardSuggestionResponse.fromJson(Map<String, dynamic> json) =>
      _$CardSuggestionResponseFromJson(json);
}
