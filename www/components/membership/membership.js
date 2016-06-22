angular.module('LoyalBonus')

  .controller('MemberController', function ($scope, $state, active_controller, $ionicModal,refreshTest,$sce) {
    $scope.tabName = $state.params.id;
    //$state.params.id == 'Membership'



    $scope.Test = function () {
      return refreshTest.showrefreshtest($state.current.name, $state.params);
    }

    active_controller.set('MemberController');

    $scope.groups = [];

    $scope.groups = [
      { name: 'Update/change payment method', 
        id: 1, items : [{ bkgtxt:  $sce.trustAsHtml('<div class="row"><label class="title col-50">Select Membership Type</label><label class="title col-50 padding-left-10">Premium</label></div><div class="row"><div class="col-50"><div class="row"><input class="input_left" type="radio" name="membershipType" value="" id="membershipTypeId_2"><span class="Monthly">Monthly</span></div><div class="row"><input class="input_left" type="radio" name="membershipType" value="3" id="membershipTypeId_3"><span class="Monthly">Yearly</span></div></div><div class="col-50"><div class="row"><span class="price">₦ 250.00</span></div><div class="row"><span class="price">₦ 2600.00</span></div></div></div><div id="promoCodeDiv" class="padding"><p style="color:#808080" class="mgtop20">Do you have a Promo Code?</p><input class="form-control" id="promoCode" type="text" style="width:183px;float:left"><div class="mgtop20"><a style="cursor:pointer">Apply</a></div></div><div class="row padding"><input class="mdtb10_30 mauto btn btn-success wd172" type="button" value="Proceed to Payment"></div>') }
        ]},

      { name: 'Payment History', 
        id: 2, items :[{ bkgtxt: $sce.trustAsHtml('<div class="table-responsive"><table id="tbl" class="table table-bordered"><thead><tr><th>Ref No.</th><th>Date</th><th class="text-center">Amt.</th><th class="text-center">Transaction Type</th><th class="text-center">Plan Type</th></tr></thead><tbody><tr><td>3451e546-739b-43df-82e1-96ffa99da22d</td><td>17/06/2016 12:14:28 PM</td><td class="text-right"><b>₦</b> 250.00</td><td class="text-center">Regular</td><td class="text-center">Monthly</td></tr></tbody></table></div>')}

        ]},

      

      { name: 'Cancel membership', 
        id: 3, items:[{ bkgtxt: $sce.trustAsHtml('<div class="mainMembership"><h4 class="text-center membershipClass"> We are sad to see you leaving!</h4></div><div class="membershipBody"><div class="text-center ">You will not be able to access our members benefits once cancelled. All Loyality Reward and Bonus will be reset.</div><div class="col-md-10 mgtop30 center-block" style="margin-left: 33px;"><a class="btn btn-info pull-left" href="/MyAccount/ContinueMembership">Continue Membership</a><a class="btn btn-danger pull-right" href="/MyAccount/CancelMembership">Cancel Membership</a></div></div>')}
      ]}
    ];

  
    

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


