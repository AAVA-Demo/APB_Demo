(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('AnalyticsService', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
      const API_BASE = '/api/analytics';
      const cache = $cacheFactory('analyticsCache');
      const CACHE_TTL = 300000;
      this.getSpendingData = function(userId, months) {
        const cacheKey = `spending_${userId}_${months}`;
        const cached = cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
          return $q.resolve(cached.data);
        }
        return $http.get(`${API_BASE}/spending?userId=${userId}&months=${months}`)
          .then(function(response) {
            cache.put(cacheKey, { data: response.data, timestamp: Date.now() });
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
    }]);
})();