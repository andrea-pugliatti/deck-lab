// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CardEntry _$CardEntryFromJson(Map<String, dynamic> json) => _CardEntry(
  name: json['name'] as String,
  section: json['section'] as String,
  quantity: (json['quantity'] as num).toInt(),
);

Map<String, dynamic> _$CardEntryToJson(_CardEntry instance) =>
    <String, dynamic>{
      'name': instance.name,
      'section': instance.section,
      'quantity': instance.quantity,
    };
