(function() {
  'use strict';
  angular.module('dashboard')
    .factory('DashboardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var cache = null;
      var cacheTimestamp = null;
      var CACHE_TTL = 30000;
      return {
        getKPIs: function() {
          var now = Date.now();
          if (cache && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
            return $q.resolve(cache);
          }
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              cache = response.data;
              cacheTimestamp = now;
              return cache;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        clearCache: function() {
          cache = null;
          cacheTimestamp = null;
        }
      };
    }]);
})();