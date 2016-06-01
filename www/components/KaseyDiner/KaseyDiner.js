angular.module('LoyalBonus')

    .factory('businessVisit', function (ajaxCall, loading) {

        /**
         *  businessUid is qrCode
         */
        function give_visit(userId, businessUid, businessId) {
            return ajaxCall
                .post('webapi/BusinessMaster/CreateBusinessQR',
                { BusinessId: businessId, BusinessUID: businessUid, UserId: userId }
                );
                
        }


        function giveLove(businessId, userId, isLove) {
            loading.start();
            return ajaxCall
            .post('webapi/BusinessMaster/BusinessGiveHeart',
            {
                UserId     : userId,
                BusinessId : businessId,
                IsLoved    : isLove
            }).then(function (result) {
                loading.stop();
                return result.data.Data;
            });
        }
        return {
            give_visit: give_visit,
            giveLove: giveLove
        };

    })

    .controller('KaseyDinerController', function ($scope, $state, MathService, ajaxCall, $cordovaBarcodeScanner,
        active_controller, $ionicPlatform, businessVisit, $ionicHistory, showRating, saveData, $ionicPopup, $timeout, $rootScope, watchUser, refreshTest,get_business_data, loading) {

        console.log('testetse');

        $rootScope.showMe = false;
        get_business_data.removeSearchKeyword();

        $scope.state_on = function () {
            return $state.params.id;
        };

        $scope.Test = function () {
            return refreshTest.showrefreshtest($state.current.name, $state.params);
        }

        $scope.Lovedpage = {};
        var lovecount = 0;

        $scope.Lovedpage.loadKaro = function (isLoveStatus) {
            businessVisit
            .giveLove($scope.state_on(), $rootScope.userDetails.userId, isLoveStatus)
            .then(function (result) {
                if (result.StatusMessage != "Success") {
                    // console.log($scope.datadeal.lovecount);
                    return $scope.Test();

                }
            });
        }

        $scope.isAndroid = ionic.Platform.isAndroid();
        // isIOS = ionic.Platform.isIOS();
        // console.log(isAndroid);


        $scope.showPopup = function (msg) {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                /* template:'<i class="icon-gift"></i>',*/
                title: '<img src="img/bonus.png"> Bonus',

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
            }, 3000);
        };

        $scope.showPopupMy = function (msg) {
            if(msg == 0) {
                msg = '0';
            }
            console.log(msg);
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                /* template:'<i class="icon-gift"></i>',*/
                title: '<img src="img/bonus.png"> My Bonus',

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
            }, 3000000);
        };


        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({

                title: 'Scanned Complete'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
        $scope.showAlertscanner = function (msg,status) {
            console.log(status);
            
            $scope.data = {};

           if(status == 1) {
            var image = '<img src="img/chk.png"> ';
           } else {
            var image = '<img src="img/cancel.png">';
           }
                

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                title: image,
                subTitle: msg,
                scope: $scope,
                buttons: [
                    { text: 'Ok', type: 'button-positive' }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000000);
        };
        
        $scope.showPopupFor = function (msg) {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                /* template:'<i class="icon-gift"></i>',*/
                title: '<img src="img/bonus.png"> Number Of Visits',

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
            }, 3000);
        };

        $scope.toggleItem = function (item) {
            if ($scope.isItemShown(item)) {
                $scope.shownItem = null;
            } else {
                $scope.shownItem = item;
            }
        };
        $scope.isItemShown = function (item) {
            return $scope.shownItem === item;
        };





        $scope.goToMap = function (businessDetailId) {
            saveData.set('businessDetailId', businessDetailId);
            $state.go("home.map", { businessDetailId: businessDetailId });
        }

        
        function mydummyJson(input) {

            var output = [];
            //console.log(input);
            for (var i = 0; i < input; i++) {
                output.push(i)
                //console.log(output.push(i));
            }
            return output;
        }
        $scope.myloyalbonus = {};


        $scope.myloyalbonus.printTick    = function ( uservisits,input ) {
            console.log('printTick');
            console.log(input)
            console.log(uservisits);
            var answer =  uservisits,input;
            /*console.log(answer);*/
            return mydummyJson(answer);
        }
            
        $scope.myloyalbonus.printNonTick = function (uservisits , input ) {
            console.log('printNonTick');
            console.log(input);
            console.log(uservisits);
            //console.log(BonusDiscountToCust);
            var answerNontick =  uservisits - input ;
            return mydummyJson(answerNontick);
        }
            
        $scope.myloyalbonus.printGift    = function (input,uservisits) {
            if (+input == uservisits) {
                return mydummyJson(0);
            } else {
                return mydummyJson(1);
            }
        }



        active_controller.set('KaseyDinerController');

        $scope.datadeal       = {};
        
        $scope.newScope       = {}; // helper variable
        
        $scope.helperFunction = {};

        // $scope.checkGlobal = function () {
        //console.log($rootScope.userDetails.userId);
        // }

        // http://beta2.loyalbonus.com/webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=2&UserId=12
        function test() {
            var userIdInTestFunction = function () {
                if( watchUser.userPresent() == 1 ) {
                    return $rootScope.userDetails.userId;
                }
                return '';
            }
            ajaxCall
                .get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' + $scope.state_on() + '&UserId=' + userIdInTestFunction(), {})
                .then(function (res) {

                    console.log(res);
                    $scope.datadeal = res.data.Data[0];
                    saveData.set('kaseyDinnerBusinessName', $scope.datadeal.Name);
                    //console.log($scope.datadeal);
                    return $scope.datadeal;
                }).then(function (res) {
                    var centerDefined = 0;
                    $scope.newScope.positions = [];
                    $scope.newScope.address = [];
                    for (i in res.businesslocationsList) {
                        //console.log(res.businesslocationsList);
                        if (centerDefined == 0) {
                            $scope.newScope.center = res.businesslocationsList[i].Lat + ',' + res.businesslocationsList[i].Lng;
                            centerDefined = 1;
                        }
                        $scope.newScope.positions.push(res.businesslocationsList[i].Lat + ',' + res.businesslocationsList[i].Lng);
                        /**Start : for address printing**/
                        $scope.newScope.address.push(res.businesslocationsList[i].Address1);
                        /***End : for address printing***/
                    }
                     //console.log(res);
                    
                });
        }
        test();



        $scope.helperFunction.reviews = function (number) {
            //console.log(typeof(number));
            var str = '';
            for (var i = 1; i <= number; i++) {
                str += '<img class="filledStart" src="img/filledStar.png"/>';
            }
            var emptyStars = 5 - +number;
            for (var j = 1; j <= emptyStars; j++) {
                str += '<img class="emptyStart" src="img/emptyStart.png"/>';
            }
            return str;
        }

        $scope.helperFunction.write_review = function (businessId, businessImage, BusinessStars) {
            // BusinessStars can be null also(when user have not given any rating)
            $state.go("home.review", { businessId: businessId, businessImg: businessImage, businessRating: BusinessStars });
        };

        $scope.helperFunction.go_to_login = function() {
            $state.go("signin");
        };

        /**** End : rating service ****/

        /*$scope.Lovedpage.enableLoved = function () {
            businessVisit
            .giveLove($state.params.id, $rootScope.userDetails.userId, true)
            .then(function (res) {
                console.log(res);
                if(res.data.StatusMessage == 'Success') {


                }
            });
        };*/


        /*** Start : scanBarcode ***/
        $ionicPlatform.ready(function () {
            $scope.scanBarcode = function () {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function (imageData) {
                        return imageData.text;
                        console.log("Barcode Format -> " + imageData.format);
                        console.log("Cancelled -> " + imageData.cancelled);
                    }, function (error) {
                        console.log("An error happened -> " + error);
                    })
                    .then(function (qrCode) {
                        loading.start();
                        businessVisit.give_visit($rootScope.userDetails.userId, qrCode, $scope.datadeal.BusinessID)
                        .then(function (response) {
                            
                            if (response.data.Data == "QrCode submitted")
                            {
                                 
                                $scope.showAlertscanner('Success Thank you for visiting us! You will receive '+$scope.datadeal.LoyalDiscount +' %  OFF for this visit.', 1);
                                test();
                            } else if(response.data.StatusMessage == "Failed") {
                                $scope.showAlertscanner(response.data.Data, 0);
                            }
                            loading.stop();
                        },function(error)
                        {
                                $scope.showAlertscanner('Your Scan Cant be completed');
                        });
                        

                        return 0;


                        
                    });
                
            };
        });
        /**** End : scanBarcode ****/

    });


