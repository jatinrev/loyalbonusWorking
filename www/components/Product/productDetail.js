angular.module('LoyalBonus')
    .factory('productDetailFactory', function (ajaxCall, $rootScope, loading, $state) {
        function printProductDetail(BusinessId, Productid) {
            //console.log(BusinessId);
            return ajaxCall
                .get('webapi/businessproduct/StoreProductDetails?userId=' + $rootScope.userDetails.userId + '&businessid=' + $state.params.BusinessId + '&Productid=' + $state.params.Productid, {})
                .then(function (responseResult) {
                    //console.log(responseResult.data.Data.BusinessStoreId);
                    return responseResult.data.Data;
                });

        }

        function addCart(Productid, Price, PriceAfterDiscount, BusinessStoreId) {
            loading.start();


            return ajaxCall
                .post('webapi/UserCartAPI/AddItemtoCart',
                {
                    userId: $rootScope.userDetails.userId,
                    Productid: $state.params.Productid,
                    Price: Price,
                    PriceAfterDiscount: PriceAfterDiscount,
                    BusinessStoreId: BusinessStoreId

                }).then(function (cartResult) {
                    console.log(cartResult);
                    //console.log(JSON.parse(cartResult.data.Data));
                    loading.stop();
                    return cartResult.data.Data;

                });
        }
        return {
            printProductDetail: printProductDetail,
            addCart: addCart
        };
    })

    .controller('CartController', function ($scope, refreshTest, $state, ajaxCall, active_controller, $ionicPlatform, productDetailFactory) {

        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };





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
                    var BusinessStoreId = result.BusinessStoreId;
                    var Price = result.Price;
                    var PriceAfterDiscount = result.PriceAfterBusinessDiscount
                    
                    var heading_data_temp = [];
                    $scope.datadeal = result;
                    heading_data_temp = $scope.datadeal.ProductImages;
                    $scope.heading_image = heading_data_temp;


                    $scope.addtoCart = function () {
                        //console.log(newVarible);
                        productDetailFactory
                            .addCart($state.params.Productid, Price, PriceAfterDiscount, BusinessStoreId)
                            .then(function (resultCart) {
                                console.log(resultCart);

                            });
                    }
                    $scope.addtoCart();
                    //console.log($scope.heading_image);
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



       

    });







