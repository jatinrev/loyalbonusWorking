angular.module('LoyalBonus')

    .factory('cart_functions', function (ajaxCall, $rootScope, loading) {

        /*
        THIS FUNCTION IS INCOMPLETE
         */
        function list_cart(businessId) {
            return GetUserCartByBusinessId(businessId)
                   .then(function (res) {
                        console.log(res);
                        return  ajaxCall
                        .post('webapi/UserCartAPI/ShoppingCart?userid='+$rootScope.userDetails.userId, {
                            cartId          : res.CartId,
                            businessStoreId : res.BusinessStoreId,
                            BusinessID      : businessId,
                            ProductID       : ProductId,
                            userid          : $rootScope.userDetails.userId

                        })
                        .then(function(res) {
                            console.log(res);
                            return res;
                        });
                   }, function (error) {
                        console.log(error);
                   });
        }

        function update_cart() {
            var data = $.param({
                firstName: 'jatin',
                lastName: 'verma'
            });
            return ajaxCall
            .put('http://localhost/jatinTest/', 'lalal')
            .then(function (res) {
                console.log('success');
                console.log(res);
                return res;
            }, function (error) {
                console.log(error);
            });
        }

        /*
        get cart data from BUSINESSID
         */
        function GetUserCartByBusinessId(businessId) {
            loading.start();
            return ajaxCall
                .get('webapi/UserCartAPI/GetUserCartByBusinessId?businessId='+businessId+'&userId='+$rootScope.userDetails.userId, {})
                .then(function (res) {
                    loading.stop();
                    return res.data.Data;
                }, function (error) {
                    loading.stop();
                    console.log(error);
                    return error;
                });
        }
        
        return {
            list_cart               : list_cart,
            GetUserCartByBusinessId : GetUserCartByBusinessId,
            update_cart             : update_cart
        };
    })

    .controller('ShoppingCartController', function ($scope, $state,  active_controller, $ionicPlatform, refreshTest, $rootScope, businessVisit, cart_functions, productDetailFactory) {
        /*
        business Lising starts : this is comming from kaseyDinner.js
         */
        $scope.businessData = {};
        $scope.cart         = {
            /**
             * To change quantity of the product.
             */
            quantity_change : function (productQuantity, key) {
                cart_functions
                .update_cart()
                .then(function (res) {
                    // console.log();
                });
            }
        };

        /*
        THIS IS TO GET BUSINESS DATA.
         */
        businessVisit
        .businessDetail( 80, $rootScope.userDetails.userId )
        .then(function (res) {
            $scope.businessData = res.data.Data[0];
        });

        /*
        Listing cart products
         */
        cart_functions
        .GetUserCartByBusinessId($state.params.businessId)
        .then(function (res) {
            $scope.cart.data = res;
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


