(function() {
    'use strict';

    angular
        .module('beer')
        .controller('BeerController', BeerController);

    BeerController.$inject = [
        '$state',
        '$scope',
        '$rootScope',
        'BeerService',
        'LocationService'
    ];

    function BeerController(
        $state,
        $scope,
        $rootScope,
        BeerService,
        LocationService
    ) {

    }

})();