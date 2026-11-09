(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionDataService', ['$http', '$q', '$cacheFactory', 'AuthService', function($http, $q, $cacheFactory, AuthService) {
      var cache = $cacheFactory('transactionCache');
      var CACHE_KEY = 'transactionData';
      var CACHE_TTL = 300000;
      return {
        getTransactions: function(userId) {
          var cachedData = cache.get(CACHE_KEY);
          if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
            return $q.resolve(cachedData.data);
          }
          return $http.get('/api/transactions', {
            params: { userId: userId || AuthService.getUserId() }
          }).then(function(response) {
            cache.put(CACHE_KEY, {
              data: response.data,
              timestamp: Date.now()
            });
            return response.data;
          }).catch(function(error) {
            console.error('Error fetching transactions:', error);
            if (cachedData) {
              return cachedData.data;
            }
            return $q.reject(error);
          });
        },
        getTransactionById: function(transactionId) {
          return $http.get('/api/transactions/' + transactionId)
            .then(function(response) {
              return response.data;
            }).catch(function(error) {
              console.error('Error fetching transaction:', error);
              return $q.reject(error);
            });
        },
        clearCache: function() {
          cache.remove(CACHE_KEY);
        }
      };
    }]);
})();