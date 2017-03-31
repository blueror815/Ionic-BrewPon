/**
 * @ngdoc service
 * @name BreweryService
 * @description BreweryService Service interacts with Parse to manage brewery (Client) data
 */

angular
    .module('brew')
    .service('SpecialService', function($q, $http, BACKEND_API) {

        var self = this;

        self.cached_specials = [];
        self.cached_id_lookup = {};
        self.cached_by_brewery = {};
        self.seed = moment().format('DDDD');



        /**
         * @description: function to clear all cached data
         * @name: clearCache
         * @return: clear cache and reload data
         */

        self.clearCache = function() {

            self.cached_specials = [];
            self.cached_id_lookup = {};
            self.cached_by_brewery = {};

            return self.getAll();
        }



        /**
         * @description: funciton to get all specials
         * @method: GET
         * @name: getAll
         * @return: promise for All specials
         */

        self.getAll = function() {

            var defer = $q.defer();

            if (self.cached_specials && self.cached_specials.length > 0) {

                defer.resolve(self.cached_specials);

                return defer.promise;

            } else {

                return $http({
                        url: BACKEND_API + 'appdata/special/get',
                        method: 'GET'
                    })
                    .then(getDataSuccess)
                    .catch(getDataFailed);

                function getDataSuccess(response) {
                    self.cached_specials = response.data;

                    angular.forEach(response.data, function(special, index) {
                        if (special.listing) {
                            angular.forEach(special.listing, function(listing) {
                                if (typeof self.cached_by_brewery[listing.ID] == 'undefined') {
                                    self.cached_by_brewery[listing.ID] = [];
                                }
                                self.cached_by_brewery[listing.ID].push(special);
                            });
                        }
                        self.cached_id_lookup[special.ID] = index;
                    });

                    return response.data;
                }

                function getDataFailed(error) {
                    return error.data;
                }
            }
        };




        /**
         * @description: estimate to get spcials for today or week
         * @name: getRandomListHome
         * @return: one time special or weekly speicals
         */

        self.getRandomListHome = function(specials) {

            var specialQueue = [];
            var now = moment();

            if (now.hour() < 4) {
                now.subtract(1, 'days');
            }

            var total_specials = specials.length;

            var serviceObj = this;

            var weeklySpecials = [];
            var todaySpecials = [];


            angular.forEach(specials, function(special) {

                var dayOfWeek = special.day_of_the_week;
                var specialDateText = special.start_date;

                var iscurrentDate;

                if (specialDateText) {
                    iscurrentDate = moment(specialDateText).isSame(now.format(), "day");
                } else {
                    iscurrentDate = false;
                }

                // console.log(specialDate);

                // console.log("now day of week", moment().format('dddd'));

                if (dayOfWeek && now.format('dddd') == dayOfWeek) {
                    weeklySpecials.push(special);
                } else if (specialDateText && iscurrentDate) {
                    todaySpecials.push(special);
                }
            });

            angular.forEach(todaySpecials, function(special) {
                specialQueue.push(special);
            });

            var num_extra_specials = serviceObj.getRandomInt(1, 3);

            if (weeklySpecials.length < num_extra_specials) {
                num_extra_specials = weeklySpecials.length;
            }

            for (var i = 0; i < num_extra_specials; i++) {
                var get_index = serviceObj.getRandomInt(0, weeklySpecials.length - 1);
                specialQueue.push(weeklySpecials[get_index]);
                delete weeklySpecials[get_index];
                weeklySpecials = weeklySpecials.filter(function(val) { return val });
            }

            return specialQueue;
        };



        /**
         * @description: funciton to get a special for brewery
         * @param: brewery_id
         * @name: getForBrewery
         * @return: promise for one time special
         */

        self.getForBrewery = function(brewery_id) {

            var defer = $q.defer();

            if (typeof self.cached_by_brewery[brewery_id] != 'undefined') {

                defer.resolve(self.cached_by_brewery[brewery_id]);

            } else {

                defer.resolve(false);

            }

            return defer.promise;
        };


        this.getRandomList = function(specials) {
            var specialQueue = [];
            var now = moment();

            if (now.hour() < 4) {
                now.subtract(1, 'days');
            }

            var total_specials = specials.length;
            var weeklySpecials = [];
            var todaySpecials = [];


            angular.forEach(specials, function(special) {

                var dayOfWeek = special.day_of_the_week;
                var specialDateText = special.start_date;

                var iscurrentDate;

                if (specialDateText) {
                    iscurrentDate = moment(specialDateText).isSame(now.format(), "day");
                } else {
                    iscurrentDate = false;
                }

                if (dayOfWeek && now.format('dddd') == dayOfWeek) {
                    weeklySpecials.push(special);
                } else if (specialDateText && iscurrentDate) {
                    todaySpecials.push(special);
                }
            });

            angular.forEach(todaySpecials, function(special) {
                specialQueue.push(special);
            });

            angular.forEach(weeklySpecials, function(special) {
                specialQueue.push(special);
            });

            return specialQueue;
        };


        /**
         * @description: function to get random integer for weekly specials
         * @param: min and max
         * @return: random integer between 1 and 3
         */

        self.getRandomInt = function(min, max) {

            return Math.floor(self.getRandom() * (max - min + 1)) + min;
        }



        /**
         * @description: function to get Random
         */

        self.getRandom = function() {
            var x = Math.sin(self.seed++) * 10000;
            return x - Math.floor(x);
        };
    });