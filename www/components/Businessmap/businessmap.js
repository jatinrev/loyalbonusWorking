angular.module('LoyalBonus')

    .controller('BusinessController', function ($scope, ajaxCall) {
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(9.0820, 8.6753),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        $scope.markers = [];
        $scope.fetchData = [];
        var infoWindow = new google.maps.InfoWindow();
        ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=1&pageSize=10&keyword=test', {}).
            success(function (fetch) {
                console.log(fetch);
                $scope.fetchData = fetch.Data;
                $scope.fetchData.forEach(function (city) {
                    //console.log(city);
                    createMarker(city);
                });
            });


        var createMarker = function (city) {
            /*console.log('city.Lat' + city.Lat);
            console.log('city.Lng' + city.Lng);
            console.log('city.name' + city.Name);*/
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(city.Lat, city.Lng),
                title: city.Name

            });
            marker.content = '<div class="infoWindowContent">' + city.Name + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);
        };
       

    });