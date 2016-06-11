angular.module('LoyalBonus.services', [])
	.factory('ajaxCall', function ($http) {
		return {
			post: function (url, data) {
				return $http({
					method: 'POST',
					url: "http://beta2.loyalbonus.com/" + url,
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					data: data
				});
			},
			get: function (url, data) {
				return $http.get("http://beta2.loyalbonus.com/" + url, {
					params  : data
				});
			}
		}
	})
	.factory('update_user_details', function ($rootScope, ajaxCall, $state, $cordovaPreferences) {
		// update userDetails array which is global.
		//console.log('in userdetail factory')
		$rootScope.userDetails = {};
		$rootScope.userDetails.Email = '';
		$rootScope.userDetails.FullName = '';
		/**Temp Data**
		$rootScope.userDetails = {
			userId: 263,
			Email: 'jatinverma@gmail.com',
			FullName: 'Jatin',
			userLocation: '6.461573,3.479404'
		}
		/**Temp Data**/
		return {
			get: function (userID) {
				if( typeof(userID) != 'undefined' && userID != '' ) {
					return ajaxCall.get('webapi/user/GetUserByID',
						{
							"userID": userID
						})
						.then(function (response) {
							if (response.data.StatusMessage == 'Success') {
								$rootScope.userDetails.userId    = userID;
								$rootScope.userDetails.Email     = response.data.Data.Email;
								$rootScope.userDetails.FullName  = response.data.Data.FullName;
								$rootScope.userDetails.IsDeleted = response.data.Data.IsDeleted;
								$rootScope.userDetails.CreatedOn = response.data.Data.CreatedOn;
								//console.log($rootScope.userDetails.CreatedOn);
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
				} else {
					return ;
				}
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
	.factory('get_user_location', function ($cordovaGeolocation, $rootScope, loading, ajaxCall, $http) {
		/**
		 * url : http://stackoverflow.com/questions/21306088/getting-geolocation-from-ip-address
		 */
		function getIpGeoLocation() {

			var output = $http.get("http://ipv4.myexternalip.com/json", {
							params: {}
						 })
						 .then(function (result) {
						 	// console.log(result.data.ip);
						 	// return result;
							return $http.get("http://ipinfo.io/"+result.data.ip, {
								params: {}
							})
							.then(function(location) {
								// console.log(location.data.loc);
								var lat_long = location.data.loc.split(',');
								return {
									coords : {
										latitude  : lat_long[0],
										longitude : lat_long[1]
									}
								}
							});
						 });

			return output;
		}

		function getLocation() {
			var posOptions = { maximumAge: 30000, timeout: 30000, enableHighAccuracy: false };
			var output = $cordovaGeolocation
						 .getCurrentPosition(posOptions)
						 .then(function (result) {
						 	// console.log('Success');
						 	console.log(result);
						 	return result;
						 }, function (error) {
						 	return getIpGeoLocation();
						 	// console.log(error)
						 	return error;
						 	// console.log('chiku');
						 });
			return output;
		}
		return {
			get 	: getLocation(),
			getIp 	: getIpGeoLocation
		};

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
			// console.log(value);
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
		var previous_page = []
		, array_key       = ''
		, setDontSave     = 0  // this variable is set because when user clicks on go back, and when he reaches back the fromState is again added to the array which remains in the history.
		, saveOnRefresh   = 0;
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
			loading.start();
			if (typeof (fromState.name) != 'undefined' && typeof (toState.name) != 'undefined' && (fromState.name == toState.name || Object.is(fromParams, toParams)) ) {
				// nothing is done here because state is same or params are also same.
				/**
					If you dont want to add state in the back functionality add a condition here in this if.
				 */
			} else if ( setDontSave == 1 && saveOnRefresh == 0 ) {
				console.log(fromState);
				console.log('setDontSave');
				setDontSave = 0;
			} else if (typeof (fromState.name) != 'undefined' && fromState.name != '') {
				previous_page.push({
					fromState: fromState.name,
					fromParams: fromParams
				});
				saveOnRefresh = 0; // in case saveOnRefresh is set to (1)

			}
			/*
			console.log('back functionality start');
			console.log(fromParams);
			console.log(fromState);
			console.log(toParams);
			console.log(toState);
			console.log(previous_page);
			console.log('back functionality stop');*/
			loading.stop();
			/*******Jali kaama lai(extra)******/
			saveData.remove('kaseyDinnerBusinessName');
		});

		return {
			one_step_back : function () {
				setDontSave = 1;
				var back = previous_page.slice(-1)[0];
				previous_page.pop();
				$state.go(back.fromState, back.fromParams);
			},
			setDontSave       : function() {
				// setDontSave       = 1;
			},
			set_saveOnRefresh : function() {
				// saveOnRefresh     = 1;
			},
			setNewDontSave    : function() {
				setDontSave       = 1;
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
			/*
			ngFB init is done in app.js, where user could input app id for authentication.
			 */
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
			console.log('refreshing');
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
	})
	.factory('popUp', function ($ionicPopup) {
		function confirm(title, content) {
			var options = {};
			if(title != null && title != '') {
				options.title = title;
			}
			if(content != null && content != '') {
				options.template = content;
			}
			return $ionicPopup.confirm(options);
		}
		
		return {
			confirm : confirm
		};
	});


















