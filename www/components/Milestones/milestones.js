angular.module('LoyalBonus')




.controller('MileStoneController', function ($scope, $state, ajaxCall, $rootScope,saveData, refreshTest) {

	$scope.open_detail_page = function (BusinessID) {
		// console.log(BusinessID);
		// saveData.set('id',id , 'businesslocationsList',businesslocationsList,'businessDetailId', businessDetailId);
        $state.go("home.kaseydiner", { id: BusinessID });
    };

    $scope.v = {
        Dt: Date.now()
        /*DDt: Date.parse()*/
    }

    $scope.Test = function () {
        return refreshTest.showrefreshtest($state.current.name, $state.params);
    }


	$scope.myloyalbonus = {};

	$scope.myloyalbonus.print = [];
//.get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' + $scope.state_on() + '&UserId='+$rootScope.userDetails.userId, {})
	ajaxCall
	.get('webapi/BusinessMaster/GetAllBusinessLocationsVisitedByUser?UserId='+$rootScope.userDetails.userId, {})
	.then(function(res) {
		$scope.myloyalbonus.print = res.data.Data;
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


