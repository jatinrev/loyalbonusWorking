angular.module('LoyalBonus')

    .factory('businessVisit', function (ajaxCall) {

        /**
         *  businessUid is qrCode
         */
        function give_visit(userId, businessUid, businessId) {
            ajaxCall
                .post('webapi/BusinessMaster/CreateBusinessQR',
                { BusinessId: businessId, BusinessUID: businessUid, UserId: userId }
                )
                .then(function (response) {
                    console.log(response);
                });
        }


        function giveLove(businessId, userId, isLove) {
            console.log('yoyoyo');
            return ajaxCall
            .post('webapi/BusinessMaster/BusinessGiveHeart',
            {
                BusinessId : businessId,
                UserId     : userId,
                IsLoved    : isLove
            }).then(function (result) {

                return result.data.Data;
            });
        }
        return {
            give_visit: give_visit,
            giveLove: giveLove
        };

    })

    .controller('KaseyDinerController', function ($scope, $state, MathService, ajaxCall, $cordovaBarcodeScanner,
        active_controller, $ionicPlatform, businessVisit, $ionicHistory, showRating, saveData, $ionicPopup, $timeout, $rootScope, watchUser) {

        console.log('userPresent');
        console.log($rootScope.userPresent());

        $scope.Lovedpage = {};
        var lovecount = 0;

        $scope.Lovedpage.loadKaro = function () {
            businessVisit
            .giveLove($state.params.businessId, $rootScope.userDetails.userId, false)
            .then(function (result) {
                // console.log(result);
                if (result.StatusMessage != "Success") {
                    //console.log(result);
                    console.log($scope.datadeal.lovecount);
                }
            });
        }


        $scope.state_on = function () {
            //console.log($state.params.id);
            return $state.params.id;
        };


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


        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({

                title: 'Scanned Complete'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
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
            for (var i = 0; i < input; i++) {
                output.push(i)
            }
            return output;
        }
        $scope.myloyalbonus = {};

        $scope.myloyalbonus.printTick    = function (input) {
            return mydummyJson(input);
        }
            
        $scope.myloyalbonus.printNonTick = function (input) {
            return mydummyJson(9 - +input);
        }
            
        $scope.myloyalbonus.printGift    = function (input) {
            if (+input == 10) {
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
                    // console.log(res);
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

                        businessVisit.give_visit($rootScope.userDetails.userId, qrCode, $scope.datadeal.BusinessID);
                        test();
                        return 0;


                        /*** Start : get image name ***/
                        var imagePath = $scope.datadeal.QRCodePath;
                        splitImage = imagePath.split("/");
                        var imageNameWithExtension = splitImage.slice(-1).pop();
                        var imageName = imageNameWithExtension.split(".");
                        imageName = imageName[0]; // this is the qr code to match
                        /*** Start : get image name ***/
                        qrCode = qrCode.replace('-', '');
                        if (qrCode == imageName) {
                            //run ajax here.
                            console.log('ajaxwa');
                        } else {
                            // give some error here.
                        }
                    });
                $scope.showAlert();
            };
        });
        /**** End : scanBarcode ****/

    });


