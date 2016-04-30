angular.module('LoyalBonus')

.factory('reviewFactory', function (ajaxCall) {
	function printReview(businessId, pageNumber) {
		return ajaxCall
		.get('webapi/BusinessMaster/GetReviewsDetailByBusinessIdwithUsername?BusinessId='+businessId+'&pageIndex='+pageNumber+'&pageSize=3', {})
		.then(function (res) {
			return res.data.Data;
		});
	}

	function giveFeedback(rating, pros, cons, businessId, userId) {
		return ajaxCall
		.post('webapi/BusinessMaster/BusinessGiveStar',
			  {
			  	BusinessId 	: businessId,
				UserId		: userId,
				Pros 		: pros,
				Cons 		: cons
			   }
		)
		.then(function(prosConsResult) {
			return ajaxCall
			.post('webapi/BusinessMaster/BusinessGiveHeartStar',
				  {
				  	UserId 		: userId, 
				  	BusinessId  : businessId,
				   	Reviews 	: rating
				   }
			)
			.then(function(ratingResult) {
				console.log(prosConsResult);
				console.log(ratingResult);
				return prosConsResult;
			});
			
		});
	}

	return {
		printReview  : printReview,
		giveFeedback : giveFeedback
	};
})

.controller('ReviewController', function ($scope, $state, showRating, reviewFactory, showRating, $rootScope) {
	var allReviews = [];
	var reviewPage = 0;
	$scope.reviewVar = {
		businessImg : function() {
			return $state.params.businessImg;
		},
		businessRating : function() {
			return +$state.params.businessRating;
		}
	};

	$scope.reviewVar.reviews = function(number) {
        return showRating.showRatingImages(number);
    };

    $scope.reviewVar.writeReveiwShow = false;
    $scope.reviewVar.enableReveiw = function() {
    	$scope.reviewVar.writeReveiwShow = $scope.reviewVar.writeReveiwShow == false ? true : false;
    };

    $scope.stopLoading = true;
    $scope.reviewVar.loadMore = function() {
    	if($scope.stopLoading) {
		    reviewFactory
		    .printReview($state.params.businessId, reviewPage)
		    .then(function(res) {
		    	if(res.length > 0) {
		    		reviewPage += 1;
			    	for (i in res) {
			    		allReviews.push(res[i]);
			    	}
			    	console.log(allReviews)
			    } else {
			    	$scope.stopLoading = false;
			    }
		    });
		}
	}
	$scope.reviewVar.loadMore();

    $scope.reviewVar.allReview = function() {
    	return allReviews;
    }

    /***Rating starts here***/

    $scope.reviewVar.ratingStarNumber = 0;

    $scope.reviewVar.giveRating = function(number) {
    	$scope.reviewVar.ratingStarNumber = number;
    	$scope.reviewVar.starsArr = [];
		for( var i = 1; i < 6; i++ ) {
			if( i > 0 && i <= number) {
				$scope.reviewVar.starsArr.push({ 
					class : 'filledStart',
					src   : 'img/filledStar.png'
				});
			} else {
				$scope.reviewVar.starsArr.push({ 
					class : 'emptyStart',
					src   : 'img/emptyStart.png'
				});
			}
		}
    }
    $scope.reviewVar.giveRating(0);
	// console.log(giveRating.ratingImages(2));
   
	$scope.reviewVar.ratingMsg = false;

	$scope.reviewVar.giveFeedback = function() {
		reviewFactory
		.giveFeedback($scope.reviewVar.ratingStarNumber
					 ,$scope.reviewVar.pros
					 ,$scope.reviewVar.cons
					 ,$state.params.businessId
					 ,$rootScope.userDetails.userId
		)
		.then(function(res) {
			$scope.reviewVar.ratingMsg = true;
			$scope.stopLoading = true;
			$scope.reviewVar.loadMore();
		});
	}
	
});


