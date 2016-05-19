var app = angular.module('LoyalBonus')
    .factory('get_business_data_map', function (ajaxCall, $state, get_unique_elements, loading, $q) {
        var heading_data = []
            , restaurantData = []
            , pageIndex = []
            , searchKeyword = ''
            , searchPageIndex = []
            , searchData = []; //data is stored here categorywise

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
            search: function (keyword, lat, long, catId) {
                loading.start();
                var heading = [],
                    data = {};
                return ajaxCall.get('webapi/BusinessMaster/SearchDataByFilters?pageIndex=' + searchPageIndex[catId] + '&pageSize=5&CatId=' + catId + '&SubCatId=&locId=&Keyword=' + keyword + '&currlocationlatlong=' + lat + ',' + long, {})
                    .then(function (response) {
                        searchKeyword = keyword;
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
            },

            getBusinessRecord: getBusinessPaging,
            getSearchKeyword: function () { return searchKeyword; },
            removeSearchKeyword: function () { searchKeyword = ''; }
        };
    })

    .controller('BusinessController', function ($scope, saveData, $state, ajaxCall, $rootScope, active_controller, get_business_data_map, NgMap, $http, $interval, watchUser) {
        active_controller.set('BusinessController');


        var bc = this;
        bc.positions = [];
        bc.center = null;
        $scope.datadeal = [];
        $scope.helperFunction = {};

        $scope.state_on = function () {
            //console.log($state.params.id);
            return $state.params.id;
        };



        NgMap
            .getMap()
            .then(function (map) {
                bc.showCustomMarker = function (BusinessId) {
                    bc.testdata(2);
                    //console.log(evt);
                    //this is for click fujnctionality for marker click

                    /*map.customMarkers.foo.setVisible(true);
                    map.customMarkers.foo.setPosition(this.getPosition());*/
                };

                bc.closeCustomMarker = function (evt) {
                    this.style.display = 'none';
                };

                bc.test = function () {
                    http://beta2.loyalbonus.com/webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong=&pageIndex=1&pageSize=10&keyword=test
                    ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong' + $rootScope.userDetails.userLocation + '=&pageIndex=0&pageSize=10&keyword=', {})
                        .then(function (fetch, a) {
                            //console.log(fetch);
                            var positions = [];
                            for (i in fetch.data.Data) {
                                positions.push(fetch.data.Data[i].Lat + ',' + fetch.data.Data[i].Lng);
                                /*positions.push(fetch.data.Data[i].Lat + ',' + fetch.data.Data[i].Lng + ',' +fetch.data.Data[i].Address1 + ',' + fetch.data.Data[i].Address2);*/
                                /*positions.push( {
                                    'latLong' : fetch.data.Data[i].Lat + ',' + fetch.data.Data[i].Lng , 
                                    'address' : fetch.data.Data[i].Address1 + ',' + fetch.data.Data[i].Address2
                                } );*/
                            }
                            var arrayUnique = function (a) {

                                return a.reduce(function (p, c) {
                                    if (p.indexOf(c) < 0) p.push(c);
                                    return p;
                                    //console.log(arrayUnique);
                                }, []);
                            };
                            bc.center = positions[0];
                            bc.positions = arrayUnique(positions);
                            //console.log(bc.positions);
                        });
                }
                bc.test();


                bc.search = function (input) {
                    console.log(input);
                    return 0;
                    ajaxCall.get('webapi/BusinessMaster/GetAllBusinessLocations?currlocationlatlong' + $rootScope.userDetails.userLocation + '=&pageIndex=0&pageSize=10&keyword=' + input, {})
                        .then(function (fetch) {
                            var positions = [];
                            bc.positions = [];
                            for (i in fetch.data.Data) {
                                positions.push(fetch.data.Data[i].Lat + ', ' + fetch.data.Data[i].Lng);
                            }
                            var arrayUnique = function (a) {
                                return a.reduce(function (p, c) {
                                    if (p.indexOf(c) < 0) p.push(c);
                                    return p;
                                }, []);
                            };
                            bc.positions = arrayUnique(positions);
                        });

                }

            });


        bc.testdata =function(BusinessId) {
            $scope.datadeal=[];
            ajaxCall
                .get('webapi/BusinessMaster/GetBusinessbyIDUserId?BusinessId=' + BusinessId + '&UserId=', {})
                .then(function (res) {

                    //console.log(res);
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
            /*loading.start();
            loading.stop();*/

            if (typeof (keyword) != "undefined" && keyword.length > 0) {
                $rootScope.showMe = false;

                get_business_data
                    .search(keyword, position.lat, position.long, +$state.params.vertical)
                    .then(function (response) {
                        restaurantData = response[+$state.params.vertical];

                    });
            } else {
                console.log('keyword empty');
            }

        };


    });