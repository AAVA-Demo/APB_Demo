(function() {
  'use strict';
  angular.module('app.analytics')
    .service('CategorizationService', [function() {
      var categoryMapping = {
        'food': 'Food & Dining',
        'restaurant': 'Food & Dining',
        'dining': 'Food & Dining',
        'fuel': 'Fuel',
        'gas': 'Fuel',
        'petrol': 'Fuel',
        'shop': 'Shopping',
        'store': 'Shopping',
        'mall': 'Shopping',
        'travel': 'Travel',
        'flight': 'Travel',
        'hotel': 'Travel',
        'entertainment': 'Entertainment',
        'movie': 'Entertainment',
        'cinema': 'Entertainment',
        'utility': 'Utilities',
        'electric': 'Utilities',
        'water': 'Utilities',
        'healthcare': 'Healthcare',
        'hospital': 'Healthcare',
        'medical': 'Healthcare',
        'education': 'Education',
        'school': 'Education',
        'university': 'Education'
      };
      var service = {
        categorizeTransactions: categorizeTransactions
      };
      return service;
      function categorizeTransactions(transactions) {
        return transactions.map(function(txn) {
          var category = 'Miscellaneous';
          if (txn.merchant) {
            var merchantLower = txn.merchant.toLowerCase();
            for (var keyword in categoryMapping) {
              if (merchantLower.indexOf(keyword) !== -1) {
                category = categoryMapping[keyword];
                break;
              }
            }
          }
          return angular.extend({}, txn, { category: category });
        });
      }
    }]);
})();