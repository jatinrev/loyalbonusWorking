angular.module('LoyalBonus')

.factory('get_business_data', function (ajaxCall, $state, get_unique_elements) {
	function get_data(latitude, longitude) {
		var heading = [], 
		data        = {};

		return ajaxCall.get('webapi/BusinessMaster/GetAllBusinessDataNearByKMFromCurrentLocation?currlocationlatlong='+latitude+','+longitude+'&kms=50', {})
	    .then(function(response) {
	    	// $scope.testing = response;

	    	for ( i in response.data.Data ) {
	    		heading.push( response.data.Data[i].CategoryName );
	    	}
	    	// Start : getting unique element of array
	    	heading  = get_unique_elements.get_unique_arr(heading);                

	    	for (i in heading) {
	    		data[ heading[i] ] = [];
	    	}

	    	for ( i in response.data.Data ) {
	    		for ( heading_obj in heading ) {
	    			if( heading[heading_obj] == response.data.Data[i].CategoryName ) {
	    				data[ heading[heading_obj] ].push( response.data.Data[i] );
	    			}
	    		}
	    	}

	    	//putting data in global variable.
	    	globaldata.businesses = data;

	    	if ( typeof($state.params.vertical) != 'undefined' && $state.params.vertical == '' ) {
	    		for(i in data) {
	    			// console.log('in here');
	    			$state.go("home.restaurants", {vertical: i});
	    			break;
	    		}
	    	}
	    	console.log(data);
	    	return data;
	    });
	}

	return {
		get : function (latitude, longitude) { 
			if( typeof(globaldata.businesses) != 'undefined' && Object.keys(globaldata.businesses).length > 0 ) {
				console.log('data comming from globaldata variable.');
				var p2 = new Promise(function(resolve, reject) {
				  resolve( globaldata.businesses );
				});
				return p2;
			} else {
				return get_data(latitude, longitude);
			}
		},
		search : function (keyword) {
			return ajaxCall.get('webapi/BusinessMaster/GetBusinessbySearchKeyword?keyword='+keyword, {})
	    	.then(function(response) {
	    		return response;
	    	});
		}
	};
})

.controller('RestaurantController', function ( $scope, $rootScope, $state, ajaxCall, $ionicPlatform,
											   get_unique_elements, get_user_location, $cordovaGeolocation, get_business_data,
											   active_controller ) {

	

	var vm = this;
	// vm.openDetailPage = openDetailPage;

	active_controller.set('RestaurantController');

	$scope.restaurants = {};

	$scope.open_detail_page = function (id) {
		$state.go("home.kaseydiner", {id: id});
	};

	$scope.testing = 'in RestaurantController...';

	/*$rootScope.$watch('userDetails', function() {
		if( typeof($rootScope.userDetails.userId) != 'undefined' && !isNaN($rootScope.userDetails.userId) ) {
			$state.go("home.restaurants");
		} else {
			$state.go("signin");
		}
	}, true);*/

	$scope.print_data = {};
	$scope.data       = {};
	$scope.positions  = {};
	$scope.heading 	  = [];
/**/

	$scope.restaurants.search = function (keyword) {
		get_business_data
		.search(keyword)
		.then(function (response) {
			console.log(response);
		});
	};

    $ionicPlatform.ready(function() {
    	$scope.testing = 'in RestaurantController ionic ready.';
    	// console.log($rootScope.userDetails);
    	
    	get_user_location
    	.get
    	.then(function (position) {
    		$scope.testing = position;

    		get_business_data
    		.get(position.lat, position.long)
    		.then(function (ajax_response) {
    			$scope.data = ajax_response;
    		});

			$scope.positions.lat  = position.lat;
			$scope.positions.long = position.long;
    	});

	});

	$scope.tabName = $state.params.vertical;

	$scope.tab_name = function () {
		return $state.params.vertical;
	}

	$scope.print_data = function () {
		return $scope.data[$state.params.vertical];
	};

});



