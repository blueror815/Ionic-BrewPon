angular
    .module('comment')
    .service('CommentService', CommentService);

CommentService.$inject = [
    '$http',
    '$q',
    'COMMENT_API'
];

function CommentService(
    $http,
    $q,
    COMMENT_API
) {

    var self = this;

    self.save = function(data) {

        var defer = $q.defer();

        $http({
                url: COMMENT_API,
                method: 'POST',
                data: data
            })
            .success(function(resp) {
                defer.resolve(resp);
            })
            .error(function(err) {
                defer.reject('An error occured while communicating to the server.', err);
            });

        return defer.promise;
    }
}