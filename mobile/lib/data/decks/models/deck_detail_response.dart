import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../domain/enums/enums.dart';
import 'deck_card_response.dart';

part 'deck_detail_response.freezed.dart';
part 'deck_detail_response.g.dart';

/// DTO representing the comprehensive details of a deck blueprint.
///
/// Contains all deck card mappings sorted by section for view and validation operations.
@freezed
abstract class DeckDetailResponse with _$DeckDetailResponse {
  const DeckDetailResponse._();

  const factory DeckDetailResponse({
    int? id,
    required String name,
    String? description,
    required Format formatName,
    String? creatorUsername,
    String? updatedAt,
    required List<DeckCardResponse> deckCards,
  }) = _DeckDetailResponse;

  List<DeckCardResponse> get mainDeckCards =>
      deckCards.where((card) => card.section == DeckSection.main).toList();

  List<DeckCardResponse> get extraDeckCards =>
      deckCards.where((card) => card.section == DeckSection.extra).toList();

  List<DeckCardResponse> get sideDeckCards =>
      deckCards.where((card) => card.section == DeckSection.side).toList();

  int get mainDeckCount =>
      mainDeckCards.fold(0, (sum, card) => sum + card.quantity);

  int get extraDeckCount =>
      extraDeckCards.fold(0, (sum, card) => sum + card.quantity);

  int get sideDeckCount =>
      sideDeckCards.fold(0, (sum, card) => sum + card.quantity);

  int get totalCardsCount => mainDeckCount + extraDeckCount + sideDeckCount;

  /// De-serializes JSON map data into a [DeckDetailResponse] class.
  factory DeckDetailResponse.fromJson(Map<String, dynamic> json) =>
      _$DeckDetailResponseFromJson(json);
}
