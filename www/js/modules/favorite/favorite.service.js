angular
    .module('favorite')
    .service('FavoriteService', FavoriteService);

FavoriteService.$inject = [
    '$q',
    '$http',
    'Parse'
];

function FavoriteService($q, $http, parseLib) {

    var self = this;


    /**
     * Returns beers for the provided user
     * @param user - User for which to get favorite beers
     */
    self.get = function(user) {
        return parseLib.getWhere('Favorites', { 'user': user });
    }

    /**
     * Saves an array of favorites and associates them with the current user
     * @param favorites - Favorites object to save for the current user
     */
    self.save = function(favorites) {
        return parseLib.save(favorites);
    };


    /**
     * Generates a new favorite beers object for the provided user. Used if the 
     * get function doesn't return anything
     * @param user - User for which to create a new Favorites object
     */
    self.new = function(user) {
        var favorites = parseLib.new('Favorites');
        favorites.set('user', user);
        favorites.set('favoriteBrews', []);

        console.log("===>favorites are...", favorites);

        return self.save(favorites);
    };

    /**
     * Generates a new favorite beers object for the provided user. Used if the 
     * get function doesn't return anything
     * @param user, favorite beers - User for which to create a new Favorites object
     */
    self.add = function(user, favors) {

        var Parse = parseLib.getParse();

        var Favorite = Parse.Object.extend("Favorites");

        var query = new Parse.Query(Favorite);

        query.equalTo("user", user);

        query.first({
            success: function(object) {
                object.set("favoriteBrews", favors);
                object.save();
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
}