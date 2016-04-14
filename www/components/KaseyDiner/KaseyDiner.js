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
        active_controller, $ionicPlatform, businessVisit, $ionicHistory) {
        $scope.tabName = $state.params.id;
        $scope.state_on = function() {
            return $state.params.id;
        };



        active_controller.set('KaseyDinerController');

        $scope.datadeal = {};

        $scope.helperFunction = {};

        ajaxCall
            .get('webapi/BusinessMaster/GetBusinessbyID?BusinessId=' + $scope.state_on(), {})
            .then(function(res) {
                $scope.datadeal = res.data.Data[0];
                console.log($scope.datadeal);
                console.log($scope.datadeal.Lat);
                console.log($scope.datadeal.Lng);
                console.log($scope.datadeal.reviews);

            }).then(function(res) {
                $scope.locations = [{ lat: 30.899923, lon: 75.845864, place: "Bus stand, ludhiana" }];
                $scope.map;    // Google map object
                $scope.directionsDisplay;
                $scope.directionsService = new google.maps.DirectionsService();
                $scope.directionsDisplay = new google.maps.DirectionsRenderer();
                Init();
                function Init() {
                    // HTML5/W3C Geolocation
                    if (navigator.geolocation) {
                        ClosestLocation(30.852234, 75.8591939, "ludhiana,India");
                        // navigator.geolocation.getCurrentPosition( UserLocation, errorCallback,{maximumAge:60000,timeout:10000});
                    }
                    // Default to Washington, DC
                    else {
                        ClosestLocation(30.852234, 75.8591939, "ludhiana,India");
                    }
                }
                // Callback function for asynchronous call to HTML5 geolocation
                function UserLocation(position) {
                    ClosestLocation(position.coords.latitude, position.coords.longitude, "This is my Location");
                }

                // Display a map centered at the nearest location with a marker and InfoWindow.
                function ClosestLocation(lat, lon, title) {

                    var bounds = new google.maps.LatLngBounds();
                    // Create a Google coordinate object for where to center the map
                    var latlng = new google.maps.LatLng(lat, lon);

                    // Map options for how to display the Google map
                    var mapOptions = { zoom: 10, center: latlng };

                    // Show the Google map in the div with the attribute id 'map-canvas'.
                    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    // find the closest location to the user's location
                    var closest = 0;
                    var mindist = 99999;
                    for (i = 0; i < $scope.locations.length; i++) {
                        $scope.position = new google.maps.LatLng($scope.locations[i].lat, $scope.locations[i].lon);
                        bounds.extend($scope.position);
                        $scope.marker = new google.maps.Marker({
                            position: $scope.position,
                            map: $scope.map,
                            title: $scope.locations[i][0]
                        });
                    }
                    for (var i = 0; i < $scope.locations.length; i++) {
                        // get the distance between user's location and this point
                        var dist = Haversine($scope.locations[i].lat, $scope.locations[i].lon, lat, lon);

                        // check if this is the shortest distance so far
                        if (dist < mindist) {
                            closest = i;
                            mindist = dist;
                        }
                    }
                    $scope.directionsDisplay.setMap($scope.map);
                    var latlng1 = new google.maps.LatLng($scope.locations[closest].lat, $scope.locations[closest].lon);
                    calcRoute(latlng, latlng1);
                }
                // Convert Degress to Radians
                function Deg2Rad(deg) {
                    return deg * Math.PI / 180;
                }
                // Get Distance between two lat/lng points using the Haversine function
                // First published by Roger Sinnott in Sky & Telescope magazine in 1984 (“Virtues of the Haversine”)
                //
                function Haversine(lat1, lon1, lat2, lon2) {
                    var R = 6372.8; // Earth Radius in Kilometers
                    var dLat = Deg2Rad(lat2 - lat1);
                    var dLon = Deg2Rad(lon2 - lon1);
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c;
                    // Return Distance in Kilometers
                    return d;
                }
                // Call the method 'Init()' to display the google map when the web page is displayed ( load event )
                google.maps.event.addDomListener(window, 'load', Init);
                function calcRoute(origin, destination) {
                    //var selectedMode = document.getElementById("mode").value;
                    var request = {
                        origin: origin,
                        destination: destination,

                    };

                }

                $scope.temp = function() {
                    var imagePath = $scope.datadeal.QRCodePath;
                    splitImage = imagePath.split("/");
                    var imageNameWithExtension = splitImage.slice(-1).pop();
                    var imageName = imageNameWithExtension.split(".");
                    imageName = imageName[0];
                    return imageName;
                };
                
               
               
            });
 $scope.helperFunction.reviews = function(number) {
                    //console.log(typeof(number));
                    var str = '';
                    for (var i = 1; i <= number; i++) {
                        str += '<img class="filledStart" src="../../img/filledStar.png"/>';
                    }
                    var emptyStars = 5 - +number;
                    for (var j = 1; j <= emptyStars; j++) {
                        str += '<img class="emptyStart" src="../../img/emptyStart.png"/>';
                    }
                    return str;
                }


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


