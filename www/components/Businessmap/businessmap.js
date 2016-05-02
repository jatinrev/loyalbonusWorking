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

    .controller('BusinessController', function ($scope, $state, ajaxCall, $rootScope, active_controller, get_business_data_map, NgMap, $http, $interval) {
        active_controller.set('BusinessController');

        
        var bc = this;
        bc.positions = [
            [54.779951, 9.334164], [47.209613, 15.991539],
            [51.975343, 7.596731], [51.97539, 7.596962], 
            [47.414847, 8.23485], [47.658028, 9.159596],
            [47.525927, 7.68761], [50.85558, 9.704403],
            [54.320664, 10.285977], [49.214374, 6.97506],
            [52.975556, 7.596811], [52.975556, 7.596811],
            [52.975556, 7.596811], [52.975556, 7.596811], 
            [52.975556, 7.596811], [52.975556, 7.596811],
            [52.975556, 7.596811], [52.975556, 7.596811],
            [52.975556, 7.596811], [52.975556, 7.596811]
        ];
            
        bc.dynMarkers = [];
        NgMap
        .getMap()
        .then(function(map) {
            console.log(map);
            var bounds = new google.maps.LatLngBounds();
            for (var k in map.customMarkers) {
              var cm = map.customMarkers[k];
              bc.dynMarkers.push(cm);
              bounds.extend(cm.getPosition());
            };
            
            bc.markerClusterer = new MarkerClusterer(map, bc.dynMarkers, {});
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);  
        });


        /*ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=1&pageSize=10&keyword=test', {})
        .then(function (fetch) {
            console.log(fetch);
        });*/



    });