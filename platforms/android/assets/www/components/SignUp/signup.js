angular.module('LoyalBonus')

.controller('SignUpController', function ($scope, $rootScope, $state, ajaxCall, update_user_details, loading) {
	var vm         = this;
	$scope.signUp  = {};
	$scope.tabName = $state.params.id;
	$state.params.id == 'Signup'
		$scope.datasignup = [{
			name: 'Steak House',
		}];

	$scope.signUp.signUp_button_visibility = true;
	
	$scope.signUp.submit = function() {
		loading.start();
		$scope.signUp.response = 'hello';
		$scope.signUp.signUp_button_visibility = false;
		ajaxCall.post('webapi/AppLogin/Register',
		{
			"Email": $scope.frmsignup.email.$modelValue,
			"FullName": $scope.frmsignup.firstname.$modelValue+' '+$scope.frmsignup.lastname.$modelValue,
			"Password": $scope.frmsignup.password.$modelValue,
			"ConfirmPassword": $scope.frmsignup.password.$modelValue,
			"CurrentPassword": $scope.frmsignup.password.$modelValue,
			"UserType": 1 
		}).then(function(response){
			loading.stop();
			if(response.data.StatusMessage == null) {
				//success
				window.localStorage['userId'] = response.data.Data.UserID;
				update_user_details.get( response.data.Data.UserID );
				console.log(response);
				$scope.signUp.response = 'user created.';
				$state.go("home.restaurants");
			} else {
				$scope.signUp.signUp_button_visibility = true;
				$scope.signUp.responseVisibility       = true;
				$scope.signUp.response = response.data.StatusMessage;
			}
	    }, function errorCallback(response) {
	    	loading.stop();
			$scope.signUp.signUp_button_visibility = true; // comment this
			$scope.signUp.response = response;
		});
	};
});


