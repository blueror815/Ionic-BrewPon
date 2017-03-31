(function() {
    'use strict';

    angular
        .module('comment')
        .controller('CommentCtrl', CommentCtrl);

    CommentCtrl.$inject = [
        '$state',
        '$scope',
        '$ionicHistory',
        'CommentService',
        'Parse',
        'Utils'
    ];

    function CommentCtrl(
        $state,
        $scope,
        $ionicHistory,
        CommentService,
        parseLib,
        Utils
    ) {

        $scope.comment = "";

        activate();

        function activate() {

            $scope.$on("$ionicView.beforeEnter", function(scope, states) {
                var Parse = parseLib.getParse();
                $scope.comment = "";
                $scope.currentUser = Parse.User.current().get('email');
            })

            $scope.save = function(comment) {
                console.log("===?comment is,", comment);
                Utils.show("Submitting....");
                var data = {
                    commentValue: comment,
                    user: $scope.currentUser
                };
                CommentService.save(data).then(function(response) {
                    Utils.hide();
                    Utils.alertShow("Alert", "Your comment was successfully submitted. Thank you for your feedback!");
                    $ionicHistory.goBack();
                }, function(err) {
                    Utils.hide();
                    Utils.errMessage("There was an issue submitting your comment. Please try again later.");
                })
            }

            $scope.goBack = function() {
                $ionicHistory.goBack();
            }

            $scope.goHome = function() {
                $state.go('home');
            }
        }
    }
})();