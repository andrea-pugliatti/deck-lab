// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_validation_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckValidationResponse {

 bool get isValid; List<String> get errors;
/// Create a copy of DeckValidationResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckValidationResponseCopyWith<DeckValidationResponse> get copyWith => _$DeckValidationResponseCopyWithImpl<DeckValidationResponse>(this as DeckValidationResponse, _$identity);

  /// Serializes this DeckValidationResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckValidationResponse&&(identical(other.isValid, isValid) || other.isValid == isValid)&&const DeepCollectionEquality().equals(other.errors, errors));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,isValid,const DeepCollectionEquality().hash(errors));

@override
String toString() {
  return 'DeckValidationResponse(isValid: $isValid, errors: $errors)';
}


}

/// @nodoc
abstract mixin class $DeckValidationResponseCopyWith<$Res>  {
  factory $DeckValidationResponseCopyWith(DeckValidationResponse value, $Res Function(DeckValidationResponse) _then) = _$DeckValidationResponseCopyWithImpl;
@useResult
$Res call({
 bool isValid, List<String> errors
});




}
/// @nodoc
class _$DeckValidationResponseCopyWithImpl<$Res>
    implements $DeckValidationResponseCopyWith<$Res> {
  _$DeckValidationResponseCopyWithImpl(this._self, this._then);

  final DeckValidationResponse _self;
  final $Res Function(DeckValidationResponse) _then;

/// Create a copy of DeckValidationResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isValid = null,Object? errors = null,}) {
  return _then(_self.copyWith(
isValid: null == isValid ? _self.isValid : isValid // ignore: cast_nullable_to_non_nullable
as bool,errors: null == errors ? _self.errors : errors // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [DeckValidationResponse].
extension DeckValidationResponsePatterns on DeckValidationResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckValidationResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckValidationResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckValidationResponse value)  $default,){
final _that = this;
switch (_that) {
case _DeckValidationResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckValidationResponse value)?  $default,){
final _that = this;
switch (_that) {
case _DeckValidationResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isValid,  List<String> errors)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeckValidationResponse() when $default != null:
return $default(_that.isValid,_that.errors);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isValid,  List<String> errors)  $default,) {final _that = this;
switch (_that) {
case _DeckValidationResponse():
return $default(_that.isValid,_that.errors);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isValid,  List<String> errors)?  $default,) {final _that = this;
switch (_that) {
case _DeckValidationResponse() when $default != null:
return $default(_that.isValid,_that.errors);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckValidationResponse implements DeckValidationResponse {
  const _DeckValidationResponse({required this.isValid, final  List<String> errors = const []}): _errors = errors;
  factory _DeckValidationResponse.fromJson(Map<String, dynamic> json) => _$DeckValidationResponseFromJson(json);

@override final  bool isValid;
 final  List<String> _errors;
@override@JsonKey() List<String> get errors {
  if (_errors is EqualUnmodifiableListView) return _errors;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_errors);
}


/// Create a copy of DeckValidationResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckValidationResponseCopyWith<_DeckValidationResponse> get copyWith => __$DeckValidationResponseCopyWithImpl<_DeckValidationResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckValidationResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckValidationResponse&&(identical(other.isValid, isValid) || other.isValid == isValid)&&const DeepCollectionEquality().equals(other._errors, _errors));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,isValid,const DeepCollectionEquality().hash(_errors));

@override
String toString() {
  return 'DeckValidationResponse(isValid: $isValid, errors: $errors)';
}


}

/// @nodoc
abstract mixin class _$DeckValidationResponseCopyWith<$Res> implements $DeckValidationResponseCopyWith<$Res> {
  factory _$DeckValidationResponseCopyWith(_DeckValidationResponse value, $Res Function(_DeckValidationResponse) _then) = __$DeckValidationResponseCopyWithImpl;
@override @useResult
$Res call({
 bool isValid, List<String> errors
});




}
/// @nodoc
class __$DeckValidationResponseCopyWithImpl<$Res>
    implements _$DeckValidationResponseCopyWith<$Res> {
  __$DeckValidationResponseCopyWithImpl(this._self, this._then);

  final _DeckValidationResponse _self;
  final $Res Function(_DeckValidationResponse) _then;

/// Create a copy of DeckValidationResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isValid = null,Object? errors = null,}) {
  return _then(_DeckValidationResponse(
isValid: null == isValid ? _self.isValid : isValid // ignore: cast_nullable_to_non_nullable
as bool,errors: null == errors ? _self._errors : errors // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on
