angular.module('LoyalBonus')
.controller('MileStoneController', function ($scope, $state, ajaxCall, active_controller,$rootScope,saveData, refreshTest) {

	$scope.open_detail_page = function (BusinessID) {
        $state.go("home.kaseydiner", { id: BusinessID });
    };

    var restaurantData = [];
        active_controller.set('MileStoneController');

    

    $scope.Test = function () {
        return refreshTest.showrefreshtest($state.current.name, $state.params);
    }
    console.log('yoyoyoyo');

	$scope.myloyalbonus = {};


    $scope.printTick_html = function(total_visits, bonus_discount_toCust) {
        console.log(total_visits, bonus_discount_toCust);
        // return 'ellloo';
    }

	$scope.myloyalbonus.print = [];

    //.get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' + $scope.state_on() + '&UserId='+$rootScope.userDetails.userId, {})
	ajaxCall
	.get('webapi/BusinessMaster/GetAllBusinessLocationsVisitedByUser?UserId='+$rootScope.userDetails.userId, {})
	.then(function(res) {
		$scope.myloyalbonus.print = res.data.Data;
		//saveData.set('kaseyDinnerBusinessName', $scope.myloyalbonus.print.Name);
		return $scope.myloyalbonus.print;
	});

   function mydummyJson(input) {

        var output = [];
        //console.log(input);
        for (var i = 0; i < input; i++) {
            output.push(i)
            //console.log(output.push(i));
        }
        return output;
    }


    $scope.myloyalbonus.printTick    = function ( uservisits, BonusDiscountToCust ) {
        if( +uservisits == +BonusDiscountToCust ) {
            return mydummyJson(+uservisits - 1);
        }
        return mydummyJson(+uservisits);
    }
        
    $scope.myloyalbonus.printNonTick = function ( uservisits, BonusDiscountToCust ) {
        var answerNontick =  +BonusDiscountToCust - +uservisits ;
        if( answerNontick - 1 <= 0 ) {
            return mydummyJson(0);
        } else {
            return mydummyJson(answerNontick - 1);
        }
    }
        
    $scope.myloyalbonus.printGift    = function ( uservisits, BonusDiscountToCust ) {
        if (+BonusDiscountToCust == uservisits) {
            return mydummyJson(0);
        } else {
            return mydummyJson(1);
        }
    }

    $scope.myloyalbonus.printGiftDiscount    = function ( uservisits, BonusDiscountToCust ) {
        if( +uservisits == +BonusDiscountToCust ) {
            return mydummyJson(1);
        }
    }
         
        


});


