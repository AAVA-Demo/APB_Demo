(function() {
  'use strict';
  angular.module('creditCard.transactions').filter('transactionFilter', function() {
    return function(transactions, searchTerm) {
      if (!searchTerm) {
        return transactions;
      }
      var term = searchTerm.toLowerCase();
      return transactions.filter(function(txn) {
        return (txn.merchant && txn.merchant.toLowerCase().indexOf(term) !== -1) ||
               (txn.category && txn.category.toLowerCase().indexOf(term) !== -1) ||
               (txn.description && txn.description.toLowerCase().indexOf(term) !== -1) ||
               (txn.amount && txn.amount.toString().indexOf(term) !== -1);
      });
    };
  });
})();