angular.module('LoyalBonus')


.factory('businessVisitMilestone', function (ajaxCall) {

        /**
         *  businessUid is qrCode
         */
        function give_visitmile(userId, businessUid, businessId) {
            ajaxCall
                .post('webapi/BusinessMaster/CreateBusinessQR',
                { BusinessId: businessId, BusinessUID: businessUid, UserId: userId }
                )
                .then(function (response) {
                    console.log('response');
                    console.log(reponse);
                });
        }
        return {
            give_visitmile: give_visitmile
            
        };
}) 

.controller('MileStoneController', function ($scope, $state, ajaxCall, $rootScope,businessVisitMilestone) {

	$scope.open_detail_page = function (id) {
            $state.go("home.kaseydiner", { id: id });
        };



	
	$scope.myloyalbonus = {};

	$scope.myloyalbonus.print = [];

	ajaxCall
	.get('webapi/BusinessMaster/GetAllBusinessLocationsVisitedByUser?UserId='+$rootScope.userDetails.userId, {})
	.then(function(res) {
		console.log(res);
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


