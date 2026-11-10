(function() {
  'use strict';
  angular.module('analytics')
    .factory('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var cache = {};
      var CACHE_TTL = 300000;
      function getCacheKey(dateRange) {
        return dateRange.startDate + '_' + dateRange.endDate;
      }
      return {
        getSpendingAnalytics: function(dateRange) {
          var cacheKey = getCacheKey(dateRange);
          var now = Date.now();
          if (cache[cacheKey] && cache[cacheKey].timestamp && (now - cache[cacheKey].timestamp < CACHE_TTL)) {
            return $q.resolve(cache[cacheKey].data);
          }
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING, {
            params: { start: dateRange.startDate, end: dateRange.endDate },
            timeout: API_CONFIG.TIMEOUT
          })
          .then(function(response) {
            cache[cacheKey] = { data: response.data, timestamp: now };
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
        },
        clearCache: function() {
          cache = {};
        }
      };
    }]);
})();