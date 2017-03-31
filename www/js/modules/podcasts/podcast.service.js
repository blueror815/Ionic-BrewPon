angular
    .module('podcast')
    .service('PodcastService', PodcastService);

PodcastService.$inject = [
    '$q',
    '$http',
    'BACKEND_API'
];

function PodcastService($q, $http, BACKEND_API) {

    var podcasts = [];
    var cached_by_brewery = {};
    var cached_id_lookup = {};

    return {
        loadData: loadData,
        clearCache: clearCache,
        getAll: getAll,
        get: get,
        getForClient: getForClient
    };

    function loadData() {
        return $http({
                url: BACKEND_API + 'appdata/podcast/get',
                method: 'GET'
            })
            .then(getDataSuccess)
            .catch(getDataFailed);

        function getDataSuccess(response) {
            podcasts = response.data;
            var cached_by_brewery_temp = {};
            var cached_by_id_lookup_temp = {};

            angular.forEach(podcasts, function(podcast, index) {
                if (podcast.listing) {
                    angular.forEach(podcast.listing, function(listing) {

                        if (typeof cached_by_brewery_temp[listing.ID] == 'undefined') {
                            cached_by_brewery_temp[listing.ID] = [];
                        }
                        cached_by_brewery_temp[listing.ID].push(podcast);
                    });
                }
                cached_by_id_lookup_temp[podcast.ID] = index;
            });
            cached_by_brewery = cached_by_brewery_temp;
            cached_id_lookup = cached_by_id_lookup_temp;

            podcasts = response.data;
            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }
    }

    function clearCache() {
        podcasts = [];
        cached_by_brewery = {};
        cached_id_lookup = {};
        return loadData();
    }

    function getAll() {

        var defer = $q.defer();

        if (podcasts && podcasts.length > 0) {
            defer.resolve(podcasts);
        } else {
            return loadData();
        }

        return defer.promise;
    }

    function get(podcast_id) {
        return $http({
                url: BACKEND_API + "appdetail/" + podcast_id,
                method: 'GET'
            })
            .then(getDataSuccess)
            .catch(getDataFailed);

        function getDataSuccess(response) {
            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }
    }

    function getForClient(client_id) {

        var defer = $q.defer();

        if (typeof cached_by_brewery[client_id] != 'undefined') {
            defer.resolve(cached_by_brewery[client_id]);
        } else {
            var podcast = [];
            defer.resolve(podcast);
        }

        return defer.promise;
    }
}