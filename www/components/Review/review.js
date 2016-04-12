angular.module('LoyalBonus')

.controller('ReviewController', function ($scope, $state) {
	$scope.tabName = $state.params.id;

	$state.params.id == 'Review'
		$scope.dataReview = [{
			name: 'Customer Reviews',
			rating : {},
			rate : 3,
  			max : 5
		}];

		

	});


