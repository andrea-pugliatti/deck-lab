import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/auth/models/auth_response.dart';
import 'package:mobile/data/auth/models/login_request.dart';
import 'package:mobile/data/decks/models/deck_summary_response.dart';
import 'package:mobile/domain/models/page.dart';

void main() {
  group('Model Serialization Tests', () {
    test('LoginRequest serializes to JSON correctly', () {
      const req = LoginRequest(username: 'testuser', password: 'password123');
      final json = req.toJson();

      expect(json['username'], 'testuser');
      expect(json['password'], 'password123');
    });

    test('AuthResponse deserializes from JSON correctly', () {
      final json = {
        'username': 'andrea',
        'accessToken': 'jwt_access_token_xyz',
      };

      final res = AuthResponse.fromJson(json);

      expect(res.username, 'andrea');
      expect(res.accessToken, 'jwt_access_token_xyz');
    });

    test('DeckSummaryResponse deserializes and computes counts correctly', () {
      final json = {
        'id': 42,
        'name': 'Burning Abyss',
        'description': 'Graveyard combo strategy',
        'formatName': 'TCG',
        'creatorUsername': 'dante',
        'updatedAt': '2026-07-10T12:00:00Z',
        'deckCards': [
          {'cardId': 101, 'name': 'Scarm', 'section': 'MAIN', 'quantity': 3},
          {'cardId': 102, 'name': 'Graff', 'section': 'MAIN', 'quantity': 3},
          {'cardId': 103, 'name': 'Dante', 'section': 'EXTRA', 'quantity': 3},
          {'cardId': 104, 'name': 'Cir', 'section': 'SIDE', 'quantity': 3},
        ],
      };

      final res = DeckSummaryResponse.fromJson(json);

      expect(res.id, 42);
      expect(res.name, 'Burning Abyss');
      expect(res.mainDeckCount, 6);
      expect(res.extraDeckCount, 3);
      expect(res.sideDeckCount, 3);
      expect(res.totalCardsCount, 12);
    });

    test('Page generic deserializes flat Spring Boot structure', () {
      final json = {
        'content': [
          {'id': 1, 'name': 'Card A', 'type': 'Normal Monster'},
          {'id': 2, 'name': 'Card B', 'type': 'Spell Card'},
        ],
        'number': 0,
        'size': 2,
        'totalElements': 2,
        'totalPages': 1,
      };

      final page = Page<Map<String, dynamic>>.fromJson(
        json,
        (item) => item as Map<String, dynamic>,
      );

      expect(page.content.length, 2);
      expect(page.content[0]['name'], 'Card A');
      expect(page.number, 0);
      expect(page.totalPages, 1);
    });

    test('Page generic deserializes nested HAL/HATEOAS page metadata', () {
      final json = {
        'content': [
          {'id': 1, 'name': 'Card A'},
        ],
        'page': {'number': 1, 'size': 10, 'totalElements': 15, 'totalPages': 2},
      };

      final page = Page<Map<String, dynamic>>.fromJson(
        json,
        (item) => item as Map<String, dynamic>,
      );

      expect(page.content.length, 1);
      expect(page.number, 1);
      expect(page.size, 10);
      expect(page.totalElements, 15);
      expect(page.totalPages, 2);
    });
  });
}
