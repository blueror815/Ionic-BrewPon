angular
    .module('brew')
    .factory('Utils', function($ionicLoading, $cordovaDialogs) {

        var Utils = {

            show: function(title) {
                var caption = "Loading...";
                if (title) {
                    caption = title;
                };

                $ionicLoading.show({
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 500,
                    template: '<ion-spinner class="light"></ion-spinner><br /><span>' + caption + '</span>'
                });
            },
            showLoading: function(title) {
                var caption = "Loading...";
                if (title) {
                    caption = title;
                };

                $ionicLoading.show({
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200,
                    showDelay: 500,
                    template: '<ion-spinner class="light"></ion-spinner><br /><span>' + caption + '</span>'
                });
            },

            hide: function() {
                $ionicLoading.hide();
            },

            alertshow: function(tit, msg) {
                $cordovaDialogs.alert(msg, tit, 'OK');
            },

            errMessage: function(err) {

                var msg = (err) ? err : "Network Error...";

                Utils.alertshow("Error", msg);
            },

        };

        return Utils;

    })