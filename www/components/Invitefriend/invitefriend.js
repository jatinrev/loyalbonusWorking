angular.module('LoyalBonus')
	.controller('InviteController', function ($scope, $state, showRating, $ionicPopup, $timeout,reviewFactory, showRating, $rootScope, backFunctionality, refreshTest) {
		active_controller.set('InviteController');

		$scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }

	});


