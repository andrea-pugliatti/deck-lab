// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'card_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CardResponse {

/// Unique identifier of the card catalog entry.
 int get id;/// Display name of the card.
 String get name;/// Card classification type (e.g. Normal Monster, Spell Card).
 String get type;/// Text effect description or flavor description.
 String? get description;/// Card monster race classification (e.g. Spellcaster, Dragon).
 String? get race;/// elemental attribute classification (e.g. LIGHT, DARK).
 String? get attribute;/// Archetype group name.
 String? get archetype;/// URL path pointing to the full card artwork image.
 String? get imageUrl;/// URL path pointing to the cropped card artwork illustration.
 String? get imageUrlCropped;/// Visual frame border style color representation.
 String? get frameType;/// Monster Attack points value.
 int? get atk;/// Monster Defense points value.
 int? get def;/// Monster Level or Rank rating.
 int? get level;/// Monster Link Rating value.
 int? get linkVal;/// Monster Pendulum Scale rating.
 int? get scale;
/// Create a copy of CardResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CardResponseCopyWith<CardResponse> get copyWith => _$CardResponseCopyWithImpl<CardResponse>(this as CardResponse, _$identity);

  /// Serializes this CardResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CardResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.type, type) || other.type == type)&&(identical(other.description, description) || other.description == description)&&(identical(other.race, race) || other.race == race)&&(identical(other.attribute, attribute) || other.attribute == attribute)&&(identical(other.archetype, archetype) || other.archetype == archetype)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.imageUrlCropped, imageUrlCropped) || other.imageUrlCropped == imageUrlCropped)&&(identical(other.frameType, frameType) || other.frameType == frameType)&&(identical(other.atk, atk) || other.atk == atk)&&(identical(other.def, def) || other.def == def)&&(identical(other.level, level) || other.level == level)&&(identical(other.linkVal, linkVal) || other.linkVal == linkVal)&&(identical(other.scale, scale) || other.scale == scale));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,type,description,race,attribute,archetype,imageUrl,imageUrlCropped,frameType,atk,def,level,linkVal,scale);

@override
String toString() {
  return 'CardResponse(id: $id, name: $name, type: $type, description: $description, race: $race, attribute: $attribute, archetype: $archetype, imageUrl: $imageUrl, imageUrlCropped: $imageUrlCropped, frameType: $frameType, atk: $atk, def: $def, level: $level, linkVal: $linkVal, scale: $scale)';
}


}

/// @nodoc
abstract mixin class $CardResponseCopyWith<$Res>  {
  factory $CardResponseCopyWith(CardResponse value, $Res Function(CardResponse) _then) = _$CardResponseCopyWithImpl;
@useResult
$Res call({
 int id, String name, String type, String? description, String? race, String? attribute, String? archetype, String? imageUrl, String? imageUrlCropped, String? frameType, int? atk, int? def, int? level, int? linkVal, int? scale
});




}
/// @nodoc
class _$CardResponseCopyWithImpl<$Res>
    implements $CardResponseCopyWith<$Res> {
  _$CardResponseCopyWithImpl(this._self, this._then);

  final CardResponse _self;
  final $Res Function(CardResponse) _then;

/// Create a copy of CardResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? type = null,Object? description = freezed,Object? race = freezed,Object? attribute = freezed,Object? archetype = freezed,Object? imageUrl = freezed,Object? imageUrlCropped = freezed,Object? frameType = freezed,Object? atk = freezed,Object? def = freezed,Object? level = freezed,Object? linkVal = freezed,Object? scale = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,race: freezed == race ? _self.race : race // ignore: cast_nullable_to_non_nullable
as String?,attribute: freezed == attribute ? _self.attribute : attribute // ignore: cast_nullable_to_non_nullable
as String?,archetype: freezed == archetype ? _self.archetype : archetype // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,imageUrlCropped: freezed == imageUrlCropped ? _self.imageUrlCropped : imageUrlCropped // ignore: cast_nullable_to_non_nullable
as String?,frameType: freezed == frameType ? _self.frameType : frameType // ignore: cast_nullable_to_non_nullable
as String?,atk: freezed == atk ? _self.atk : atk // ignore: cast_nullable_to_non_nullable
as int?,def: freezed == def ? _self.def : def // ignore: cast_nullable_to_non_nullable
as int?,level: freezed == level ? _self.level : level // ignore: cast_nullable_to_non_nullable
as int?,linkVal: freezed == linkVal ? _self.linkVal : linkVal // ignore: cast_nullable_to_non_nullable
as int?,scale: freezed == scale ? _self.scale : scale // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

}


/// Adds pattern-matching-related methods to [CardResponse].
extension CardResponsePatterns on CardResponse {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CardResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CardResponse() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CardResponse value)  $default,){
final _that = this;
switch (_that) {
case _CardResponse():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CardResponse value)?  $default,){
final _that = this;
switch (_that) {
case _CardResponse() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int id,  String name,  String type,  String? description,  String? race,  String? attribute,  String? archetype,  String? imageUrl,  String? imageUrlCropped,  String? frameType,  int? atk,  int? def,  int? level,  int? linkVal,  int? scale)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CardResponse() when $default != null:
return $default(_that.id,_that.name,_that.type,_that.description,_that.race,_that.attribute,_that.archetype,_that.imageUrl,_that.imageUrlCropped,_that.frameType,_that.atk,_that.def,_that.level,_that.linkVal,_that.scale);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int id,  String name,  String type,  String? description,  String? race,  String? attribute,  String? archetype,  String? imageUrl,  String? imageUrlCropped,  String? frameType,  int? atk,  int? def,  int? level,  int? linkVal,  int? scale)  $default,) {final _that = this;
switch (_that) {
case _CardResponse():
return $default(_that.id,_that.name,_that.type,_that.description,_that.race,_that.attribute,_that.archetype,_that.imageUrl,_that.imageUrlCropped,_that.frameType,_that.atk,_that.def,_that.level,_that.linkVal,_that.scale);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int id,  String name,  String type,  String? description,  String? race,  String? attribute,  String? archetype,  String? imageUrl,  String? imageUrlCropped,  String? frameType,  int? atk,  int? def,  int? level,  int? linkVal,  int? scale)?  $default,) {final _that = this;
switch (_that) {
case _CardResponse() when $default != null:
return $default(_that.id,_that.name,_that.type,_that.description,_that.race,_that.attribute,_that.archetype,_that.imageUrl,_that.imageUrlCropped,_that.frameType,_that.atk,_that.def,_that.level,_that.linkVal,_that.scale);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CardResponse implements CardResponse {
  const _CardResponse({required this.id, required this.name, required this.type, this.description, this.race, this.attribute, this.archetype, this.imageUrl, this.imageUrlCropped, this.frameType, this.atk, this.def, this.level, this.linkVal, this.scale});
  factory _CardResponse.fromJson(Map<String, dynamic> json) => _$CardResponseFromJson(json);

/// Unique identifier of the card catalog entry.
@override final  int id;
/// Display name of the card.
@override final  String name;
/// Card classification type (e.g. Normal Monster, Spell Card).
@override final  String type;
/// Text effect description or flavor description.
@override final  String? description;
/// Card monster race classification (e.g. Spellcaster, Dragon).
@override final  String? race;
/// elemental attribute classification (e.g. LIGHT, DARK).
@override final  String? attribute;
/// Archetype group name.
@override final  String? archetype;
/// URL path pointing to the full card artwork image.
@override final  String? imageUrl;
/// URL path pointing to the cropped card artwork illustration.
@override final  String? imageUrlCropped;
/// Visual frame border style color representation.
@override final  String? frameType;
/// Monster Attack points value.
@override final  int? atk;
/// Monster Defense points value.
@override final  int? def;
/// Monster Level or Rank rating.
@override final  int? level;
/// Monster Link Rating value.
@override final  int? linkVal;
/// Monster Pendulum Scale rating.
@override final  int? scale;

/// Create a copy of CardResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CardResponseCopyWith<_CardResponse> get copyWith => __$CardResponseCopyWithImpl<_CardResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CardResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CardResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.type, type) || other.type == type)&&(identical(other.description, description) || other.description == description)&&(identical(other.race, race) || other.race == race)&&(identical(other.attribute, attribute) || other.attribute == attribute)&&(identical(other.archetype, archetype) || other.archetype == archetype)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.imageUrlCropped, imageUrlCropped) || other.imageUrlCropped == imageUrlCropped)&&(identical(other.frameType, frameType) || other.frameType == frameType)&&(identical(other.atk, atk) || other.atk == atk)&&(identical(other.def, def) || other.def == def)&&(identical(other.level, level) || other.level == level)&&(identical(other.linkVal, linkVal) || other.linkVal == linkVal)&&(identical(other.scale, scale) || other.scale == scale));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,type,description,race,attribute,archetype,imageUrl,imageUrlCropped,frameType,atk,def,level,linkVal,scale);

@override
String toString() {
  return 'CardResponse(id: $id, name: $name, type: $type, description: $description, race: $race, attribute: $attribute, archetype: $archetype, imageUrl: $imageUrl, imageUrlCropped: $imageUrlCropped, frameType: $frameType, atk: $atk, def: $def, level: $level, linkVal: $linkVal, scale: $scale)';
}


}

/// @nodoc
abstract mixin class _$CardResponseCopyWith<$Res> implements $CardResponseCopyWith<$Res> {
  factory _$CardResponseCopyWith(_CardResponse value, $Res Function(_CardResponse) _then) = __$CardResponseCopyWithImpl;
@override @useResult
$Res call({
 int id, String name, String type, String? description, String? race, String? attribute, String? archetype, String? imageUrl, String? imageUrlCropped, String? frameType, int? atk, int? def, int? level, int? linkVal, int? scale
});




}
/// @nodoc
class __$CardResponseCopyWithImpl<$Res>
    implements _$CardResponseCopyWith<$Res> {
  __$CardResponseCopyWithImpl(this._self, this._then);

  final _CardResponse _self;
  final $Res Function(_CardResponse) _then;

/// Create a copy of CardResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? type = null,Object? description = freezed,Object? race = freezed,Object? attribute = freezed,Object? archetype = freezed,Object? imageUrl = freezed,Object? imageUrlCropped = freezed,Object? frameType = freezed,Object? atk = freezed,Object? def = freezed,Object? level = freezed,Object? linkVal = freezed,Object? scale = freezed,}) {
  return _then(_CardResponse(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,race: freezed == race ? _self.race : race // ignore: cast_nullable_to_non_nullable
as String?,attribute: freezed == attribute ? _self.attribute : attribute // ignore: cast_nullable_to_non_nullable
as String?,archetype: freezed == archetype ? _self.archetype : archetype // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,imageUrlCropped: freezed == imageUrlCropped ? _self.imageUrlCropped : imageUrlCropped // ignore: cast_nullable_to_non_nullable
as String?,frameType: freezed == frameType ? _self.frameType : frameType // ignore: cast_nullable_to_non_nullable
as String?,atk: freezed == atk ? _self.atk : atk // ignore: cast_nullable_to_non_nullable
as int?,def: freezed == def ? _self.def : def // ignore: cast_nullable_to_non_nullable
as int?,level: freezed == level ? _self.level : level // ignore: cast_nullable_to_non_nullable
as int?,linkVal: freezed == linkVal ? _self.linkVal : linkVal // ignore: cast_nullable_to_non_nullable
as int?,scale: freezed == scale ? _self.scale : scale // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}


}

// dart format on
