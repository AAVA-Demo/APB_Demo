(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('transactionSearch', [function() {
      return function(transactions, filters) {
        if (!filters) return transactions;
        return transactions.filter(function(txn) {
          var matchSearch = !filters.searchText || 
            (txn.merchantName && txn.merchantName.toLowerCase().indexOf(filters.searchText.toLowerCase()) > -1) ||
            (txn.description && txn.description.toLowerCase().indexOf(filters.searchText.toLowerCase()) > -1);
          var matchCard = !filters.cardId || txn.cardId === filters.cardId;
          var matchDateFrom = !filters.dateFrom || new Date(txn.transactionDate) >= new Date(filters.dateFrom);
          var matchDateTo = !filters.dateTo || new Date(txn.transactionDate) <= new Date(filters.dateTo);
          var matchMinAmount = !filters.minAmount || txn.amount >= parseFloat(filters.minAmount);
          var matchMaxAmount = !filters.maxAmount || txn.amount <= parseFloat(filters.maxAmount);
          return matchSearch && matchCard && matchDateFrom && matchDateTo && matchMinAmount && matchMaxAmount;
        });
      };
    }]);
})();