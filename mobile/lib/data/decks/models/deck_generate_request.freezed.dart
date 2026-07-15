// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_generate_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckGenerateRequest {

 String get archetype; String get strategy; String get formatName; String? get customPrompt;
/// Create a copy of DeckGenerateRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckGenerateRequestCopyWith<DeckGenerateRequest> get copyWith => _$DeckGenerateRequestCopyWithImpl<DeckGenerateRequest>(this as DeckGenerateRequest, _$identity);

  /// Serializes this DeckGenerateRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckGenerateRequest&&(identical(other.archetype, archetype) || other.archetype == archetype)&&(identical(other.strategy, strategy) || other.strategy == strategy)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&(identical(other.customPrompt, customPrompt) || other.customPrompt == customPrompt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,archetype,strategy,formatName,customPrompt);

@override
String toString() {
  return 'DeckGenerateRequest(archetype: $archetype, strategy: $strategy, formatName: $formatName, customPrompt: $customPrompt)';
}


}

/// @nodoc
abstract mixin class $DeckGenerateRequestCopyWith<$Res>  {
  factory $DeckGenerateRequestCopyWith(DeckGenerateRequest value, $Res Function(DeckGenerateRequest) _then) = _$DeckGenerateRequestCopyWithImpl;
@useResult
$Res call({
 String archetype, String strategy, String formatName, String? customPrompt
});




}
/// @nodoc
class _$DeckGenerateRequestCopyWithImpl<$Res>
    implements $DeckGenerateRequestCopyWith<$Res> {
  _$DeckGenerateRequestCopyWithImpl(this._self, this._then);

  final DeckGenerateRequest _self;
  final $Res Function(DeckGenerateRequest) _then;

/// Create a copy of DeckGenerateRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? archetype = null,Object? strategy = null,Object? formatName = null,Object? customPrompt = freezed,}) {
  return _then(_self.copyWith(
archetype: null == archetype ? _self.archetype : archetype // ignore: cast_nullable_to_non_nullable
as String,strategy: null == strategy ? _self.strategy : strategy // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,customPrompt: freezed == customPrompt ? _self.customPrompt : customPrompt // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [DeckGenerateRequest].
extension DeckGenerateRequestPatterns on DeckGenerateRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckGenerateRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckGenerateRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckGenerateRequest value)  $default,){
final _that = this;
switch (_that) {
case _DeckGenerateRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckGenerateRequest value)?  $default,){
final _that = this;
switch (_that) {
case _DeckGenerateRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String archetype,  String strategy,  String formatName,  String? customPrompt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeckGenerateRequest() when $default != null:
return $default(_that.archetype,_that.strategy,_that.formatName,_that.customPrompt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String archetype,  String strategy,  String formatName,  String? customPrompt)  $default,) {final _that = this;
switch (_that) {
case _DeckGenerateRequest():
return $default(_that.archetype,_that.strategy,_that.formatName,_that.customPrompt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String archetype,  String strategy,  String formatName,  String? customPrompt)?  $default,) {final _that = this;
switch (_that) {
case _DeckGenerateRequest() when $default != null:
return $default(_that.archetype,_that.strategy,_that.formatName,_that.customPrompt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckGenerateRequest implements DeckGenerateRequest {
  const _DeckGenerateRequest({required this.archetype, required this.strategy, required this.formatName, this.customPrompt});
  factory _DeckGenerateRequest.fromJson(Map<String, dynamic> json) => _$DeckGenerateRequestFromJson(json);

@override final  String archetype;
@override final  String strategy;
@override final  String formatName;
@override final  String? customPrompt;

/// Create a copy of DeckGenerateRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckGenerateRequestCopyWith<_DeckGenerateRequest> get copyWith => __$DeckGenerateRequestCopyWithImpl<_DeckGenerateRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckGenerateRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckGenerateRequest&&(identical(other.archetype, archetype) || other.archetype == archetype)&&(identical(other.strategy, strategy) || other.strategy == strategy)&&(identical(other.formatName, formatName) || other.formatName == formatName)&&(identical(other.customPrompt, customPrompt) || other.customPrompt == customPrompt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,archetype,strategy,formatName,customPrompt);

@override
String toString() {
  return 'DeckGenerateRequest(archetype: $archetype, strategy: $strategy, formatName: $formatName, customPrompt: $customPrompt)';
}


}

/// @nodoc
abstract mixin class _$DeckGenerateRequestCopyWith<$Res> implements $DeckGenerateRequestCopyWith<$Res> {
  factory _$DeckGenerateRequestCopyWith(_DeckGenerateRequest value, $Res Function(_DeckGenerateRequest) _then) = __$DeckGenerateRequestCopyWithImpl;
@override @useResult
$Res call({
 String archetype, String strategy, String formatName, String? customPrompt
});




}
/// @nodoc
class __$DeckGenerateRequestCopyWithImpl<$Res>
    implements _$DeckGenerateRequestCopyWith<$Res> {
  __$DeckGenerateRequestCopyWithImpl(this._self, this._then);

  final _DeckGenerateRequest _self;
  final $Res Function(_DeckGenerateRequest) _then;

/// Create a copy of DeckGenerateRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? archetype = null,Object? strategy = null,Object? formatName = null,Object? customPrompt = freezed,}) {
  return _then(_DeckGenerateRequest(
archetype: null == archetype ? _self.archetype : archetype // ignore: cast_nullable_to_non_nullable
as String,strategy: null == strategy ? _self.strategy : strategy // ignore: cast_nullable_to_non_nullable
as String,formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,customPrompt: freezed == customPrompt ? _self.customPrompt : customPrompt // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
