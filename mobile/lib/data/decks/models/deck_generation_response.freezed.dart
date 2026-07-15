// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_generation_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckGenerationResponse {

 String get name; String get description; String get formatName; List<DeckCardResponse> get deckCards; List<String> get validationWarnings;
/// Create a copy of DeckGenerationResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckGenerationResponseCopyWith<DeckGenerationResponse> get copyWith => _$DeckGenerationResponseCopyWithImpl<DeckGenerationResponse>(this as DeckGenerationResponse, _$identity);

  /// Serializes this DeckGenerationResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckGenerationResponse&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other.deckCards, deckCards)&&const DeepCollectionEquality().equals(other.validationWarnings, validationWarnings));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,description,formatName,const DeepCollectionEquality().hash(deckCards),const DeepCollectionEquality().hash(validationWarnings));

@override
String toString() {
  return 'DeckGenerationResponse(name: $name, description: $description, formatName: $formatName, deckCards: $deckCards, validationWarnings: $validationWarnings)';
}


}

/// @nodoc
abstract mixin class $DeckGenerationResponseCopyWith<$Res>  {
  factory $DeckGenerationResponseCopyWith(DeckGenerationResponse value, $Res Function(DeckGenerationResponse) _then) = _$DeckGenerationResponseCopyWithImpl;
@useResult
$Res call({
 String name, String description, String formatName, List<DeckCardResponse> deckCards, List<String> validationWarnings
});




}
/// @nodoc
class _$DeckGenerationResponseCopyWithImpl<$Res>
    implements $DeckGenerationResponseCopyWith<$Res> {
  _$DeckGenerationResponseCopyWithImpl(this._self, this._then);

  final DeckGenerationResponse _self;
  final $Res Function(DeckGenerationResponse) _then;

/// Create a copy of DeckGenerationResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? description = null,Object? formatName = null,Object? deckCards = null,Object? validationWarnings = null,}) {
  return _then(_self.copyWith(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,deckCards: null == deckCards ? _self.deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,validationWarnings: null == validationWarnings ? _self.validationWarnings : validationWarnings // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [DeckGenerationResponse].
extension DeckGenerationResponsePatterns on DeckGenerationResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckGenerationResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckGenerationResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckGenerationResponse value)  $default,){
final _that = this;
switch (_that) {
case _DeckGenerationResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckGenerationResponse value)?  $default,){
final _that = this;
switch (_that) {
case _DeckGenerationResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  String description,  String formatName,  List<DeckCardResponse> deckCards,  List<String> validationWarnings)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeckGenerationResponse() when $default != null:
return $default(_that.name,_that.description,_that.formatName,_that.deckCards,_that.validationWarnings);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  String description,  String formatName,  List<DeckCardResponse> deckCards,  List<String> validationWarnings)  $default,) {final _that = this;
switch (_that) {
case _DeckGenerationResponse():
return $default(_that.name,_that.description,_that.formatName,_that.deckCards,_that.validationWarnings);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  String description,  String formatName,  List<DeckCardResponse> deckCards,  List<String> validationWarnings)?  $default,) {final _that = this;
switch (_that) {
case _DeckGenerationResponse() when $default != null:
return $default(_that.name,_that.description,_that.formatName,_that.deckCards,_that.validationWarnings);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckGenerationResponse implements DeckGenerationResponse {
  const _DeckGenerationResponse({required this.name, required this.description, required this.formatName, final  List<DeckCardResponse> deckCards = const [], final  List<String> validationWarnings = const []}): _deckCards = deckCards,_validationWarnings = validationWarnings;
  factory _DeckGenerationResponse.fromJson(Map<String, dynamic> json) => _$DeckGenerationResponseFromJson(json);

@override final  String name;
@override final  String description;
@override final  String formatName;
 final  List<DeckCardResponse> _deckCards;
@override@JsonKey() List<DeckCardResponse> get deckCards {
  if (_deckCards is EqualUnmodifiableListView) return _deckCards;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_deckCards);
}

 final  List<String> _validationWarnings;
@override@JsonKey() List<String> get validationWarnings {
  if (_validationWarnings is EqualUnmodifiableListView) return _validationWarnings;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_validationWarnings);
}


/// Create a copy of DeckGenerationResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckGenerationResponseCopyWith<_DeckGenerationResponse> get copyWith => __$DeckGenerationResponseCopyWithImpl<_DeckGenerationResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckGenerationResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckGenerationResponse&&(identical(other.name, name) || other.name == name)&&(identical(other.description, description) || other.description == description)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other._deckCards, _deckCards)&&const DeepCollectionEquality().equals(other._validationWarnings, _validationWarnings));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,description,formatName,const DeepCollectionEquality().hash(_deckCards),const DeepCollectionEquality().hash(_validationWarnings));

@override
String toString() {
  return 'DeckGenerationResponse(name: $name, description: $description, formatName: $formatName, deckCards: $deckCards, validationWarnings: $validationWarnings)';
}


}

/// @nodoc
abstract mixin class _$DeckGenerationResponseCopyWith<$Res> implements $DeckGenerationResponseCopyWith<$Res> {
  factory _$DeckGenerationResponseCopyWith(_DeckGenerationResponse value, $Res Function(_DeckGenerationResponse) _then) = __$DeckGenerationResponseCopyWithImpl;
@override @useResult
$Res call({
 String name, String description, String formatName, List<DeckCardResponse> deckCards, List<String> validationWarnings
});




}
/// @nodoc
class __$DeckGenerationResponseCopyWithImpl<$Res>
    implements _$DeckGenerationResponseCopyWith<$Res> {
  __$DeckGenerationResponseCopyWithImpl(this._self, this._then);

  final _DeckGenerationResponse _self;
  final $Res Function(_DeckGenerationResponse) _then;

/// Create a copy of DeckGenerationResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? description = null,Object? formatName = null,Object? deckCards = null,Object? validationWarnings = null,}) {
  return _then(_DeckGenerationResponse(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,deckCards: null == deckCards ? _self._deckCards : deckCards // ignore: cast_nullable_to_non_nullable
as List<DeckCardResponse>,validationWarnings: null == validationWarnings ? _self._validationWarnings : validationWarnings // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on
