'use strict';

/**
 * @ngdoc service
 * @name brew.Services.Location
 * @description Location Service returns a promise that can be used to get the
 * current latitude and longitude of the device using the geolocation plugin
 */

angular
    .module('brew')
    .service('LocationService', LocationService);

LocationService.$inject = [
    '$q',
    'Utils'
];

function LocationService(
    $q,
    Utils
) {
    return {
        getPosition: getPosition,
    };

    function getPosition() {

        var defer = $q.defer();

        navigator.geolocation.getCurrentPosition(function(position) {
                defer.resolve(position);
            },
            function(err) {
                console.log("err", err);
                defer.reject(err);
            });

        return defer.promise;
    }
}