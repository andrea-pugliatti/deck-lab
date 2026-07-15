// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'deck_suggest_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DeckSuggestRequest {

 String get formatName; List<CardEntry> get currentCards;
/// Create a copy of DeckSuggestRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DeckSuggestRequestCopyWith<DeckSuggestRequest> get copyWith => _$DeckSuggestRequestCopyWithImpl<DeckSuggestRequest>(this as DeckSuggestRequest, _$identity);

  /// Serializes this DeckSuggestRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DeckSuggestRequest&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other.currentCards, currentCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,formatName,const DeepCollectionEquality().hash(currentCards));

@override
String toString() {
  return 'DeckSuggestRequest(formatName: $formatName, currentCards: $currentCards)';
}


}

/// @nodoc
abstract mixin class $DeckSuggestRequestCopyWith<$Res>  {
  factory $DeckSuggestRequestCopyWith(DeckSuggestRequest value, $Res Function(DeckSuggestRequest) _then) = _$DeckSuggestRequestCopyWithImpl;
@useResult
$Res call({
 String formatName, List<CardEntry> currentCards
});




}
/// @nodoc
class _$DeckSuggestRequestCopyWithImpl<$Res>
    implements $DeckSuggestRequestCopyWith<$Res> {
  _$DeckSuggestRequestCopyWithImpl(this._self, this._then);

  final DeckSuggestRequest _self;
  final $Res Function(DeckSuggestRequest) _then;

/// Create a copy of DeckSuggestRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? formatName = null,Object? currentCards = null,}) {
  return _then(_self.copyWith(
formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,currentCards: null == currentCards ? _self.currentCards : currentCards // ignore: cast_nullable_to_non_nullable
as List<CardEntry>,
  ));
}

}


/// Adds pattern-matching-related methods to [DeckSuggestRequest].
extension DeckSuggestRequestPatterns on DeckSuggestRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DeckSuggestRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DeckSuggestRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DeckSuggestRequest value)  $default,){
final _that = this;
switch (_that) {
case _DeckSuggestRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DeckSuggestRequest value)?  $default,){
final _that = this;
switch (_that) {
case _DeckSuggestRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String formatName,  List<CardEntry> currentCards)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DeckSuggestRequest() when $default != null:
return $default(_that.formatName,_that.currentCards);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String formatName,  List<CardEntry> currentCards)  $default,) {final _that = this;
switch (_that) {
case _DeckSuggestRequest():
return $default(_that.formatName,_that.currentCards);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String formatName,  List<CardEntry> currentCards)?  $default,) {final _that = this;
switch (_that) {
case _DeckSuggestRequest() when $default != null:
return $default(_that.formatName,_that.currentCards);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DeckSuggestRequest implements DeckSuggestRequest {
  const _DeckSuggestRequest({required this.formatName, required final  List<CardEntry> currentCards}): _currentCards = currentCards;
  factory _DeckSuggestRequest.fromJson(Map<String, dynamic> json) => _$DeckSuggestRequestFromJson(json);

@override final  String formatName;
 final  List<CardEntry> _currentCards;
@override List<CardEntry> get currentCards {
  if (_currentCards is EqualUnmodifiableListView) return _currentCards;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_currentCards);
}


/// Create a copy of DeckSuggestRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DeckSuggestRequestCopyWith<_DeckSuggestRequest> get copyWith => __$DeckSuggestRequestCopyWithImpl<_DeckSuggestRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DeckSuggestRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DeckSuggestRequest&&(identical(other.formatName, formatName) || other.formatName == formatName)&&const DeepCollectionEquality().equals(other._currentCards, _currentCards));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,formatName,const DeepCollectionEquality().hash(_currentCards));

@override
String toString() {
  return 'DeckSuggestRequest(formatName: $formatName, currentCards: $currentCards)';
}


}

/// @nodoc
abstract mixin class _$DeckSuggestRequestCopyWith<$Res> implements $DeckSuggestRequestCopyWith<$Res> {
  factory _$DeckSuggestRequestCopyWith(_DeckSuggestRequest value, $Res Function(_DeckSuggestRequest) _then) = __$DeckSuggestRequestCopyWithImpl;
@override @useResult
$Res call({
 String formatName, List<CardEntry> currentCards
});




}
/// @nodoc
class __$DeckSuggestRequestCopyWithImpl<$Res>
    implements _$DeckSuggestRequestCopyWith<$Res> {
  __$DeckSuggestRequestCopyWithImpl(this._self, this._then);

  final _DeckSuggestRequest _self;
  final $Res Function(_DeckSuggestRequest) _then;

/// Create a copy of DeckSuggestRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? formatName = null,Object? currentCards = null,}) {
  return _then(_DeckSuggestRequest(
formatName: null == formatName ? _self.formatName : formatName // ignore: cast_nullable_to_non_nullable
as String,currentCards: null == currentCards ? _self._currentCards : currentCards // ignore: cast_nullable_to_non_nullable
as List<CardEntry>,
  ));
}


}

// dart format on
