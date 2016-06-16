angular.module('LoyalBonus')
    .factory('productDetailFactory', function (ajaxCall, $rootScope, loading, $state) {
        function printProductDetail(BusinessId, Productid) {
            //console.log(BusinessId);
            return ajaxCall
                .get('webapi/businessproduct/StoreProductDetails?userId=' + $rootScope.userDetails.userId + '&BusinessID=' + $state.params.BusinessId + '&ProductID=' + $state.params.Productid, {})
                .then(function (responseResult) {
                    //console.log(responseResult.data.Data.BusinessStoreId);
                    return responseResult.data.Data;
                });
        }

        function addCart(Productid, Price, PriceAfterDiscount, BusinessStoreId) {
            loading.start();
            return ajaxCall
                .post('webapi/UserCartAPI/AddItemtoCart?userId='+$rootScope.userDetails.userId,
                {
                    userId             : $rootScope.userDetails.userId,
                    ProductId          : Productid,
                    Price              : Price,
                    PriceAfterDiscount : PriceAfterDiscount,
                    BusinessStoreId    : BusinessStoreId

                }).then(function (cartResult) {                    //console.log(JSON.parse(cartResult.data.Data));
                    loading.stop();
                    return cartResult.data.Data;
                });
        }
        return {
            printProductDetail : printProductDetail,
            addCart            : addCart
        };
    })

    .controller('CartController', function ($scope, showRating,refreshTest, $state, ajaxCall, active_controller, $ionicPlatform, productDetailFactory, businessVisit, $rootScope, watchUser, popUp, $cordovaSocialSharing, loading) {
        
        $scope.helperFunction = {};
        $scope.businessData   = {};
        $scope.product_detail = {
            share_twitter  : function () {
                document.addEventListener("deviceready", function () {
                    loading.start();
                    $cordovaSocialSharing
                    .shareViaTwitter('Hey check this out ', globaldata.prefix+'assets/img/logo-w-o-text.png', globaldata.prefix+'Business/StoreProductDetails?businessid='+$state.params.BusinessId+'&productid='+$state.params.Productid)
                    .then(function (res) {
                        loading.stop();
                    }, function (error) {
                        popUp
                        .msgPopUp('Please install Twitter app.');
                        loading.stop();
                    });
                }, false);
            },
            share_facebook : function () {
                document.addEventListener("deviceready", function () {
                    loading.start();
                    $cordovaSocialSharing
                    .shareViaFacebook('Hey check this out ', globaldata.prefix+'assets/img/logo-w-o-text.png', globaldata.prefix+'Business/StoreProductDetails?businessid='+$state.params.BusinessId+'&productid='+$state.params.Productid)
                    .then(function (res) {
                        loading.stop();
                    }, function (error) {
                        popUp
                            .msgPopUp('Please install Facebook app.');
                        loading.stop();
                    });
                }, false);
            },
            share_google   : function () {
                document.addEventListener("deviceready", function () {
                    $cordovaSocialSharing
                    .shareVia("gm", 'Hey check this out', 'Loyalbonus', 'www/img/logo.png', globaldata.prefix+'Business/StoreProductDetails?businessid='+$state.params.BusinessId+'&productid='+$state.params.Productid)
                    .then(function (res) {
                        console.log('res output:');
                        console.log(res);
                    }, function (error) {
                        popUp
                            .msgPopUp('Please install Gmail app.');
                    });
                }, false);
            }
        };
        
        $scope.direction      = 'left';
        $scope.currentIndex   = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };



        /*
        business Lising starts : this is comming from kaseyDinner.js
         */
        businessVisit
        .businessDetail( $state.params.BusinessId, $rootScope.userDetails.userId )
        .then(function (res) {
            $scope.businessData = res.data.Data[0];
        });


        $scope.Test = function () {
            //console.log(refreshTest.showrefreshtest($state.current.name, $state.params));
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }
        $scope.isAndroid = ionic.Platform.isAndroid();

        active_controller.set('CartController');

        /* ------------started functionality productDetailFactory-----------*/

        $scope.invitelistdetail = function () {
            productDetailFactory
                .printProductDetail($state.params.BusinessId, $state.params.Productid)
                .then(function (result) {
                    //console.log(result);
                    var BusinessStoreId    = result.BusinessStoreId;
                    var Price              = result.Price;
                    var PriceAfterDiscount = result.PriceAfterBusinessDiscount
                    
                    var heading_data_temp  = [];
                    $scope.datadeal        = result;
                    heading_data_temp      = $scope.datadeal.ProductImages;
                    $scope.heading_image   = heading_data_temp;


                    $scope.addtoCart = function () {
                        if( watchUser.userPresent() == 1 ) {
                            productDetailFactory
                            .addCart(+$state.params.Productid, Price, PriceAfterDiscount, BusinessStoreId)
                            .then(function (res) {
                                if( +res.$id > 0 ) {
                                    popUp
                                    .msgPopUp('Item Added to Cart.', 1);
                                } else {
                                    popUp
                                    .msgPopUp('Item was not added to Cart.');
                                }
                            });
                        } else {
                            popUp
                            .msgPopUp('You can not add product without login.');
                        }
                    }
                });
            $scope.prevSlide = function () {
                $scope.direction = 'left';
                $scope.currentIndex = ($scope.currentIndex < $scope.heading_image.length - 1) ? ++$scope.currentIndex : 0;
                //alert('Right click');
                //console.log($scope.currentIndex);
            };

            $scope.nextSlide = function () {
                $scope.direction = 'right';
                $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.heading_image.length - 1;
                //alert('left click');
                //console.log($scope.currentIndex);
            };
        }
        $scope.invitelistdetail();

        /* ------------Ended functionality productDetailFactory------------*/

        $scope.helperFunction.reviews = function (newNumber) {
           return showRating.showRatingImages(newNumber);
        }


    });







