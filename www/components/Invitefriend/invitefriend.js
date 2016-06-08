angular.module('LoyalBonus')

    .factory('Friendinvite', function (ajaxCall, loading, $rootScope) {

        function invite(EmailAddresses, EmailContent, userId) {
            console.log($rootScope.userDetails.userId);
            loading.start();
            return ajaxCall
                .post('webapi/Invitation/SendInvitation',
                {
                    EmailAddresses: EmailAddresses,
                    EmailContent: EmailContent,
                    userId: $rootScope.userDetails.userId
                }).then(function (result) {
                    console.log(result);
                    /*if(result.data.StatusMessage != null) {
                        return result.data;
                    } else {
                        
                    }*/
                    loading.stop();
                    return 1;
                });
        }
        return {

            invite: invite
        };
    })
    .controller('InviteController', function ($scope, $state, showRating, $ionicPopup, $timeout, reviewFactory, showRating, $rootScope, backFunctionality, refreshTest, active_controller, Friendinvite) {
        active_controller.set('InviteController');
        console.log('have reached');
        $scope.datadeal = {};
		/*$scope.emailaddresses ;
		$scope.emailcontent;
		$scope.Userid;*/
        function showPopup(msg) {
            $scope.data = {}
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                /* template:'<i class="icon-gift"></i>',*/
                title: 'Success',
                template: 'The mail has been sent successfully.',
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

        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }

        var userIdInTestFunction = function () {
            if (watchUser.userPresent() == 1) {
                return $rootScope.userDetails.userId;
            }
            return '';
        }
        // Start : date calculation for showing discount offer.
        var createdondate = new Date($rootScope.userDetails.CreatedOn)
        , todayDate       = new Date();
        createdondate.setMonth(createdondate.getMonth() + 1); //adding month to date
        if(todayDate.getTime() >= createdondate.getTime()) { //if today date is greater then dont show discount offers.
            console.log('asdsadsad');
            $scope.Show_discount_offer = false;
        } else {
            $scope.Show_discount_offer = true;
        }
        //   End : date calculation for showing discount offer.
        $scope.invitelist = function () {
         $scope.show_hide_invite_submit = true;  
            Friendinvite
                .invite($scope.datadeal.emailaddresses, $scope.datadeal.emailcontent)
                .then(function (result) {
                    console.log(result);
                    $scope.show_hide_invite_submit = false;
                    //showPopup();
                });
        }
       


    });


