/**
 * @ngdoc service
 * @name CommunityEventService
 * @description CommunityEventService interacts with blog website and get all blogs
 */

angular.module('community')
    .service('CommunityEventService', function($q, $http, BACKEND_API, Parse) {

        var self = this;

        self.community_events = [];
        self.cached_by_brewery = {};
        self.cached_id_lookup = {};
        self.currentCommunityEvent = {};


        /**
         * Clear cache data. so we can update old events
         * with new ones
         * @param 
         */
        self.clearCache = function() {
            self.community_events = [];
            self.cached_by_brewery = {};
            self.cached_id_lookup = {};
            self.currentCommunityEvent = {};

            return self.loadData();
        }


        /**
         * Load event deta from API. It is called from the start of
         * application
         * @param 
         */
        self.loadData = function() {

            var defer = $q.defer();

            $http({
                    url: BACKEND_API + 'appdata/tribe_events/get',
                    method: 'GET'
                })
                .success(function(resp) {
                    // console.log("===>Response for getting community is...", resp);

                    self.community_events = resp;

                    var cached_by_brewery_temp = {};
                    var cached_id_lookup_temp = {};
                    var cached_data_temp = [];

                    angular.forEach(self.community_events, function(event, index) {
                        if (typeof event.place != 'undefined' && typeof event.place.listing != 'undefined' && event.place.listing) {
                            angular.forEach(event.place.listing, function(listing) {
                                if (typeof cached_by_brewery_temp[listing.ID] == 'undefined') {
                                    cached_by_brewery_temp[listing.ID] = [];
                                }
                                cached_by_brewery_temp[listing.ID].push(event);
                            });
                        }
                        cached_id_lookup_temp[event.ID] = index;
                    });

                    self.cached_by_brewery = cached_by_brewery_temp;
                    self.cached_id_lookup = cached_id_lookup_temp;

                    defer.resolve(resp);
                })
                .error(function(err) {
                    defer.reject('An error occured while communicating to the server.', err);
                });

            return defer.promise;
        };


        /**
         * Get all events from API. 
         * @param 
         */
        self.getAll = function() {

            var defer = $q.defer();

            if (self.community_events && self.community_events.length > 0) {
                // console.log("===>Community events are...", self.community_events);
                defer.resolve(self.community_events);
            } else {
                return self.loadData();
            }

            return defer.promise;
        };


        /**
         * Get a specific events from API. 
         * @param: community_event_id
         */
        self.get = function(community_event_id) {

            var defer = $q.defer();

            if (typeof self.cached_id_lookup[community_event_id] != 'undefined') {
                // console.log("===>Get community", self.community_events[self.cached_id_lookup[community_event_id]]);
                defer.resolve(self.community_events[self.cached_id_lookup[community_event_id]]);
            } else {
                $http({
                        url: BACKEND_API + 'appdetail/' + community_event_id,
                        method: 'GET'
                    })
                    .success(function(resp) {
                        defer.resolve(resp);
                    })
                    .error(function(err) {
                        defer.reject('An error occured while communicating to the server.', err);
                    });
            }
            return defer.promise;
        };

        self.setCurrentCommunityEvent = function(community_event) {
            self.currentCommunityEvent = community_event;
        };

        self.getCurrentCommunityEvent = function() {
            return self.currentCommunityEvent;
        }

        self.getParseDataForEvent = function(facebook_event_id) {
            return Parse.getWhere('Community', { 'facebook_event_id': facebook_event_id });
        };

        self.getForClient = function(client_id) {
            var defer = $q.defer();

            if (typeof self.cached_by_brewery[client_id] != 'undefined') {
                defer.resolve(self.cached_by_brewery[client_id]);
            } else {
                defer.resolve(false);
            }

            return defer.promise;
        };
    });