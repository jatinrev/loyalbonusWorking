angular.module('LoyalBonus')
    .factory('get_business_data', function(ajaxCall, $state, get_unique_elements) {
        var heading_data = []
        ,restaurantData = []; //data is stored here categorywise
        function get_data(latitude, longitude) {
            var heading = [],
                data = {};

            return ajaxCall.get('webapi/BusinessMaster/GetAllBusinessDataNearByKMFromCurrentLocation?currlocationlatlong=' + latitude + ',' + longitude + '&kms=50', {})
                .then(function(response) {
                    // $scope.testing = response;

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
                        for (i in data) {
                            $state.go("home.restaurants", { vertical: i });
                            break;
                        }
                    }
                    return data;
                });
        }

        function getBusinessRecord(businessId, pageIndex, lat, long) {
            return ajaxCall.get('webapi/BusinessMaster/GetBusinessByCategoryIDNearByKMFromCurrentLocation?catid='+businessId+'&currlocationlatlong='+lat+','+long+'&pageIndex='+pageIndex+'&pageSize=5', {})
                .then(function(response) {
                    for (i in response.data.Data) {
                        restaurantData[businessId].push(response.data.Data[i]);
                    }
                    return restaurantData;
                });
        }

        return {
            get: function(latitude, longitude) {
                if (typeof (globaldata.businesses) != 'undefined' && Object.keys(globaldata.businesses).length > 0) {
                    var p2 = new Promise(function(resolve, reject) {
                        resolve(globaldata.businesses);
                    });
                    return p2;
                } else {
                    return get_data(latitude, longitude);
                }
            },

            search: function(keyword) {
                var heading = [],
                    data = {};
               	return ajaxCall.get('webapi/BusinessMaster/GetBusinessbySearchKeyword?keyword=' + keyword, {})
                    .then(function(response) {
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
                                $state.go("home.restaurants", { vertical: i });
                                break;
                            }
                        }
                        return data;
                    });
            },
            getheading : function () {
                console.log('in heading');
                if( heading_data.length > 0 ) {
                    var p2 = new Promise(function(resolve, reject) {
                        resolve(heading_data);
                    });
                    return p2;
                } else {
                    return ajaxCall.get('webapi/BusinessMaster/GetBusinessCategory', {})
                    .then(function (res) {
                        var heading_data_temp = [];
                        for (variable in res.data.Data) {
                            heading_data_temp.push({ CategoryID : res.data.Data[variable].CategoryID, CategoryName : res.data.Data[variable].CategoryName });
                        }
                        heading_data = heading_data_temp;

                        /**for restaurant page**/
                        for (i in heading_data) {
                            restaurantData[heading_data[i].CategoryID] = [];
                        }
                        $state.go("home.restaurants", { vertical: heading_data[0].CategoryID});
                        return heading_data;
                    });
                }
            },
            getBusinessRecord : getBusinessRecord
        };
    })

    .controller('RestaurantController', function($scope, $rootScope, $state, ajaxCall, $ionicPlatform,
        get_unique_elements, get_user_location, $cordovaGeolocation, get_business_data,
        active_controller, loading) {
        var restaurantData = [];
        active_controller.set('RestaurantController');

        $scope.restaurants = {};

        $scope.open_detail_page = function(id) {
            $scope.restaurants.demo = { id: id, tension : 'nhi'};
            $state.go("home.kaseydiner", { id: id });
        };

        $scope.testing = 'in RestaurantController...';


        $scope.print_data = [];
        $scope.data 	  = {};
        $scope.positions  = {};
        $scope.heading    = [];

        /**/

        $scope.restaurants.search = function(keyword) {
            if( typeof(keyword) != "undefined" && keyword.length > 0 ) {
                loading.start();
                $rootScope.showMe = false;
                get_business_data
                    .search(keyword)
                    .then(function(response) {
                    	loading.stop();
                        $scope.data = response;
                    });
            } else {
                console.log('keyword empty');
            }
        };

        $ionicPlatform.ready(function() {
            $scope.testing = 'in RestaurantController ionic ready.';

            get_user_location
            .get
            .then(function(position) {
                /*position.lat, position.long
                loading.start();
                loading.stop();*/

                $scope.testing = position;
                
                get_business_data   //setting heading
                .getheading()
                .then(function (res) {
                    $scope.heading = res;
                })
                .then(function () {
                    get_business_data               //getting records
                    .getBusinessRecord(+$state.params.vertical, 1, position.lat, position.long)
                    .then(function (res) {
                        restaurantData = res[+$state.params.vertical];
                    });
                });
                
            });


        });

        $scope.print_data = function () {
            return restaurantData;
        }

        $scope.restaurants.print_image = function (number) {
            var array = [];
            var str = '';
            for (var i = 1; i <= number; i++) {
                str += '<img src="img/filledStar.png" class="filledStart">';
            }
            var emptyStars = 5 - +number;
            for (var j=1; j<= emptyStars; j++ ) {
                str += '<img src="img/emptyStart.png" class="emptyStart">';
            }
            return str;
        }

        $scope.tabName = $state.params.vertical;

        $scope.tab_name = function() {
            return $state.params.vertical;
        }


    });



