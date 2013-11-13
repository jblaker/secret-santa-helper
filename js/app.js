Parse.initialize("", "");

angular.module('SecretSanta', ['SecretSanta.controllers']).config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/login.html', controller: 'LoginController'}).
      when('/family', {templateUrl: 'partials/family.html', controller: 'FamilyController'}).
      when('/wishlist/:familyMemberID', {templateUrl: 'partials/wish-list.html', controller: 'WishListController'}).
      otherwise({redirectTo: '/'});
}]);