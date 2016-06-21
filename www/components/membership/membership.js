angular.module('LoyalBonus')

  .controller('MemberController', function ($scope, $state, active_controller, refreshTest,$sce) {
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
        id: 2, items :[{ bkgtxt: $sce.trustAsHtml('<div class="row"></div><div class="col-25"><label class="title col-50">Transaction Ref No.</label></div><div class="col-25"><label class="title col-50">Transaction Date</label></div><div class="col-25"><label class="title col-50">Transaction Amt.</label></div><div class="col-25"><label class="title col-50">Transaction Type </label></div>')}

        ]},

      

      { name: 'Cancel membership', 
        id: 3, 
      }
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


