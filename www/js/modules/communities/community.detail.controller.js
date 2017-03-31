(function() {
    'use strict';

    angular
        .module('community')
        .controller('CommunityEventDetailCtrl', CommunityEventDetailCtrl);

    CommunityEventDetailCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'CommunityEventService',
        'Utils',
        'BeerService',
        'MapCalc',
        'HoursOfOperationService',
        '$ionicHistory'
    ];

    function CommunityEventDetailCtrl(
        $scope,
        $state,
        $stateParams,
        CommunityEventService,
        Utils,
        BeerService,
        MapCalc,
        HoursOfOperationService,
        $ionicHistory
    ) {
        activate();

        function activate() {
            $scope.$on('$ionicView.beforeEnter', function(scope, states) {
                Utils.show();

                $scope.community_event = false;
                var community_event_id = $stateParams.id;

                CommunityEventService.get(community_event_id).then(function(data) {
                    Utils.hide();

                    console.log('got event', data);
                    $scope.community_event = data;
                });
            });

            $scope.goBack = function() {
                // $state.go('events');
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.openTicketLink = function(url) {
                window.open(url, '_system');
            }
        }
    }
})();