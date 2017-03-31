/* global Parse */
'use strict';

/**
 * @ngdoc service
 * @name core.Services.ParseGeneral
 * @description Service for interacting with the Parse SDK. The parse keys are set in core/core.js
 */
angular
    .module('brew')
    .service('Parse', [

        function() {

            this.getUser = function() {
                return Parse.User.current();
            };

            this.getParse = function() {
                return Parse;
            };

            this.contains = function(objName, searchField, searchTerm) {
                var Object = Parse.Object.extend(objName);
                var query = new Parse.Query(Object);
                searchTerm = searchTerm.toLowerCase();
                query.contains(searchField, searchTerm.split(' '));

                return query.find();
            };

            this.save = function(Object) {
                return Object.save();
            };

            this.new = function(objName) {
                var Object = Parse.Object.extend(objName);
                return new Object();
            };

            this.search = function(objName, searchTerm) {
                var Object = Parse.Object.extend(objName);
                var query = new Parse.Query(Object);

                searchTerm = searchTerm.toLowerCase();

                query.matches('name', ".*" + searchTerm + ".*");

                return query.find();
            };

            this.get = function(objName, id) {
                var Object = Parse.Object.extend(objName);
                var query = new Parse.Query(Object);

                query.equalTo('objectId', id);

                return query.find();
            };

            this.getAll = function(objName, alphabetical) {
                var Object = Parse.Object.extend(objName);
                var query = new Parse.Query(Object);

                if (alphabetical) {
                    query.ascending(alphabetical);
                }

                //query.limit(1000);

                return query.find();
            };

            this.getWhere = function(objName, filter) {
                var Object = Parse.Object.extend(objName);
                var query = new Parse.Query(Object);

                angular.forEach(filter, function(val, key) {
                    query.equalTo(key, val);
                });

                return query.find();
            };

            this.getWhereIn = function(objName, idField, idArr) {
                var Object = Parse.Object.extend(objName);
                var query = new Parse.Query(Object);

                query.containedIn(idField, idArr);

                return query.find();
            };

            this.cloud = function(cloudFunction, data) {
                return Parse.Cloud.run(cloudFunction, data);
            };
        }
    ]);