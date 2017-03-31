(function() {
    'use strict';

    angular
        .module('news')
        .controller('NewsCtrl', NewsCtrl);

    NewsCtrl.$inject = [
        '$scope',
        '$state',
        '$rootScope',
        'NewsService',
        'Utils',
        '$ionicHistory'
    ];

    function NewsCtrl($scope, $state, $rootScope, NewsService, Utils, $ionicHistory) {

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                if (states.direction == "forward") {

                    $scope.news_articles = [];

                    Utils.show();

                    $scope.blogs = [];

                    NewsService.getAllNews().then(function(response) {

                        console.log("--->Response for getting blog", JSON.stringify(response));

                        Utils.hide();

                        $scope.blogs = response;

                    })
                }
            });

            $scope.show_news_item = function(url) {
 
                window.open(url, '_system');
            };

            $scope.goBack = function() {
                // $state.go('home');
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }

            $scope.showBlogItem = function(index) {
                $state.go('news-detail', { 'index': index });
            };
        }
    }

})();
