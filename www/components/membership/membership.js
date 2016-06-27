angular.module('LoyalBonus')

  .controller('MemberController', function ($scope, $state, active_controller, $ionicModal,refreshTest,$sce, $rootScope, ajaxCall, popUp, $q, $http, loading) {
    $scope.tabName = $state.params.id;
    //$state.params.id == 'Membership'

    var data_ctr = {};

    function get_payment_amount(MembershipTypeID) {
      for(i in $scope.datadeal.UpdatePaymentMethod.MembershipTypes) {
        if( $scope.datadeal.UpdatePaymentMethod.MembershipTypes[i].MembershipTypeID == MembershipTypeID ) {
          return $scope.datadeal.UpdatePaymentMethod.MembershipTypes[i];
        }
      }
    }

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
        SavePayStackResponseInPaymentHistory : function (formData) {
            // getting selected data response.
            data_ctr.selectedMembershipObj = get_payment_amount($scope.datadeal.membershipTypeId_selected);
            
            $scope.membership
            .get_paystack_reference()
            .then(function(referenceId) {
                var handler = PaystackPop.setup({
                  key      : 'pk_test_08bb2ccce7b8084d4d3f1daee5b849771ce5ce53',
                  email    : $rootScope.userDetails.Email,
                  amount   : data_ctr.selectedMembershipObj.MemberShipFee,
                  ref      : referenceId,
                  callback : function(response) {
                    // response = Object {trxref: "1466954710"}
                    loading.start();
                    $scope.membership
                    .get_payment_data_from_paystack(response.trxref)
                    .then(function(callBackdata) {
                        var paystack_authorization_code = callBackdata.data.authorization.authorization_code,
                        paystack_bank                   = callBackdata.data.authorization.bank,
                        paystack_card_type              = callBackdata.data.authorization.card_type,
                        paystack_channel                = callBackdata.data.authorization.channel,
                        paystack_last4                  = callBackdata.data.authorization.last4,
                        paystack_message                = callBackdata.message,
                        sava_paystack_data              = {
                            membershipTypeId       : $scope.datadeal.membershipTypeId_selected,
                            PaystackAuthCode       : paystack_authorization_code,
                            transactionReferenceNo : referenceId,
                            userId                 : $rootScope.userDetails.userId,
                            PaystackCardType       : paystack_card_type,
                            PaystackCCLastFour     : paystack_last4,
                            PaystackChannel        : paystack_channel,
                            PaystackMessage        : paystack_message,
                            promoFreeMonth         : ''
                        };
                        ajaxCall
                        .post('webapi/MyAccountAPI/SavePayStackResponseInPaymentHistory', sava_paystack_data)
                        .then(function (res) {
                            if( res.data.Data == true ) {
                                popUp
                                .msgPopUp('Paystack verification successful.', 1);
                            } else {
                                popUp
                                .msgPopUp('Paystack verification unsuccessful.');
                            }
                            loading.stop();
                            console.log(res);
                            return res.data.Data;
                        });
                    });

                    // alert('success. transaction ref is ' + response.trxref);
                  },
                  onClose  : function(){
                      console.log('window closed');
                  }
                });
                handler.openIframe();
            });

            return 0;
            return ajaxCall
            .post('webapi/MyAccountAPI/SavePayStackResponseInPaymentHistory', {})
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
            .post('webapi/MyAccountAPI/RemoveUserPromoByUserPromoId', {
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
            return popUp
            .confirm("Are you sure you want to cancel membership?")
            .then(function(res) {
                if(res) { // if true then cancel membership.
                    return ajaxCall
                    .get('webapi/MyAccountAPI/CancelMembership?userId='+$rootScope.userDetails.userId, {})
                    .then(function (res) {
                        if(res.data.Data.status == true) {
                            popUp.msgPopUp("You membership was canceled.", 2);
                        }
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
            .get('webapi/MyAccountAPI/ContinueMembership?userId='+$rootScope.userDetails.userId, {})
            .then(function (res) {
                console.log(res);
                return res;
            });
        },

        //getting PAYSTACK REFERENCE
        get_paystack_reference : function() {
            //NEW HERE
            var referenceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            var promise = $q.defer();
            promise.resolve(referenceId);
            return promise.promise;
        },
        //Get Payment Data From Paystack
        get_payment_data_from_paystack : function(transactionRef) {
            return $http({
              method  : 'GET',
              url     : 'https://api.paystack.co/transaction/verify/' + transactionRef,
              headers : {
                'Authorization': 'Bearer sk_test_6b95965be2cf9679606d8103548f5847ce019175'
              }
            }).then(function(data) {
                if(data.status == '200') {
                    console.log(data.data);
                    return data.data;
                } else {
                    popUp
                    .msgPopUp('Paystack verification unsuccessful.');
                    return data.data;
                }
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


