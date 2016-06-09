angular.module('LoyalBonus')
    .factory('productFactory', function (ajaxCall,$rootScope,loading) {

        function printProduct(BusinessId,pageIndex) {
            return ajaxCall
                .get('webapi/businessproduct/getProductsList?userId=' +$rootScope.userDetails.userId +'&businessid='+BusinessId+'&pageIndex=' +pageIndex+ '&pageSize=12', {})
                .then(function (responseResult) {
                    return JSON.parse(responseResult.data.Data);
                    
                });
        }
        return {
            printProduct: printProduct
        };
    })

    .controller('ProductController', function ($scope, refreshTest, $state, active_controller, $ionicPlatform, productFactory) {


        $scope.datadeal = {};

        
        
        $scope.state_on = function () {
            
            return $state.params.BusinessId;
            
        };

        $scope.state_on();

        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }
        $scope.isAndroid = ionic.Platform.isAndroid();
        
        active_controller.set('ProductController');

        /* ------------started functionality productFactory-----------*/

        $scope.invitelistnew = function () {
            productFactory
                .printProduct($scope.state_on(), $scope.pageIndex)
                .then(function (result) {
                    console.log(result);
                    $scope.datadeal = result;
                    // console.log($scope.datadeal);
                });
        }
        $scope.invitelistnew();
        /* ------------Ended functionality productFactory------------*/
    });
