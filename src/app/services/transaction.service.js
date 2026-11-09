(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionService', ['$http', '$cacheFactory', function($http, $cacheFactory) {
      const cache = $cacheFactory('transactionCache');
      const API_BASE = '/api/transactions';
      this.getTransactions = function(params) {
        const cacheKey = JSON.stringify(params || {});
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          return Promise.resolve(cachedData);
        }
        return $http.get(API_BASE, { params: params }).then(function(response) {
          cache.put(cacheKey, response.data, { maxAge: 300000 });
          return response.data;
        });
      };
      this.clearCache = function() {
        cache.removeAll();
      };
    }]);
})();