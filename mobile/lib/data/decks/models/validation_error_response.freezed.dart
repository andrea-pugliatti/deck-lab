// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'validation_error_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ValidationErrorResponse {

 String get message; List<String> get errors;
/// Create a copy of ValidationErrorResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ValidationErrorResponseCopyWith<ValidationErrorResponse> get copyWith => _$ValidationErrorResponseCopyWithImpl<ValidationErrorResponse>(this as ValidationErrorResponse, _$identity);

  /// Serializes this ValidationErrorResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ValidationErrorResponse&&(identical(other.message, message) || other.message == message)&&const DeepCollectionEquality().equals(other.errors, errors));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,message,const DeepCollectionEquality().hash(errors));

@override
String toString() {
  return 'ValidationErrorResponse(message: $message, errors: $errors)';
}


}

/// @nodoc
abstract mixin class $ValidationErrorResponseCopyWith<$Res>  {
  factory $ValidationErrorResponseCopyWith(ValidationErrorResponse value, $Res Function(ValidationErrorResponse) _then) = _$ValidationErrorResponseCopyWithImpl;
@useResult
$Res call({
 String message, List<String> errors
});




}
/// @nodoc
class _$ValidationErrorResponseCopyWithImpl<$Res>
    implements $ValidationErrorResponseCopyWith<$Res> {
  _$ValidationErrorResponseCopyWithImpl(this._self, this._then);

  final ValidationErrorResponse _self;
  final $Res Function(ValidationErrorResponse) _then;

/// Create a copy of ValidationErrorResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? message = null,Object? errors = null,}) {
  return _then(_self.copyWith(
message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,errors: null == errors ? _self.errors : errors // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [ValidationErrorResponse].
extension ValidationErrorResponsePatterns on ValidationErrorResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ValidationErrorResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ValidationErrorResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ValidationErrorResponse value)  $default,){
final _that = this;
switch (_that) {
case _ValidationErrorResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ValidationErrorResponse value)?  $default,){
final _that = this;
switch (_that) {
case _ValidationErrorResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String message,  List<String> errors)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ValidationErrorResponse() when $default != null:
return $default(_that.message,_that.errors);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String message,  List<String> errors)  $default,) {final _that = this;
switch (_that) {
case _ValidationErrorResponse():
return $default(_that.message,_that.errors);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String message,  List<String> errors)?  $default,) {final _that = this;
switch (_that) {
case _ValidationErrorResponse() when $default != null:
return $default(_that.message,_that.errors);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ValidationErrorResponse implements ValidationErrorResponse {
  const _ValidationErrorResponse({required this.message, required final  List<String> errors}): _errors = errors;
  factory _ValidationErrorResponse.fromJson(Map<String, dynamic> json) => _$ValidationErrorResponseFromJson(json);

@override final  String message;
 final  List<String> _errors;
@override List<String> get errors {
  if (_errors is EqualUnmodifiableListView) return _errors;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_errors);
}


/// Create a copy of ValidationErrorResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ValidationErrorResponseCopyWith<_ValidationErrorResponse> get copyWith => __$ValidationErrorResponseCopyWithImpl<_ValidationErrorResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ValidationErrorResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ValidationErrorResponse&&(identical(other.message, message) || other.message == message)&&const DeepCollectionEquality().equals(other._errors, _errors));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,message,const DeepCollectionEquality().hash(_errors));

@override
String toString() {
  return 'ValidationErrorResponse(message: $message, errors: $errors)';
}


}

/// @nodoc
abstract mixin class _$ValidationErrorResponseCopyWith<$Res> implements $ValidationErrorResponseCopyWith<$Res> {
  factory _$ValidationErrorResponseCopyWith(_ValidationErrorResponse value, $Res Function(_ValidationErrorResponse) _then) = __$ValidationErrorResponseCopyWithImpl;
@override @useResult
$Res call({
 String message, List<String> errors
});




}
/// @nodoc
class __$ValidationErrorResponseCopyWithImpl<$Res>
    implements _$ValidationErrorResponseCopyWith<$Res> {
  __$ValidationErrorResponseCopyWithImpl(this._self, this._then);

  final _ValidationErrorResponse _self;
  final $Res Function(_ValidationErrorResponse) _then;

/// Create a copy of ValidationErrorResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? message = null,Object? errors = null,}) {
  return _then(_ValidationErrorResponse(
message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,errors: null == errors ? _self._errors : errors // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on
