'use strict';

/**
 * @ngdoc service
 * @name core.Services.HoursOfOperationService
 * @description HoursOfOperationService Service determines what is displayed based on the provided object
 * for hours in the client table in parse. getHoursMessage is the only public function this service
 * exposes.
 */
angular
    .module('brew')
    .service('HoursOfOperationService', [function() {

        this.store_hour_cache = {};

        this.clearCache = function() {
            this.store_hour_cache = {};
            return this;
        };

        this.getHoursMessage = function(brewery, show_long_version) {

            var curhour = moment().hour();
            var curmin = moment().minute();
            var curpart = Math.floor(curmin / 12);

            var cache_string = "store_" + brewery.id + "_" + curhour + "_" + curpart + show_long_version;


            if (typeof this.store_hour_cache[cache_string] != "undefined") {
                return this.store_hour_cache[cache_string];
            }

            var hourData = getHours(brewery);
            var kitchenHourData = getKitchenHours(brewery);

            this.store_hour_cache[cache_string] = {
                'storeHours': storeHoursMessage(hourData, kitchenHourData, show_long_version),
                'kitchenHours': kitchenHoursMessage(kitchenHourData)
            };

            return this.store_hour_cache[cache_string];
        };

        var getHours = function(brewery) {
            return opHours(brewery.hoursObject);
        };

        var getKitchenHours = function(brewery) {
            return opHours(brewery.kitchenClose);
        };

        var storeHoursMessage = function(storeHours, kitchenHours, show_long_version) {
            // PRC - Force update of current time
            var now = moment();

            var today = getOpenClose(storeHours.today);

            var tomorrow = getOpenClose(storeHours.tomorrow);

            var kitchenToday = getOpenClose(' - ' + kitchenHours.today);

            // PRC - If Close is before open, they're talking about tomorrow 
            var close_moment = moment(today.close, 'h:mm A');
            if (close_moment.isBefore(moment(today.open, 'h:mm A'))) {
                close_moment.add(1, 'days'); // Then make it tomorrow
            }

            var open_moment = moment(today.open, 'h:mm A');
            if (now.hour() < 4) {
                open_moment.add(-1, 'days');
                close_moment.add(-1, 'days');
            }

            // console.log(now, today, close_moment, moment(today.open,'h:mm A'), open_moment);

            if (today.close == 'closed') {
                if (show_long_version) {
                    console.log("==>sorry");
                    return {
                        message: 'Sorry, we are closed today.',
                        closedStatus: 'closed'
                    };

                } else {
                    return {
                        message: 'Closed today',
                        closedStatus: 'closed'
                    };
                }

            }


            if (moment(now).isBefore(open_moment)) {
                if (show_long_version) {
                    return {
                        'message': 'Sorry, we are currently closed. We will open today at ' + today.open + ".",
                        'closedStatus': 'closed'
                    };

                } else {
                    return {
                        'message': '<span class="brewery-opens-at">Opens at ' + today.open + "</span>",
                        'closedStatus': 'closed'
                    };
                }
            }

            // PRC - And let's check the closed time as well
            if (moment(now).isAfter(close_moment)) {
                if (show_long_version) {
                    return {
                        'message': 'Sorry, we have closed for the evening.',
                        'closedStatus': 'closed'
                    };

                } else {
                    return {
                        'message': 'Closed for evening',
                        'closedStatus': 'closed'
                    };
                }
            }

            if (show_long_version) {
                var new_message = "We're open! Our last call for alcohol is " + today.close + ".";
                if (kitchenToday.close != 'closed') {
                    new_message += " We will be serving food until " + kitchenToday.close;
                }
                return {
                    'message': new_message,
                    'closedStatus': 'open'
                };

            } else {
                return {
                    'message': 'Last Call ' + today.close,
                    'closedStatus': 'open'
                };
            }
        };

        var storeHoursMessageDetail = function(storeHours, kitchenHours) {
            var today = getOpenClose(storeHours.today);
            return {
                'message': 'We are open and welcoming all craft beer enthusiasts! Our last call for alcohol is ' + today.close,
                'closedStatus': 'open'
            };


        };

        var kitchenHoursMessage = function(kitchenHours) {
            var today;
            if (kitchenHours.today && kitchenHours.today.split(' - ').length >= 2) {
                today = getOpenClose(kitchenHours.today);
            } else {
                today = getOpenClose(' - ' + kitchenHours.today);
            }

            if (today.close == 'closed') {
                return {
                    // 'message' : 'Kitchen Closed',
                    'message': '',
                    'closedStatus': 'closed'
                };
            }

            return {
                'message': 'Kitchen Closes at ' + today.close,
                'closedStatus': 'open'
            };
        };

        var getOpenClose = function(hours) {
            if (hours == 'closed' || !hours) {
                return {
                    'open': 'closed',
                    'close': 'closed'
                };
            }
            //check format

            var hours_arr = hours.split(' - ');

            return {
                'open': hours_arr[0],
                'close': hours_arr[1]
            };
        };

        var opHours = function(hourObject) {

            var now = moment();
            var intDay = now.hour() < 4 ? now.day() - 1 : now.day();

            var today = moment.weekdays(intDay).toLowerCase();
            var tommorrow = moment.weekdays(intDay + 1).toLowerCase();

            return {
                'today': hourObject[today],
                'tomorrow': hourObject[tommorrow]
            };
        };
    }]);