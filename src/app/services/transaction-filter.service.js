(function() {
  'use strict';
  angular.module('app.transactions')
    .service('TransactionFilterService', [function() {
      this.applyFilters = function(transactions, filter) {
        if (!transactions) return [];
        var filtered = transactions;
        if (filter.searchText) {
          var searchLower = filter.searchText.toLowerCase();
          filtered = filtered.filter(function(txn) {
            return txn.merchant.toLowerCase().indexOf(searchLower) > -1 ||
                   txn.category.toLowerCase().indexOf(searchLower) > -1 ||
                   txn.description.toLowerCase().indexOf(searchLower) > -1;
          });
        }
        if (filter.dateFrom) {
          filtered = filtered.filter(function(txn) {
            return new Date(txn.date) >= new Date(filter.dateFrom);
          });
        }
        if (filter.dateTo) {
          filtered = filtered.filter(function(txn) {
            return new Date(txn.date) <= new Date(filter.dateTo);
          });
        }
        if (filter.cardIds && filter.cardIds.length > 0) {
          filtered = filtered.filter(function(txn) {
            return filter.cardIds.indexOf(txn.cardId) > -1;
          });
        }
        if (filter.categories && filter.categories.length > 0) {
          filtered = filtered.filter(function(txn) {
            return filter.categories.indexOf(txn.category) > -1;
          });
        }
        return filtered;
      };
    }]);
})();