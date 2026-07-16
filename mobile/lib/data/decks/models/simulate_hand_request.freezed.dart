// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'simulate_hand_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SimulateHandRequest {

 int get deckSize; int get targetCopies; int get drawSize; int get successThreshold;
/// Create a copy of SimulateHandRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SimulateHandRequestCopyWith<SimulateHandRequest> get copyWith => _$SimulateHandRequestCopyWithImpl<SimulateHandRequest>(this as SimulateHandRequest, _$identity);

  /// Serializes this SimulateHandRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SimulateHandRequest&&(identical(other.deckSize, deckSize) || other.deckSize == deckSize)&&(identical(other.targetCopies, targetCopies) || other.targetCopies == targetCopies)&&(identical(other.drawSize, drawSize) || other.drawSize == drawSize)&&(identical(other.successThreshold, successThreshold) || other.successThreshold == successThreshold));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,deckSize,targetCopies,drawSize,successThreshold);

@override
String toString() {
  return 'SimulateHandRequest(deckSize: $deckSize, targetCopies: $targetCopies, drawSize: $drawSize, successThreshold: $successThreshold)';
}


}

/// @nodoc
abstract mixin class $SimulateHandRequestCopyWith<$Res>  {
  factory $SimulateHandRequestCopyWith(SimulateHandRequest value, $Res Function(SimulateHandRequest) _then) = _$SimulateHandRequestCopyWithImpl;
@useResult
$Res call({
 int deckSize, int targetCopies, int drawSize, int successThreshold
});




}
/// @nodoc
class _$SimulateHandRequestCopyWithImpl<$Res>
    implements $SimulateHandRequestCopyWith<$Res> {
  _$SimulateHandRequestCopyWithImpl(this._self, this._then);

  final SimulateHandRequest _self;
  final $Res Function(SimulateHandRequest) _then;

/// Create a copy of SimulateHandRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? deckSize = null,Object? targetCopies = null,Object? drawSize = null,Object? successThreshold = null,}) {
  return _then(_self.copyWith(
deckSize: null == deckSize ? _self.deckSize : deckSize // ignore: cast_nullable_to_non_nullable
as int,targetCopies: null == targetCopies ? _self.targetCopies : targetCopies // ignore: cast_nullable_to_non_nullable
as int,drawSize: null == drawSize ? _self.drawSize : drawSize // ignore: cast_nullable_to_non_nullable
as int,successThreshold: null == successThreshold ? _self.successThreshold : successThreshold // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [SimulateHandRequest].
extension SimulateHandRequestPatterns on SimulateHandRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SimulateHandRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SimulateHandRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SimulateHandRequest value)  $default,){
final _that = this;
switch (_that) {
case _SimulateHandRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SimulateHandRequest value)?  $default,){
final _that = this;
switch (_that) {
case _SimulateHandRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int deckSize,  int targetCopies,  int drawSize,  int successThreshold)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SimulateHandRequest() when $default != null:
return $default(_that.deckSize,_that.targetCopies,_that.drawSize,_that.successThreshold);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int deckSize,  int targetCopies,  int drawSize,  int successThreshold)  $default,) {final _that = this;
switch (_that) {
case _SimulateHandRequest():
return $default(_that.deckSize,_that.targetCopies,_that.drawSize,_that.successThreshold);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int deckSize,  int targetCopies,  int drawSize,  int successThreshold)?  $default,) {final _that = this;
switch (_that) {
case _SimulateHandRequest() when $default != null:
return $default(_that.deckSize,_that.targetCopies,_that.drawSize,_that.successThreshold);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SimulateHandRequest implements SimulateHandRequest {
  const _SimulateHandRequest({required this.deckSize, required this.targetCopies, required this.drawSize, this.successThreshold = 1});
  factory _SimulateHandRequest.fromJson(Map<String, dynamic> json) => _$SimulateHandRequestFromJson(json);

@override final  int deckSize;
@override final  int targetCopies;
@override final  int drawSize;
@override@JsonKey() final  int successThreshold;

/// Create a copy of SimulateHandRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SimulateHandRequestCopyWith<_SimulateHandRequest> get copyWith => __$SimulateHandRequestCopyWithImpl<_SimulateHandRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SimulateHandRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SimulateHandRequest&&(identical(other.deckSize, deckSize) || other.deckSize == deckSize)&&(identical(other.targetCopies, targetCopies) || other.targetCopies == targetCopies)&&(identical(other.drawSize, drawSize) || other.drawSize == drawSize)&&(identical(other.successThreshold, successThreshold) || other.successThreshold == successThreshold));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,deckSize,targetCopies,drawSize,successThreshold);

@override
String toString() {
  return 'SimulateHandRequest(deckSize: $deckSize, targetCopies: $targetCopies, drawSize: $drawSize, successThreshold: $successThreshold)';
}


}

/// @nodoc
abstract mixin class _$SimulateHandRequestCopyWith<$Res> implements $SimulateHandRequestCopyWith<$Res> {
  factory _$SimulateHandRequestCopyWith(_SimulateHandRequest value, $Res Function(_SimulateHandRequest) _then) = __$SimulateHandRequestCopyWithImpl;
@override @useResult
$Res call({
 int deckSize, int targetCopies, int drawSize, int successThreshold
});




}
/// @nodoc
class __$SimulateHandRequestCopyWithImpl<$Res>
    implements _$SimulateHandRequestCopyWith<$Res> {
  __$SimulateHandRequestCopyWithImpl(this._self, this._then);

  final _SimulateHandRequest _self;
  final $Res Function(_SimulateHandRequest) _then;

/// Create a copy of SimulateHandRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? deckSize = null,Object? targetCopies = null,Object? drawSize = null,Object? successThreshold = null,}) {
  return _then(_SimulateHandRequest(
deckSize: null == deckSize ? _self.deckSize : deckSize // ignore: cast_nullable_to_non_nullable
as int,targetCopies: null == targetCopies ? _self.targetCopies : targetCopies // ignore: cast_nullable_to_non_nullable
as int,drawSize: null == drawSize ? _self.drawSize : drawSize // ignore: cast_nullable_to_non_nullable
as int,successThreshold: null == successThreshold ? _self.successThreshold : successThreshold // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
