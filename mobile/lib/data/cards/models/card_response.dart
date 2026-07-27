import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../domain/enums/enums.dart';

part 'card_response.freezed.dart';
part 'card_response.g.dart';

/// DTO representing a Card entity in the database catalog.
///
/// Contains all game mechanics metadata, stats, and graphics references.
@freezed
abstract class CardResponse with _$CardResponse {
  const factory CardResponse({
    required int id,
    required String name,
    @JsonKey(unknownEnumValue: CardType.unknown) required CardType type,
    String? description,
    @JsonKey(unknownEnumValue: CardRace.unknown) CardRace? race,
    @JsonKey(unknownEnumValue: CardAttribute.unknown) CardAttribute? attribute,
    String? archetype,
    String? imageUrl,
    String? imageUrlCropped,
    @JsonKey(unknownEnumValue: FrameType.unknown) FrameType? frameType,
    int? atk,
    int? def,
    int? level,
    int? linkVal,
    int? scale,
  }) = _CardResponse;

  /// De-serializes JSON map data into a [CardResponse] class.
  factory CardResponse.fromJson(Map<String, dynamic> json) =>
      _$CardResponseFromJson(json);
}
