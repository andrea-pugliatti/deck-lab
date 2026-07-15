// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'validate_deck_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ValidateDeckRequest {

/// Display name of the deck.
 String get name;/// Format category name.
 String get formatName;/// List of cards and their quantities.
 List<DeckCardResponse> get deckCards;
/// Create a copy of ValidateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ValidateDeckRequestCopyWith<ValidateDeckRequest> get copyWith => _$ValidateDeckRequestCopyWithImpl<ValidateDeckRequest>(this as ValidateDeckRequest, _$identity);

  /// Serializes this ValidateDeckRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ValidateDeckRequest&&(identical(other.name, name) || other.name == name)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other.deckCards, deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,formatName,const DeepCollectionEquality().hash(deckCards));

@override
String toString() {
  return 'ValidateDeckRequest(name: $name, formatName: $formatName, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class $ValidateDeckRequestCopyWith<$Res>  {
  factory $ValidateDeckRequestCopyWith(ValidateDeckRequest value, $Res Function(ValidateDeckRequest) _then) = _$ValidateDeckRequestCopyWithImpl;
@useResult
$Res call({
 String name, String formatName, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class _$ValidateDeckRequestCopyWithImpl<$Res>
    implements $ValidateDeckRequestCopyWith<$Res> {
  _$ValidateDeckRequestCopyWithImpl(this._self, this._then);

  final ValidateDeckRequest _self;
  final $Res Function(ValidateDeckRequest) _then;

/// Create a copy of ValidateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? formatName = null,Object? deckCards = null,}) {
  return _then(_self.copyWith(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,deckCards: null == deckCards ? _self.deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,
  ));
}

}


/// Adds pattern-matching-related methods to [ValidateDeckRequest].
extension ValidateDeckRequestPatterns on ValidateDeckRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ValidateDeckRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ValidateDeckRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ValidateDeckRequest value)  $default,){
final _that = this;
switch (_that) {
case _ValidateDeckRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ValidateDeckRequest value)?  $default,){
final _that = this;
switch (_that) {
case _ValidateDeckRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  String formatName,  List<DeckCardResponse> deckCards)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ValidateDeckRequest() when $default != null:
return $default(_that.name,_that.formatName,_that.deckCards);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  String formatName,  List<DeckCardResponse> deckCards)  $default,) {final _that = this;
switch (_that) {
case _ValidateDeckRequest():
return $default(_that.name,_that.formatName,_that.deckCards);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  String formatName,  List<DeckCardResponse> deckCards)?  $default,) {final _that = this;
switch (_that) {
case _ValidateDeckRequest() when $default != null:
return $default(_that.name,_that.formatName,_that.deckCards);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ValidateDeckRequest implements ValidateDeckRequest {
  const _ValidateDeckRequest({required this.name, required this.formatName, required final  List<DeckCardResponse> deckCards}): _deckCards = deckCards;
  factory _ValidateDeckRequest.fromJson(Map<String, dynamic> json) => _$ValidateDeckRequestFromJson(json);

/// Display name of the deck.
@override final  String name;
/// Format category name.
@override final  String formatName;
/// List of cards and their quantities.
 final  List<DeckCardResponse> _deckCards;
/// List of cards and their quantities.
@override List<DeckCardResponse> get deckCards {
  if (_deckCards is EqualUnmodifiableListView) return _deckCards;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_deckCards);
}


/// Create a copy of ValidateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ValidateDeckRequestCopyWith<_ValidateDeckRequest> get copyWith => __$ValidateDeckRequestCopyWithImpl<_ValidateDeckRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ValidateDeckRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ValidateDeckRequest&&(identical(other.name, name) || other.name == name)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other._deckCards, _deckCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,formatName,const DeepCollectionEquality().hash(_deckCards));

@override
String toString() {
  return 'ValidateDeckRequest(name: $name, formatName: $formatName, deckCards: $deckCards)';
}


}

/// @nodoc
abstract mixin class _$ValidateDeckRequestCopyWith<$Res> implements $ValidateDeckRequestCopyWith<$Res> {
  factory _$ValidateDeckRequestCopyWith(_ValidateDeckRequest value, $Res Function(_ValidateDeckRequest) _then) = __$ValidateDeckRequestCopyWithImpl;
@override @useResult
$Res call({
 String name, String formatName, List<DeckCardResponse> deckCards
});




}
/// @nodoc
class __$ValidateDeckRequestCopyWithImpl<$Res>
    implements _$ValidateDeckRequestCopyWith<$Res> {
  __$ValidateDeckRequestCopyWithImpl(this._self, this._then);

  final _ValidateDeckRequest _self;
  final $Res Function(_ValidateDeckRequest) _then;

/// Create a copy of ValidateDeckRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? formatName = null,Object? deckCards = null,}) {
  return _then(_ValidateDeckRequest(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,deckCards: null == deckCards ? _self._deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,
  ));
}


}

// dart format on
