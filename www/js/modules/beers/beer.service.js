angular
    .module('beer')
    .service('BeerService', BeerService);

BeerService.$inject = [
    '$http',
    'BACKEND_API',
    '$q',
    'BreweryService'
];

function BeerService($http, BACKEND_API, $q, BreweryService) {

    var beers = [];
    var cached_id_lookup = {};
    var last_global_update = false;

    return {
        clearCache: clearCache,
        loadData: loadData,
        getAll: getAll,
        getBeer: getBeer,
        withStyle: withStyle,
        getOnTapFromBeer: getOnTapFromBeer
    };

    function loadData() {

        return $http({
                url: BACKEND_API + "appdata/beer/get",
                method: 'GET'
            })
            .then(getDataSuccess)
            .catch(getDataFailed);

        function getDataSuccess(response) {
            beers = response.data;

            var cached_id_lookup_temp = {};

            angular.forEach(beers, function(beer, index) {
                cached_id_lookup_temp[beer.ID] = index;
            });

            cached_id_lookup = cached_id_lookup_temp;

            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }
    }

    function getOnTapFromBeer(beer_id) {

        var defer = $q.defer();

        if (typeof BreweryService.beers_by_brewery[beer_id] != 'undefined') {
            defer.resolve(BreweryService.beers_by_brewery[beer_id]);
        } else {
            defer.resolve();
        }

        return defer.promise;
    }

    function clearCache() {
        beers = [];
        return loadData();
    }

    function getAll() {
        var defer = $q.defer();

        if (beers && beers.length > 0) {
            defer.resolve(beers);
        } else {
            return loadData();
        }

        return defer.promise;
    }

    function getBeer(beer_id) {

        var defer = $q.defer();

        if (cached_id_lookup[beer_id]) {
            defer.resolve(beers[cached_id_lookup[beer_id]]);
        } else {
            return loadData().then(function(data) {
                return beers[cached_id_lookup[beer_id]];
            });
        }

        return defer.promise;
    }

    function withStyle(style_id) {

        var defer = $q.defer();

        return getAll().then(function(beers) {
            var beers_with_style = [];

            angular.forEach(beers, function(beer, index) {
                if (beer.style && beer.style.length) {
                    if (beer.style[0].ID == style_id) {
                        beers_with_style.push(beer);
                    }
                }
            });

            defer.resolve(beers_with_style);

            return defer.promise;
        });
    };
}