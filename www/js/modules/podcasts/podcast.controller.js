(function() {
    'use strict';

    angular
        .module('podcast')
        .controller('PodcastCtrl', PodcastCtrl);

    PodcastCtrl.$inject = [
        '$scope',
        '$state',
        '$rootScope',
        'PodcastService',
        'Utils',
        '$ionicHistory'
    ];

    function PodcastCtrl($scope, $state, $rootScope, PodcastService, Utils, $ionicHistory) {

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                $scope.podcasts = [];

                Utils.show();

                PodcastService.getAll().then(function(response) {

                    // console.log("===>Response for podcast", response);

                    Utils.hide();

                    $scope.podcasts = response;
                })

            });

            $scope.goBack = function() {
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.showPodcastItem = function(podcast_id) {
                $state.go('podcast', { 'id': podcast_id });
            }
        }
    }
})();