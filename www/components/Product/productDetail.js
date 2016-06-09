angular.module('LoyalBonus')
    .factory('productDetailFactory', function (ajaxCall,$rootScope,loading) {
        function printProductDetail(BusinessId,ProductId) {
            //console.log(BusinessId);
            return ajaxCall
                .get('webapi/businessproduct/StoreProductDetails?userId=' +$rootScope.userDetails.userId +'&businessid='+BusinessId+'&ProductId=' +ProductId+ {})
                .then(function (responseResult) {
                    return JSON.parse(responseResult.data.Data);
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

        /*$scope.invitelistdetail = function () {
            productDetailFactory
                .printProductDetail($state.params.BusinessId, $state.params.Productid)
                .then(function (result) {
                    console.log(result);
                    $scope.datadeal = result;
                    // console.log($scope.datadeal);
                });
        }
        $scope.invitelistdetail();*/

        /* ------------Ended functionality productDetailFactory------------*/

        /* ------------Started functionality get data from one state to another state------------*/

        function getTest() {
            return ajaxCall
                .get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' +$state.params.BusinessId +'&ProductId=' +$state.params.Productid + {})
                .then(function (resResult) {
                    console.log(resResult);
                    return resResult.data.Data;
                });
        }
        getTest();

        /* ------------Ended functionality get data from one state to another state------------*/


    });







