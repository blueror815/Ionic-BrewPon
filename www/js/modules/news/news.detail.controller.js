(function() {
    'use strict';

    angular
        .module('news')
        .controller('NewsDetailCtrl', NewsDetailCtrl);

    NewsDetailCtrl.$inject = [
        '$scope',
        '$state',
        'Utils',
        'NewsService',
        '$ionicHistory'
    ];

    function NewsDetailCtrl(
        $scope,
        $state,
        Utils,
        NewsService,
        $ionicHistory
    ) {
        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {

                $scope.blog_item = {};
                $scope.news_url = "";

                var index = $state.params.index;

                Utils.show();

                NewsService.getNews(index).then(function(response) {

                    Utils.hide();

                    $scope.blog_item = response;

                    $scope.news_url = response.link;
                })
            });

            $scope.showNewsItemOnBlog = function() {
                window.open($scope.news_url, '_system');
            };

            $scope.goBack = function() {
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }
        }
    }
})();