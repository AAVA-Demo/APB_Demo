(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionService', TransactionService);
  TransactionService.$inject = ['$http', '$q', 'API_CONFIG', 'TransactionCache'];
  function TransactionService($http, $q, API_CONFIG, TransactionCache) {
    var vm = this;
    vm.getTransactions = function(cardId, page, size, filters) {
      var cacheKey = 'txn_' + (cardId || 'all') + '_' + page + '_' + size;
      var cached = TransactionCache.get(cacheKey);
      if (cached) {
        return $q.resolve(cached);
      }
      var params = { page: page || 1, size: size || 50 };
      if (cardId) params.cardId = cardId;
      if (filters) {
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.category) params.category = filters.category;
        if (filters.minAmount) params.minAmount = filters.minAmount;
        if (filters.maxAmount) params.maxAmount = filters.maxAmount;
      }
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, { params: params, timeout: API_CONFIG.timeout })
        .then(function(response) {
          TransactionCache.put(cacheKey, response.data, { maxAge: 300000 });
          return response.data;
        });
    };
    vm.getTransactionDetail = function(transactionId) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId, { timeout: API_CONFIG.timeout })
        .then(function(response) {
          return response.data;
        });
    };
  }
})();