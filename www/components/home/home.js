angular.module('LoyalBonus')
.controller('HomeController', function ($scope, $ionicSideMenuDelegate, $ionicHistory, $state, $rootScope, active_controller, $ionicHistory,backFunctionality, get_business_data,$ionicViewService, saveData, watchUser
  , get_business_data_map,refreshTest ) {



  $scope.home_var = {
    // userPresent => return 1 when user is present.
    userPresent : function () {
      return watchUser.userPresent();
    }
  };

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
    
    
    //$rootScope.doRefresh();
  }
  $rootScope.gotextHandler = function() {
    $rootScope.showMe = !$rootScope.showMe; //this is for search textbox.
    //$rootScope.doRefresh();
  }

 

  $scope.signOut = function() {
    // console.log('helllooooo');
  	$rootScope.userDeatils = {};
    window.localStorage.removeItem('userId');
    $state.go("signin");
  };
  $scope.signOut = function() {
    // console.log('helllooooo');
    $rootScope.userDeatils = {};
    window.localStorage.removeItem('userId');
    $state.go("signup");
  };
  $scope.signin = function() {
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
      //console.log(get_business_data.getSearchKeyword);
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

 $scope.ShowHide = true;
$scope.home_var.homesearch = {};
$scope.home_var.homesearch.setValue = function(input){

  get_business_data.setKewordSearch(input);

  //console.log(input);
  get_business_data.setKewordSearch(input);
  $rootScope.showMe = false;
  refreshTest.showrefreshtest($state.current.name, $state.params);

};


$scope.home_var.kaseyDinnerHeading = {
    text : function () {
      var KaseyDinnerBusinessName = saveData.get('kaseyDinnerBusinessName');
      if( typeof(KaseyDinnerBusinessName) != 'undefined' && KaseyDinnerBusinessName != '' ) {
        return KaseyDinnerBusinessName; // data is present
      }
      return '';
    }
  }

  $scope.home_var.businessMap = {
    text : function() {
      var businessMap = get_business_data_map.getSearchKeyword();
      //console.log(businessMap);
      if( typeof(businessMap) != 'undefined' && businessMap != '' ) {
        return businessMap; // data is present
      }
      return '';
    }
  }

  $rootScope.showPopup = function (msg) {
      $scope.data = {}

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
          /* template:'<i class="icon-gift"></i>',*/
          title: '<img src="img/bonus.png"> Bonus',

          subTitle: msg,
          scope: $scope,
          buttons: [
              { text: 'Cancel', type: 'button-positive' }

          ]
      });
      myPopup.then(function (res) {
          console.log('Tapped!', res);
      });
      $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
  };
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
      console.log('home');
      $scope.output = 'home';
      $state.go('home.restaurants', { vertical: "1"});
    },
    aboutus : function() {
      console.log('aboutus');
      $scope.output = 'aboutus';
      $state.go("home.aboutus");
    },
    map : function() {
      console.log('Map View');
      $scope.output = 'map_view';
      $state.go("home.businessmap");
    },
    myloyalbonus : function () {
      $state.go("home.milestones");
    }
  };

});
