var globaldata = {};

angular.module('LoyalBonus', ['ionic','ionic-rating-stars', 'LoyalBonus.services', 'ngCordova', 'angular-carousel', 'ngOpenFB'])

.run(function ($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    ngFB.init({appId: '1151061421612372'});
  });
})
.run(function ($ionicPlatform, $rootScope, backFunctionality) {
  $ionicPlatform.ready(function () {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

})





.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      // $urlRouterProvider.otherwise("home/restaurants/");
      $urlRouterProvider.otherwise("/signin/");

      $stateProvider
      .state("home", {
        url: "/home/",
        views: {
          "": {
            templateUrl: "components/home/home.html",
            controller: "HomeController",
            controllerAs: "hc"
          }
        },
        abstract: true
      })
      .state("signin", {
        url: "/signin/",
        views: {
          "": {
            templateUrl: "components/SignIn/signin.html",
            controller: "SignInController",
            controllerAs: "sc"
          }
        }
      })
      .state("signup", {
        url: "/signup/",
        views: {
          "": {
            templateUrl: "components/SignUp/signup.html",
            controller: "SignUpController",
            controllerAs: "suc"
          }
        }
      })
      .state("restpassword", {
        url: "/restpassword/",
        views: {
          "": {
            templateUrl: "components/Resetpassword/rest.html",
            controller: "RestPasswordController",
            controllerAs: "rpc"
          }
        }

      })
      .state("home.restaurants", {
        url: "restaurants/:vertical",
        views: {
          "body": {
            templateUrl: "components/Restaurants/restaurants.html",
            controller: "RestaurantController",
            controllerAs: "rc"
          }
        }

      })
      .state("home.kaseydiner", {
        url: "kaseydiner/:id",
        views: {
          "body": {
            templateUrl: "components/KaseyDiner/KaseyDiner.html",
            controller: "KaseyDinerController",
            controllerAs: "kdc"
          }
        }
      })
      .state("home.success", {
        url: "success/",
        views: {
          "body": {
            templateUrl: "components/Success/success.html",
            controller: "SuccessController",
            controllerAs: "sc"
          }
        }
      })
      .state("home.review", {
        url: "review/",
        views: {
          "body": {
            templateUrl: "components/Review/review.html",
            controller: "ReviewController",
            controllerAs: "rc"
          }
        }
      })
      .state("home.milestones", {
        url: "milestones/",
        views: {
          "body": {
            templateUrl: "components/Milestones/milestones.html",
            controller: "MileStoneController",
            controllerAs: "msc"
          }
        }
      })
      .state("home.account", {
        url: "account/",
        views: {
          "body": {
            templateUrl: "components/Account/account.html",
            controller: "AccountController",
            controllerAs: "acc"
          }
        }
      })
      .state("home.membership", {
        url: "membership/",
        views: {
          "body": {
            templateUrl: "components/Membership/membership.html",
            controller: "MemberController",
            controllerAs: "mc"
          }
        }
      })
      .state("home.map", {
        url: "map/",
        views: {
          "body": {
           templateUrl: "components/Map/map.html",
            controller: "MapController",
          controllerAs: "mpc"
         }
        }
      })
      // .state("home.deal", {
      //   url: "deal/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/deal/deal.html",
      //       controller: "DealController",
      //       controllerAs: "dc"
      //     }
      //   }
      // })

    // .state("home.deal.list", {
    //     url: "list/",
    //     views: {
    //       "body": {
    //         templateUrl: "components/list/list.html",
    //         controller: "ListController",
    //         controllerAs: "lc"
    //       }
    //     }
    //   })
      // .state("home.deal.map", {
      //   url: "map/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/map/map.html",
      //       controller: "MapController",
      //       controllerAs: "mc"
      //     }
      //   }
      // })
      // .state("home.deal.materialise", {
      //   url: "materialise/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/materialise/materialise.html",
      //       controller: "MaterialiseController",
      //       controllerAs: "mc"
      //     }
      //   }
      // })
      // .state("home.deal.materialise.step1", {
      //   url: "step1/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/step1/step1.html",
      //     }
      //   }
      // })
      // .state("home.deal.materialise.step2", {
      //   url: "step2/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/step2/step2.html",
      //     }
      //   }
      // })
      // .state("home.deal.review", {
      //   url: "review/:id",
      //   views: {
      //     "body": {
      //       templateUrl: "components/review/review.html",
      //       controller: "ReviewController",
      //       controllerAs: "rc"
      //     }
      //   }
      // })
      // 
      // .state("home.account", {
      //   url: "account/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/account/account.html",
      //       controller: "AccountController",
      //       controllerAs: "ac"
      //     }
      //   }
      // })
      // .state("home.membership", {
      //   url: "membership/",
      //   views: {
      //     "body": {
      //       templateUrl: "components/membership/membership.html",
      //       controller: "MemberController",
      //       controllerAs: "mc"
      //     }
      //   }
      // });
    }
])
// my custom function
.run (function (update_user_details, $state, $rootScope) {
  /*if( typeof($rootScope.userDetails.userId) == 'undefined' ) {
    $state.go("signin");
  } else if( typeof(window.localStorage['userId']) != 'undefined' && !isNaN(window.localStorage['userId']) ) {
    // updating user data.
    update_user_details.get(window.localStorage['userId']);
  }*/
});
