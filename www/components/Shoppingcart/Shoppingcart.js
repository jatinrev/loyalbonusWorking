angular.module('LoyalBonus')

    .factory('cart_functions', function (ajaxCall, $rootScope, loading) {

        /*
        THIS FUNCTION IS INCOMPLETE
        ShoppingCart(Post): Parameters – [ cartId, businessStoreId, BusinessID, ProductID, userid].
         */
        function list_cart(businessId) {
            return GetUserCartByBusinessId(businessId)
                   .then(function (res) {
                        console.log('Cart By Business Data');
                        res.BusinessStoreId;
                        res.CartId;
                        console.log(res);
                        return  ajaxCall
                        .post('webapi/UserCartAPI/ShoppingCart', {
                            cartId          : res.CartId,
                            businessStoreId : res.BusinessStoreId,
                            BusinessID      : businessId,
                            ProductID       : 61,
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

        /*
        get all cart data from BUSINESSID
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
                    return error;
                });
        }

        function update_cart(cartDetailId, productId, qty) {
            return ajaxCall
            .post('webapi/UserCartAPI/UpdateQuantityByCartDetailId', {
                cartDetailId : cartDetailId,
                productId    : productId,
                qty          : qty,
                userId       : $rootScope.userDetails.userId
            });
        }

        /*
            UserCartAPI/RemoveItemFromCart(Get): Parameters – [cartDetailId, cartId, businessStoreId, businessId, productId, userId]
            return 1, when product is removed.
         */
        function remove_product(cartDetailId, cartId, businessStoreId, businessId, productId) {
            loading.start();
            return ajaxCall
            .get('webapi/UserCartAPI/RemoveItemFromCart?cartDetailId='+cartDetailId+'&cartId='+cartId+'&businessStoreId='+businessStoreId+'&businessId='+businessId+'&productId='+productId+'&userId='+$rootScope.userDetails.userId, {})
            .then(function(res) {
                loading.start();
                if( res.data.Data.BusinessID == businessId ) {
                    return 1;
                }
            });
        }
        
        return {
            list_cart               : list_cart,
            GetUserCartByBusinessId : GetUserCartByBusinessId,
            update_cart             : update_cart,
            remove_product          : remove_product
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
            quantity_change : function (cartDetailId, productId, qty) {
                cart_functions
                .update_cart(cartDetailId, productId, qty)
                .then(function (res) {

                });
            }
                                        //      1       2             3             4
            , remove_product : function (cartDetailId, cartId, businessStoreId, productId, ArrayKey) {
                cart_functions      //1         2             3                     4               5
                .remove_product(cartDetailId, cartId, businessStoreId, $state.params.businessId, productId)
                .then(function (res) {
                    if(res == 1) {
                        $scope.cart.data.UserCartDetails.splice(ArrayKey, 1);
                        $scope.Test();
                    } else {
                        alert('Unfortunately the product was not removed.');
                    }
                });
            }
        };

        /*
        Listing cart
         *
        cart_functions
        .list_cart($state.params.businessId)
        .then(function(res) {
            console.log(res);
        });

        /*
        THIS IS TO GET BUSINESS DATA.
         */
        businessVisit
        .businessDetail( $state.params.businessId, $rootScope.userDetails.userId )
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


