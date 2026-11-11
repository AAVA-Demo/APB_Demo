(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('KPIService', ['$http', '$q', 'API_CONFIG', 'AuthService', function($http, $q, API_CONFIG, AuthService) {
      var self = this;
      var cache = null;
      var cacheTime = null;
      var CACHE_TTL = 30000;
      self.getKPIs = function() {
        var now = Date.now();
        if (cache && cacheTime && (now - cacheTime < CACHE_TTL)) {
          return $q.resolve(cache);
        }
        return $http.get(API_CONFIG.baseUrl + '/dashboard/kpis', {cache: true})
          .then(function(response) {
            cache = response.data;
            cacheTime = now;
            return cache;
          })
          .catch(function(error) {
            console.error('Error fetching KPIs:', error);
            if (cache) {
              return cache;
            }
            return $q.reject(error);
          });
      };
      self.clearCache = function() {
        cache = null;
        cacheTime = null;
      };
    }]);
})();