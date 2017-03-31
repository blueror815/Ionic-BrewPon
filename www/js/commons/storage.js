/**
 * @ngdoc service
 * @name brew.Services.Storage
 * @description Storage service to store value to local storage
 */

angular
    .module('brew')
    .service('StorageService', StorageService);

StorageService.$inject = [
    '$q'
];

function StorageService(
    $q
) {
    var self = this;


    /**
     * @description: Get localStorage value using key
     * @name: getValue
     * @param: key
     * @return: localStorage value
     */

    self.getValue = function(key) {
        return window.localStorage.getItem(key);
    }


    /**
     * @description: set localStorage value using key, value
     * @name: setValue
     * @param: key, value
     * @return: localStorage value
     */

    self.setValue = function(key, value) {
        window.localStorage.setItem(key, value);
    }


    /**
     * @description: clear all localStorage value
     * @name: clearAll
     * @return: clear all.
     */

    self.clearAll = function() {
        window.localStorage.clear();
    }


    /**
     * @description: clear an item using key
     * @name: clearItem
     * @param: key
     * @return: localStorage value
     */

    self.clearItem = function(key) {
        window.localStorage.removeItem(key);
    }
}