(function() {
    'use strict';

    angular
        .module('brewery')
        .controller('BreweryCtrl', BreweryCtrl);

    BreweryCtrl.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$ionicHistory',
        'Utils',
        'BreweryService',
        'MapCalc',
        'LocationService',
        'HoursOfOperationService'
    ];

    function BreweryCtrl(
        $scope,
        $rootScope,
        $state,
        $ionicHistory,
        Utils,
        BreweryService,
        MapCalc,
        LocationService,
        HoursService
    ) {

        /**
         * @initialize varialbles
         * here
         */
        $scope.$on("$ionicView.beforeEnter", function(scopes, states) {

            if (states.direction == "forward") {
                $scope.breweries = [];
                $scope.specials = [];
                angular.forEach($rootScope.specials, function(sp) {
                    angular.forEach(sp.listing, function(li) {
                        $scope.specials.push(li.ID);
                    })
                })
                $scope.distances = [];
                $scope.refresh = "";
                console.log("===>Near me specials are....", $scope.specials);
                Utils.show();

                BreweryService.nearMe().then(function(breweries) {
                    $scope.breweries = breweries;
                    console.log("===Breweries....", $scope.breweries);
                    Utils.hide();
                }, function(err) {
                    console.log("===>log", err);
                })

                LocationService.getPosition().then(function(res) {
                    console.log("==>Position is..", res);
                    $rootScope.currentLocation = res;
                    $scope.currentLocation = $rootScope.currentLocation;
                }, function(err) {
                    console.log("===>Error for getting current location")
                });
            }
        });

        $scope.$on("$ionicView.afterLeave", function(scopes, states) {
            // $scope.breweries = [];
        });

        $scope.goBack = function() {
            // $state.go("home");
            $ionicHistory.goBack();
        };

        $scope.calcDistance = function(lat, lon) {
            // var cur_lat = 30.93323;
            // var cur_lon = -70.12311;

            return MapCalc.distance(lat, lon, $scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude);
            // return MapCalc.distance(lat, lon, cur_lat, cur_lon);
        };

        $scope.order = function(brewery) {
            var cur_lat = 30.93323;
            var cur_lon = -70.12311;
            // return MapCalc.distance(brewery.geolat, brewery.geolong, $scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude);
            return MapCalc.distance(brewery.geolat, brewery.geolong, cur_lat, cur_lon);
        };

        $scope.refreshData = function() {

            $scope.refresh = "fa-spin";

            Utils.show("Loading information....");

            BreweryService.clearCache().then(function(breweries) {
                $scope.refresh = "";
                $scope.breweries = breweries;
                breweries = $scope.breweries;
                Utils.hide();
                console.log($scope.breweries[0]);
            }, function(err) {
                console.log("===>log", err);
            })
        }

        $scope.getHoursMessage = function(brewery, show_long_version) {
            return HoursService.getHoursMessage(brewery, show_long_version);
        };

        $scope.hasKitchen = function(brewery) {
            return BreweryService.hasKitchen(brewery);
        };

        $scope.navigateTo = function(lat, lon) {
            launchnavigator.navigate(
                [lat, lon], [$scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude],
                function() {
                    console.log('Yay');
                },
                function(err) {
                    console.log(err);
                });
        };
    }
})();