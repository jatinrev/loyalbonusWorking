angular.module('LoyalBonus')
    .factory('productFactory', function (ajaxCall,$rootScope,loading) {

        function printProduct(BusinessId,pageIndex) {
            return ajaxCall
                .get('webapi/businessproduct/getProductsList?userId=' +$rootScope.userDetails.userId +'&businessid='+BusinessId+'&pageIndex=' +pageIndex+ '&pageSize=12', {})
                .then(function (responseResult) {
                    //console.log(JSON.parse(responseResult.data.Data));
                    return JSON.parse(responseResult.data.Data);
                });
        }
        return {
            printProduct: printProduct
        };
    })

    .controller('ProductController', function ($scope, showRating,refreshTest, $state, active_controller, $ionicPlatform, productFactory, businessVisit, $rootScope, saveData) {

        $scope.datadeal = {};
        
        $scope.businessData = {};

        $scope.helperFunction = {};
        
        
        $scope.state_on = function () {
            //console.log($state.params.BusinessId);
            return $state.params.BusinessId;
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
                });
        }
        $scope.invitelistnew();
        /* ------------Ended functionality productFactory------------*/

        $scope.helperFunction.productdetails = function (businessId, productid) {
            $state.go("home.productDetail", { BusinessId: businessId, Productid: productid});
        };

        $scope.helperFunction.reviews = function (newNumber) {
            //console.log(typeof(number));
            return showRating.showRatingImages(newNumber);
        }

        saveData
        .set('business_id_for_shoppingcart', $state.params.BusinessId);

    });


