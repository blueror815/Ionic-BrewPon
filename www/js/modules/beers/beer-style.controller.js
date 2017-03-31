(function() {
    'use strict';

    angular
        .module('beer')
        .controller('BeerStyleCtrl', BeerStyleCtrl);

    BeerStyleCtrl.$inject = [
        'Utils',
        '$state',
        '$scope',
        '$ionicHistory',
        'BeerService',
        'BeerStyleService'
    ];

    function BeerStyleCtrl(
        Utils,
        $state,
        $scope,
        $ionicHistory,
        BeerService,
        BeerStyleService
    ) {

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                Utils.show();

                /**
                 * Private variable that represents the style id parsed
                 * from the URL
                 */
                var style_id = $state.params.id;
                $scope.style = null;
                $scope.searchTerm = "";
                $scope.favorite_mode = false;
                $scope.beers = null;


                /**
                 * Retrieves the style for the provided style id parameter and stores
                 * it in the scope
                 */
                BeerStyleService.get(style_id).then(function(style) {

                    $scope.style = style;

                    /**
                     * Retrieves beers that share the style that was found from the parameter
                     * in the URL
                     */
                    BeerService.withStyle($scope.style.ID).then(function(beers) {
                        $scope.beers = beers;
                    });

                    Utils.hide();
                });


                /**
                 * Redirects the user to the page that shows the provided beer id
                 * @param {string} beer_id
                 */
                $scope.showBeer = function(beer_id) {
                    BeerService.getBeer(beer_id).then(function(beer) {
                        $state.go('beer-detail', { id: beer_id });
                    }, function(err) {
                        console.log(err);
                    });
                };

                $scope.goBack = function() {
                    console.log("-goback");
                    $ionicHistory.goBack();
                }

                $scope.goHome = function() {
                    $state.go('home');
                }
            })
        }
    }
})();