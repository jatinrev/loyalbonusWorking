var app = angular.module('LoyalBonus')
    .factory('get_business_data_map', function (ajaxCall, $state, get_unique_elements, loading, $q, $rootScope) {
        var heading_data  = []
        , restaurantData  = []
        , pageIndex       = []
        , searchKeyword   = ''
        , searchPageIndex = []
        , searchData      = []; //data is stored here categorywise

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

        function sort(multi_array) {
            var sorted_array      = []
            , temp_multi_array    = multi_array
            , go                  = 1
            , sorting_array_index = 0;
            for (i in multi_array) {
                for(j in temp_multi_array) {
                    if( multi_array[i] == temp_multi_array[j] ) {
                        go                  = 1;
                        sorting_array_index = 0;
                        for (k in sorted_array) {
                            if( sorted_array[k].positions == multi_array[i].positions ) {
                                go                  = 0; // add to existing array.
                                sorting_array_index = k;
                                break;
                            }
                        }
                        if( go == 0 ) { // if the variable is repeating in the array.
                            sorted_array[sorting_array_index].businessIds.push(multi_array[i].businessId);
                        } else {        // if the variable is not repeating in the array.
                            sorted_array.push({ positions : multi_array[i].positions, businessIds : [ multi_array[i].businessId ] });
                        }
                    }
                }
            }
            return sorted_array;
        }


        return {
            search: function (keyword) {
                // below is the outdated function
                // loading.start();
                return ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong' + $rootScope.userDetails.userLocation + '=&pageIndex=1&pageSize=10&keyword=' + keyword, {})
                .then(function (fetch) {
                    var test         = [];
                    for(i in fetch.data.Data) {
                        test.push({ businessId : fetch.data.Data[i].BusinessId, positions : fetch.data.Data[i].Lat + ',' + fetch.data.Data[i].Lng})
                    }
                    return sort(test);
                });
            },

            getBusinessRecord   : getBusinessPaging,
            getSearchKeyword    : function () { return searchKeyword; },
            removeSearchKeyword : function () { searchKeyword = ''; },
            sort_multi_array    : sort
        };
    })

    .controller('BusinessController', function ($scope, saveData, $state, ajaxCall, $rootScope, active_controller, get_business_data_map, NgMap, $http, $interval, loading) {
        active_controller.set('BusinessController');


        var bc = this;
        bc.positions = [];
        bc.center = null;
        $scope.datadeal = [];
        $scope.helperFunction = {};
        $scope.loadmoreNgShow = false;

        $scope.state_on = function () {
            //console.log($state.params.id);
            return $state.params.id;
        };



        NgMap
            .getMap()
            .then(function (map) {
                loading.start();
                bc.showCustomMarker = function (BusinessId) {
                    //console.log(BusinessId)
                    bc.testdata(2);
                    //console.log(evt);
                    //this is for click fujnctionality for marker click

                    /*map.customMarkers.foo.setVisible(true);
                    map.customMarkers.foo.setPosition(this.getPosition());*/
                    loading.stop();
                };

                bc.closeCustomMarker = function (evt) {
                    this.style.display = 'none';
                };

                bc.test = function () {
                    loading.start();
                    $scope.loadmoreNgShow = true;
                    ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong' + $rootScope.userDetails.userLocation + '=&pageIndex=0&pageSize=10&keyword=', {})
                        .then(function (fetch) {
                            var positions = []
                            , test        = [];

                            for(i in fetch.data.Data) {
                                test.push({ businessId : fetch.data.Data[i].BusinessId, positions : fetch.data.Data[i].Lat + ',' + fetch.data.Data[i].Lng})
                            }
                            var sortedArray = get_business_data_map
                                              .sort_multi_array(test);

                            bc.center = sortedArray[0].positions;
                            bc.positions = sortedArray;

                            loading.stop()
                        });
                }
                bc.test();

            });


        bc.testdata =function(BusinessId) {
            $scope.datadeal=[];
            ajaxCall
                .get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' + BusinessId + '&UserId=', {})
                .then(function (res) {
                    $scope.datadeal.push(res.data.Data[0]);
                    // $scope.datadeal.push(res.data.Data[0]);
                    console.log($scope.datadeal);
                });

        }

        $scope.helperFunction.reviews = function (number) {
            console.log(typeof(number));
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
        $scope.goToMap = function (businessDetailId) {
            saveData.set('businessDetailId', businessDetailId);
            $state.go("home.restaurants", { vertical: 1 }, { businessDetailId: businessDetailId });
        }

        /*******Search functionality******/
        bc.search = function (keyword) {
            if (typeof (keyword) != "undefined" && keyword.length > 0) {
                $rootScope.showMe = false;
                get_business_data_map
                    .search(keyword)
                    .then(function (response) {
                        bc.positions = response;
                    });
            } else {
                console.log('keyword empty');
            }
        };


    });