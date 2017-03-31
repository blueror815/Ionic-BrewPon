'use strict';

/**
 * @ngdoc service
 * @name core.Services.MapCalc
 * @description MapCalc Service determines distances between two latitude and longitude points
 */
angular
    .module('brew')
    .service('MapCalc', [

        function() {
            /**
             * Returns the distance between the two provided latitude and longitude
             * points using the haversine formula
             * @param {float} lat1
             * @param {float} lon1
             * @param {float} lat2
             * @param {float} lon2
             */
            this.distance = function(lat1, lon1, lat2, lon2) {
                var R = 6371; // km 
                //has a problem with the .toRad() method below.
                var dLat = this.deg2rad(lat2 - lat1);
                var dLon = this.deg2rad(lon2 - lon1);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                var d = Number((d).toFixed(1));
                return d;
            };
            /**
             * Converts degrees to radians
             * @param degrees
             */
            this.deg2rad = function(degrees) {
                return degrees * Math.PI / 180;
            };
            /**
             * Converts kilometers to miles
             * @param kilometers
             */
            this.km2mi = function(kilometers) {
                return kilometers / 1.60934;
            };
        }
    ]);