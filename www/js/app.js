// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

/**
 * Initialize Parse with api keys
 */

angular
    .module('brew', ['ionic', 'ngCordova', 'ionic-native-transitions', 'ionic-audio', 'loading', 'home', 'brewery', 'beer', 'podcast', 'community', 'news', 'info', 'find-beer', 'login', 'favorite', 'comment'])
    .run(function($ionicPlatform, $ionicPopup, $location, $ionicHistory) {

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $ionicPlatform.registerBackButtonAction(function(event) {
                if (true) { // your check here
                    if ($location.path() === "/home" || $location.path() === "home") {
                        navigator.app.exitApp();
                    } else {
                        $ionicHistory.goBack();
                    }
                }
            }, 100);
        });
    })
    .run(['$rootScope', '$state', 'Parse', '$cordovaNetwork', 'Utils', function($rootScope, $state, parse, $cordovaNetwork, Utils) {

        var Parse = parse.getParse();

        // $rootScope.currentUser = Parse.User.current();

        $rootScope.is_loggedIn = false;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

            $rootScope.currentUser = Parse.User.current();

            console.log("====>CURRENT USER", $rootScope.currentUser);

            var requireLogin = toState.auth;

            if (!$rootScope.currentUser && requireLogin) {
                console.log("==>Current user is...", $rootScope.currentUser);
                event.preventDefault();
                $state.go('login');
            }

            document.addEventListener("deviceready", function() {

                $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                    console.log("===>Online here");
                    var onlineState = networkState;
                })

                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                    console.log("===>Great");
                    var offlineState = networkState;
                    event.preventDefault();
                    Utils.errMessage("You are in offline mode. Please check out your network status")
                })

            }, false);
        });
    }])
    .config(function($ionicNativeTransitionsProvider) {
        $ionicNativeTransitionsProvider.setDefaultOptions({
            duration: 400, // in milliseconds (ms), default 400, 
            slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4 
            iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1 
            androiddelay: -1, // same as above but for Android, default -1 
            winphonedelay: -1, // same as above but for Windows Phone, default -1, 
            fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android) 
            fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android) 
            triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option 
            backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back 
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {

        console.log("===>State provider is...", $stateProvider);

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        // document.body.classList.remove("platform-ios");
        // document.body.classList.remove("platform-android");
        // document.body.classList.add("platform-ios");
        // document.body.classList.add("platform-android");


        Parse.initialize("brewponAppId");
        Parse.serverURL = 'https://brewpon.herokuapp.com/parse';

        $stateProvider
            .state('loading', {
                url: '/loading',
                templateUrl: 'templates/loading.html',
                controller: 'LoadingCtrl',
                auth: false
            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl',
                auth: false,
                nativeTransitions: {
                    "type": "fade",
                    "duration": 500,
                }
            })
            .state('near-mes', {
                url: '/near-mes',
                templateUrl: 'templates/near-me-list.html',
                controller: 'BreweryCtrl',
                auth: false
            })
            .state('show-brewery', {
                url: '/near-mes/:id',
                templateUrl: 'templates/brewery-detail.html',
                controller: 'BreweryDetailCtrl',
                auth: false
            })
            .state('breweries', {
                url: '/breweries',
                templateUrl: 'templates/breweries.html',
                controller: 'BreweryCtrl',
                auth: false
            })
            .state('pubs-n-grub', {
                url: '/pubs-n-grub',
                templateUrl: 'templates/pubs-n-grub.html',
                controller: 'BreweryCtrl',
                auth: false
            })
            .state('events', {
                url: '/events',
                templateUrl: 'templates/events.html',
                controller: 'CommunityEventCtrl',
                auth: false
            })
            .state('event-detail', {
                url: '/event/:id',
                templateUrl: 'templates/event-detail.html',
                controller: 'CommunityEventDetailCtrl',
                auth: false
            })
            .state('news', {
                url: '/news',
                templateUrl: 'templates/news.html',
                controller: 'NewsCtrl',
                auth: false
            })
            .state('news-detail', {
                url: '/news/:index',
                templateUrl: 'templates/news-detail.html',
                controller: 'NewsDetailCtrl',
                auth: false
            })
            .state('podcasts', {
                url: '/podcasts',
                templateUrl: 'templates/podcasts.html',
                controller: 'PodcastCtrl',
                auth: false
            })
            .state('podcast', {
                url: '/podcast/:id',
                templateUrl: 'templates/podcast-detail.html',
                controller: 'PodcastDetailCtrl',
                auth: false
            })
            .state('info', {
                url: '/info',
                templateUrl: 'templates/info.html',
                controller: 'InfoCtrl',
                auth: false
            })
            .state('find-beer', {
                url: '/find-beer',
                templateUrl: 'templates/find-beer.html',
                controller: 'FindBeerCtrl',
                auth: false
            })
            .state('beer-detail', {
                url: '/beers/:id',
                templateUrl: 'templates/beer-detail.html',
                controller: 'BeerDetailCtrl',
                auth: false
            })
            .state('beer-style', {
                url: '/beer-style/:id',
                templateUrl: 'templates/beer-style.html',
                controller: 'BeerStyleCtrl',
                auth: false
            })
            .state('favorites', {
                url: '/favorites',
                templateUrl: 'templates/favorite.html',
                controller: 'FavoriteCtrl',
                auth: true
            })
            .state('comment', {
                url: '/comment',
                templateUrl: 'templates/comment.html',
                controller: 'CommentCtrl',
                auth: false
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                auth: false
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/loading');

    });