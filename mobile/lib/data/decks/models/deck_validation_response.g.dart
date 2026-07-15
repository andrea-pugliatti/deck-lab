// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deck_validation_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DeckValidationResponse _$DeckValidationResponseFromJson(
  Map<String, dynamic> json,
) => _DeckValidationResponse(
  isValid: json['isValid'] as bool,
  errors:
      (json['errors'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
);

Map<String, dynamic> _$DeckValidationResponseToJson(
  _DeckValidationResponse instance,
) => <String, dynamic>{'isValid': instance.isValid, 'errors': instance.errors};
