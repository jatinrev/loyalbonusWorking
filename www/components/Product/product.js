angular.module('LoyalBonus')
    .factory('productFactory', function (ajaxCall,$rootScope,loading) {

        function printProduct(BusinessId) {
            console.log($rootScope.userDetails.userId);
            //loading.start();
            return ajaxCall
                .post('webapi/ProductList/GetProductList',
                {
                    BusinessId: BusinessId, 
                    pageIndex:  0,
                    pageSize:5,
                    userId : $rootScope.userDetails.userId
                }
                )
                .then(function (responseResult) {
                    console.log(responseResult);
                    //return res.data.Data;
                   // loading.stop();
                    return responseResult.data.Data;
                });
        }
        return {
            printProduct: printProduct
        };
    })
    .controller('ProductController', function ($scope, refreshTest, $state, active_controller, $ionicPlatform,productFactory) {

        $scope.datadeal = {};

        $scope.state_on = function () {
            console.log($state.params.BusinessId);
            return $state.params.BusinessId;
        };
        $scope.state_on();
       

        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }
        $scope.isAndroid = ionic.Platform.isAndroid();
        active_controller.set('ProductController');



        $scope.invitelistnew = function () {
            productFactory
                .printProduct($scope.datadeal.BusinessId)
                .then(function (result) {
                    console.log(result);
                    //showPopup();
                });
        }

         $scope.invitelistnew();
    });
