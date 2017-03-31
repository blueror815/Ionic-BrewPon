(function() {
    'use strict';

    angular
        .module('podcast')
        .controller('PodcastDetailCtrl', PodcastDetailCtrl);

    PodcastDetailCtrl.$inject = [
        '$scope',
        '$state',
        'PodcastService',
        'BreweryService',
        'Utils',
        '$ionicHistory'
    ];

    function PodcastDetailCtrl($scope, $state, PodcastService, BreweryService, Utils, $ionicHistory) {

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                var podcast_id = $state.params.id;
                $scope.podcast = {};
                $scope.podcast_clients = [];

                Utils.show();

                PodcastService.get(podcast_id).then(function(response) {

                    Utils.hide();

                    $scope.podcast = response;

                    $scope.track = {
                        url: $scope.podcast.url,
                        id: $scope.podcast.ID
                    };

                    if ($scope.podcast.listing) {
                        angular.forEach($scope.podcast.listing, function(listing) {
                            BreweryService.getBrewery(listing.ID).then(function(data) {
                                $scope.podcast_clients.push(data);
                            });
                        });
                    }
                })
            });

            $scope.goBack = function() {
                // $state.go('podcasts');
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home')
            }

            $scope.show_podcast_item = function(url) {
                console.log("===>Url is..", url);
                window.open(url, '_system');
            };

            $scope.goBreweryDetail = function(clietn_id) {
                $state.go('show-brewery', { id: clietn_id });
            }
        }
    }
})();