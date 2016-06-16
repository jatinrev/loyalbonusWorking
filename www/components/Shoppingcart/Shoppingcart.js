angular.module('LoyalBonus')

    .factory('cart_functions', function (ajaxCall, $rootScope) {

        function list_cart(cartId, businessStoreId, businessId, ProductId) {
            return  ajaxCall
                    .post('webapi/UserCartAPI/ShoppingCart?userid='+$rootScope.userDetails.userId, {
                        cartId          : cartId,
                        businessStoreId : businessStoreId,
                        BusinessID      : businessId,
                        ProductID       : ProductId,
                        userid          : $rootScope.userDetails.userId

                    })
                    .then(function(res) {
                        console.log(res);
                        return res;
                    });
        }
        
        return {
            list_cart : list_cart
        };
    })

    .controller('ShoppingCartController', function ($scope, $state,  active_controller, $ionicPlatform, refreshTest, $rootScope, businessVisit, cart_functions) {
        /*
        business Lising starts : this is comming from kaseyDinner.js
         */
        $scope.businessData = {};
        $scope.cart         = {};
        businessVisit
        .businessDetail( 80, $rootScope.userDetails.userId )
        .then(function (res) {
            $scope.businessData = res.data.Data[0];
        });
       

        /*
        Listing cart products
         */
        cart_functions
        .list_cart('5a72a75d-6c31-4d52-a3df-27233ab03293', 'adf76e03-eaf8-4190-8bd3-b8e9c8ad9d84', 80, 60)
        .then(function (res) {

        });

        $scope.state_on = function () {
            return $state.params.id;
        };

        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }

      
        $scope.isAndroid = ionic.Platform.isAndroid();
       
        active_controller.set('ShoppingCartController');

      

    });


