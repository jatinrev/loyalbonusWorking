angular.module('LoyalBonus')

.controller('RestPasswordController', function ($scope, $state, $ionicHistory, ajaxCall, validation, loading) {
	

	$scope.tabName = $state.params.id;
	$state.params.id == 'ResetPassword'
	$scope.datasignin = [{
	}];

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
		})
		.then(function () {
			loading.stop();
		});
	}

	$scope.myGoBack = function() {
     	$state.go("signin");
	}
});
