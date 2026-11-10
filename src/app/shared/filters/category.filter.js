(function() {
  'use strict';
  angular.module('creditCardApp')
    .filter('categoryFilter', [categoryFilter]);
  function categoryFilter() {
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    return function(transactions, selectedCategory) {
      if (!selectedCategory || selectedCategory === 'All') {
        return transactions;
      }
      return transactions.filter(function(txn) {
        return txn.category === selectedCategory;
      });
    };
  }
})();