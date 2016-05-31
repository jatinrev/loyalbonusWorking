angular.module('LoyalBonus')
    .controller('CartController', function ($scope, $state, active_controller, $ionicPlatform) {
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




        $scope.state_on = function () {
            return $state.params.id;
        };



        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }
        $scope.isAndroid = ionic.Platform.isAndroid();

        active_controller.set('CartController');
    });







