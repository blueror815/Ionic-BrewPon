(function() {
    'use strict';

    angular
        .module('community')
        .controller('CommunityEventCtrl', CommunityEventCtrl);

    CommunityEventCtrl.$inject = [
        '$scope',
        '$state',
        '$rootScope',
        'CommunityEventService',
        'Utils',
        '$ionicHistory'
    ];

    function CommunityEventCtrl(
        $scope,
        $state,
        $rootScope,
        CommmunityEventService,
        Utils,
        $ionicHistory
    ) {

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {
                console.log("===>States are...", states);
                if (states.direction == "forward") {
                    $scope.community_events = [];
                    $scope.breweryDistances = {};
                    $scope.community_event_parse_data_array = {};

                    Utils.show();

                    CommmunityEventService.loadData().then(function(events) {
                        Utils.hide();
                        $scope.community_events = events;
                    });
                }
            });

            $scope.showBeerPageOnFacebook = function() {
                window.open('https://www.facebook.com/beer.club.brewpon/?fref=ts', '_system');
            };

            $scope.showCommunityEvent = function(community_event_id) {
                $state.go('event-detail', { id: community_event_id });
            };

            $scope.sortList = function(selector) {
                var parent$ = $(selector);
                parent$.find("li").detach().sort(function(a, b) {
                    console.log('sort', a, b, a.getAttribute('data-sorter'), parseFloat(a.getAttribute('data-sorter')));
                    return (parseFloat(a.getAttribute('data-sorter')) - parseFloat(b.getAttribute('data-sorter')));
                }).each(function(index, el) {
                    parent$.append(el);
                });
            };

            $scope.goBack = function() {
                // $state.go('home');
                $ionicHistory.goBack();
            }
        }
    }
})();