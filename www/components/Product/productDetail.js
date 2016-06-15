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

    .controller('CartController', function ($scope, showRating,refreshTest, $state, ajaxCall, active_controller, $ionicPlatform, productDetailFactory, businessVisit, $rootScope, watchUser, popUp) {
        
        $scope.helperFunction = {};
        $scope.businessData   = {};
        
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
                            .addCart(+$state.params.Productid, Price, PriceAfterDiscount, BusinessStoreId);
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
           return showRating.showRatingImages(newNumber);;
        }


    });







