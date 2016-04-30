angular.module('LoyalBonus')

    .factory('businessVisit', function(ajaxCall) {

        /**
         *  businessUid is qrCode
         */
        function give_visit(userId, businessUid, businessId) {
            ajaxCall
                .post('webapi/BusinessMaster/CreateBusinessQR',
                { BusinessId: businessId, BusinessUID: businessUid, UserId: userId }
                )
                .then(function(response) {
                    console.log(reponse);
                });
        }
        return {
            give_visit: give_visit
        };
    })

    .controller('KaseyDinerController', function($scope, $state, MathService, ajaxCall, $cordovaBarcodeScanner,
        active_controller, $ionicPlatform, businessVisit, $ionicHistory, saveData, $ionicPopup, $timeout) {
        $scope.state_on = function() {
            return $state.params.id;
        };


         $scope.showPopup = function () {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({

                title: 'Bonus',
                subTitle: 'Gift Box',
                scope: $scope,
                buttons: [
                    { text: 'Cancel', type: 'button-positive' }
                    /*{
                      text: '<b>Save</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                        if (!$scope.data.wifi) {
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                        } else {
                          return $scope.data.wifi;
                        }
                      }
                    },*/
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };


        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({

                template: 'Visit 10 times to receive Bonus.'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

         $scope.toggleItem= function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };


        $scope.goToMap = function (businessDetailId) {
            saveData.set('businessDetailId', businessDetailId);
            $state.go("home.map", { businessDetailId: businessDetailId });
        }


        function mydummyJson (input) {
            var output = [];
            for (var i = 0; i < input; i++) {
                output.push(i)
            }
            return output;
        }
        $scope.myloyalbonus = {};

        $scope.myloyalbonus.printTick = function (input) {
            return mydummyJson(input);
        }

        $scope.myloyalbonus.printNonTick = function (input) {
            return mydummyJson(9 - +input);
        }

        $scope.myloyalbonus.printGift = function (input) {
            if(+input == 10) {
                return mydummyJson(0);
            } else {
                return mydummyJson(1);
            }
        }



        active_controller.set('KaseyDinerController');

        $scope.datadeal = {};

        $scope.newScope = {};

        $scope.helperFunction = {};


        // http://beta2.loyalbonus.com/webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=2&UserId=12
        ajaxCall
        .get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' + $scope.state_on() +'&UserId=259', {})
        .then(function(res) {
            console.log(res);
            //console.log(res);
            $scope.datadeal = res.data.Data[0];
            //console.log($scope.datadeal);
        }).then(function(res) {
            function initialize() {
                var myLatlng = new google.maps.LatLng($scope.datadeal.Lat, $scope.datadeal.Lng);
                var mapOptions = {
                    center: myLatlng,
                    zoom: 20
                    
                };
                $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                    var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: $scope.map
                });
                    if (typeof($scope.datadeal.Lat =='undefined') || typeof($scope.datadeal.Lng == 'undefined'))
                    {

                        newScope = (($scope.datadeal.Lat),($scope.datadeal.Lng));
                        //console.log(newScope); 
                    }
            }

            initialize();

           /* $scope.centerOnMe = function() {
                if (!$scope.map) {
                    return;
                }
                $scope.loading = $ionicLoading.show({
                    content: 'Getting current location...',
                    showBackdrop: false
                });

                navigator.geolocation.getCurrentPosition(function(pos) {

                    $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                    //console.log($scope.new_location);
                    $scope.loading.hide();
                }, function(error) {
                    alert('Unable to get location: ' + error.message);
                });
            };*/
        });


        $scope.helperFunction.reviews = function(number) {
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

        $scope.helperFunction.write_review = function(businessId, businessImage, BusinessStars) {
            // BusinessStars can be null also(when user have not given any rating)
            $state.go("home.review", { businessId: businessId, businessImg : businessImage, businessRating : BusinessStars });
        };

        /**** End : rating service ****/

        /*** Start : scanBarcode ***/
        $ionicPlatform.ready(function() {
            $scope.scanBarcode = function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(imageData) {
                        return imageData.text;
                        console.log("Barcode Format -> " + imageData.format);
                        console.log("Cancelled -> " + imageData.cancelled);
                    }, function(error) {
                        console.log("An error happened -> " + error);
                    })
                    .then(function(qrCode) {

                        businessVisit.give_visit('215', qrCode, $scope.datadeal.BusinessID);
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
            };
        });
        /**** End : scanBarcode ****/

    });


