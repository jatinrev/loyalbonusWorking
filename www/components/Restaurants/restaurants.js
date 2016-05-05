angular.module('LoyalBonus', '')
    .factory('get_business_data', function (ajaxCall, $state, get_unique_elements, loading, $q) {
        var heading_data = []
            , restaurantData = []
            , pageIndex = []
            , searchKeyword = ''
            , searchPageIndex = []
            , searchData = []; //data is stored here categorywise



        function getBusinessRecord(businessId, lat, long) {
            loading.start();
            return ajaxCall.get('webapi/BusinessMaster/SearchDataByFilters?pageIndex=' + pageIndex[businessId] + '&pageSize=5&CatId=' + businessId + '&SubCatId=&locId=&Keyword=&currlocationlatlong=' + lat + ',' + long, {})
                .then(function (response) {
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
                var heading = []
                    , data = {};
               	return ajaxCall.get('webapi/BusinessMaster/SearchDataByFilters?pageIndex=' + searchPageIndex[catId] + '&pageSize=5&CatId=' + catId + '&SubCatId=&locId=&Keyword=' + keyword + '&currlocationlatlong=' + lat + ',' + long, {})
                    .then(function (response) {
                        searchKeyword = keyword;
                        if (response.data.Data.length > 0) {
                            searchPageIndex[catId] += 1;
                        }
                        for (i in response.data.Data) {
                            searchData[catId].push(response.data.Data[i]);
                        }
                        loading.stop();
                        return searchData;

                    });

            },
            getheading: function () {
                if (heading_data.length > 0) {
                    var promise = $q.defer();
                    // var p2 = new Promise(function(resolve, reject) {
                    promise.resolve(heading_data);
                    // });
                    return promise.promise;
                } else {
                    return ajaxCall.get('webapi/BusinessMaster/GetBusinessCategory', {})
                        .then(function (res) {
                            var heading_data_temp = [];
                            for (variable in res.data.Data) {
                                heading_data_temp.push({ CategoryID: res.data.Data[variable].CategoryID, CategoryName: res.data.Data[variable].CategoryName });
                            }
                            heading_data = heading_data_temp;

                            /**for restaurant page**/
                            for (i in heading_data) {
                                restaurantData[heading_data[i].CategoryID] = [];
                                /**for indexing of each page**/
                                pageIndex[heading_data[i].CategoryID] = 0;
                                searchPageIndex[heading_data[i].CategoryID] = 0;
                                searchData[heading_data[i].CategoryID] = [];
                            }

                            $state.go("home.restaurants", { vertical: heading_data[0].CategoryID });
                            return heading_data;
                        });
                }

            },
            getBusinessRecord: getBusinessRecord,
            getSearchKeyword: function () { return searchKeyword; },
            removeSearchKeyword: function () { searchKeyword = ''; }
        };

    })



    .controller('RestaurantController', function ($scope, $rootScope, $state, ajaxCall, $ionicPlatform,
        get_unique_elements, get_user_location, $cordovaGeolocation, get_business_data,
        active_controller, loading, $ionicPopup, $timeout, saveData, $ionicScrollDelegate) {

        //console.log('hello');



        var restaurantData = [];
        active_controller.set('RestaurantController');

        $scope.restaurants = {};

        $scope.open_detail_page = function (id) {
            $state.go("home.kaseydiner", { id: id });
        };

        $scope.testing = 'in RestaurantController...';


        $scope.print_data = [];
        $scope.data = {};
        $scope.positions = {};
        $scope.heading = [];
        $scope.loadmoreNgShow = false;
        /**/

        $scope.goToMap = function (businessDetailId) {
            saveData.set('businessDetailId', businessDetailId);
            $state.go("home.map", { businessDetailId: businessDetailId });
        }

        $ionicPlatform.ready(function () {
            $scope.testing = 'in RestaurantController ionic ready.';

            get_user_location
                .get
                .then(function (position) {
                    /*position.lat, position.long
                    loading.start();
                    loading.stop();*/

                    $scope.testing = position;

                    get_business_data   //setting heading
                        .getheading()
                        .then(function (res) {
                            $scope.heading = res;
                            return res;
                        })
                        .then(function () {
                            // this if else is here when user changes navigation of business.
                            if (get_business_data.getSearchKeyword() != '' && +$state.params.vertical != 0) {
                                // search results
                                return get_business_data
                                    .search(get_business_data.getSearchKeyword(), position.lat, position.long, +$state.params.vertical)
                                    .then(function (response) {
                                        restaurantData = response[+$state.params.vertical];
                                    });
                            } else if (+$state.params.vertical != 0) {
                                return get_business_data               //getting records
                                    .getBusinessRecord(+$state.params.vertical, position.lat, position.long)
                                    .then(function (result) {
                                        restaurantData = result[+$state.params.vertical];
                                    });
                            }
                        })
                        .then(function () {
                            // pagination starts here
                            $scope.loadmoreNgShow = true;
                            var reachLast = false;
                            $scope.listData = function () {
                                if (reachLast) {
                                    return false;
                                }

                                if (get_business_data.getSearchKeyword() != '' && +$state.params.vertical != 0) {
                                    return get_business_data
                                        .search(get_business_data.getSearchKeyword(), position.lat, position.long, +$state.params.vertical)
                                        .then(function (response) {
                                            if (response[+$state.params.vertical].length == restaurantData.length) {
                                                reachLast = true;
                                                $scope.loadmoreNgShow = false;
                                            } else {
                                                restaurantData = response[+$state.params.vertical];
                                            }
                                        });
                                } else if (+$state.params.vertical != 0) {
                                    return get_business_data               //appending records
                                        .getBusinessRecord(+$state.params.vertical, position.lat, position.long)
                                        .then(function (res) { // this is appending records getting from ajax.
                                            if (res[+$state.params.vertical].length == restaurantData.length) {
                                                reachLast = true;
                                                $scope.loadmoreNgShow = false;
                                            } else {
                                                restaurantData = res[+$state.params.vertical];
                                            }
                                        });
                                }

                            };
                        });


                    $scope.showPopup = function (msg) {
                        $scope.data = {}

                        // An elaborate, custom popup
                        var myPopup = $ionicPopup.show({
                            /* template:'<i class="icon-gift"></i>',*/
                            title: '<img src="img/bonus.png"> Bonus',

                            subTitle: msg,
                            scope: $scope,
                            buttons: [
                                { text: 'Cancel', type: 'button-positive' }

                            ]
                        });
                        myPopup.then(function (res) {
                            console.log('Tapped!', res);
                        });
                        $timeout(function () {
                            myPopup.close(); //close the popup after 3 seconds for some reason
                        }, 3000);
                    };


                    /*******Search functionality******/
                    $scope.restaurants.search = function (keyword) {
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
        });


        /* ion-infinite-scroll start*/

        $scope.noMoreItemsAvailable = false;

        $scope.loadMore = function () {
            $scope.items.push({ id: $scope.items.length });

            if ($scope.items.length == 99) {
                $scope.noMoreItemsAvailable = true;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.items = [];


        /* ion-infinite-scroll end*/



        $scope.print_data = function () {
            return restaurantData;
        }

        $scope.restaurants.print_image = function (number) {
            var str = '';
            for (var i = 1; i <= 5; i++) {
                if (i > 0 && i <= number) {
                    str += '<img src="img/filledStar.png" class="filledStart">';
                } else {
                    str += '<img src="img/emptyStart.png" class="emptyStart">';
                }
            }
            return str;
        }

        $scope.restaurants.print_BonusDiscount = function (input) {
            if (input == null) {
                input = 0;
            }
            // input = input.trim();
            // input = input.replace('%', '');
            return input;
        }

        $scope.tabName = $state.params.vertical;

        $scope.tab_name = function () {
            return $state.params.vertical;
        }

    });



