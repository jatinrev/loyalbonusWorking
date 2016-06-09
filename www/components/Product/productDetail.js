angular.module('LoyalBonus')
    .factory('productDetailFactory', function (ajaxCall,$rootScope,loading, $state) {
        function printProductDetail(BusinessId,Productid) {
            //console.log(BusinessId);
            return ajaxCall
                .get('webapi/businessproduct/StoreProductDetails?userId=' +$rootScope.userDetails.userId +'&businessid='+$state.params.BusinessId+'&Productid=' +$state.params.Productid, {})
                .then(function (responseResult) {
                    return responseResult.data.Data;
                });
        }
        return {
            printProductDetail: printProductDetail
        };
    })

    .controller('CartController', function ($scope, $state, ajaxCall,active_controller, $ionicPlatform,productDetailFactory) {
        $scope.slides = [
            { image: 'img/img00.jpg', description: 'Image 00' },
            { image: 'img/img01.jpg', description: 'Image 01' },
            { image: 'img/img02.jpg', description: 'Image 02' },
            { image: 'img/img03.jpg', description: 'Image 03' },
            { image: 'img/img04.jpg', description: 'Image 04' }
        ];
        $scope.hoverIn = function () {


        };

        $scope.hoverOut = function () {


        };


        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };



        $scope.Test = function () {
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
                    $scope.datadeal = result;
                    // console.log($scope.datadeal);
                });
        }
        $scope.invitelistdetail();

        /* ------------Ended functionality productDetailFactory------------*/
    });







