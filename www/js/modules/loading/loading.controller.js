(function() {
    'use strict';

    angular
        .module('loading')
        .controller('LoadingCtrl', LoadingCtrl);

    LoadingCtrl.$inject = [
        '$state',
        'BreweryService',
        'LocationService',
        '$scope',
        '$rootScope',
        '$ionicLoading',
        'BeerService',
        'PodcastService',
        'CommunityEventService',
        'Utils',
        '$timeout'
    ];

    function LoadingCtrl(
        $state,
        BreweryService,
        LocationService,
        $scope,
        $rootScope,
        $ionicLoading,
        BeerService,
        PodcastService,
        CommunityEventService,
        Utils,
        $timeout
    ) {
        var vm = this;

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scopes, states) {

                Utils.showLoading();

                document.addEventListener("deviceready", function() {

                    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                        Utils.hide();
                        $state.go('home');
                        Utils.errMessage("You are in offline mode. Please check out your network status")
                    })

                }, false);

                BeerService.loadData();

                PodcastService.loadData();

                CommunityEventService.loadData();

                LocationService.getPosition().then(function(res) {

                    $rootScope.currentLocation = res;

                    var geocoder = new google.maps.Geocoder();

                    var latlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);

                    geocoder.geocode({ 'latLng': latlng },

                        function(results, status) {

                            if (status == google.maps.GeocoderStatus.OK) {

                                if (results[0]) {

                                    var length = results[0].address_components.length;

                                    for (var i = 0; i < length; i++) {
                                        for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                                            if (results[0].address_components[i].types[b] == "locality") {

                                                var city = results[0].address_components[i].long_name;
                                                console.log("===>city", city);
                                                break;
                                            }
                                        }
                                    }

                                    $rootScope.city_name = city;

                                } else {
                                    console.log("address is not existed");
                                }
                            } else {
                                // alert("Geocoder failed due to: " + status);
                                console.log("===>Geocoder is failed", status);
                            }
                        }
                    );
                }, function(err) {
                    console.log("===>Error for getting current location")
                });
            });

            BreweryService.loadData().then(function(data) {
                if (data) {
                    $timeout(function() {
                        Utils.hide();
                        $state.go('home');
                    }, 3000);
                }
            });
        }
    }
})();