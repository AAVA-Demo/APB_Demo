(function() {
  'use strict';
  angular.module('app.analytics')
    .service('TransactionService', ['$http', '$q', '$cacheFactory', 'API_CONFIG', 'AuthService', function($http, $q, $cacheFactory, API_CONFIG, AuthService) {
      var self = this;
      var cache = $cacheFactory('transactionCache');
      self.getTransactions = function(startDate, endDate, category) {
        var params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (category) params.category = category;
        var cacheKey = JSON.stringify(params);
        var cachedData = cache.get(cacheKey);
        if (cachedData) {
          return $q.resolve(cachedData);
        }
        return $http.get(API_CONFIG.baseUrl + '/transactions', {params: params})
          .then(function(response) {
            cache.put(cacheKey, response.data);
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching transactions:', error);
            return $q.reject(error);
          });
      };
      self.clearCache = function() {
        cache.removeAll();
      };
    }]);
})();