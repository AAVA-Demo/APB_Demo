(function() {
  'use strict';
  angular.module('app.transactions')
    .service('TransactionService', ['$http', '$q', 'ApiService', function($http, $q, ApiService) {
      var cache = new Map();
      this.getTransactions = function(page, size, filters) {
        page = page || 1;
        size = size || 20;
        var cacheKey = JSON.stringify({page: page, size: size, filters: filters});
        if (cache.has(cacheKey)) {
          return $q.resolve(cache.get(cacheKey));
        }
        var params = {page: page, size: size};
        if (filters) {
          if (filters.startDate) params.startDate = filters.startDate;
          if (filters.endDate) params.endDate = filters.endDate;
          if (filters.cardIds && filters.cardIds.length) params.cardIds = filters.cardIds.join(',');
          if (filters.minAmount) params.minAmount = filters.minAmount;
          if (filters.maxAmount) params.maxAmount = filters.maxAmount;
          if (filters.searchTerm) params.search = filters.searchTerm;
          if (filters.sortBy) params.sortBy = filters.sortBy;
          if (filters.sortOrder) params.sortOrder = filters.sortOrder;
        }
        return ApiService.get('/transactions', params).then(function(response) {
          cache.set(cacheKey, response);
          return response;
        });
      };
      this.clearCache = function() {
        cache.clear();
      };
    }]);
  TransactionService.$inject = ['$http', '$q', 'ApiService'];
})();