(function() {
  'use strict';
  angular.module('app.transactions')
    .service('TransactionService', ['$http', '$q', '$cacheFactory', 'API_CONFIG', function($http, $q, $cacheFactory, API_CONFIG) {
      var self = this;
      var transactionCache = $cacheFactory('transactionCache');
      self.getTransactions = function(filterParams, page, pageSize) {
        var deferred = $q.defer();
        var params = angular.extend({}, filterParams, { page: page, size: pageSize });
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, { params: params, timeout: API_CONFIG.timeout })
          .then(function(response) {
            deferred.resolve({
              transactions: response.data.transactions || [],
              totalCount: response.data.totalCount || 0
            });
          })
          .catch(function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getTransactionById = function(transactionId) {
        var cached = transactionCache.get(transactionId);
        if (cached) {
          return $q.resolve(cached);
        }
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .then(function(response) {
            transactionCache.put(transactionId, response.data);
            return response.data;
          });
      };
    }]);
})();