(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', '$cacheFactory', TransactionService]);
  function TransactionService($http, $q, $cacheFactory) {
    var vm = this;
    var cache = $cacheFactory('transactionCache');
    vm.getTransactions = function(filterCriteria, pagination) {
      var params = { page: pagination.currentPage, size: pagination.pageSize };
      if (filterCriteria) {
        if (filterCriteria.startDate) params.startDate = filterCriteria.startDate.toISOString().split('T')[0];
        if (filterCriteria.endDate) params.endDate = filterCriteria.endDate.toISOString().split('T')[0];
        if (filterCriteria.cardIds && filterCriteria.cardIds.length) params.cardIds = filterCriteria.cardIds.join(',');
        if (filterCriteria.merchant) params.merchant = filterCriteria.merchant;
        if (filterCriteria.minAmount) params.minAmount = filterCriteria.minAmount;
        if (filterCriteria.maxAmount) params.maxAmount = filterCriteria.maxAmount;
      }
      var cacheKey = JSON.stringify(params);
      var cached = cache.get(cacheKey);
      if (cached) return $q.resolve(cached);
      return $http.get('/api/transactions', { params: params }).then(function(response) {
        var result = { transactions: response.data.transactions || [], totalCount: response.data.totalCount || 0 };
        cache.put(cacheKey, result);
        return result;
      }).catch(function(error) {
        console.error('Error fetching transactions:', error);
        return { transactions: [], totalCount: 0 };
      });
    };
  }
})();