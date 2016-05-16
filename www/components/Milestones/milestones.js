angular.module('LoyalBonus')




.controller('MileStoneController', function ($scope, $state, ajaxCall, $rootScope,saveData) {

	$scope.open_detail_page = function (id, BusinessID, businessDetailId,businesslocationsList) {
		console.log($scope.open_detail_page);
			saveData.set('id',id , 'businesslocationsList',businesslocationsList,'businessDetailId', businessDetailId);
            $state.go("home.kaseydiner", { id: id}, { businessDetailId: businessDetailId },{businesslocationsList:businesslocationsList});
            
        };




	$scope.myloyalbonus = {};

	$scope.myloyalbonus.print = [];

	ajaxCall
	.get('webapi/BusinessMaster/GetAllBusinessLocationsVisitedByUser?UserId='+$rootScope.userDetails.userId, {})
	.then(function(res) {
		//console.log(res);
		$scope.myloyalbonus.print = res.data.Data;
		//console.log($scope.myloyalbonus.print);
		
	});

	


	function mydummyJson (input) {
		var output = [];
		for (var i = 0; i < input; i++) {
			output.push(i)
		}
		return output;
	}

	$scope.myloyalbonus.printTick = function (input) {
		return mydummyJson(input);
	}

	$scope.myloyalbonus.printNonTick = function (input) {
		return mydummyJson(9 - +input);
	}

	$scope.myloyalbonus.printGift = function (input) {
		if(+input == 10) {
			return mydummyJson(0);
		} else {
			return mydummyJson(1);
		}
	}

});


