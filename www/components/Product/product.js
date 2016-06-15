angular.module('LoyalBonus')
    .factory('productFactory', function (ajaxCall,$rootScope,loading) {

        function printProduct(BusinessId,pageIndex) {
            return ajaxCall
                .get('webapi/businessproduct/getProductsList?userId=' +$rootScope.userDetails.userId +'&businessid='+BusinessId+'&pageIndex=' +pageIndex+ '&pageSize=12', {})
                .then(function (responseResult) {
                    console.log(JSON.parse(responseResult.data.Data));
                    return JSON.parse(responseResult.data.Data);
                });
        }
        return {
            printProduct: printProduct
        };
    })

    .controller('ProductController', function ($scope, refreshTest, $state, active_controller, $ionicPlatform, productFactory, businessVisit, $rootScope) {


        $scope.datadeal = {};
        
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
            console.log(res);
        });


        $scope.Test = function () {
            console.log(refreshTest.showrefreshtest($state.current.name, $state.params));
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

        $scope.helperFunction.reviews = function (number) {
            //console.log(typeof(number));
            var str = '';
            for (var i = 1; i <= number; i++) {
                str += '<img class="filledStart" src="img/filledStar.png"/>';
            }
            var emptyStars = 5 - +number;
            for (var j = 1; j <= emptyStars; j++) {
                str += '<img class="emptyStart" src="img/emptyStart.png"/>';
            }
            return str;
        }
    });


