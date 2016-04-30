var app = angular.module('LoyalBonus')
    .factory('get_business_data_map', function (ajaxCall, $state, get_unique_elements) {

        function getBusinessPaging(businessId, lat, long) {
            loading.start();
            return ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=' + pageIndex[businessId] + '&pageSize=10&keyword=' + keyword, {})
                .then(function (response) {
                    console.log(response);
                    if (response.data.Data.length > 0) { //records are present so add pageIndex.
                        pageIndex[businessId] += 1;
                    }
                    for (i in response.data.Data) {
                        restaurantData[businessId].push(response.data.Data[i]);
                    }
                    loading.stop();
                    return restaurantData;
                }, function errorCallback(response) {
                    console.log(response);
                });
        }



        return {


            search: function (keyword) {
                var heading = [],
                    data = {};
                return ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=' + pageIndex[businessId] + '&pageSize=10&keyword=' + keyword, {})
                    .then(function (response) {
                        console.log(response);
                        for (i in response.data.Data) {
                            heading.push(response.data.Data[i].CategoryName);
                        }
                        // Start : getting unique element of array
                        heading = get_unique_elements.get_unique_arr(heading);

                        for (i in heading) {
                            data[heading[i]] = [];
                        }

                        for (i in response.data.Data) {
                            for (heading_obj in heading) {
                                if (heading[heading_obj] == response.data.Data[i].CategoryName) {
                                    data[heading[heading_obj]].push(response.data.Data[i]);
                                }
                            }
                        }
                        //putting data in global variable.
                        globaldata.businesses = data;

                        if (typeof ($state.params.vertical) != 'undefined' && $state.params.vertical == '') {
                            for (i in data_search) {
                                // console.log('in here');
                                $state.go("home.restaurants", { vertical: i });
                                break;
                            }
                        }
                        // console.log(data);
                        return data;
                    });




            }
        };
    })

    .controller('BusinessController', function ($scope, $state, ajaxCall, $rootScope, active_controller, get_business_data_map) {
        $scope.businessmap = {};
        active_controller.set('BusinessController');
        $scope.markers = [];
        $scope.fetchData = [];
        var data;
        var infoWindow = new google.maps.InfoWindow();
        ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=1&pageSize=10&keyword=test', {}).
            success(function (fetch) {
                console.log(fetch);
                $scope.fetchData = fetch.Data;
                console.log($scope.fetchData);
                
                
        var mapOptions = {
            center: new google.maps.LatLng(9.0820, 8.6753),
            zoom: 4,
            disableDefaultUI: true
        }
        $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                createMarker($scope.fetchData);
            });

        var createMarker = function (data) {
            for (var h = 0; h < data.length; h++) {
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


            $scope.businessmap.search = function (keyword) {
               

                if (typeof (keyword) != "undefined" && keyword.length > 0) {
                    $rootScope.showMe = false;

                    get_business_data_map
                        .search(keyword)
                        .then(function (response) {
                            restaurantData = response[+$state.params.vertical];
                        });
                } else {
                    console.log('keyword empty');
                }

            };
            
        };
        function getBusinessPaging($scope, businessId) {
            $scope.businessId = 0;
            $scope.pageSize = 10;
            $scope.data = [];
            $scope.numberOfPages = function () {
                return Math.ceil($scope.data.length / $scope.pageSize);
            }
            for (var ii = 0; ii < 45; ii++) {
                $scope.data.push("Item " + ii);
            }
        }

        //We already have a limitTo filter built-in to angular,
        //let's make a startFrom filter
        app.filter('startFrom', function () {
            return function (input, start) {
                start = +start; //parse to int
                return input.slice(start);
            }
        });







    });