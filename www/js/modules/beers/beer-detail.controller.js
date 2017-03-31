(function() {
    'use strict';

    angular
        .module('beer')
        .controller('BeerDetailCtrl', BeerDetailCtrl);

    BeerDetailCtrl.$inject = [
        '$scope',
        '$state',
        '$ionicHistory',
        'BeerService',
        'Utils',
        '$rootScope',
        'FavoriteService',
        'Parse'
    ];

    function BeerDetailCtrl(
        $scope,
        $state,
        $ionicHistory,
        BeerService,
        Utils,
        $rootScope,
        FavoriteService,
        parse
    ) {

        activate();

        function activate() {

            $scope.beer = {};
            $scope.favorites = [];
            // $scope.currentUser = $rootScope.currentUser;

            $scope.is_loggedIn = ($scope.currentUser) ? true : false;

            $scope.$on('$ionicView.beforeEnter', function(scope, states) {

                Utils.show();

                var Parse = parse.getParse();

                $scope.currentUser = Parse.User.current();

                var beer_id = $state.params.id;
                $scope.beer = {};
                $scope.favorites = [];
                $scope.onTapBreweries = [];
                $scope.favoriteBeers = [];

                // PRC TEMP
                BeerService.getOnTapFromBeer(beer_id).then(function(onTapBreweries) {
                    $scope.onTapBreweries = onTapBreweries;
                }, function(err) {
                    console.log(err);
                });

                FavoriteService.get($scope.currentUser).then(function(favorites) {

                    if (favorites.length == 0) {

                        //create a new one
                        FavoriteService.new($scope.currentUser).then(function(favorites) {
                            $scope._favoriteBeers = favorites[0];
                            $scope.favorites = [];
                        });
                    } else {

                        $scope.favoriteBeers = favorites[0];
                        $scope.favorites = favorites[0].get('favoriteBrews');

                        console.log("Favorites and favorite beers are...", $scope.favoriteBeers, $scope.favorites);

                        BeerService.getAll().then($scope.getFavorites).then(function(results) {
                            $scope.beers = results;
                        })
                    }
                });

                BeerService.getBeer(beer_id).then(function(resp) {

                    Utils.hide();

                    $scope.beer = resp;

                })
            });

            $scope.doLike = function(action, beer_id) {

                if (!$scope.currentUser) {
                    Utils.alertshow("Alert", "Please log in to Facebook to anonymously track your beers.");
                    $state.go('login');
                } else {
                    if (action == "add") {
                        $scope.favorites.push(beer_id);
                    } else {
                        $scope.favorites.splice($scope.favorites.indexOf(beer_id), 1);
                    }
                }

                FavoriteService.add($scope.currentUser, $scope.favorites);
            }

            $scope.goBack = function() {
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.goBeerStyle = function(id) {
                console.log("===Style id ...", id);
                $state.go('beer-style', { id: id });
            }

            $scope.goBrewery = function(brewery_id) {
                $state.go('show-brewery', { id: brewery_id });
            }
        }
    }
})();