// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_summary_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckSummaryResponse {

 int get id; String get name; String? get description; String get formatName; String? get creatorUsername; String? get updatedAt; List<DeckCardResponse> get deckCards;
/// Create a copy of DeckSummaryResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckSummaryResponseCopyWith<DeckSummaryResponse> get copyWith => _$DeckSummaryResponseCopyWithImpl<DeckSummaryResponse>(this as DeckSummaryResponse, _$identity);

  /// Serializes this DeckSummaryResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckSummaryResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&(identical(other.creatorUsername, creatorUsername) || other.creatorUsername == creatorUsername)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&const DeepCollectionEquality().equals(other.deckCards, deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,formatName,creatorUsername,updatedAt,const DeepCollectionEquality().hash(deckCards));

@override
String toString() {
  return 'DeckSummaryResponse(id: $id, name: $name, description: $description, formatName: $formatName, creatorUsername: $creatorUsername, updatedAt: $updatedAt, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class $DeckSummaryResponseCopyWith<$Res>  {
  factory $DeckSummaryResponseCopyWith(DeckSummaryResponse value, $Res Function(DeckSummaryResponse) _then) = _$DeckSummaryResponseCopyWithImpl;
@useResult
$Res call({
 int id, String name, String? description, String formatName, String? creatorUsername, String? updatedAt, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class _$DeckSummaryResponseCopyWithImpl<$Res>
    implements $DeckSummaryResponseCopyWith<$Res> {
  _$DeckSummaryResponseCopyWithImpl(this._self, this._then);

  final DeckSummaryResponse _self;
  final $Res Function(DeckSummaryResponse) _then;

/// Create a copy of DeckSummaryResponse
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


/// Adds pattern-matching-related methods to [DeckSummaryResponse].
extension DeckSummaryResponsePatterns on DeckSummaryResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckSummaryResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckSummaryResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckSummaryResponse value)  $default,){
final _that = this;
switch (_that) {
case _DeckSummaryResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckSummaryResponse value)?  $default,){
final _that = this;
switch (_that) {
case _DeckSummaryResponse() when $default != null:
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
case _DeckSummaryResponse() when $default != null:
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
case _DeckSummaryResponse():
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
case _DeckSummaryResponse() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.creatorUsername,_that.updatedAt,_that.deckCards);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckSummaryResponse extends DeckSummaryResponse {
  const _DeckSummaryResponse({required this.id, required this.name, this.description, required this.formatName, this.creatorUsername, this.updatedAt, final  List<DeckCardResponse> deckCards = const []}): _deckCards = deckCards,super._();
  factory _DeckSummaryResponse.fromJson(Map<String, dynamic> json) => _$DeckSummaryResponseFromJson(json);

@override final  int id;
@override final  String name;
@override final  String? description;
@override final  String formatName;
@override final  String? creatorUsername;
@override final  String? updatedAt;
 final  List<DeckCardResponse> _deckCards;
@override@JsonKey() List<DeckCardResponse> get deckCards {
  if (_deckCards is EqualUnmodifiableListView) return _deckCards;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_deckCards);
}


/// Create a copy of DeckSummaryResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckSummaryResponseCopyWith<_DeckSummaryResponse> get copyWith => __$DeckSummaryResponseCopyWithImpl<_DeckSummaryResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckSummaryResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckSummaryResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&(identical(other.creatorUsername, creatorUsername) || other.creatorUsername == creatorUsername)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&const DeepCollectionEquality().equals(other._deckCards, _deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,formatName,creatorUsername,updatedAt,const DeepCollectionEquality().hash(_deckCards));

@override
String toString() {
  return 'DeckSummaryResponse(id: $id, name: $name, description: $description, formatName: $formatName, creatorUsername: $creatorUsername, updatedAt: $updatedAt, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class _$DeckSummaryResponseCopyWith<$Res> implements $DeckSummaryResponseCopyWith<$Res> {
  factory _$DeckSummaryResponseCopyWith(_DeckSummaryResponse value, $Res Function(_DeckSummaryResponse) _then) = __$DeckSummaryResponseCopyWithImpl;
@override @useResult
$Res call({
 int id, String name, String? description, String formatName, String? creatorUsername, String? updatedAt, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class __$DeckSummaryResponseCopyWithImpl<$Res>
    implements _$DeckSummaryResponseCopyWith<$Res> {
  __$DeckSummaryResponseCopyWithImpl(this._self, this._then);

  final _DeckSummaryResponse _self;
  final $Res Function(_DeckSummaryResponse) _then;

/// Create a copy of DeckSummaryResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? description = freezed,Object? formatName = null,Object? creatorUsername = freezed,Object? updatedAt = freezed,Object? deckCards = null,}) {
  return _then(_DeckSummaryResponse(
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
