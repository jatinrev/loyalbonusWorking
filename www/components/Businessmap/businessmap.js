angular.module('LoyalBonus')
    .controller('BusinessController', function ($scope, ajaxCall, active_controller, $ionicHistory) {
        

        ajaxCall
            .get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=1&pageSize=10&keyword=test', {})
            .then(function (res) {
                var newCount = res.data.Data;
                    
                console.log(newCount);
                   
                function initialize() {
                    alert('kutte');
                        var mapOptions = {
                            center: new google.maps.LatLng(6.5243793, 3.3792057),
                            zoom: 9,
                            mapTypeId: 'roadmap',
                        };

                        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                        // a new Info Window is created
                        infoWindow = new google.maps.InfoWindow();

                        // Event that closes the InfoWindow with a click on the map
                        google.maps.event.addListener(map, 'click', function () {

                            infoWindow.close();
                        });

                        // Finally displayMarkers() function is called to begin the markers creation
                        displayMarkers();
                    }
                    google.maps.event.addDomListener(window, 'load', initialize);

                    function displayMarkers() {
                        alert('b');
                        //var myLatlng = new google.maps.LatLng($scope.cluster[value.Lat,value.Lng]);
                        var bounds = new google.maps.LatLngBounds();

                        for (var ii = 0; ii < newCount.length; ii++) {

                            var latlngcount = new google.maps.LatLng(newCount[ii].Lat, newCount[ii].Lng);
                            
                            var name = newCount[ii].Name;
                            
                            console.log(latlngcount);
                            
                            createMarker(latlngcount, name);
                            // Marker’s Lat. and Lng. values are added to bounds variable
                            bounds.extend(latlngcount);
                        }

                        // Finally the bounds variable is used to set the map bounds
                        // with API’s fitBounds() function
                        map.fitBounds(bounds);
                    }

                    function createMarker(latlng, name) {
                        var marker = new google.maps.Marker({
                            map: map,
                            position: latlngcount,
                            title: name
                        });
                        google.maps.event.addListener(marker, 'click', function () {

                            // Variable to define the HTML content to be inserted in the infowindow
                            var iwContent = '<div id="iw_container">' +
                                '<div class="iw_title">' + name + '</div>' +
                                '<div class="iw_content">' + address1 + '<br />' +
                                address2 + '<br />' +
                                postalCode + '</div></div>';

                            // including content to the infowindow
                            infoWindow.setContent(iwContent);

                            // opening the infowindow in the current map and at the current marker location
                            infoWindow.open(map, marker);
                        });
                    }

                    
                    
                

            });
    });         