// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'validation_error_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ValidationErrorResponse _$ValidationErrorResponseFromJson(
  Map<String, dynamic> json,
) => _ValidationErrorResponse(
  message: json['message'] as String,
  errors: (json['errors'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$ValidationErrorResponseToJson(
  _ValidationErrorResponse instance,
) => <String, dynamic>{'message': instance.message, 'errors': instance.errors};
