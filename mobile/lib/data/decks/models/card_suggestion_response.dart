import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../domain/enums/enums.dart';

part 'card_suggestion_response.freezed.dart';
part 'card_suggestion_response.g.dart';

/// DTO representing a single card recommended by AI synergies.
@freezed
abstract class CardSuggestionResponse with _$CardSuggestionResponse {
  const factory CardSuggestionResponse({
    required String name,
    required DeckSection section,
    required String synergyReason,
    required int cardId,
    @JsonKey(unknownEnumValue: CardType.unknown) required CardType type,
    String? imageUrl,
  }) = _CardSuggestionResponse;

  /// De-serializes JSON map data into a [CardSuggestionResponse] class.
  factory CardSuggestionResponse.fromJson(Map<String, dynamic> json) =>
      _$CardSuggestionResponseFromJson(json);
}
