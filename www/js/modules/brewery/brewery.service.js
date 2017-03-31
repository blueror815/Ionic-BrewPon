'use strict';

/**
 * @ngdoc service
 * @name BreweryService
 * @description BreweryService Service interacts with Parse to manage brewery (Client) data
 */

angular.module('brewery')
    .service('BreweryService', function($q, $http, BACKEND_API) {

        var self = this;


        self.currentBrewery = null;

        self.cached_nearme = [];
        self.beers_by_brewery = {};
        self.cached_brewery = [];
        self.cached_food = [];
        self.breweryDistances = false;
        self.breweryDistancesUserLocation = false;
        self.cached_id_lookup = {};
        self.all_on_tap_beers = [];

        self.clearCache = function() {
            self.cached_nearme = [];
            self.beers_by_brewery = {};
            self.cached_brewery = [];
            self.cached_food = [];
            self.breweryDistances = false;
            self.breweryDistancesUserLocation = false;
            self.cached_id_lookup = {};
            self.all_on_tap_beers = [];

            return self.loadData();
        }

        self.loadData = function() {

            var cached_brewery_temp = [];
            var cached_food_temp = [];
            var cached_id_lookup_temp = {};
            var beers_by_brewery_temp = {};
            var all_on_tap_beers_temp = [];

            var defer = $q.defer();

            $http({
                    url: BACKEND_API + 'appdata/listing/get',
                    method: 'GET'
                })
                .success(function(resp) {

                    angular.forEach(resp, function(brewery, index) {
                        if (brewery.brew) {
                            cached_brewery_temp.push(brewery)
                        }

                        if (brewery.food) {
                            cached_food_temp.push(brewery)
                        }

                        if (typeof brewery.on_tap_beers != 'undefined' && brewery.on_tap_beers.length) {
                            angular.forEach(brewery.on_tap_beers, function(beer, index) {
                                if (typeof beers_by_brewery_temp[beer.id] == 'undefined') {
                                    beers_by_brewery_temp[beer.id] = [];
                                }
                                beers_by_brewery_temp[beer.id].push(brewery);
                                all_on_tap_beers_temp.push(beer);
                            });
                        }

                        cached_id_lookup_temp[brewery.id] = index;
                    });

                    self.beers_by_brewery = beers_by_brewery_temp;
                    self.all_on_tap_beers = all_on_tap_beers_temp;
                    self.cached_brewery = cached_brewery_temp;
                    self.cached_food = cached_food_temp;
                    self.cached_id_lookup = cached_id_lookup_temp;
                    self.cached_nearme = resp;

                    defer.resolve(resp);
                })
                .error(function(err) {
                    defer.reject('An error occured while communicating to the server.', err);
                });

            return defer.promise;
        };

        self.nearMe = function() {

            var defer = $q.defer();

            if (self.cached_nearme && self.cached_nearme.length > 0) {
                defer.resolve(self.cached_nearme);
            } else {
                return self.loadData();
            }

            return defer.promise;
        };

        self.hasKitchen = function(brewery) {

            var kitchenHours = brewery.kitchenClose;

            var hasKitchen = false;

            angular.forEach(kitchenHours, function(hours, day) {
                if (hours != 'closed') {
                    hasKitchen = true;
                }
            });

            return hasKitchen;
        };

        self.getBrewery = function(brewery_id) {

            var defer = $q.defer();

            $http({
                    url: BACKEND_API + "appdetail/" + brewery_id,
                    method: 'GET'
                })
                .success(function(resp) {
                    defer.resolve(resp);
                })
                .error(function(err) {
                    defer.reject('An error occured while communicating to the server.', err);
                });

            return defer.promise;
        }
    });