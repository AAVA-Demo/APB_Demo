(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['$http', '$q', 'MockDataService', function($http, $q, MockDataService) {
      var cache = null;
      var cacheTime = null;
      var CACHE_TTL = 5 * 60 * 1000;
      
      this.getKPIs = function() {
        var now = new Date().getTime();
        if (cache && cacheTime && (now - cacheTime) < CACHE_TTL) {
          return $q.resolve(cache);
        }
        return MockDataService.getDashboardKPIs()
          .then(function(data) {
            cache = data;
            cacheTime = now;
            return data;
          });
      };
      
      this.clearCache = function() {
        cache = null;
        cacheTime = null;
      };
    }]);
})();