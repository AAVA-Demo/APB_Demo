(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KPIService', ['$http', '$q', '$cacheFactory', 'AuthService', function($http, $q, $cacheFactory, AuthService) {
      var cache = $cacheFactory('kpiCache');
      var CACHE_KEY = 'kpiData';
      var CACHE_TTL = 300000;
      return {
        getKPIs: function(userId) {
          var cachedData = cache.get(CACHE_KEY);
          if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
            return $q.resolve(cachedData.data);
          }
          return $http.get('/api/dashboard/kpis', {
            params: { userId: userId || AuthService.getUserId() }
          }).then(function(response) {
            cache.put(CACHE_KEY, {
              data: response.data,
              timestamp: Date.now()
            });
            return response.data;
          }).catch(function(error) {
            console.error('Error fetching KPIs:', error);
            if (cachedData) {
              return cachedData.data;
            }
            return $q.reject(error);
          });
        },
        clearCache: function() {
          cache.remove(CACHE_KEY);
        }
      };
    }]);
})();