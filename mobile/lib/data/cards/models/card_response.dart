import 'package:freezed_annotation/freezed_annotation.dart';

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
    required String type,
    String? description,
    String? race,
    String? attribute,
    String? archetype,
    String? imageUrl,
    String? imageUrlCropped,
    String? frameType,
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
