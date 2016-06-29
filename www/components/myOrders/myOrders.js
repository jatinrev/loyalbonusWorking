angular.module('LoyalBonus')

.controller('myOrdersController', function ($scope, $state, ajaxCall, active_controller,$rootScope, refreshTest) {

	active_controller.set('myOrdersController');
	$scope.Test = function () {
        return refreshTest.showrefreshtest($state.current.name, $state.params);
    }

    // http://beta2.loyalbonus.com/webapi/MyAccountAPI/GetMyOrderByUserId?userId=236
    ajaxCall
    .get('webapi/MyAccountAPI/GetMyOrderByUserId', {userId : $rootScope.userDetails.userId})
    .then(function(res) {
    	$scope.datadeal = res.data.Data;
    	console.log(res);
    });

    // OrderInvoice(Get): Parameters – [orderId, userId]
    $scope.view_receipt = function(orderId) {
    	$state.go("home.orderReciept", {order_id : orderId});
    }
});