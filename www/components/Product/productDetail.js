angular.module('LoyalBonus')
    .factory('productDetailFactory', function (ajaxCall, $rootScope, loading, $state) {
        function printProductDetail(BusinessId, Productid) {
            //console.log(BusinessId);
            return ajaxCall
                .get('webapi/businessproduct/StoreProductDetails?userId=' + $rootScope.userDetails.userId + '&businessid=' + $state.params.BusinessId + '&Productid=' + $state.params.Productid, {})
                .then(function (responseResult) {
                    return responseResult.data.Data;
                });
        }
        return {
            printProductDetail: printProductDetail
        };
    })

    .controller('CartController', function ($scope, refreshTest, $state, ajaxCall, active_controller, $ionicPlatform, productDetailFactory) {
        /*$scope.slides = [
            { image: 'img/img00.jpg', description: 'Image 00' },
            { image: 'img/img01.jpg', description: 'Image 01' },
            { image: 'img/img02.jpg', description: 'Image 02' },
            { image: 'img/img03.jpg', description: 'Image 03' },
            { image: 'img/img04.jpg', description: 'Image 04' }
        ];*/
       


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
                    console.log(result);
                    var heading_data_temp = [];
                    $scope.datadeal = result;
                    heading_data_temp = $scope.datadeal.ProductImages;
                    $scope.heading_image = heading_data_temp;
                    console.log($scope.heading_image);
                });
            $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.heading_image.length - 1) ? ++$scope.currentIndex : 0;
            //alert('Right click');
            console.log($scope.currentIndex);
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? -- $scope.currentIndex : $scope.heading_image.length - 1;
            //alert('left click');
            console.log($scope.currentIndex);
        };
        }
        $scope.invitelistdetail();

        /* ------------Ended functionality productDetailFactory------------*/
    });







