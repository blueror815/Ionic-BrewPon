angular
    .module('beer')
    .service('BeerStyleService', BeerStyleService);

BeerStyleService.$inject = [
    '$q',
    '$http',
    'BACKEND_API',
    'Parse'
];

function BeerStyleService(
    $q,
    $http,
    BACKEND_API,
    Parse
) {

    var self = this;

    /**
     * Retrieves a specific style from the provided style id
     * @param {string} style_id - Style id for which to get information from Parse
     */

    self.get = function(style_id) {

        var defer = $q.defer();

        $http({
                url: BACKEND_API + 'appdetail/' + style_id,
                method: 'GET'
            })
            .success(function(resp) {
                defer.resolve(resp);
            })
            .error(function(err) {
                defer.reject('An error occured while communicating to the server.', err);
            });

        return defer.promise;
    }



    /**
     * Returns the BeerStyles object for the provided beer
     * @param {ParseObject} beer - Beer for which to get the style
     */

    self.getForBeer = function(beer) {
        return Parse.getWhere('BeerStyles', { 'style': beer.styleId });
    }
}