angular.module('LoyalBonus')

  .controller('MemberController', function ($scope, $state, active_controller, $ionicModal,refreshTest,$sce, $rootScope, ajaxCall, popUp) {
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
        function get_payment_amount(MembershipTypeID) {
          for(i in $scope.datadeal.UpdatePaymentMethod.MembershipTypes) {
            if( $scope.datadeal.UpdatePaymentMethod.MembershipTypes[i].MembershipTypeID == MembershipTypeID ) {
              return $scope.datadeal.UpdatePaymentMethod.MembershipTypes[i];
            }
          }
        }
        if( $scope.datadeal.membershipTypeId_selected == undefined ) {
          $scope.datadeal.error = 'Please select the membership type.';
        } else {
          $scope.datadeal.error = undefined;
          return ajaxCall
          .post('webapi/MyAccountAPI/ApplyPromoCode', {
            userId           : $rootScope.userDetails.userId,
            promoCode        : formData.promoCode.$modelValue, // promo code
            amount           : get_payment_amount(formData.membershipType.$modelValue).MemberShipFee,
            membershipTypeId : get_payment_amount(formData.membershipType.$modelValue).MembershipTypeID
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
        return popUp.confirm("Are you sure you want to cancel membership?")
        .then(function(res) {
          if(res) { // if true then cancel membership.
            return ajaxCall
            .Get('webapi/MyAccountAPI/CancelMembership?userId='+$rootScope.userDetails.userId, {})
            .then(function (res) {
              console.log(res);
              return res;
            });
          }
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


