(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsDataService', ['$http', '$q', '$cacheFactory', 'AuthService', function($http, $q, $cacheFactory, AuthService) {
      var cache = $cacheFactory('analyticsCache');
      var CACHE_KEY = 'analyticsData';
      var CACHE_TTL = 600000;
      return {
        getSpendingAnalytics: function(userId, dateRange) {
          var months = dateRange || 12;
          var cacheKey = CACHE_KEY + '_' + months;
          var cachedData = cache.get(cacheKey);
          if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
            return $q.resolve(cachedData.data);
          }
          return $http.get('/api/analytics/spending', {
            params: {
              userId: userId || AuthService.getUserId(),
              months: months
            }
          }).then(function(response) {
            cache.put(cacheKey, {
              data: response.data,
              timestamp: Date.now()
            });
            return response.data;
          }).catch(function(error) {
            console.error('Error fetching analytics:', error);
            if (cachedData) {
              return cachedData.data;
            }
            return $q.reject(error);
          });
        },
        clearCache: function() {
          cache.removeAll();
        }
      };
    }]);
})();