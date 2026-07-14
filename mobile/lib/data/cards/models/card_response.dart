import 'package:freezed_annotation/freezed_annotation.dart';

part 'card_response.freezed.dart';
part 'card_response.g.dart';

/// Data Transfer Object representing a Card entity in the database catalog.
///
/// Contains all game mechanics metadata, stats, and graphics references.
@freezed
abstract class CardResponse with _$CardResponse {
  /// Default constructor for [CardResponse].
  const factory CardResponse({
    /// Unique identifier of the card catalog entry.
    required int id,

    /// Display name of the card.
    required String name,

    /// Card classification type (e.g. Normal Monster, Spell Card).
    required String type,

    /// Text effect description or flavor description.
    String? description,

    /// Card monster race classification (e.g. Spellcaster, Dragon).
    String? race,

    /// elemental attribute classification (e.g. LIGHT, DARK).
    String? attribute,

    /// Archetype group name.
    String? archetype,

    /// URL path pointing to the full card artwork image.
    String? imageUrl,

    /// URL path pointing to the cropped card artwork illustration.
    String? imageUrlCropped,

    /// Visual frame border style color representation.
    String? frameType,

    /// Monster Attack points value.
    int? atk,

    /// Monster Defense points value.
    int? def,

    /// Monster Level or Rank rating.
    int? level,

    /// Monster Link Rating value.
    int? linkVal,

    /// Monster Pendulum Scale rating.
    int? scale,
  }) = _CardResponse;

  /// De-serializes JSON map data into a [CardResponse] class.
  factory CardResponse.fromJson(Map<String, dynamic> json) =>
      _$CardResponseFromJson(json);
}
