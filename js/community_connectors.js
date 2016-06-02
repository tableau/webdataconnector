(function (angular) {
  var wdcSearchServices = angular.module('wdcSearchServices', ['ngResource']),
      wdcHub;

  wdcSearchServices.factory('WDC', ['$resource',
    function ($resource) {
      return $resource('//npmsearch.com/query?q=keywords%3Atableau-wdc AND :query&fields=author,name,description,repository,homepage,modified,version&size=50', {}, {
        query: {
          method: 'GET',
          transformResponse: function (data) {
            var results = angular.fromJson(data).results;

            results.map(function (r, i) {
              var name = results[i].name[0],
                  versionParts;

              // Clean up repository property.
              if (r.repository) {
                results[i].repository[0] = r.repository[0].replace('git+', '');
              }

              // Provide a friendlier "last modified" date.
              results[i].modified[0] = moment(r.modified[0]).fromNow();

              // Remove the trailing "-wdc" from the name, filter out any that
              // do not include it.
              if (_.last(name, 4).join('') === '-wdc') {
                results[i].name[0] = name.substring(0, name.length - 4);
              }
              else {
                results.splice(i + 1, 1);
              }

              // Parse out the version to display Tableau WDC API version.
              versionParts = r.version[0].split('.');
              results[i].version[0] = versionParts[0] + '.' + versionParts[1];
            });

            return results;
          },
          isArray: true
        }
      });
    }]);


  wdcHub = angular.module('wdcHub', ['ngRoute', 'wdcSearchServices', 'wu.masonry']);
  wdcHub.controller('WdcSearchCtrl', ['$scope', 'WDC', function ($scope, wdc) {
    $scope.searchWdcs = function() {
      // If no query is defined, return "all" results.
      $scope.wdcs = wdc.query({query: $scope.query || '*'});
    };

    // Apply a debounce of 350ms.
    $scope.searchWdcs = _.debounce($scope.searchWdcs, 350);

    // Initialize with default.
    $scope.searchWdcs();
  }]);
})(angular);
