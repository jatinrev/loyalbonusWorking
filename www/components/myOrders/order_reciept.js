angular.module('LoyalBonus')

.controller('orderRecieptController', function ($scope, $state, ajaxCall, active_controller,$rootScope, refreshTest) {

	active_controller.set('orderRecieptController');
	$scope.Test = function () {
        return refreshTest.showrefreshtest($state.current.name, $state.params);
    }

    

    // OrderInvoice(Get): Parameters – [orderId, userId]
	ajaxCall
    .get('webapi/UserCartApi/OrderInvoice', {
		userId  : $rootScope.userDetails.userId,
		orderId : $state.params.order_id
    })
    .then(function(res) {
    	console.log(res);
    });
});