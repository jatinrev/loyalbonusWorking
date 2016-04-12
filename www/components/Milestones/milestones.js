angular.module('LoyalBonus')

.controller('MileStoneController', function ($scope, $state) {
	$scope.tabName = $state.params.id;
	$state.params.id == 'Milestones'
		$scope.datamilestone = [{
			name: 'Steak House',
			
		}];

	});


