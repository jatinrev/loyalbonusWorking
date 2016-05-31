var globaldata = {};

angular.module('LoyalBonus', ['ionic','ionic-rating-stars', 'tabSlideBox','LoyalBonus.services', 'ngCordova', 'angular-carousel', 'ngOpenFB', 'ngMap','ngAnimate','ngTouch'])

.run(function ($ionicPlatform, ngFB, $rootScope, $cordovaPreferences, update_user_details) {

  /*Temp Data*
    $rootScope.userDetails = {
      userId       : 263,
      Email        : 'jatinverma@gmail.com',
      FullName     : 'Jatin',
      userLocation : '6.461573,3.479404'
    }
  /*Temp Data*/
  $ionicPlatform.ready(function () {

    /**Start : checking storage**/
    $cordovaPreferences.fetch('userId', 'dict')
    .success(function(value) {
      console.log(value);
      update_user_details.get( value );
    })
    .error(function(error) {
      
    });
    /***End : checking storage***/

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
 

.run(function ($ionicPlatform, $rootScope, backFunctionality, watchUser) {
  $ionicPlatform.ready(function () {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.userPresent = function () {
    return watchUser.userPresent();
  }

})

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("home/restaurants/");
      // $urlRouterProvider.otherwise("/signin/");

      $stateProvider
      .state("home", {
        url   : "/home/",
        cache : false,
        views : {
          "" : {
            templateUrl  : "components/home/home.html",
            controller   : "HomeController",
            controllerAs : "hc"
          }
        },
        abstract: true
      })
      .state("signin", {
        url   : "/signin/",
        views : {
          "" : {
            templateUrl  : "components/SignIn/signin.html",
            controller   : "SignInController",
            controllerAs : "sc"
          }
        }
      })
      .state("signup", {
        url   : "/signup/",
        views : {
        ""    : {
            templateUrl  : "components/SignUp/signup.html",
            controller   : "SignUpController",
            controllerAs : "suc"
          }
        }
      })
      .state("restpassword", {
        url   : "/restpassword/",
        views : {
          "" : {
            templateUrl  : "components/Resetpassword/rest.html",
            controller   : "RestPasswordController",
            controllerAs : "rpc"
          }
        }

      })
      .state("home.restaurants", {
        url   : "restaurants/:vertical",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Restaurants/restaurants.html",
            controller   : "RestaurantController",
            controllerAs : "rc"
          }
        }

      })
      .state("home.kaseydiner", {
        url   : "kaseydiner/:id",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/KaseyDiner/KaseyDiner.html",
            controller   : "KaseyDinerController",
            controllerAs : "kdc"
          }
        }
      })
      .state("home.success", {
        url   : "success/",
        views : {
          "body": {
            templateUrl  : "components/Success/success.html",
            controller   : "SuccessController",
            controllerAs : "sc"
          }
        }
      })
      .state("home.review", {
        url   : "review/:businessId/:businessImg/:businessRating",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Review/review.html",
            controller   : "ReviewController",
            controllerAs : "rc"
          }
        }
      })
      .state("home.milestones", {
        url   : "milestones/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Milestones/milestones.html",
            controller   : "MileStoneController",
            controllerAs : "msc"
          }
        }
      })
      .state("home.account", {
        url   : "account/",
        views : {
          "body": {
            templateUrl  : "components/Account/account.html",
            controller   : "AccountController",
            controllerAs : "acc"
          }
        }
      })
      .state("home.membership", {
        url   : "membership/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Membership/membership.html",
            controller   : "MemberController",
            controllerAs : "mc"
          }
        }
      })
      .state("home.map", {
        url   : "map/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Map/map.html",
            controller   : "MapController",
            controllerAs : "mpc"
         }
        }
      })
      .state("home.aboutus", {
        url   : "aboutus/",
        views : {
          "body": {
            templateUrl  : "components/Aboutus/aboutus.html",
            controller   : "AboutusController",
            controllerAs : "ac"
          }
        }
      })
      .state("home.businessmap", {
        url   : "businessmap/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Businessmap/businessmap.html",
            controller   : "BusinessController",
            controllerAs : "bc"
          }
        }
      })
      .state("home.invite", {
        url   : "invitefriend/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Invitefriend/invitefriend.html",
            controller   : "InviteController",
            controllerAs : "ic"
          }
        }
      })
      .state("home.shoppingcart", {
        url   : "shoppingcart/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Shoppingcart/shoppingcart.html",
            controller   : "ShoppingCartController",
            controllerAs : "scc"
          }
        }
      })
      .state("home.product", {
        url   : "product/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Product/product.html",
            controller   : "ProductController",
            controllerAs : "pc"
          }
        }
      })
      .state("home.cart", {
        url   : "cart/",
        cache : false,
        views : {
          "body": {
            templateUrl  : "components/Cart/cart.html",
            controller   : "CartController",
            controllerAs : "cc"
          }
        }
      })

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
]);


