angular.module('LoyalBonus')

.controller('HomeController', function ($scope, $ionicSideMenuDelegate, $ionicHistory, $state, $rootScope, active_controller, $ionicHistory,
                                        backFunctionality, get_business_data) {
  var previousState       = '';
  var previousStateParams = '';
  $rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams, options) {
    previousState       = fromState.name;
    previousStateParams = fromParams;
    // $state.go(fromState.name, fromParams);
  });

  $scope.home_var = {};

  

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.toggleRight = function () {
    $ionicSideMenuDelegate.toggleRight();
  };



  $scope.goBackHandler = function() {
    backFunctionality.one_step_back();
    // $state.go(previousState, previousStateParams);
  };

  $rootScope.goSearchHandler = function() {
    $rootScope.showMe = !$rootScope.showMe;
  }

  $scope.signOut = function() {
    // console.log('helllooooo');
  	$rootScope.userDeatils = {};
    window.localStorage.removeItem('userId');
    $state.go("signin");
  };

  $scope.home_var.magnifyOrBack = function () {
    return active_controller.get();
  };

  /*****Start : Home Heading Setting*****/
  $scope.home_var.homeheading = {};
  $scope.home_var.homeheading.text = function () {
    // remember to string length here
    if( get_business_data.getSearchKeyword() != '' ) {
      return get_business_data.getSearchKeyword();
    }
    return '';
  };
  $scope.home_var.homeheading.Visibility = function () {
    if( get_business_data.getSearchKeyword() != '' ) {
      return true;
    } else {
      return false;
    }
  }
  $scope.home_var.homeheading.deleteSearch = function () {
    get_business_data.removeSearchKeyword();
  }
  /******End : Home Heading Setting*******/

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
    },
    home : function() {
      console.log('account_settings');
      $scope.output = 'home';
      $state.go("home.restaurants");
    },
    aboutus : function() {
      console.log('aboutus');
      $scope.output = 'aboutus';
      $state.go("home.aboutus");
    },
    businessmap : function() {
      console.log('businessmap');
      $scope.output = 'businessmap';
      $state.go("home.businessmap");
    },
    myloyalbonus : function () {
      $state.go("home.milestones");
    }
  };

});
