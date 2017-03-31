(function() {
    'use strict';

    angular
        .module('info')
        .controller('InfoCtrl', InfoCtrl);

    InfoCtrl.$inject = [
        '$state',
        '$scope',
        '$ionicHistory'
    ];

    function InfoCtrl(
        $state,
        $scope,
        $ionicHistory
    ) {

        activate();

        function activate() {

            $scope.goBack = function() {
                console.log("-goback");
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.leaveComment = function() {

            }
        }
    }
})();