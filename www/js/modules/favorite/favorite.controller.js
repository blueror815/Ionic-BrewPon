(function() {
    'use strict';

    angular
        .module('favorite')
        .controller('FavoriteCtrl', FavoriteCtrl);

    FavoriteCtrl.$inject = [
        '$state',
        '$scope',
        '$rootScope',
        '$ionicHistory',
        'FavoriteService',
        'BeerService',
        'Utils',
        'Parse'
    ];

    function FavoriteCtrl(
        $state,
        $scope,
        $rootScope,
        $ionicHistory,
        FavoriteService,
        BeerService,
        Utils,
        parse
    ) {

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                var Parse = parse.getParse();

                $scope.favoriteBeers = [];
                $scope.beers = [];
                $scope.currentUser = Parse.User.current();

                Utils.show();

                FavoriteService.get($scope.currentUser).then(function(favorites) {

                    if (favorites.length > 0) {

                        $scope.favoriteBeers = favorites[0];
                        $scope.favorites = favorites[0].get('favoriteBrews');

                        BeerService.getAll().then($scope.getFavorites).then(function(results) {

                            console.log("===>Favorite Beers are...", results);
                            Utils.hide();
                            $scope.beers = results;
                        })
                    }
                });
            });


            $scope.getFavorites = function(beers) {
                console.log("===>Beers are...", beers);
                var favBeers = [];
                angular.forEach($scope.favorites, function(favorite) {
                    angular.forEach(beers, function(beer) {
                        if (favorite == beer.ID || favorite == beer.objectId) {
                            favBeers.push(beer);
                        }
                    });
                });
                return favBeers;
            };

            $scope.goBack = function() {
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.showBeer = function(beer_id) {
                $state.go('beer-detail', { id: beer_id });
            }
        }
    }
})();