import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../domain/enums/enums.dart';

part 'deck_generate_request.freezed.dart';
part 'deck_generate_request.g.dart';

/// Request body DTO encapsulating parameters to request AI deck generation.
///
/// Sent to the POST `/api/decks/ai/generate` endpoint.
@freezed
abstract class DeckGenerateRequest with _$DeckGenerateRequest {
  const factory DeckGenerateRequest({
    required String archetype,
    required Strategy strategy,
    required Format formatName,
    String? customPrompt,
  }) = _DeckGenerateRequest;

  /// De-serializes JSON map data into a [DeckGenerateRequest] class.
  factory DeckGenerateRequest.fromJson(Map<String, dynamic> json) =>
      _$DeckGenerateRequestFromJson(json);
}
