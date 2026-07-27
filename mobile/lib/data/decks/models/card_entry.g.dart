// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CardEntry _$CardEntryFromJson(Map<String, dynamic> json) => _CardEntry(
  name: json['name'] as String,
  section: $enumDecode(_$DeckSectionEnumMap, json['section']),
  quantity: (json['quantity'] as num).toInt(),
);

Map<String, dynamic> _$CardEntryToJson(_CardEntry instance) =>
    <String, dynamic>{
      'name': instance.name,
      'section': _$DeckSectionEnumMap[instance.section]!,
      'quantity': instance.quantity,
    };

const _$DeckSectionEnumMap = {
  DeckSection.main: 'MAIN',
  DeckSection.extra: 'EXTRA',
  DeckSection.side: 'SIDE',
};
