(function() {
    'use strict';

    angular
        .module('login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = [
        '$state',
        '$scope',
        '$rootScope',
        'Parse',
        'Utils'
    ];

    function LoginCtrl($state, $scope, $rootScope, parse, Utils) {

        activate();

        function activate() {

            var Parse = parse.getParse();

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                $scope.is_loggedIn = (Parse.User.current()) ? true : false;

            })

            $scope.loginWithFacebook = function() {

                facebookConnectPlugin.login(['public_profile', 'email'],
                    function(userData) {

                        Utils.show("Loading your information...");

                        Parse.FacebookUtils.logIn({
                            'expiration_date': moment().add(5167951, 'seconds').format(),
                            'id': userData.authResponse.userID,
                            'access_token': userData.authResponse.accessToken
                        }).then(
                            function(response) {
                                var accessToken = userData.authResponse.accessToken;

                                facebookConnectPlugin.api(userData.authResponse.userID + "/?fields=id,email", ["public_profile"],
                                    function onSuccess(me) {

                                        // save facebook user to databse..
                                        Parse.User.current().set("email", me.email);
                                        Parse.User.current().save();

                                        Utils.hide();

                                        Utils.alertshow("Alert", "Login Success");

                                        $state.go('home');
                                    },
                                    function onError(error) {
                                        console.error("Failed: ", error);

                                        Utils.errMessage('Something went wrong. Please try again');
                                        $state.go('login');
                                    }
                                );
                            },
                            function(err) {
                                Utils.errMessage('Something went wrong. Please try again');
                                console.log(err);
                            }
                        );
                    },
                    function(err) {
                        Utils.errMessage("We're sorry, but we couldn't log you in, please try again.");
                        console.log(err);
                    });

            };

            $scope.goBack = function() {
                $state.go('home');
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.logout = function() {
                $scope.is_loggedIn = false;
                Parse.User.logOut();
                facebookConnectPlugin.logout(
                    function onSuccess(success) {
                        Utils.alertshow("Alert", "You are logged out");
                    },
                    function onError(err) {
                        Utils.errMessage("Error");
                    }
                )
                $state.go('login');
            }
        }
    }
})();