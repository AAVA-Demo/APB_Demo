(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .filter('transactionFilter', [function() {
      return function(transactions, filters) {
        if (!filters || !transactions) return transactions;
        return transactions.filter(function(txn) {
          if (filters.startDate && new Date(txn.date) < new Date(filters.startDate)) return false;
          if (filters.endDate && new Date(txn.date) > new Date(filters.endDate)) return false;
          if (filters.category && txn.merchantCategory !== filters.category) return false;
          if (filters.cardId && txn.cardId !== filters.cardId) return false;
          if (filters.minAmount && txn.amount < filters.minAmount) return false;
          if (filters.maxAmount && txn.amount > filters.maxAmount) return false;
          return true;
        });
      };
    }]);
})();