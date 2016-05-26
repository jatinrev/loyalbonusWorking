angular.module('LoyalBonus.services', [])
	.factory('MathService', function () {
		var factory = {};

		factory.multiply = function (a, b) {
			return a * b
		}
		return factory;
	})
	.service('CalcService', function ($http) {

		this.response = function (url, data) {
			$http({
				method: 'POST',
				async: false,
				url: "http://beta2.loyalbonus.com/" + url,
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
				data: data //{ Email : $scope.signIn.username, Password : $scope.signIn.password }
			}).then(function (response) {
				this.response_data = response;
				return response;
			}, function errorCallback(response) {

			});
		}

		/*this.response = function(url, data) {
			$http({
				method: 'POST',
				async : false,
				url: url,
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
				data: data //{ Email : $scope.signIn.username, Password : $scope.signIn.password }
			}).then(function(response){
				this.response_data = response;
				return response;
			}, function errorCallback(response){
	
			});
		}*/
	})
	.factory('ajaxCall', function ($http) {
		return {
			post: function (url, data) {
				return $http({
					method: 'POST',
					url: "http://beta2.loyalbonus.com/" + url,
					headers: { 'Content-Type': 'application/json; charset=utf-8' },
					data: data
				});
			},
			get: function (url, data) {
				return $http.get("http://beta2.loyalbonus.com/" + url, {
					params: data
				});
			}
		}
	})
	.factory('update_user_details', function ($rootScope, ajaxCall, $state, $cordovaPreferences) {
		// update userDetails array which is global.
		console.log('in userdetail factory')
		$rootScope.userDetails = {};
		$rootScope.userDetails.Email = '';
		$rootScope.userDetails.FullName = '';
		/**Temp Data**/
		/*$rootScope.userDetails = {
			userId: 263,
			Email: 'jatinverma@gmail.com',
			FullName: 'Jatin',
			userLocation: '6.461573,3.479404'
		}*/
		/**Temp Data**/
		return {
			get: function (userID) {
				return ajaxCall.get('webapi/user/GetUserByID',
					{
						"userID": userID
					}).then(function (response) {
						if (response.data.StatusMessage == 'Success') {
							$rootScope.userDetails.userId = userID;
							$rootScope.userDetails.Email = response.data.Data.Email;
							$rootScope.userDetails.FullName = response.data.Data.FullName;
							$rootScope.userDetails.IsDeleted = response.data.Data.IsDeleted;
							// $state.go("home.restaurants");
							$cordovaPreferences.store('userId', userID, 'dict');
					        /*.success(function(value) {
					            // alert("Success: " + value);
					            // $scope.test = value;
					        })
					        .error(function(error) {
					            // alert("Error: " + error);
					            // $scope.test = error;
					        });*/
						} else {
							$rootScope.userDetails = {};
							$state.go("signin");
						}
					});
			}
		};
	})
	.factory('giveRating', function ($scope) {
		function ratingImages(number) {
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

		return {
			ratingImages: ratingImages
		}
	})
	.service('get_unique_elements', function () {
		this.get_unique_arr = function (arr) {
			var uniqueNames = [];
			for (i = 0; i < arr.length; i++) {
				if (uniqueNames.indexOf(arr[i]) === -1) {
					uniqueNames.push(arr[i]);
				}
			}
			/*for(i = 0; i< uniqueNames.length; i++){
				uniqueNames[i];
			}*/
			return uniqueNames;
		};
	})
	.factory('get_user_location', function ($cordovaGeolocation, $rootScope, loading) {

		function getLocation() {
			//console.log('kuchbhi');
			var posOptions = { maximumAge: 30000, timeout: 15000, enableHighAccuracy: false };

			var output = $cordovaGeolocation
				.getCurrentPosition(posOptions)
				.then(function (result) {
					// console.log('Success');
					console.log(result);
					return result;
				}, function (error) {
					console.log(error)
					return error;
					// console.log('chiku');
				});
			/*console.log('console');
			console.log(output);*/
			return output;
		}



		//watch.clearwatch();
		return { get: getLocation() };

	})
	.filter('spaceless', function () {
		console.log('in filter spaceless');
		return function (input) {
			return input.replace(' ', '').replace(' ', '');
		};
	})
	.factory('active_controller', function () {
		var activeController;

		function set(name) {
			activeController = name;
			console.log(activeController);

		}
		function get() {
			return activeController;
		}

		return {
			set: set,
			get: get
		};
	})
	.factory('saveData', function () {
		var saveHere = {};

		function set(key, value) {
			saveHere[key] = value;
		}

		function get(key) {
			return saveHere[key];
		}

		function remove(key) {
			saveHere[key] = '';
		}

		return {
			set: set,
			get: get,
			remove: remove
		};
	})
	.factory('loading', function ($ionicLoading) {
		return {
			start: function () {
				$ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 200,
					showDelay: 0
				});
			},
			stop: function () {
				$ionicLoading.hide();
			}
		};
	})
	.factory('backFunctionality', function ($rootScope, $state, saveData, loading) {
		var previous_page = [];
		var array_key = '';
		var setDontSave = 0;  // this variable is set because when user clicks on go back, and when he reaches back the fromState is again added to the array which remains in the history.
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
			loading.start();
			if (typeof (fromState.name) != 'undefined' && typeof (toState.name) != 'undefined' && fromState.name == toState.name) {
				/*
				if(Object.is(fromParams, toParams)) {
					console.log('object is same');
				}
				console.log('from and to are same.');*/
			} else if (setDontSave == 1) {
				setDontSave = 0;
			} else if (typeof (fromState.name) != 'undefined' && fromState.name != '') {
				previous_page.push({
					fromState: fromState.name,
					fromParams: fromParams
				});
				/*console.log(previous_page);
				console.log(toState);
				console.log(fromState);*/
			}
			loading.stop();
			/*******Jali kaama lai(extra)******/
			saveData.remove('kaseyDinnerBusinessName');
		});

		return {
			one_step_back : function () {
				setDontSave = 1
				var back = previous_page.slice(-1)[0];
				previous_page.pop();
				$state.go(back.fromState, back.fromParams);
			},
			setDontSave   : function() {
				setDontSave = 1;
			}
		};
	})
	.factory('validation', function () {

		/**
		 *	returns true when email is valid
		 */
		function email(emailAddposOptionss) {
			if (emailAddress != '') {
				var emailPattern = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},*[\W]*)+$/;
				if (!emailPattern.test(emailAddress)) {
					return false;
				} else {
					return true;
				}
			}
		}

		return {
			email: email
		};
	})
	.factory('facebookFactory', function (ngFB, ajaxCall, loading) {
		function facebookLogin() {
			return ngFB
				.login({ scope: 'email,read_stream,publish_actions' })
				.then(function (response) {
					console.log(response);
					if (response.status === 'connected') {
						return response.authResponse.accessToken;
					} else {
						alert('Facebook login failed');
					}
					return 0;
				})
				.then(function (response) {
					if (response == 0) {
						return 0;
					} else {
						loading.start();
						return ngFB
							.api({
								path: '/me',
								params: { fields: 'id,name,email' }
							})
							.then(function (fbResponse) {
								return ajaxCall
									.post('webapi/AppLogin/RegisterWithFB',
									{
										userName: fbResponse.name,
										accessToken: response,     //access token from login
										email: fbResponse.email
									}
									)
									.then(function (res) {
										loading.stop();
										return res;
									});
							},
							function (error) {
								loading.stop();
								return 0;
							}
							);
					}
				});
		}

		return {
			facebookLogin: facebookLogin
		};
	})
	.factory('showRating', function () {
		function showRatingImages(number) {
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

		function showRatingJson(number) {
			var starsArr = [];
			for (var i = 1; i < 6; i++) {
				if (i > 0 && i <= number) {
					starsArr.push({
						class: 'filledStart',
						src: 'img/filledStar.png'
					});
				} else {
					starsArr.push({
						class: 'emptyStart',
						src: 'img/emptyStart.png'
					});
				}
			}
			return starsArr;
		}

		return {
			showRatingImages: showRatingImages,
			showRatingJson: showRatingJson
		};


	})

	.factory('refreshTest', function ($state, backFunctionality) {
		function showrefreshtest ($statename,$stateparam) {
			backFunctionality.setDontSave();
			$state.go($statename, $stateparam, { reload: true });
			return '';
		}
		return {
			showrefreshtest: showrefreshtest
		}
	})
	.factory('watchUser', function ($rootScope) {
		var userPresent = 0;
		$rootScope.$watch('userDetails', function () {
			if (typeof ($rootScope.userDetails) == 'undefined') {
				userPresent = 0;
			} else {
				if (typeof ($rootScope.userDetails.userId) == 'undefined') {
					userPresent = 0;
				} else {
					userPresent = 1;
				}
			}
			console.log('in watchUser');
		}, true);

		return {
			userPresent: function () { return userPresent; }
		};
	});
















