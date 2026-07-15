// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'card_suggestion_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CardSuggestionResponse {

/// Name of the card.
 String get name;/// Recommended placement section (MAIN, EXTRA, or SIDE).
 String get section;/// AI-generated text outlining synergy reasonings.
 String get synergyReason;/// Resolved database Card ID.
 int get cardId;/// Classification type of the recommended card.
 String get type;/// Image URL path pointing to card artwork.
 String? get imageUrl;
/// Create a copy of CardSuggestionResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CardSuggestionResponseCopyWith<CardSuggestionResponse> get copyWith => _$CardSuggestionResponseCopyWithImpl<CardSuggestionResponse>(this as CardSuggestionResponse, _$identity);

  /// Serializes this CardSuggestionResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CardSuggestionResponse&&(identical(other.name, name) || other.name == name)&&(identical(other.section, section) || other.section == section)&&(identical(other.synergyReason, synergyReason) || other.synergyReason == synergyReason)&&(identical(other.cardId, cardId) || other.cardId == cardId)&&(identical(other.type, type) || other.type == type)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,section,synergyReason,cardId,type,imageUrl);

@override
String toString() {
  return 'CardSuggestionResponse(name: $name, section: $section, synergyReason: $synergyReason, cardId: $cardId, type: $type, imageUrl: $imageUrl)';
}


}

/// @nodoc
abstract mixin class $CardSuggestionResponseCopyWith<$Res>  {
  factory $CardSuggestionResponseCopyWith(CardSuggestionResponse value, $Res Function(CardSuggestionResponse) _then) = _$CardSuggestionResponseCopyWithImpl;
@useResult
$Res call({
 String name, String section, String synergyReason, int cardId, String type, String? imageUrl
});




}
/// @nodoc
class _$CardSuggestionResponseCopyWithImpl<$Res>
    implements $CardSuggestionResponseCopyWith<$Res> {
  _$CardSuggestionResponseCopyWithImpl(this._self, this._then);

  final CardSuggestionResponse _self;
  final $Res Function(CardSuggestionResponse) _then;

/// Create a copy of CardSuggestionResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? section = null,Object? synergyReason = null,Object? cardId = null,Object? type = null,Object? imageUrl = freezed,}) {
  return _then(_self.copyWith(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,section: null == section ? _self.section : section // ignore: cast_nullable_to_non_nullable
as String,synergyReason: null == synergyReason ? _self.synergyReason : synergyReason // ignore: cast_nullable_to_non_nullable
as String,cardId: null == cardId ? _self.cardId : cardId // ignore: cast_nullable_to_non_nullable
as int,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [CardSuggestionResponse].
extension CardSuggestionResponsePatterns on CardSuggestionResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CardSuggestionResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CardSuggestionResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CardSuggestionResponse value)  $default,){
final _that = this;
switch (_that) {
case _CardSuggestionResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CardSuggestionResponse value)?  $default,){
final _that = this;
switch (_that) {
case _CardSuggestionResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  String section,  String synergyReason,  int cardId,  String type,  String? imageUrl)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CardSuggestionResponse() when $default != null:
return $default(_that.name,_that.section,_that.synergyReason,_that.cardId,_that.type,_that.imageUrl);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  String section,  String synergyReason,  int cardId,  String type,  String? imageUrl)  $default,) {final _that = this;
switch (_that) {
case _CardSuggestionResponse():
return $default(_that.name,_that.section,_that.synergyReason,_that.cardId,_that.type,_that.imageUrl);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  String section,  String synergyReason,  int cardId,  String type,  String? imageUrl)?  $default,) {final _that = this;
switch (_that) {
case _CardSuggestionResponse() when $default != null:
return $default(_that.name,_that.section,_that.synergyReason,_that.cardId,_that.type,_that.imageUrl);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CardSuggestionResponse implements CardSuggestionResponse {
  const _CardSuggestionResponse({required this.name, required this.section, required this.synergyReason, required this.cardId, required this.type, this.imageUrl});
  factory _CardSuggestionResponse.fromJson(Map<String, dynamic> json) => _$CardSuggestionResponseFromJson(json);

/// Name of the card.
@override final  String name;
/// Recommended placement section (MAIN, EXTRA, or SIDE).
@override final  String section;
/// AI-generated text outlining synergy reasonings.
@override final  String synergyReason;
/// Resolved database Card ID.
@override final  int cardId;
/// Classification type of the recommended card.
@override final  String type;
/// Image URL path pointing to card artwork.
@override final  String? imageUrl;

/// Create a copy of CardSuggestionResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CardSuggestionResponseCopyWith<_CardSuggestionResponse> get copyWith => __$CardSuggestionResponseCopyWithImpl<_CardSuggestionResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CardSuggestionResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CardSuggestionResponse&&(identical(other.name, name) || other.name == name)&&(identical(other.section, section) || other.section == section)&&(identical(other.synergyReason, synergyReason) || other.synergyReason == synergyReason)&&(identical(other.cardId, cardId) || other.cardId == cardId)&&(identical(other.type, type) || other.type == type)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,section,synergyReason,cardId,type,imageUrl);

@override
String toString() {
  return 'CardSuggestionResponse(name: $name, section: $section, synergyReason: $synergyReason, cardId: $cardId, type: $type, imageUrl: $imageUrl)';
}


}

/// @nodoc
abstract mixin class _$CardSuggestionResponseCopyWith<$Res> implements $CardSuggestionResponseCopyWith<$Res> {
  factory _$CardSuggestionResponseCopyWith(_CardSuggestionResponse value, $Res Function(_CardSuggestionResponse) _then) = __$CardSuggestionResponseCopyWithImpl;
@override @useResult
$Res call({
 String name, String section, String synergyReason, int cardId, String type, String? imageUrl
});




}
/// @nodoc
class __$CardSuggestionResponseCopyWithImpl<$Res>
    implements _$CardSuggestionResponseCopyWith<$Res> {
  __$CardSuggestionResponseCopyWithImpl(this._self, this._then);

  final _CardSuggestionResponse _self;
  final $Res Function(_CardSuggestionResponse) _then;

/// Create a copy of CardSuggestionResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? section = null,Object? synergyReason = null,Object? cardId = null,Object? type = null,Object? imageUrl = freezed,}) {
  return _then(_CardSuggestionResponse(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,section: null == section ? _self.section : section // ignore: cast_nullable_to_non_nullable
as String,synergyReason: null == synergyReason ? _self.synergyReason : synergyReason // ignore: cast_nullable_to_non_nullable
as String,cardId: null == cardId ? _self.cardId : cardId // ignore: cast_nullable_to_non_nullable
as int,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
