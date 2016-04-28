angular.module('LoyalBonus')

    .controller('BusinessController', function ($scope, ajaxCall) {
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(9.0820, 8.6753),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        $scope.markers = [];
        $scope.fetchData = [];
        var data;
        var infoWindow = new google.maps.InfoWindow();
        ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=1&pageSize=10&keyword=test', {}).
            success(function (fetch) {
                //console.log(fetch);
                $scope.fetchData = fetch.Data;
               /* console.log($scope.fetchData.length);
                for(var i=0; i< $scope.fetchData.length; i++) {
                    data = $scope.fetchData[i];
                }*/
                    createMarker($scope.fetchData);
            });

        var createMarker = function (data) {
          
        //console.log('data');
      //  console.log(data);
     for (var h=0; h < data.length; h++){
           var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(data[h].Lat, data[h].Lng),
                title: data[h].Name

            });
            marker.content = '<div class="infoWindowContent">' + data[h].Name + '</div>';
            console.log(marker.content);
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        }

        };
       

    });