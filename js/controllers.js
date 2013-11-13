var app = angular.module('SecretSanta.controllers', ['SecretSanta.services']);

app.controller('LoginController', function($scope, $rootScope, $location) {

  $scope.doLogin = function() {
    Parse.User.logIn($scope.loginUsername, $scope.loginPassword, {
      success: function(user) {
        $scope.$apply(function(){
          $scope.showFamilyMembers();
        });
      },
      error: function(user, error) {
        console.log(error);
      }
    });
  };

  $scope.doSignup = function() {

    var user = new Parse.User();
    user.set("username", $scope.signupUsername);
    user.set("password", $scope.signupPassword);
    user.set("name", $scope.signupName);

    user.signUp(null, {
      success: function(user) {
        $scope.$apply(function(){
          $scope.showFamilyMembers();
        });
      },
      error: function(user, error) {
        console.log(error);
      }
    });

  };

  $scope.showFamilyMembers = function() {
    $rootScope.user = Parse.User.current();
    $location.path('/family');
  };

  // If there is already a user redirect to Profiles
  if ( Parse.User.current() ) {
    $scope.showFamilyMembers();
  }

});

app.controller('FamilyController', function($scope, $location, logout, isValidSession, $rootScope) {

  // Verify that session is valid
  isValidSession();

  $scope.getFamilyMembers = function() {
    var query = new Parse.Query(Parse.User);
    query.ascending("name");
    query.find({
      success: function(members) {
        $scope.$apply(function(){
          $scope.members = members;
        });
      }
    });
  };

  $scope.wishListCount = function() {

    var thisMember = this.member;

    var WishlistItem = Parse.Object.extend("WishListItem");
    var query = new Parse.Query(WishlistItem);
    query.equalTo("member", this.member);
    query.count({
      success: function(count) {
        // The count request succeeded. Show the count
        $scope.$apply(function(){
          thisMember.itemCount = count;
        });
      },
      error: function(error) {
        // The request failed
      }
    });

  };

  $scope.viewWishlist = function() {

    $rootScope.selectedMember = this.member;
    $location.path("/wishlist/" + this.member.id);

  };

});


app.controller('WishListController', function($scope, $rootScope, $location, $routeParams, logout, isValidSession) {

  // Verify that session is valid
  isValidSession();

  $scope.addingItem = false;

  $scope.addItem = function() {
    $scope.addingItem = true;
  };

  $scope.addedItem = function() {

    var WishListItem = Parse.Object.extend("WishListItem");
    var wishListItem = new WishListItem();
     
    wishListItem.set("itemName", $scope.itemName);
    wishListItem.set("itemURL", $scope.itemURL);
    wishListItem.set("member", Parse.User.current());
     
    wishListItem.save(null, {
      success: function(item) {
        // Execute any logic that should take place after the object is saved.
        //alert(item.get('itemName') + ' has been added to your wishlist.');
        $scope.addedItemCleanup();
      },
      error: function(item, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and description.
        alert('Failed to add ' + item.get('itemName') + ' to your wishlist. Please try again.');
      }
    });

  };

  $scope.addedItemCleanup = function() {
    $scope.itemName = null;
    $scope.itemURL = null;
    $scope.addingItem = false;
    $scope.getWishList();
  };

  if(!$rootScope.selectedMember) {
    $location.path('/wishlist');
    return;
  }

  $scope.getWishList = function() {

    var WishlistItem = Parse.Object.extend("WishListItem");
    var query = new Parse.Query(WishlistItem);
    query.equalTo("member", $rootScope.selectedMember);
    query.ascending("itemName");
    query.find({
      success: function(results) {
        $scope.$apply(function(){
          $scope.wishListItems = results;
        });
      },
      error: function(error) {
        console.log(error);
      }
    });

  };

  $scope.deleteItem = function() {

    this.item.destroy({
      success: function(item) {
        // The object was deleted from the Parse Cloud.
        alert(item.get('itemName') + ' has been removed from your wishlist.');
        $scope.getWishList();
      },
      error: function(item, error) {
        // The delete failed.
        // error is a Parse.Error with an error code and description.
        alert('Failed to delete ' + item.get('itemName') + ' from your wishlist. Please try again.');
      }
    });

  };

  $scope.user = Parse.User.current();
  $scope.memberId = $routeParams.familyMemberID;

});

app.controller('NavigationController', function($scope, $rootScope, $location, $routeParams, logout, isValidSession) {

  $rootScope.user = Parse.User.current();

  $scope.doLogout = function() {
    $rootScope.user = null;
    logout();
  };

  $scope.viewWishlist = function() {

    $rootScope.selectedMember = Parse.User.current();
    $location.path("/wishlist/" + Parse.User.current().id);

  };

  $scope.isLoggedIn = function() {
    if (Parse.User.current()) {
      return true;
    } else {
      return false;
    }
  }

});