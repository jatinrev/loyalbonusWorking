angular.module('LoyalBonus')

.controller('RestPasswordController', function ($scope, $state, $ionicHistory, ajaxCall, validation, loading) {

	$scope.resetPass = {};

	/**
	 *	returns true when email is valid
	 */
	$scope.resetPass.emailValidation = function () {
		return validation.email(frmrest.email.value)
	};

	$scope.resetPass.rest = function () {
		loading.start();
		ajaxCall.post('webapi/AppLogin/ForgotPassword',
					  {Email : frmrest.email.value }
					  )
		.then(function (res) {
			$scope.resetPass.msg = res.data.StatusMessage;
			loading.stop();
		});
	}

	$scope.myGoBack = function() {
     	$state.go("signin");
	}
});
