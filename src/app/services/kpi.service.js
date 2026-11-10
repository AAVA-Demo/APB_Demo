(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('KpiService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
      var cache = $cacheFactory('kpiCache');
      var CACHE_KEY = 'dashboardKpis';
      var CACHE_TTL = 300000;
      var service = {
        getKpis: getKpis,
        clearCache: clearCache
      };
      return service;
      function getKpis() {
        var cached = cache.get(CACHE_KEY);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
          return $q.resolve(cached.data);
        }
        return $http.get('/api/dashboard/kpis')
          .then(function(response) {
            var kpiData = new window.KpiModel(response.data);
            cache.put(CACHE_KEY, { data: kpiData, timestamp: Date.now() });
            return kpiData;
          })
          .catch(function(error) {
            console.error('Error fetching KPIs:', error);
            return $q.reject(error);
          });
      }
      function clearCache() {
        cache.remove(CACHE_KEY);
      }
    }]);
})();