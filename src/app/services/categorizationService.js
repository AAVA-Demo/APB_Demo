(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('categorizationService', [function() {
      var categoryRules = {
        'Food & Dining': ['starbucks', 'pizza', 'restaurant', 'cafe', 'food'],
        'Fuel': ['shell', 'hp', 'fuel', 'petrol', 'gas'],
        'Shopping': ['amazon', 'flipkart', 'mall', 'store', 'shopping'],
        'Travel': ['uber', 'ola', 'airline', 'hotel', 'travel'],
        'Entertainment': ['netflix', 'spotify', 'cinema', 'movie', 'entertainment'],
        'Utilities': ['electricity', 'water', 'gas', 'internet', 'utilities'],
        'Healthcare': ['pharmacy', 'hospital', 'clinic', 'apollo', 'healthcare'],
        'Education': ['coursera', 'udemy', 'school', 'college', 'education'],
        'Miscellaneous': ['misc', 'general', 'other']
      };
      this.categorizeTransactions = function(transactions) {
        return transactions.map(function(txn) {
          if (txn.category) return txn;
          var merchant = txn.merchant.toLowerCase();
          for (var cat in categoryRules) {
            if (categoryRules[cat].some(function(keyword) { return merchant.includes(keyword); })) {
              txn.category = cat;
              return txn;
            }
          }
          txn.category = 'Miscellaneous';
          return txn;
        });
      };
    }]);