angular.module('LoyalBonus')

.factory('Friendinvite', function (ajaxCall, loading, $rootScope ) {

        function invite(EmailAddresses , EmailContent , userId) {
        	/*console.log(EmailAddresses);
        	console.log(EmailContent);*/
        	console.log($rootScope.userDetails.userId);

            loading.start();
            return ajaxCall
            .post('webapi/Invitation/SendInvitation',
            {
                EmailAddresses 	 : EmailAddresses,
                EmailContent     : EmailContent,
                userId    		 : $rootScope.userDetails.userId
            }).then(function (result) {
            	console.log(result);
                loading.stop();



                return result.data;
                
            });

             
        }
        return {
            
            invite: invite
        };

    })
	.controller('InviteController', function ($scope, $state, showRating, $ionicPopup, $timeout,reviewFactory, showRating, $rootScope, backFunctionality, refreshTest,active_controller,Friendinvite) {

		active_controller.set('InviteController');

		console.log('have reached');
		$scope.datadeal       = {};
		/*$scope.emailaddresses ;
		$scope.emailcontent;
		$scope.Userid;*/

		$scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }
        var userIdInTestFunction = function () {
                if( watchUser.userPresent() == 1 ) {
                    return $rootScope.userDetails.userId;
                }
                return '';
            }
        $scope.invitelist = function () {
             Friendinvite
            .invite($scope.datadeal.emailaddresses, $scope.datadeal.emailcontent)
            .then(function (result) {
            		console.log(result);
            	/*if(statusText == 'OK')
            	{
            		showPopup();
            	}*/

            	
            });
            $scope.showPopup = function (msg) {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
				/* template:'<i class="icon-gift"></i>',*/
                title: 'Success',
                template:'SuccessFully Send Email',
                subTitle: msg,
                scope: $scope,
                buttons: [
                    { text: 'Cancel', type: 'button-positive' }

                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
            	
                myPopup.close(); //close the popup after 3 seconds for some reason
                //backFunctionality.one_step_back();
            }, 3000);
            //backFunctionality.one_step_back();
        };
           // return $scope.datadeal.emailaddresses,$scope.datadeal.emailcontent;
        

       

}


	});


