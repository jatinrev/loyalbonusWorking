angular.module('LoyalBonus')

.controller('HomeController', function ($scope, $ionicSideMenuDelegate, $ionicHistory, $state, $rootScope, active_controller) {
  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.toggleRight = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.goBackHandler = function() {
    $ionicHistory.goBack();
  };

  $scope.signOut = function() {
    console.log('helllooooo');
  	$rootScope.userDeatils = {};
    window.localStorage.removeItem('userId');
    $state.go("signin");
  };

  $scope.home_var = {};

  $scope.home_var.magnifyOrBack = function () {
    return active_controller.get();
  };

  $scope.redirect_urls = {
    my_membership : function() {
      $scope.output = 'my_membership';
      $state.go("home.membership");
    },
    account_settings : function() {
      $scope.output = 'accout_settings';
      $state.go("home.account");
    }
  };


});
