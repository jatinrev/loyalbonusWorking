angular.module('LoyalBonus')

    .factory('cart_functions', function (ajaxCall, $rootScope, loading, saveData) {

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
                    //UPDATING CART DATA.
                    if( res.data.Data != null ) {
                        saveData
                        .set('business_cart_size', res.data.Data.UserCartDetails.length);
                    }
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
                saveData.set('business_cart_size', +saveData.get('business_cart_size') - 1);

                loading.stop();
                if( res.data.Data.BusinessID == businessId ) {
                    return 1;
                }
            });
        }

        // ApplyPromoCode (Post): Parameters – [CartId, BusinessStoreId, PromoCode,  userId]
        function apply_promo(CartId, BusinessStoreId, PromoCode) {
            loading.start();
            return ajaxCall
            .post('webapi/UserCartAPI/ApplyPromoCode', {
                CartId          : CartId,
                BusinessStoreId : BusinessStoreId,
                PromoCode       : PromoCode,
                userId          : $rootScope.userDetails.userId
            })
            .then(function (res) {
                loading.stop();
                return res;
            });
        }
        
        // CheckOut(Get): Parameters – [cartId, businessStoreId, BusinessID, ProductID, userId].
        // THIS FUNCTION IS INCOMPLETE
        function checkout(cartId, businessStoreId, BusinessID, ProductID) {
            loading.start();
            return ajaxCall
            .get('webapi/UserCartAPI/CheckOut?cartId='+cartId+',businessStoreId='+businessStoreId+',BusinessID='+BusinessID+',ProductID='+ProductID+',userId='+$rootScope.userDetails.userId, {})
            .then(function(res) {
                loading.stop();
                console.log(res);
                return res;
            });
        }

        // getShaCode(Post): Parameters – [HasCode]
        // HasCode : [gtpay_mert_id,gtpay_tranx_id,gtpay_tranx_amt,gtpay_tranx_curr,gtpay_cust_id,gtpay_tranx_noti_url,hashkey]
        function getShaCode() {

            var hashkey = 'D3D1D05AFE42AD50818167EAC73C109168A0F108F32645C8B59E897FA930DA44F9230910DAC9E20641823799A107A02068F7BC0F4CC41D2952E249552255710F'
            , gtpay_mert_id = '4994'
            , gtpay_tranx_id = ''
            , gtpay_cust_id  = $rootScope.userDetails.userId;
            var HasCode = '';
            return  ajaxCall
                    .post('webapi/UserCartAPI/getShaCode', {
                        HasCode : HasCode
                    })
                    .then(function(res) {

                    });
        }

        return {
            list_cart               : list_cart,
            GetUserCartByBusinessId : GetUserCartByBusinessId,
            update_cart             : update_cart,
            remove_product          : remove_product,
            apply_promo             : apply_promo,
            checkout                : checkout
        };
    })

    .controller('ShoppingCartController', function ($scope, $state,  active_controller, $ionicPlatform, refreshTest, $rootScope, businessVisit, cart_functions, productDetailFactory, popUp) {
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
                                        //      1        2            3             4
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
            , apply_promo : function () {
                cart_functions
                .apply_promo($scope.cart.data.CartId, $scope.cart.data.BusinessStoreId, $scope.cart.promo)
                .then(function(res) {
                    if(res.data.Data.success == false) {
                        popUp
                        .msgPopUp( res.data.Data.result, 0);
                    }
                });
            }
            , check_out : function() {
                cart_functions
                .checkout($scope.cart.data.CartId, $scope.cart.data.BusinessStoreId, $state.params.businessId, ProductID)
                .then(function (res) {

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


