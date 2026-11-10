(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('DashboardDataFactory', ['$cacheFactory', function($cacheFactory) {
      const cache = $cacheFactory('dashboardCache');
      const CACHE_KEY = 'kpiData';
      const CACHE_TTL = 5000;
      return {
        cacheKPIData: function(data) {
          cache.put(CACHE_KEY, { data: data, timestamp: Date.now() });
        },
        getCachedKPIData: function() {
          const cached = cache.get(CACHE_KEY);
          if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return cached.data;
          }
          return null;
        },
        clearCache: function() {
          cache.remove(CACHE_KEY);
        }
      };
    }]);
})();