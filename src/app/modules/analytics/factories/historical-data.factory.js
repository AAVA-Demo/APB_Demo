(function() {
  'use strict';
  angular.module('creditCardApp.analytics').factory('HistoricalDataFactory', ['$http', '$cacheFactory', 'API_CONFIG', function($http, $cacheFactory, API_CONFIG) {
    var cache = $cacheFactory('historicalDataCache');
    var factory = {};
    factory.getHistoricalTransactions = function(userId, startDate, endDate) {
      var cacheKey = userId + '_' + startDate + '_' + endDate;
      var cachedData = cache.get(cacheKey);
      if (cachedData) {
        return Promise.resolve(cachedData);
      }
      return $http({
        method: 'GET',
        url: API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionHistory,
        params: {
          userId: userId,
          startDate: startDate,
          endDate: endDate
        },
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        cache.put(cacheKey, response.data);
        return response.data;
      });
    };
    return factory;
  }]);
  HistoricalDataFactory.$inject = ['$http', '$cacheFactory', 'API_CONFIG'];
})();