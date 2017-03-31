(function() {
    'use strict';

    angular
        .module('find-beer')
        .controller('FindBeerCtrl', FindBeerCtrl);

    FindBeerCtrl.$inject = [
        'Utils',
        '$state',
        '$scope',
        '$ionicHistory',
        'BeerService',
        'BreweryService',
    ];

    function FindBeerCtrl(
        Utils,
        $state,
        $scope,
        $ionicHistory,
        BeerService,
        BreweryService
    ) {
        activate();

        function activate() {

            $scope.$on('$ionicView.beforeEnter', function(scope, states) {
                if (states.direction == "forward") {
                    $scope.beers = [];
                    $scope.currentIndex = 0;
                    $scope.searchTerm = "";
                    $scope.favorite_mode = false;
                    $scope.search = "search";
                    $scope.allBeers = [];
                    $scope.onTapBeers = [];

                    Utils.show();

                    BeerService.getAll().then(function(beers) {

                        Utils.hide();

                        $scope.search = "search";

                        $scope.allBeers = beers;

                        $scope.beers = [];
                    });
                }
            })

            $scope.updateBeerSearchTerm = function(term) {
                $scope.updateBeers(term);
            };

            $scope.showBeer = function(beer_id) {
                $state.go('beer-detail', { id: beer_id });
            };

            $scope.updateBeers = function(searchTerm) {
                if (searchTerm.length > 0 && searchTerm.length < 3) {
                    return;
                }

                if (searchTerm || $scope.searchTerm) {

                    $scope.beers = $scope.allBeers.filter(function(beer) {

                        if (typeof beer.beer_search_text != 'undefined' && beer.beer_search_text.indexOf(searchTerm.toLowerCase()) != -1) {
                            return true;
                        } else if (typeof beer.brewery_text != 'undefined' && beer.brewery_text.indexOf(searchTerm.toLowerCase()) != -1) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    $scope.searchTerm = "";
                    $scope.beers = []; //$scope.onTapBeers;
                }
            };

            $scope.goBack = function() {
                $ionicHistory.goBack()
            }

            $scope.goHome = function() {
                $state.go('home');
            }
        }
    }
})();