angular.module('LoyalBonus')

.controller('RestPasswordController', function ($scope, $state, $ionicHistory, ajaxCall, validation) {
	

	$scope.tabName = $state.params.id;
	$state.params.id == 'ResetPassword'
	$scope.datasignin = [{
	}];

	$scope.resetPass = {};

	$scope.resetPass.emailValidation = function () {
		validation.email()
	};

	function rest() {
		ajaxCall.post('webapi/AppLogin/ForgotPassword',
					  {Email : 'yoyo@gmail.com' }
					  )
		.then(function (res) {

		})
	}

	$scope.resetPass.rest = function () {
		console.log('reset ho gya.');
		// $state.go("signin");
	}
	$scope.myGoBack = function() {
     $state.go("signin");
	}
});
