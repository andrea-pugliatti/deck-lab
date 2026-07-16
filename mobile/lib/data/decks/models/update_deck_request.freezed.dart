// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'update_deck_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$UpdateDeckRequest {

 int get id; String get name; String get description; String get formatName; List<DeckCardResponse> get deckCards;
/// Create a copy of UpdateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UpdateDeckRequestCopyWith<UpdateDeckRequest> get copyWith => _$UpdateDeckRequestCopyWithImpl<UpdateDeckRequest>(this as UpdateDeckRequest, _$identity);

  /// Serializes this UpdateDeckRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UpdateDeckRequest&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other.deckCards, deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,formatName,const DeepCollectionEquality().hash(deckCards));

@override
String toString() {
  return 'UpdateDeckRequest(id: $id, name: $name, description: $description, formatName: $formatName, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class $UpdateDeckRequestCopyWith<$Res>  {
  factory $UpdateDeckRequestCopyWith(UpdateDeckRequest value, $Res Function(UpdateDeckRequest) _then) = _$UpdateDeckRequestCopyWithImpl;
@useResult
$Res call({
 int id, String name, String description, String formatName, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class _$UpdateDeckRequestCopyWithImpl<$Res>
    implements $UpdateDeckRequestCopyWith<$Res> {
  _$UpdateDeckRequestCopyWithImpl(this._self, this._then);

  final UpdateDeckRequest _self;
  final $Res Function(UpdateDeckRequest) _then;

/// Create a copy of UpdateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? description = null,Object? formatName = null,Object? deckCards = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,deckCards: null == deckCards ? _self.deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,
  ));
}

}


/// Adds pattern-matching-related methods to [UpdateDeckRequest].
extension UpdateDeckRequestPatterns on UpdateDeckRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UpdateDeckRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UpdateDeckRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UpdateDeckRequest value)  $default,){
final _that = this;
switch (_that) {
case _UpdateDeckRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UpdateDeckRequest value)?  $default,){
final _that = this;
switch (_that) {
case _UpdateDeckRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int id,  String name,  String description,  String formatName,  List<DeckCardResponse> deckCards)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UpdateDeckRequest() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.deckCards);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int id,  String name,  String description,  String formatName,  List<DeckCardResponse> deckCards)  $default,) {final _that = this;
switch (_that) {
case _UpdateDeckRequest():
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.deckCards);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int id,  String name,  String description,  String formatName,  List<DeckCardResponse> deckCards)?  $default,) {final _that = this;
switch (_that) {
case _UpdateDeckRequest() when $default != null:
return $default(_that.id,_that.name,_that.description,_that.formatName,_that.deckCards);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UpdateDeckRequest implements UpdateDeckRequest {
  const _UpdateDeckRequest({required this.id, required this.name, required this.description, required this.formatName, required final  List<DeckCardResponse> deckCards}): _deckCards = deckCards;
  factory _UpdateDeckRequest.fromJson(Map<String, dynamic> json) => _$UpdateDeckRequestFromJson(json);

@override final  int id;
@override final  String name;
@override final  String description;
@override final  String formatName;
 final  List<DeckCardResponse> _deckCards;
@override List<DeckCardResponse> get deckCards {
  if (_deckCards is EqualUnmodifiableListView) return _deckCards;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_deckCards);
}


/// Create a copy of UpdateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UpdateDeckRequestCopyWith<_UpdateDeckRequest> get copyWith => __$UpdateDeckRequestCopyWithImpl<_UpdateDeckRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UpdateDeckRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UpdateDeckRequest&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other._deckCards, _deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,description,formatName,const DeepCollectionEquality().hash(_deckCards));

@override
String toString() {
  return 'UpdateDeckRequest(id: $id, name: $name, description: $description, formatName: $formatName, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class _$UpdateDeckRequestCopyWith<$Res> implements $UpdateDeckRequestCopyWith<$Res> {
  factory _$UpdateDeckRequestCopyWith(_UpdateDeckRequest value, $Res Function(_UpdateDeckRequest) _then) = __$UpdateDeckRequestCopyWithImpl;
@override @useResult
$Res call({
 int id, String name, String description, String formatName, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class __$UpdateDeckRequestCopyWithImpl<$Res>
    implements _$UpdateDeckRequestCopyWith<$Res> {
  __$UpdateDeckRequestCopyWithImpl(this._self, this._then);

  final _UpdateDeckRequest _self;
  final $Res Function(_UpdateDeckRequest) _then;

/// Create a copy of UpdateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? description = null,Object? formatName = null,Object? deckCards = null,}) {
  return _then(_UpdateDeckRequest(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as int,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,deckCards: null == deckCards ? _self._deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,
  ));
}


}

// dart format on
