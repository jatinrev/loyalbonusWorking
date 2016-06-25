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
          console.log(res);
          return res;
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
          return res.data.Data;
        });
      },

      /*
        Method - Post : ApplyPromoCode 
        [Parameters : userId, promoCode, amount, membershipTypeId]
      */
      ApplyPromoCode : function () {
        return ajaxCall
        .Post('webapi/MyAccountAPI/ApplyPromoCode', {})
        .then(function (res) {
          console.log(res);
          return res;
        });
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

    $scope.membership
    .GetMembershipTypeByUserId()
    .then(function (res) {
      $scope.datadeal.membershipType = res.MembershipTypes;
      data_ctr.updatepayment     =  '<div class="row">';
      data_ctr.updatepayment     +=  '<label class="title col-50">Select Membership Type</label>';
      data_ctr.updatepayment     +=  '<label class="title col-50 padding-left-10">Premium</label>';
      data_ctr.updatepayment     += '</div>';
      data_ctr.updatepayment     += '<div class="row">';
      data_ctr.updatepayment     +=    '<div class="col-50">';
      data_ctr.updatepayment     +=      '<div class="row">';
      data_ctr.updatepayment     +=        '<input class="input_left" ng-model="datadeal.test" type="radio" name="membershipType" value="" id="membershipTypeId_2">';
      data_ctr.updatepayment     +=        '<span class="Monthly">Monthly</span>';
      data_ctr.updatepayment     +=      '</div>';
      data_ctr.updatepayment     +=    '</div>';
      data_ctr.updatepayment     +=    '<div class="col-50">';
      data_ctr.updatepayment     +=      '<div class="row">';
      data_ctr.updatepayment     +=        '<span class="price">₦ 250.00</span>';
      data_ctr.updatepayment     +=      '</div>';
      data_ctr.updatepayment     +=    '</div>';
      data_ctr.updatepayment     += '</div>';
      data_ctr.updatepayment     += '<div id="promoCodeDiv" class="padding">';
      data_ctr.updatepayment     +=    '<p style="color:#808080" class="mgtop20">Do you have a Promo Code?</p>';
      data_ctr.updatepayment     +=    '<input class="form-control" id="promoCode" type="text" style="width:183px;float:left">';
      data_ctr.updatepayment     +=    '<div class="mgtop20">';
      data_ctr.updatepayment     +=      '<a style="cursor:pointer">Apply</a>';
      data_ctr.updatepayment     +=    '</div>';
      data_ctr.updatepayment     += '</div>';
      data_ctr.updatepayment     += '<div class="row padding"><input class="mdtb10_30 mauto btn btn-success wd172" type="button" value="Proceed to Payment"></div>';
      // ADDING ITEM TO ARRAY
      $scope.groups[0].items = $sce.trustAsHtml(data_ctr.updatepayment);
    });

    $scope.testingyo = function() {
      console.log($scope.datadeal.test);
    }

    $scope.Test = function () {
      return refreshTest.showrefreshtest($state.current.name, $state.params);
    }

    active_controller.set('MemberController');

    $scope.groups = [
      { 
        name : 'Update/change payment method', 
        id     : 1,
        items  : ''
      },
      { 
        name : 'Payment History', 
        id     : 2, 
        items  : $sce.trustAsHtml('<div class="table-responsive"><table id="tbl" class="table table-bordered"><thead><tr><th>Ref No.</th><th>Date</th><th class="text-center">Amt.</th><th class="text-center">Transaction Type</th><th class="text-center">Plan Type</th></tr></thead><tbody><tr><td>3451e546-739b-43df-82e1-96ffa99da22d</td><td>17/06/2016 12:14:28 PM</td><td class="text-right"><b>₦</b> 250.00</td><td class="text-center">Regular</td><td class="text-center">Monthly</td></tr></tbody></table></div>')
      },
      { 
        name   : 'Cancel membership',
        id     : 3,
        items  : $sce.trustAsHtml('<div class="mainMembership"><h4 class="text-center membershipClass"> We are sad to see you leaving!</h4></div><div class="membershipBody"><div class="text-center ">You will not be able to access our members benefits once cancelled. All Loyality Reward and Bonus will be reset.</div><div class="col-md-10 mgtop30 center-block" style="margin-left: 33px;"><a class="btn btn-info pull-left" href="/MyAccount/ContinueMembership">Continue Membership</a><a class="btn btn-danger pull-right" href="/MyAccount/CancelMembership">Cancel Membership</a></div></div>')
      }
    ];

    console.log($scope.groups);

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


