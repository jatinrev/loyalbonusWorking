angular.module('LoyalBonus')

  .controller('MemberController', function ($scope, $state, active_controller, $ionicModal,refreshTest,$sce, $rootScope, ajaxCall) {
    $scope.tabName = $state.params.id;
    //$state.params.id == 'Membership'

    var data_ctr = {};

    $scope.datadeal = {};

    $scope.membership = {
      /*
        Method - Get : GetMembershipTypeByUserId
        [Parameters : userId]
      */
      GetMembershipTypeByUserId : function () {
        return ajaxCall
        .get('webapi/MyAccountAPI/GetMembershipTypeByUserId?userId='+$rootScope.userDetails.userId, {})
        .then(function(res) {
          $scope.datadeal.UpdatePaymentMethod = res.data.Data;
          return { res : res };
        });
      },

      /*
        Method - Post : SavePayStackResponseInPaymentHistory 
        [Parameters : membershipTypeId, PaystackAuthCode, transactionReferenceNo, userId, PaystackCardType, PaystackCCLastFour, PaystackChannel, PaystackMessage, promoFreeMonth]
      */
      SavePayStackResponseInPaymentHistory : function () {
        return ajaxCall
        .Post('webapi/MyAccountAPI/SavePayStackResponseInPaymentHistory', {})
        .then(function (res) {
          console.log(res);
          return res;
        });
      },

      /*
        Method - Post : ApplyPromoCode 
        [Parameters : userId, promoCode, amount, membershipTypeId]
      */
      ApplyPromoCode : function (formData) {
        console.log(formData);
        console.log($scope.datadeal.membershipTypeId_selected);
        console.log(formData.promoCode);
        if( $scope.datadeal.membershipTypeId_selected == undefined ) {
          console.log('insiede');
          $scope.datadeal.error = 'Please select the membership type.';
        } else {
          $scope.datadeal.error = undefined;
          return 0;
          return ajaxCall
          .Post('webapi/MyAccountAPI/ApplyPromoCode', {
            userId : $rootScope.userDetails.userId,
            promoCode : promoCode,
            amount : '',
            membershipTypeId : ''
          })
          .then(function (res) {
            console.log(res);
            return res;
          });
        }
      },

      /*
        Method - Post : RemoveUserPromoByUserPromoId
        [Parameters : userId, userPromoId]
      */
      RemoveUserPromoByUserPromoId : function (userPromoId) {
        return ajaxCall
        .Post('webapi/MyAccountAPI/RemoveUserPromoByUserPromoId', {
          userId      : $rootScope.userDetails.userId,
          userPromoId : userPromoId
        })
        .then(function (res) {
          console.log(res);
          return res;
        });
      },

      /*
        Method - Get : CancelMembership
        [Parameters : userId]
      */
      CancelMembership : function () {
        return ajaxCall
        .Get('webapi/MyAccountAPI/CancelMembership?userId='+$rootScope.userDetails.userId, {})
        .then(function (res) {
          console.log(res);
          return res;
        });
      },

      /*
        Method - Get : ContinueMembership
        [Parameters : userId]
      */
      ContinueMembership : function () {
        return ajaxCall
        .Get('webapi/MyAccountAPI/ContinueMembership?userId='+$rootScope.userDetails.userId, {})
        .then(function (res) {
          console.log(res);
          return res;
        });
      }
    }

    $scope.membership.GetMembershipTypeByUserId();

    $scope.Test = function () {
      return refreshTest.showrefreshtest($state.current.name, $state.params);
    }

    active_controller.set('MemberController');

    $scope.toggleGroup = function (group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function (group) {
      return $scope.shownGroup === group;
    };


  });


