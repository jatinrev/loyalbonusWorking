angular.module('LoyalBonus')

.controller('RestPasswordController', function ($scope, $state, $ionicHistory) {
	var vm = this;
	vm.rest = rest;

	$scope.tabName = $state.params.id;
	$state.params.id == 'ResetPassword'
	$scope.datasignin = [{
	}];

	function rest() {
		$state.go("signin");
	}
	$scope.myGoBack = function() {
     $state.go("signin");
	}
});
