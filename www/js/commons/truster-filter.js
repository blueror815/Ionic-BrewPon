angular
    .module("brew")
    .filter('trustUrl', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    })
    .filter('highlight', function($sce) {

        return function(text, phrase) {

            var words = phrase.split(" ");

            for (var index in words) {
                var word = words[index];
                if (word.length < 3) {
                    continue;
                }
                if (word) text = text.replace(new RegExp('(' + word + ')', 'gi'),
                    '<span class="highlighted">$1</span>')
            }

            return $sce.trustAsHtml(text)
        }
    });