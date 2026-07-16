// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_card_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckCardResponse {

 int? get id; int get cardId; String get name; String? get type; String? get description; String? get race; String? get attribute; String? get archetype; String? get imageUrl; String get section; int get quantity;
/// Create a copy of DeckCardResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckCardResponseCopyWith<DeckCardResponse> get copyWith => _$DeckCardResponseCopyWithImpl<DeckCardResponse>(this as DeckCardResponse, _$identity);

  /// Serializes this DeckCardResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckCardResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.cardId, cardId) || other.cardId == cardId)&&(identical(other.name, name) || other.name == name)&&(identical(other.type, type) || other.type == type)&&(identical(other.description, description) || other.description == description)&&(identical(other.race, race) || other.race == race)&&(identical(other.attribute, attribute) || other.attribute == attribute)&&(identical(other.archetype, archetype) || other.archetype == archetype)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.section, section) || other.section == section)&&(identical(other.quantity, quantity) || other.quantity == quantity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,cardId,name,type,description,race,attribute,archetype,imageUrl,section,quantity);

@override
String toString() {
  return 'DeckCardResponse(id: $id, cardId: $cardId, name: $name, type: $type, description: $description, race: $race, attribute: $attribute, archetype: $archetype, imageUrl: $imageUrl, section: $section, quantity: $quantity)';
}


}

/// @nodoc
abstract mixin class $DeckCardResponseCopyWith<$Res>  {
  factory $DeckCardResponseCopyWith(DeckCardResponse value, $Res Function(DeckCardResponse) _then) = _$DeckCardResponseCopyWithImpl;
@useResult
$Res call({
 int? id, int cardId, String name, String? type, String? description, String? race, String? attribute, String? archetype, String? imageUrl, String section, int quantity
});




}
/// @nodoc
class _$DeckCardResponseCopyWithImpl<$Res>
    implements $DeckCardResponseCopyWith<$Res> {
  _$DeckCardResponseCopyWithImpl(this._self, this._then);

  final DeckCardResponse _self;
  final $Res Function(DeckCardResponse) _then;

/// Create a copy of DeckCardResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? cardId = null,Object? name = null,Object? type = freezed,Object? description = freezed,Object? race = freezed,Object? attribute = freezed,Object? archetype = freezed,Object? imageUrl = freezed,Object? section = null,Object? quantity = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int?,cardId: null == cardId ? _self.cardId : cardId // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,type: freezed == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,race: freezed == race ? _self.race : race // ignore: cast_nullable_to_non_nullable
as String?,attribute: freezed == attribute ? _self.attribute : attribute // ignore: cast_nullable_to_non_nullable
as String?,archetype: freezed == archetype ? _self.archetype : archetype // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,section: null == section ? _self.section : section // ignore: cast_nullable_to_non_nullable
as String,quantity: null == quantity ? _self.quantity : quantity // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [DeckCardResponse].
extension DeckCardResponsePatterns on DeckCardResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckCardResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckCardResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckCardResponse value)  $default,){
final _that = this;
switch (_that) {
case _DeckCardResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckCardResponse value)?  $default,){
final _that = this;
switch (_that) {
case _DeckCardResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int? id,  int cardId,  String name,  String? type,  String? description,  String? race,  String? attribute,  String? archetype,  String? imageUrl,  String section,  int quantity)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeckCardResponse() when $default != null:
return $default(_that.id,_that.cardId,_that.name,_that.type,_that.description,_that.race,_that.attribute,_that.archetype,_that.imageUrl,_that.section,_that.quantity);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int? id,  int cardId,  String name,  String? type,  String? description,  String? race,  String? attribute,  String? archetype,  String? imageUrl,  String section,  int quantity)  $default,) {final _that = this;
switch (_that) {
case _DeckCardResponse():
return $default(_that.id,_that.cardId,_that.name,_that.type,_that.description,_that.race,_that.attribute,_that.archetype,_that.imageUrl,_that.section,_that.quantity);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int? id,  int cardId,  String name,  String? type,  String? description,  String? race,  String? attribute,  String? archetype,  String? imageUrl,  String section,  int quantity)?  $default,) {final _that = this;
switch (_that) {
case _DeckCardResponse() when $default != null:
return $default(_that.id,_that.cardId,_that.name,_that.type,_that.description,_that.race,_that.attribute,_that.archetype,_that.imageUrl,_that.section,_that.quantity);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckCardResponse implements DeckCardResponse {
  const _DeckCardResponse({this.id, required this.cardId, required this.name, this.type, this.description, this.race, this.attribute, this.archetype, this.imageUrl, required this.section, required this.quantity});
  factory _DeckCardResponse.fromJson(Map<String, dynamic> json) => _$DeckCardResponseFromJson(json);

@override final  int? id;
@override final  int cardId;
@override final  String name;
@override final  String? type;
@override final  String? description;
@override final  String? race;
@override final  String? attribute;
@override final  String? archetype;
@override final  String? imageUrl;
@override final  String section;
@override final  int quantity;

/// Create a copy of DeckCardResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckCardResponseCopyWith<_DeckCardResponse> get copyWith => __$DeckCardResponseCopyWithImpl<_DeckCardResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckCardResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckCardResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.cardId, cardId) || other.cardId == cardId)&&(identical(other.name, name) || other.name == name)&&(identical(other.type, type) || other.type == type)&&(identical(other.description, description) || other.description == description)&&(identical(other.race, race) || other.race == race)&&(identical(other.attribute, attribute) || other.attribute == attribute)&&(identical(other.archetype, archetype) || other.archetype == archetype)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.section, section) || other.section == section)&&(identical(other.quantity, quantity) || other.quantity == quantity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,cardId,name,type,description,race,attribute,archetype,imageUrl,section,quantity);

@override
String toString() {
  return 'DeckCardResponse(id: $id, cardId: $cardId, name: $name, type: $type, description: $description, race: $race, attribute: $attribute, archetype: $archetype, imageUrl: $imageUrl, section: $section, quantity: $quantity)';
}


}

/// @nodoc
abstract mixin class _$DeckCardResponseCopyWith<$Res> implements $DeckCardResponseCopyWith<$Res> {
  factory _$DeckCardResponseCopyWith(_DeckCardResponse value, $Res Function(_DeckCardResponse) _then) = __$DeckCardResponseCopyWithImpl;
@override @useResult
$Res call({
 int? id, int cardId, String name, String? type, String? description, String? race, String? attribute, String? archetype, String? imageUrl, String section, int quantity
});




}
/// @nodoc
class __$DeckCardResponseCopyWithImpl<$Res>
    implements _$DeckCardResponseCopyWith<$Res> {
  __$DeckCardResponseCopyWithImpl(this._self, this._then);

  final _DeckCardResponse _self;
  final $Res Function(_DeckCardResponse) _then;

/// Create a copy of DeckCardResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? cardId = null,Object? name = null,Object? type = freezed,Object? description = freezed,Object? race = freezed,Object? attribute = freezed,Object? archetype = freezed,Object? imageUrl = freezed,Object? section = null,Object? quantity = null,}) {
  return _then(_DeckCardResponse(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int?,cardId: null == cardId ? _self.cardId : cardId // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,type: freezed == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,race: freezed == race ? _self.race : race // ignore: cast_nullable_to_non_nullable
as String?,attribute: freezed == attribute ? _self.attribute : attribute // ignore: cast_nullable_to_non_nullable
as String?,archetype: freezed == archetype ? _self.archetype : archetype // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,section: null == section ? _self.section : section // ignore: cast_nullable_to_non_nullable
as String,quantity: null == quantity ? _self.quantity : quantity // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
