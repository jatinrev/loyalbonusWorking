angular.module('LoyalBonus')

    

    .controller('ShoppingCartController', function ($scope, $state,  active_controller, $ionicPlatform) {

        

       
       

        $scope.state_on = function () {
            return $state.params.id;
        };

        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }

      
        $scope.isAndroid = ionic.Platform.isAndroid();
       
        active_controller.set('ShoppingCartController');

      

    });


