angular.module('LoyalBonus.services',[])
.factory('MathService', function() {
    var factory = {};
    
    factory.multiply = function(a, b) {
       return a * b
    }
    return factory;
})
.service('CalcService', function($http) {

    this.response = function(url, data) {
    	$http({
			method: 'POST',
			async : false,
			url: "http://beta2.loyalbonus.com/"+url,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			data: data //{ Email : $scope.signIn.username, Password : $scope.signIn.password }
		}).then(function(response){
			this.response_data = response;
			return response;
		}, function errorCallback(response){

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
.factory('ajaxCall', function($http) {
    return {
        post : function(url, data) {
            return $http({
            	method: 'POST',
				url: "http://beta2.loyalbonus.com/"+url,
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
				data: data
            });
        },
        get : function(url, data){
            return $http.get("http://beta2.loyalbonus.com/"+url, {
                params : data
            });
        }
    }
})
.factory('update_user_details', function($rootScope, ajaxCall, $state) {
	// update userDetails array which is global.
	$rootScope.userDetails = {};
	return {
		get : function (userID) {
			return ajaxCall.get('webapi/user/GetUserByID',
				{
					"userID": userID
				}).then(function(response) {
					if( response.data.StatusMessage == 'Success' ) {
						$rootScope.userDetails.userId  	 = userID;
						$rootScope.userDetails.Email     = response.data.Data.Email;
						$rootScope.userDetails.FullName  = response.data.Data.FullName;
						$rootScope.userDetails.IsDeleted = response.data.Data.IsDeleted;
						// $state.go("home.restaurants");
					} else {
						$rootScope.userDetails = {};
						$state.go("signin");
					}
			    });
		}
	};
})
.service('give_rating', ['$scope', function($scope){
	this.square = function (a) {
		return a*a;
	};
}])
.service('get_unique_elements', function () {
	this.get_unique_arr = function (arr) {
		var uniqueNames = [];
		for(i = 0; i< arr.length; i++){    
		    if(uniqueNames.indexOf(arr[i]) === -1){
		        uniqueNames.push(arr[i]);        
		    }        
		}
		/*for(i = 0; i< uniqueNames.length; i++){    
		    uniqueNames[i];      
		}*/
		return uniqueNames;
	};
})
.factory('get_user_location', function ( $cordovaGeolocation, $rootScope ) {

	function getLocation() {
		if( typeof($rootScope.userDetails.userLocation) != 'undefined' && Object.keys($rootScope.userDetails.userLocation).length > 0 ) {

			var p2 = new Promise(function(resolve, reject) {
			  resolve( $rootScope.userDetails.userLocation );
			});
			return p2;
			/*
			p2.then(function(value) {
			  console.log(value); // 1
			  return value + 1;
			}).then(function(value) {
			  console.log(value); // 2
			});

			p2.then(function(value) {
			  console.log(value); // 1
			});

			console.log('Hellllooo');
			return $rootScope.userDetails.userLocation;*/
		} else {
			var posOptions = {timeout: 100000, enableHighAccuracy: false};
			return $cordovaGeolocation
	    	       .getCurrentPosition(posOptions)
	    	       .then(function (position) {
		    	   	   	$rootScope.userDetails.userLocation = {
		    	   	   		lat  : position.coords.latitude,
					   		long : position.coords.longitude
		    	   	   	};
		    	   	   	return {
			       			lat  : '6.461573',
							long : '3.479404'
			       		};
					   	return {
		    	   	   		lat  : position.coords.latitude,
					   		long : position.coords.longitude
		    	   	   	};
	    	       });
		}
	}

	return {
		get : getLocation()  //{ this : function (lalla) { return "yoyoy"; } }
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
    }
    function get() {
		return activeController;
    }

    return {
      set : set,
      get : get
    };
})
.factory('saveData', function () {
	var saveHere;	

	function set() {

	}

	return {
		set : set(),
		get : get()
	};
})
.factory('loading', function ($ionicLoading) {
	return {
		start : function () {
			$ionicLoading.show({
			    content: 'Loading',
			    animation: 'fade-in',
			    showBackdrop: true,
			    maxWidth: 200,
			    showDelay: 0
			});
		},
		stop  : function () {
			$ionicLoading.hide();
		}
	};
})
.factory('backFunctionality', function ($rootScope, $state) {
	var previous_page = [];
	var array_key	  = '';
	$rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams, options) {
		if( typeof(fromState.name) != 'undefined' && typeof(toState.name) != 'undefined' && fromState.name == toState.name ) {
			/*console.log('from and to are same.');
			console.log(fromParams);
			console.log(toParams);
			if(Object.is(fromParams, toParams)) {
				console.log('object is same');
			}
			console.log('from and to are same.');*/
		} else if( typeof(fromState.name) != 'undefined' && fromState.name != '' ) {
			previous_page.push({
				fromState  : fromState.name,
				fromParams : fromParams
			});
			/*console.log(previous_page);
			console.log(toState);
	    	console.log(fromState);*/
	    }
	    /*console.log(previous_page);*/
    });

	return {
		one_step_back : function () {
			/*console.log('enter the dragon.');*/
			var back = previous_page.slice(-1)[0];
			/*console.log(previous_page);*/
			previous_page.pop();
			previous_page.pop();
			/*console.log(previous_page);*/
			$state.go( back.fromState, back.fromParams );
		}
	};
});






