(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .factory('CategorizationService', [function() {
      var categoryMap = {
        'food': 'Food & Dining',
        'fuel': 'Fuel',
        'shopping': 'Shopping',
        'travel': 'Travel',
        'entertainment': 'Entertainment',
        'utilities': 'Utilities',
        'healthcare': 'Healthcare',
        'education': 'Education',
        'miscellaneous': 'Miscellaneous'
      };
      function categorize(transaction) {
        var mcc = transaction.merchantCategory || 'miscellaneous';
        transaction.category = categoryMap[mcc.toLowerCase()] || 'Miscellaneous';
        return transaction;
      }
      function categorizeAll(transactions) {
        return transactions.map(categorize);
      }
      return {
        categorize: categorize,
        categorizeAll: categorizeAll
      };
    }]);
})();