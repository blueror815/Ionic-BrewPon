(function() {
    'use strict';

    angular
        .module('home')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [
        '$state',
        '$scope',
        '$rootScope',
        'BreweryService',
        'SpecialService',
        'PodcastService',
        'Utils',
        'BeerService',
        'Parse'
    ];

    function HomeCtrl($state, $scope, $rootScope, BreweryService, SpecialService, PodcastService, Utils, BeerService, parse) {

        $scope.homeSections = [];
        var Parse = parse.getParse();

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                var Parse = parse.getParse();

                $scope.refresh = "";
                $scope.specials = [];
                $rootScope.specials = [];
                $scope.is_loggedIn = false;
                $scope.city_name = $rootScope.city_name;
                // $scope.$digest(function() {
                //     $scope.city_name = $rootScope.city_name;
                // });


                $scope.currentUser = Parse.User.current();

                console.log("Current user is..==home controller.", $scope.currentUser);

                $scope.is_loggedIn = ($scope.currentUser) ? true : false;

                console.log("Current Login status==home controller.", $scope.is_loggedIn);

                SpecialService.getAll().then(function(data) {
                    return SpecialService.getRandomListHome(data);
                }).then(function(specials) {
                    console.log("===>Specials are...", specials);
                    $scope.specials = specials;
                    $rootScope.specials = specials;
                }, function(err) {
                    console.log(err);
                });
            })

            $scope.refreshData = function() {
                $scope.refresh = "fa-spin";

                Utils.show("Refreshing...");

                BreweryService.clearCache();
                BeerService.clearCache();
                PodcastService.clearCache();

                SpecialService.clearCache().then(function(data) {
                    return SpecialService.getRandomListHome(data);
                }).then(function(specials) {
                    Utils.hide();
                    $scope.refresh = "";

                    console.log("===>Specials are...", specials);

                    $scope.specials = specials;
                }, function(err) {
                    Utils.hide();
                    $scope.refresh = "";
                    console.log(err);
                });
            }

            $scope.showSpecial = function(id) {
                $state.go('show-brewery', { id: id });
            }

            $scope.logout = function() {

                Parse.User.logOut();

                $scope.is_loggedIn = false;

                facebookConnectPlugin.logout(

                    function onSuccess(success) {
                        Utils.alertshow("You are logged out");
                    },

                    function onError(err) {
                        Utils.alertshow("Error");
                    }
                )

                $state.go('login');
            }
        }
    }
})();