/**
 * @ngdoc service
 * @name NewsService
 * @description NewsService interacts with blog website and get all blogs
 */

angular.module('news')
    .service('NewsService', function($q, $http) {

        var self = this;
        self.blogs = [];

        self.getAllNews = function() {

            var defer = $q.defer();

            $http({
                    url: 'http://ashevilleblog.com/category/beer',
                    method: 'GET'
                })
                .success(function(resp) {
                    console.log("===>Response is...", resp);
                    var the_data = $(resp);
                    var items = $(the_data).find('article');
                    $(items).each(function() {
                        var blog = {};
                        blog.title = $(this).find('h2 a').html();
                        blog.link = $(this).find('h2 a').attr('href');
                        var temp_body = $(this).find('.entry').text();
                        temp_body = temp_body.replace("Read More", "");
                        blog.body = temp_body;
                        blog.image = $(this).find('img').attr('src');
                        self.blogs.push(blog);
                    });
                    defer.resolve(self.blogs);
                })
                .error(function(err) {
                    defer.reject('An error occured while communicating to the server.', err);
                });

            return defer.promise;
        };

        self.getNews = function(index) {

            var defer = $q.defer();

            if (self.blogs[index]) {
                defer.resolve(self.blogs[index]);
            }
            return defer.promise;
        };
    });