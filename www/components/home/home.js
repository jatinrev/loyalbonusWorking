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
  $rootScope.goSearchHandler = function() {
    //console.log('heloooooooooo');
        $rootScope.showMe = !$rootScope.showMe;
    }

  $scope.signOut = function() {
    // console.log('helllooooo');
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
      console.log('my_membership');
      $scope.output = 'my_membership';
      $state.go("home.membership");
      // $state.go("home.membership");
    },
    account_settings : function() {
      console.log('account_settings');
      $scope.output = 'accout_settings';
      $state.go("home.account");
    }
  };


});
