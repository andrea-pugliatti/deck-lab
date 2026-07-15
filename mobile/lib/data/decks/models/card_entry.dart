import 'package:freezed_annotation/freezed_annotation.dart';

part 'card_entry.freezed.dart';
part 'card_entry.g.dart';

/// Data model representing a card entry mapping.
///
/// Used inside requests and raw AI responses before cards are verified against the database.
@freezed
abstract class CardEntry with _$CardEntry {
  const factory CardEntry({
    required String name,
    required String section,
    required int quantity,
  }) = _CardEntry;

  /// De-serializes JSON map data into a [CardEntry] class.
  factory CardEntry.fromJson(Map<String, dynamic> json) =>
      _$CardEntryFromJson(json);
}
