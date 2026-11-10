(function() {
  'use strict';
  angular.module('creditCard.trends')
    .factory('HistoricalDataFactory', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
      const cache = $cacheFactory('historicalDataCache');
      return {
        fetchHistoricalData: function(dateRange) {
          const cacheKey = dateRange.startDate + '_' + dateRange.endDate;
          const cachedData = cache.get(cacheKey);
          if (cachedData) {
            return $q.resolve(cachedData);
          }
          const params = {
            start: dateRange.startDate,
            end: dateRange.endDate
          };
          return $http.get('/api/transactions/history', { params: params })
            .then(function(response) {
              cache.put(cacheKey, response.data);
              setTimeout(function() { cache.remove(cacheKey); }, 300000);
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();