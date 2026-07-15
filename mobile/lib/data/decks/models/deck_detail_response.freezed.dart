// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_detail_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckDetailResponse {

/// Unique identifier of the deck.
 int get id;/// Display name of the deck.
 String get name;/// Description text detailing strategies or notes.
 String? get description;/// Mapped format category name (e.g. TCG, OCG, GOAT, Edison).
 String get formatName;/// Username of the deck's creator.
 String? get creatorUsername;/// Timestamp indicating when the deck was last updated.
 String? get updatedAt;/// Sorted collection of deck card references.
 List<DeckCardResponse> get deckCards;
/// Create a copy of DeckDetailResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckDetailResponseCopyWith<DeckDetailResponse> get copyWith => _$DeckDetailResponseCopyWithImpl<DeckDetailResponse>(this as DeckDetailResponse, _$identity);

  /// Serializes this DeckDetailResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckDetailResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&(identical(other.creatorUsername, creatorUsername) || other.creatorUsername == creatorUsername)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&const DeepCollectionEquality().equals(other.deckCards, deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,formatName,creatorUsername,updatedAt,const DeepCollectionEquality().hash(deckCards));

@override
String toString() {
  return 'DeckDetailResponse(id: $id, name: $name, description: $description, formatName: $formatName, creatorUsername: $creatorUsername, updatedAt: $updatedAt, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class $DeckDetailResponseCopyWith<$Res>  {
  factory $DeckDetailResponseCopyWith(DeckDetailResponse value, $Res Function(DeckDetailResponse) _then) = _$DeckDetailResponseCopyWithImpl;
@useResult
$Res call({
 int id, String name, String? description, String formatName, String? creatorUsername, String? updatedAt, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class _$DeckDetailResponseCopyWithImpl<$Res>
    implements $DeckDetailResponseCopyWith<$Res> {
  _$DeckDetailResponseCopyWithImpl(this._self, this._then);

  final DeckDetailResponse _self;
  final $Res Function(DeckDetailResponse) _then;

/// Create a copy of DeckDetailResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? formatName = null,Object? creatorUsername = freezed,Object? updatedAt = freezed,Object? deckCards = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,creatorUsername: freezed == creatorUsername ? _self.creatorUsername : creatorUsername // ignore: cast_nullable_to_non_nullable
as String?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String?,deckCards: null == deckCards ? _self.deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,
  ));
}

}


/// Adds pattern-matching-related methods to [DeckDetailResponse].
extension DeckDetailResponsePatterns on DeckDetailResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckDetailResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckDetailResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckDetailResponse value)  $default,){
final _that = this;
switch (_that) {
case _DeckDetailResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckDetailResponse value)?  $default,){
final _that = this;
switch (_that) {
case _DeckDetailResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int id,  String name,  String? description,  String formatName,  String? creatorUsername,  String? updatedAt,  List<DeckCardResponse> deckCards)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeckDetailResponse() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.creatorUsername,_that.updatedAt,_that.deckCards);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int id,  String name,  String? description,  String formatName,  String? creatorUsername,  String? updatedAt,  List<DeckCardResponse> deckCards)  $default,) {final _that = this;
switch (_that) {
case _DeckDetailResponse():
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.creatorUsername,_that.updatedAt,_that.deckCards);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int id,  String name,  String? description,  String formatName,  String? creatorUsername,  String? updatedAt,  List<DeckCardResponse> deckCards)?  $default,) {final _that = this;
switch (_that) {
case _DeckDetailResponse() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.creatorUsername,_that.updatedAt,_that.deckCards);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckDetailResponse extends DeckDetailResponse {
  const _DeckDetailResponse({required this.id, required this.name, this.description, required this.formatName, this.creatorUsername, this.updatedAt, required final  List<DeckCardResponse> deckCards}): _deckCards = deckCards,super._();
  factory _DeckDetailResponse.fromJson(Map<String, dynamic> json) => _$DeckDetailResponseFromJson(json);

/// Unique identifier of the deck.
@override final  int id;
/// Display name of the deck.
@override final  String name;
/// Description text detailing strategies or notes.
@override final  String? description;
/// Mapped format category name (e.g. TCG, OCG, GOAT, Edison).
@override final  String formatName;
/// Username of the deck's creator.
@override final  String? creatorUsername;
/// Timestamp indicating when the deck was last updated.
@override final  String? updatedAt;
/// Sorted collection of deck card references.
 final  List<DeckCardResponse> _deckCards;
/// Sorted collection of deck card references.
@override List<DeckCardResponse> get deckCards {
  if (_deckCards is EqualUnmodifiableListView) return _deckCards;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_deckCards);
}


/// Create a copy of DeckDetailResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckDetailResponseCopyWith<_DeckDetailResponse> get copyWith => __$DeckDetailResponseCopyWithImpl<_DeckDetailResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckDetailResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckDetailResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&(identical(other.creatorUsername, creatorUsername) || other.creatorUsername == creatorUsername)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&const DeepCollectionEquality().equals(other._deckCards, _deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,formatName,creatorUsername,updatedAt,const DeepCollectionEquality().hash(_deckCards));

@override
String toString() {
  return 'DeckDetailResponse(id: $id, name: $name, description: $description, formatName: $formatName, creatorUsername: $creatorUsername, updatedAt: $updatedAt, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class _$DeckDetailResponseCopyWith<$Res> implements $DeckDetailResponseCopyWith<$Res> {
  factory _$DeckDetailResponseCopyWith(_DeckDetailResponse value, $Res Function(_DeckDetailResponse) _then) = __$DeckDetailResponseCopyWithImpl;
@override @useResult
$Res call({
 int id, String name, String? description, String formatName, String? creatorUsername, String? updatedAt, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class __$DeckDetailResponseCopyWithImpl<$Res>
    implements _$DeckDetailResponseCopyWith<$Res> {
  __$DeckDetailResponseCopyWithImpl(this._self, this._then);

  final _DeckDetailResponse _self;
  final $Res Function(_DeckDetailResponse) _then;

/// Create a copy of DeckDetailResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? formatName = null,Object? creatorUsername = freezed,Object? updatedAt = freezed,Object? deckCards = null,}) {
  return _then(_DeckDetailResponse(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,creatorUsername: freezed == creatorUsername ? _self.creatorUsername : creatorUsername // ignore: cast_nullable_to_non_nullable
as String?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String?,deckCards: null == deckCards ? _self._deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,
  ));
}


}

// dart format on
