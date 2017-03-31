/**
 * @ngdoc object
 * @name core.Controllers.ViewBreweryController
 * @description ViewBreweryController
 * @requires ng.$scope
 */


(function() {
    'use strict';

    angular
        .module('brewery')
        .controller('BreweryDetailCtrl', BreweryDetailCtrl);

    BreweryDetailCtrl.$inject = [
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        'BreweryService',
        'HoursOfOperationService',
        'MapCalc',
        'Utils',
        'PodcastService',
        'CommunityEventService',
        '$ionicHistory',
        'SpecialService',
        '$cordovaLaunchNavigator'
    ];

    function BreweryDetailCtrl(
        $scope,
        $state,
        $rootScope,
        $stateParams,
        BreweryService,
        HoursService,
        MapCalc,
        Utils,
        PodcastService,
        CommunityEventService,
        $ionicHistory,
        SpecialService,
        $cordovaLaunchNavigator
    ) {

        /**
         * @initialize varialbles here
         * @get initial data here
         */
        $scope.$on("$ionicView.beforeEnter", function(scopes, states) {

            $scope.brewery_id = $stateParams.id;
            $scope.currentLocation = $rootScope.currentLocation;
            $scope.is_loaded = false;
            $scope.beers = [];
            $scope.hour_msg = "";
            $scope.formattedPhone = "";
            $scope.podcast_items = [];

            PodcastService.getForClient($scope.brewery_id).then(function(podcast_items) {
                $scope.podcast_items = podcast_items;
            }, function(error) {
                console.log("===>Error", error);
            });

            CommunityEventService.getForClient($scope.brewery_id).then(function(data) {
                console.log('events items', data);
                $scope.community_events = data;
            });

            SpecialService.getForBrewery($scope.brewery_id).then(SpecialService.getRandomList).then(function(specials) {
                console.log("====>Specials for brewery are..", specials);
                $scope.specials = specials;
            });

            Utils.show();
            BreweryService.getBrewery($scope.brewery_id).then(function(brewery) {
                Utils.hide();
                $scope.is_loaded = true;
                $scope.brewery = brewery;
                $scope.beers = $scope.brewery.on_tap_beers;
                $scope.hour_msg = HoursService.getHoursMessage($scope.brewery, true).storeHours.message;
                $scope.formattedPhone = 'tel://1' + $scope.brewery.phone.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
                $scope.distance = $scope.calcDistance($scope.brewery.geolat, $scope.brewery.geolong).toFixed(1) + ' mi.';
            });
        });

        $scope.goBack = function() {
            $ionicHistory.goBack();
        }

        $scope.goHome = function() {
            $state.go('home');
        }
        $scope.showPodcastItem = function(podcast_id) {
            $state.go('podcast', { id: podcast_id });
        };

        $scope.calcDistance = function(lat, lon) {
            // var cur_lat = 30.93323;
            // var cur_lon = -70.12311;

            return MapCalc.distance(lat, lon, $scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude);
            // return MapCalc.distance(lat, lon, cur_lat, cur_lon);
        };

        $scope.showCommunityEvent = function(community_event_id) {
            $state.go('event-detail', { id: community_event_id });
        }

        $scope.showBeer = function(beer_id) {
            $state.go('beer-detail', { id: beer_id });
        }

        $scope.navigateTo = function(lat, lon) {
            console.log("lat, lon", lat, lon);
            $cordovaLaunchNavigator.navigate(
                [lat, lon], [$scope.currentLocation.coords.latitude, $scope.currentLocation.coords.longitude],
                function() {
                    console.log('Yay');
                },
                function(err) {
                    console.log(err);
                });
        }
    }
})();