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
            .get('webapi/UserCartAPI/CheckOut?cartId='+cartId+'&businessStoreId='+businessStoreId+'&BusinessID='+BusinessID+'&ProductID='+ProductID+'&userId='+$rootScope.userDetails.userId, {})
            .then(function(res) {
                loading.stop();
                return res.data.Data;
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

    .controller('ShoppingCartController', function ($scope, $state,  active_controller, $ionicPlatform, refreshTest, $rootScope, businessVisit, cart_functions, productDetailFactory, popUp, ajaxCall, payment, $window) {
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
                .checkout($scope.cart.data.CartId, $scope.cart.data.BusinessStoreId, $state.params.businessId, $scope.cart.data.UserCartDetails[0].ProductId)
                .then(function (res) {
                    $scope.cart.checkout_data = res;
                    console.log($scope.cart.checkout_data);
                });
            }
            , payment : function(paymentMethod) {
                /*
                paymentMethod : 1 = paystack, 2 = gtbank
                 */

                if(paymentMethod == 1) {
                    // PAYSTACK
                    payment
                    .get_paystack_reference()
                    .then(function(referenceId) {

                        var handler = PaystackPop.setup({
                            key      : 'pk_test_08bb2ccce7b8084d4d3f1daee5b849771ce5ce53',
                            email    : $rootScope.userDetails.Email,
                            amount   : $scope.cart.checkout_data.SubTotal,
                            ref      : referenceId,
                            callback : function(response) {
                                // response = Object {trxref: "1466954710"}
                                loading.start();
                                payment
                                .get_paystack_response(response.trxref)
                                .then(function(callBackdata) {
                                    console.log(callBackdata);
                                    var paystack_authorization_code = callBackdata.data.authorization.authorization_code
                                    , paystack_bank                 = callBackdata.data.authorization.bank
                                    , paystack_card_type            = callBackdata.data.authorization.card_type
                                    , paystack_channel              = callBackdata.data.authorization.channel
                                    , paystack_last4                = callBackdata.data.authorization.last4
                                    , paystack_message              = callBackdata.message
                                    , input                         = {
                                        BusinessId               : $state.params.businessId
                                        , ProductId              : $scope.cart.data.UserCartDetails[0].ProductId
                                        , CartId                 : $scope.cart.data.CartId
                                        , BusinessStoreId        : $scope.cart.data.BusinessStoreId
                                        , Paymentmethod          : 1 // ?
                                        , TransactionReferenceNo : referenceId
                                        , PayAmount              : $scope.cart.checkout_data.SubTotal
                                        , PaystackAuthCode       : paystack_authorization_code
                                        , PaystackCardType       : paystack_card_type
                                        , PaystackCCLastFour     : paystack_last4
                                        , PaystackChannel        : paystack_channel
                                        , PaystackMessage        : paystack_message
                                        , userId                 : $rootScope.userDetails.userId
                                    };

                                    // INSERT PAYMENT.
                                    $scope.cart
                                    .after_payment_checkout(input)
                                    .then(function(payment_res) {
                                        console.log(payment_res);
                                    });


                                    /*popUp
                                    .msgPopUp('Paystack verification successful.', 1);*/
                                });
                                loading.stop();
                                // alert('success. transaction ref is ' + response.trxref);
                            },
                            onClose  : function(){
                                console.log('window closed');
                            }
                        });
                        handler.openIframe();
                    });
                } else {
                    // GTBANK
                    gtBank.post_request();

                    // GETTING CALLBACK 
                    $window
                    .gtBank_custom
                    .output(function (res) {
                        // res.url = http://localhost:8100/gtOauth.html?gtpay_tranx_id=2851de60-c3f7-439e-b953-7f12770825fa&gtpay_tranx_status_code=00&gtpay_tranx_curr=NGN&gtpay_tranx_status_msg=Approved%20by%20Financial%20Institution&gtpay_tranx_amt=40.00&gtpay_cust_id=263&gtpay_echo_data={%20redirectUrl%20:%20%22http://localhost:8100/gtOauth.html%22,%20other_data%20:%20%22%22%20}&site_redirect_url=http://localhost/ionic/gtPay.php&gtpay_gway_name=webpay&gtpay_tranx_hash=03AFDB1C62167A2ECEBDE1D2B419CDD1F8D6D3C5F8ED4E8BD00C47203E327B2AC81D34AFD2CD22672825FE0B1BDFCE489CF83D1D3D66A57DE2B66CDA0CB29580&gtpay_verification_hash=62F917F24E2724E591B7D6F9E4B2128093B1C12C6372F785287A1487A265752B7762B379EA4EE1CF29B6C2CDAF1649335FD7BB19A0D4E8C3135F83A3E380F1EE&gtpay_full_verification_hash=47D6FBD786D854E2DCD5C022ECDF9CA16E0D3622CD4467A308EE434C821526AE0C7A4EDDAA964311CF170D1C8479A762AC53DE3A2FB48EF7AA8FDB737C62600E&gtpay_tranx_amt_small_denom=4000
                        console.log(res.url);
                        var obj = gtBank.parseQueryString(res.url)
                        , input = {
                            BusinessId                  : $state.params.businessId
                            , ProductId                 : $scope.cart.data.UserCartDetails[0].ProductId
                            , CartId                    : $scope.cart.data.CartId
                            , BusinessStoreId           : $scope.cart.data.BusinessStoreId
                            , Paymentmethod             : 2 // ?
                            , TransactionReferenceNo    : obj.gtpay_tranx_id
                            , PayAmount                 : obj.gtpay_tranx_amt
                            , PaystackAuthCode          : null
                            , PaystackCardType          : null
                            , PaystackCCLastFour        : null
                            , PaystackChannel           : null
                            , PaystackMessage           : null
                            , userId                    : $rootScope.userDetails.userId
                            , GTPaygwayname             : obj.gtpay_gway_name
                            , GTPaytranshash            : obj.gtpay_tranx_hash
                            , GTPayverificationhash     : gtpay_verification_hash
                            , GtPayfullverificationhash : obj.gtpay_full_verification_hash
                        };
                        console.log(obj);
                        return 0;
                        // INSERT PAYMENT.
                        $scope.cart
                        .after_payment_checkout(input)
                        .then(function(payment_res) {
                            console.log(payment_res);
                        });
                    });
                }
            }
            // UserCheckOut(Post): Parameters – [BusinessId, ProductId, CartId, BusinessStoreId, Paymentmethod, TransactionReferenceNo, PayAmount, PaystackAuthCode, PaystackCardType, PaystackCCLastFour, PaystackChannel, PaystackMessage, userId]
            , after_payment_checkout : function(input) {
                return ajaxCall
                .post('webapi/UserCartAPI/UserCheckOut', input)
                .then(function(res) {
                    return res;
                });
            }
            , ChangeAddress : function() {
                return 0;
            }
            /**
             * This function is here because in "UserCartAPI/GetUserCartByBusinessId" some of the data is comming in 'UserCartDetailPromos' and some in 'UserCartDetails'.
             */
            , UserCartDetails_data : function(key) {
                return $scope.cart.data.UserCartDetailPromos[key]
            }
        };

        /*
        Start : gtBank methods
         */
        var context       = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))
        , baseUrl         = baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context
        , oauthUrl        = baseUrl + '/gtOauth.html';

        // HashCode
        var getSha512Hash    = "",
        gtpay_mert_id        = "4994",
        gtpay_tranx_id       = payment.get_paystack_reference_no_promise(),
        gtpay_tranx_amt      = "4000", // amt in kodo
        gtpay_tranx_curr     = "566",
        gtpay_cust_id        = $rootScope.userDetails.userId,
        gtpay_tranx_noti_url = "http://localhost/ionic/gtPay.php",
        hashkey              = "D3D1D05AFE42AD50818167EAC73C109168A0F108F32645C8B59E897FA930DA44F9230910DAC9E20641823799A107A02068F7BC0F4CC41D2952E249552255710F",
        // [gtpay_mert_id,gtpay_tranx_id,gtpay_tranx_amt,gtpay_tranx_curr,gtpay_cust_id,gtpay_tranx_noti_url,hashkey]
        HashCode             = gtpay_mert_id + gtpay_tranx_id + gtpay_tranx_amt + gtpay_tranx_curr + gtpay_cust_id + gtpay_tranx_noti_url + hashkey;
        
        $scope.gtbank = {
            oauthUrl             : gtpay_tranx_noti_url,
            gtpay_mert_id        : gtpay_mert_id,
            gtpay_tranx_id       : gtpay_tranx_id,
            gtpay_tranx_amt      : gtpay_tranx_amt,
            gtpay_tranx_curr     : gtpay_tranx_curr,
            gtpay_cust_id        : gtpay_cust_id,
            gtpay_tranx_noti_url : gtpay_tranx_noti_url
        };
        function loginWindow_loadStartHandler(event) {
            console.log(event.url);
        }
        // Inappbrowser exit handler: Used when running in Cordova only
        function loginWindow_exitHandler() {
            console.log('exit and remove listeners');
            // Handle the situation where the user closes the login window manually before completing the login process
            if (loginCallback && !loginProcessed) loginCallback({status: 'user_cancelled'});
            loginWindow.removeEventListener('loadstop', loginWindow_loadStopHandler);
            loginWindow.removeEventListener('exit', loginWindow_exitHandler);
            loginWindow = null;
            console.log('done removing listeners');
        }
        var gtBank = {
            post_request : function() {
                loginWindow = window.open('', 'TheWindow');
                document.getElementById('TheForm').submit();
                loginWindow.addEventListener('loadstart', loginWindow_loadStartHandler);
                loginWindow.addEventListener('exit', loginWindow_exitHandler);
            }
            // getShaCode(Post): Parameters – [HasCode]
            , getShaCode : function(hash_code) {
                return ajaxCall
                .get('webapi/UserCartAPI/getShaCode', {
                    HashCode : hash_code
                })
                .then(function(hash_code_res) {
                    $scope.gtbank.HashCode = hash_code_res.data.Data;
                });
            }
            , parseQueryString : function(queryString) {
                queryString = queryString.substring(35); // removing url from starting of the string.
                var qs = decodeURIComponent(queryString),
                    obj = {},
                    params = qs.split('&');
                params.forEach(function (param) {
                    var splitter = param.split('=');
                    obj[splitter[0]] = splitter[1];
                });
                return obj;
            }
        }
        gtBank.getShaCode(HashCode);

        // console.log(gtBank.parseQueryString('http://localhost:8100/gtOauth.html?gtpay_tranx_id=2851de60-c3f7-439e-b953-7f12770825fa&gtpay_tranx_status_code=00&gtpay_tranx_curr=NGN&gtpay_tranx_status_msg=Approved%20by%20Financial%20Institution&gtpay_tranx_amt=40.00&gtpay_cust_id=263&gtpay_echo_data={%20redirectUrl%20:%20%22http://localhost:8100/gtOauth.html%22,%20other_data%20:%20%22%22%20}&site_redirect_url=http://localhost/ionic/gtPay.php&gtpay_gway_name=webpay&gtpay_tranx_hash=03AFDB1C62167A2ECEBDE1D2B419CDD1F8D6D3C5F8ED4E8BD00C47203E327B2AC81D34AFD2CD22672825FE0B1BDFCE489CF83D1D3D66A57DE2B66CDA0CB29580&gtpay_verification_hash=62F917F24E2724E591B7D6F9E4B2128093B1C12C6372F785287A1487A265752B7762B379EA4EE1CF29B6C2CDAF1649335FD7BB19A0D4E8C3135F83A3E380F1EE&gtpay_full_verification_hash=47D6FBD786D854E2DCD5C022ECDF9CA16E0D3622CD4467A308EE434C821526AE0C7A4EDDAA964311CF170D1C8479A762AC53DE3A2FB48EF7AA8FDB737C62600E&gtpay_tranx_amt_small_denom=4000'));


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
            // $scope.cart.check_out();
            console.log($scope.cart.data);
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


