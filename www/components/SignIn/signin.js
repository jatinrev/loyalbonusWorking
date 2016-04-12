angular.module('LoyalBonus')

.controller('SignInController', function ($scope, $rootScope, $state, $http, update_user_details) {
	var vm                 = this;
	vm.login               = login;
	$scope.signIn          = {};

	$scope.tabName = $state.params.id;
	$state.params.id == 'Signin'
	$scope.datasignin = [{
	}];
	$scope.signIn.signIn_button_visibility = true;

	$rootScope.$watch('userDetails', function() {
		// console.log('in watch userDetails.');
		/*if( typeof($rootScope.userDetails.userId) != 'undefined' && !isNaN($rootScope.userDetails.userId) ) {
			$state.go("home.restaurants");
		} else {
			$state.go("signin");
		}*/
	}, true);

	// console.log( window.localStorage['userId'] );

	function login() {
		$scope.signIn.response 				   = 'in login';
		$scope.signIn.signIn_button_visibility = false;
		$scope.signIn.response_visibility      = true; // comment this

		$http({
			method: 'POST',
			url: 'http://beta2.loyalbonus.com/webapi/AppLogin/Login',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ Email : $scope.signIn.username, Password : $scope.signIn.password })
		}).then(function(response) {
			if( response.data.StatusCode == 0 ) {
				//success
				window.localStorage['userId'] = response.data.Data.UserID;
				$scope.signIn.response        = response.data.Message;
				update_user_details.get( response.data.Data.UserID );
				console.log(response);
				$state.go("home.restaurants");
			} else {
				$scope.signIn.signIn_button_visibility = true;
				if( response.data.StatusCode == 4 ) {
					$scope.signIn.signIn_button_visibility = true;
					$scope.signIn.response_visibility      = true;
					$scope.signIn.response = response.data.Message;
				}
			}
		}, function errorCallback(response) {
			$scope.signIn.response_visibility      = true; // comment this
			$scope.signIn.response = response;
		});
		
		

		/*$http('POST', 'http://beta2.loyalbonus.com/webapi/AppLogin/Login', { Email : $scope.signIn.username, Password : $scope.signIn.password }, function(status, response){
			
		}, function(status, response){
			// error
		});*/
	}

});



