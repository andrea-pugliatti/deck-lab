// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'simulate_hand_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SimulateHandResponse {

 double get exactProbability; double get atLeastProbability;
/// Create a copy of SimulateHandResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SimulateHandResponseCopyWith<SimulateHandResponse> get copyWith => _$SimulateHandResponseCopyWithImpl<SimulateHandResponse>(this as SimulateHandResponse, _$identity);

  /// Serializes this SimulateHandResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SimulateHandResponse&&(identical(other.exactProbability, exactProbability) || other.exactProbability == exactProbability)&&(identical(other.atLeastProbability, atLeastProbability) || other.atLeastProbability == atLeastProbability));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,exactProbability,atLeastProbability);

@override
String toString() {
  return 'SimulateHandResponse(exactProbability: $exactProbability, atLeastProbability: $atLeastProbability)';
}


}

/// @nodoc
abstract mixin class $SimulateHandResponseCopyWith<$Res>  {
  factory $SimulateHandResponseCopyWith(SimulateHandResponse value, $Res Function(SimulateHandResponse) _then) = _$SimulateHandResponseCopyWithImpl;
@useResult
$Res call({
 double exactProbability, double atLeastProbability
});




}
/// @nodoc
class _$SimulateHandResponseCopyWithImpl<$Res>
    implements $SimulateHandResponseCopyWith<$Res> {
  _$SimulateHandResponseCopyWithImpl(this._self, this._then);

  final SimulateHandResponse _self;
  final $Res Function(SimulateHandResponse) _then;

/// Create a copy of SimulateHandResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? exactProbability = null,Object? atLeastProbability = null,}) {
  return _then(_self.copyWith(
exactProbability: null == exactProbability ? _self.exactProbability : exactProbability // ignore: cast_nullable_to_non_nullable
as double,atLeastProbability: null == atLeastProbability ? _self.atLeastProbability : atLeastProbability // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [SimulateHandResponse].
extension SimulateHandResponsePatterns on SimulateHandResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SimulateHandResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SimulateHandResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SimulateHandResponse value)  $default,){
final _that = this;
switch (_that) {
case _SimulateHandResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SimulateHandResponse value)?  $default,){
final _that = this;
switch (_that) {
case _SimulateHandResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( double exactProbability,  double atLeastProbability)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SimulateHandResponse() when $default != null:
return $default(_that.exactProbability,_that.atLeastProbability);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( double exactProbability,  double atLeastProbability)  $default,) {final _that = this;
switch (_that) {
case _SimulateHandResponse():
return $default(_that.exactProbability,_that.atLeastProbability);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( double exactProbability,  double atLeastProbability)?  $default,) {final _that = this;
switch (_that) {
case _SimulateHandResponse() when $default != null:
return $default(_that.exactProbability,_that.atLeastProbability);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SimulateHandResponse implements SimulateHandResponse {
  const _SimulateHandResponse({required this.exactProbability, required this.atLeastProbability});
  factory _SimulateHandResponse.fromJson(Map<String, dynamic> json) => _$SimulateHandResponseFromJson(json);

@override final  double exactProbability;
@override final  double atLeastProbability;

/// Create a copy of SimulateHandResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SimulateHandResponseCopyWith<_SimulateHandResponse> get copyWith => __$SimulateHandResponseCopyWithImpl<_SimulateHandResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SimulateHandResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SimulateHandResponse&&(identical(other.exactProbability, exactProbability) || other.exactProbability == exactProbability)&&(identical(other.atLeastProbability, atLeastProbability) || other.atLeastProbability == atLeastProbability));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,exactProbability,atLeastProbability);

@override
String toString() {
  return 'SimulateHandResponse(exactProbability: $exactProbability, atLeastProbability: $atLeastProbability)';
}


}

/// @nodoc
abstract mixin class _$SimulateHandResponseCopyWith<$Res> implements $SimulateHandResponseCopyWith<$Res> {
  factory _$SimulateHandResponseCopyWith(_SimulateHandResponse value, $Res Function(_SimulateHandResponse) _then) = __$SimulateHandResponseCopyWithImpl;
@override @useResult
$Res call({
 double exactProbability, double atLeastProbability
});




}
/// @nodoc
class __$SimulateHandResponseCopyWithImpl<$Res>
    implements _$SimulateHandResponseCopyWith<$Res> {
  __$SimulateHandResponseCopyWithImpl(this._self, this._then);

  final _SimulateHandResponse _self;
  final $Res Function(_SimulateHandResponse) _then;

/// Create a copy of SimulateHandResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? exactProbability = null,Object? atLeastProbability = null,}) {
  return _then(_SimulateHandResponse(
exactProbability: null == exactProbability ? _self.exactProbability : exactProbability // ignore: cast_nullable_to_non_nullable
as double,atLeastProbability: null == atLeastProbability ? _self.atLeastProbability : atLeastProbability // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
