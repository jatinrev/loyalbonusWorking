angular.module('LoyalBonus')

  .controller('MemberController', function ($scope, $state, active_controller, $ionicModal,refreshTest,$sce, $rootScope, ajaxCall, popUp, $q) {
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
              ajaxCall
              .post('webapi/MyAccountAPI/SavePayStackResponseInPaymentHistory', {
                membershipTypeId       : $scope.datadeal.membershipTypeId_selected,
                PaystackAuthCode       : '', //?
                transactionReferenceNo : referenceId,
                userId                 : $rootScope.userDetails.userId,
                PaystackCardType       : '',
                PaystackCCLastFour     : '',
                PaystackChannel        : '',
                PaystackMessage        : '',
                promoFreeMonth         : ''
              })
              .then(function (res) {
                console.log(res);
                return res;
              });
              // alert('success. transaction ref is ' + response.trxref);
            },
            onClose  : function(){
                alert('window closed');
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
        return popUp.confirm("Are you sure you want to cancel membership?")
        .then(function(res) {
          if(res) { // if true then cancel membership.
            return ajaxCall
            .get('webapi/MyAccountAPI/CancelMembership?userId='+$rootScope.userDetails.userId, {})
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
        console.log(referenceId);
        //OLD HERE
        var promise = $q.defer();
        var timeStamp = Math.floor(Date.now() / 1000);
        promise.resolve(timeStamp);
        return promise.promise;
      },
      //Get Payment Data From Paystack
      get_payment_data_from_paystack : function() {
        $http({
          method: 'GET',
          url: 'www.google.com/someapi',
          headers: {
            'Authorization': 'Bearer sk_test'
          }
        }).then(function(data) {

        });

        return 0;
        var url = "https://api.paystack.co/transaction/verify/" + response.trxref;
        $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer sk_test_967b105665b7a27a9796e576bdb3a088944b8cff");
            },
            success: function (data) {
              /*
                console.log(data);
                var callBackdata = data;
                amount = data.data.amount;
                var paystack_authorization_code = callBackdata.data.authorization.authorization_code;
                var paystack_bank = callBackdata.data.authorization.bank;
                var paystack_card_type = callBackdata.data.authorization.card_type;
                var paystack_channel = callBackdata.data.authorization.channel;
                var paystack_last4 = callBackdata.data.authorization.last4;
                var paystack_message = callBackdata.message;

                //Save PaymentHistory Into the database
                var data = { "transactionReferenceNo": response.trxref, "payAmount": amount, "membershipTypeId": membershipTypeId, "PaystackAuthCode": paystack_authorization_code, "PaystackCardType": paystack_card_type, "PaystackChannel": paystack_channel, "PaystackCCLastFour": paystack_last4, "PaystackMessage": paystack_message, "promoFreeMonth": promoFreeMonth };
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "MyAccount/SavePayStackResponseInPaymentHistory", //?transactionReferenceNo=" + response.trxref + "&payAmount=" + amount + "&membershipTypeId=" + membershipTypeId,
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (result) {
                        //alert(result);
                        if (result) {
                            //$("#resultSuccess").html("Payment Successful");
                            alert("Payment Successful");
                            location.reload(true);
                        }
                        else
                            $("#resultError").html("Something Went Wrong");
                    },
                    error: function (xhr, err) {
                        alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
                        alert("responseText: " + xhr.responseText);
                    }
                });
              */
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


