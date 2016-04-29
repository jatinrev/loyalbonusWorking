angular.module('LoyalBonus')

.controller('ReviewController', function ($scope, $state) {

	$state.params.id == 'Review'
		$scope.dataReview = [{
			name: 'Customer Reviews',
			rating : {},
			rate : 3,
  			max : 5
		}];



	$scope.reviewVar = {};

	$state.params.businessId;
	$state.params.businessImg;
	$state.params.businessRating;

	

	console.log($state);	


});


