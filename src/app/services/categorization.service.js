(function() {
  'use strict';
  angular.module('creditCardApp').service('CategorizationService', [function() {
    var CATEGORIES = {
      'food': 'Food & Dining',
      'fuel': 'Fuel',
      'shopping': 'Shopping',
      'travel': 'Travel',
      'entertainment': 'Entertainment',
      'utilities': 'Utilities',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'misc': 'Miscellaneous'
    };
    this.categorizeTransactions = function(transactions) {
      return transactions.map(function(txn) {
        if (!txn.category || !CATEGORIES[txn.category.toLowerCase()]) {
          txn.category = 'Miscellaneous';
        } else {
          txn.category = CATEGORIES[txn.category.toLowerCase()];
        }
        return txn;
      });
    };
    this.getCategories = function() {
      return Object.values(CATEGORIES);
    };
  }]);
})();