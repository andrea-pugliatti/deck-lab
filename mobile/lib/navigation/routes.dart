/// Routing definitions.
class AppRoutes {
  AppRoutes._();

  static const String home = '/';
  static const String cards = '/cards';
  static const String login = '/login';
  static const String register = '/register';
  static const String cardDetailPattern = '/cards/:id';

  static String cardDetail(int id) => '/cards/$id';
}
