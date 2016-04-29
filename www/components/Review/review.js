angular.module('LoyalBonus')

.factory('reviewFactory', function (ajaxCall) {
	function printReview(businessId, pageNumber) {
		return ajaxCall
		.get('webapi/BusinessMaster/GetReviewsDetailByBusinessIdwithUsername?BusinessId='+businessId+'&pageIndex='+pageNumber+'&pageSize=3', {})
		.then(function (res) {
			return res.data.Data;
		});
	}	

	return {
		printReview : printReview
	};
})

.controller('ReviewController', function ($scope, $state, showRating, reviewFactory, showRating) {
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

	// console.log(giveRating.ratingImages(2));
   

	
});


