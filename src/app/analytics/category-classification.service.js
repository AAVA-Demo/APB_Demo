(function() {
  'use strict';
  angular.module('spendingAnalyticsModule')
    .factory('CategoryClassificationService', ['$q', function($q) {
      var categoryMap = {
        'FOOD': 'Food & Dining',
        'FUEL': 'Fuel',
        'SHOP': 'Shopping',
        'TRVL': 'Travel',
        'ENT': 'Entertainment',
        'UTIL': 'Utilities',
        'HLTH': 'Healthcare',
        'EDU': 'Education',
        'MISC': 'Miscellaneous'
      };
      return {
        classifyTransaction: function(transaction) {
          return categoryMap[transaction.merchantCode] || 'Miscellaneous';
        },
        classifyTransactions: function(transactions) {
          return transactions.map(function(txn) {
            txn.category = categoryMap[txn.merchantCode] || 'Miscellaneous';
            return txn;
          });
        }
      };
    }]);
})();