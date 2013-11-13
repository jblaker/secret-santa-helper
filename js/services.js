angular.module('SecretSanta.services', [], function($provide) {

  $provide.factory('logout', ['$rootScope', '$location', function($rootScope, $location) {
    return function() {
      Parse.User.logOut();
      $location.path('/');
    }
  }]);

  $provide.factory('isValidSession', ['$rootScope', '$location', function($rootScope, $location) {
    return function() {
      if ( !Parse.User.current() ) {
        $location.path('/');
      }
    }
  }]);

});