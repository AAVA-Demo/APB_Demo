(function() {
  'use strict';
  angular.module('transactionModule')
    .filter('transactionFilter', function() {
      return function(transactions, filters) {
        if (!filters) {
          return transactions;
        }
        var filtered = transactions;
        if (filters.cardId) {
          filtered = filtered.filter(function(t) {
            return t.cardId === filters.cardId;
          });
        }
        if (filters.searchTerm) {
          var searchLower = filters.searchTerm.toLowerCase();
          filtered = filtered.filter(function(t) {
            return (t.merchantName && t.merchantName.toLowerCase().indexOf(searchLower) !== -1) ||
                   (t.amount && t.amount.toString().indexOf(searchLower) !== -1) ||
                   (t.category && t.category.toLowerCase().indexOf(searchLower) !== -1);
          });
        }
        if (filters.dateRange && filters.dateRange.start) {
          var startDate = new Date(filters.dateRange.start);
          filtered = filtered.filter(function(t) {
            return new Date(t.transactionDate) >= startDate;
          });
        }
        if (filters.dateRange && filters.dateRange.end) {
          var endDate = new Date(filters.dateRange.end);
          filtered = filtered.filter(function(t) {
            return new Date(t.transactionDate) <= endDate;
          });
        }
        return filtered;
      };
    });
})();