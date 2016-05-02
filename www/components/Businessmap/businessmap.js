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
        bc.positions = [];

        bc.center = null;

        NgMap
        .getMap()
        .then(function(map) {
          bc.showCustomMarker= function(evt) {
            map.customMarkers.foo.setVisible(true);
            map.customMarkers.foo.setPosition(this.getPosition());
          };
          bc.closeCustomMarker= function(evt) {
            this.style.display = 'none';
          };

          bc.test = function () {
            ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong'+$rootScope.userDetails.userLocation+'=&pageIndex=0&pageSize=10&keyword=', {})
            .then(function (fetch) {
                var positions = [];
                for (i in fetch.data.Data) {
                    positions.push(fetch.data.Data[i].Lat+', '+fetch.data.Data[i].Lng); 
                }
                var arrayUnique = function(a) {
                    return a.reduce(function(p, c) {
                        if (p.indexOf(c) < 0) p.push(c);
                        return p;
                    }, []);
                };
                bc.center = positions[0];
                bc.positions = arrayUnique(positions);
            });
          }
          bc.test();


          bc.search = function (input) {
            console.log(input);
            return 0;
            ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong'+$rootScope.userDetails.userLocation+'=&pageIndex=0&pageSize=10&keyword='+input, {})
            .then(function (fetch) {
                var positions = [];
                bc.positions = [];
                for (i in fetch.data.Data) {
                    positions.push(fetch.data.Data[i].Lat+', '+fetch.data.Data[i].Lng); 
                }
                var arrayUnique = function(a) {
                    return a.reduce(function(p, c) {
                        if (p.indexOf(c) < 0) p.push(c);
                        return p;
                    }, []);
                };
                bc.positions = arrayUnique(positions);
            });
          }

        });


    });