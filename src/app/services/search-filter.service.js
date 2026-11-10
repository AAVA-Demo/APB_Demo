(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('SearchFilterService', ['$filter', SearchFilterService]);

  function SearchFilterService($filter) {
    return {
      applyFilters: applyFilters,
      buildQueryParams: buildQueryParams
    };

    function applyFilters(transactions, filters) {
      var filtered = transactions;
      if (filters.searchTerm) {
        filtered = $filter('filter')(filtered, filters.searchTerm);
      }
      if (filters.startDate) {
        filtered = filtered.filter(function(txn) {
          return new Date(txn.transactionDate) >= new Date(filters.startDate);
        });
      }
      if (filters.endDate) {
        filtered = filtered.filter(function(txn) {
          return new Date(txn.transactionDate) <= new Date(filters.endDate);
        });
      }
      if (filters.cardId) {
        filtered = filtered.filter(function(txn) {
          return txn.cardId === filters.cardId;
        });
      }
      return filtered;
    }

    function buildQueryParams(filters) {
      var params = {};
      if (filters.searchTerm) params.search = filters.searchTerm;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.cardId) params.cardId = filters.cardId;
      return params;
    }
  }
})();