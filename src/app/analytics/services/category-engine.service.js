(function() {
  'use strict';
  angular.module('analytics')
    .service('CategoryEngineService', [function() {
      var self = this;
      var categoryRules = {
        'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
        'Fuel': ['gas', 'fuel', 'petrol', 'shell', 'exxon'],
        'Shopping': ['amazon', 'walmart', 'target', 'mall', 'store'],
        'Travel': ['airline', 'hotel', 'uber', 'taxi', 'travel'],
        'Entertainment': ['movie', 'netflix', 'spotify', 'concert', 'theater'],
        'Utilities': ['electric', 'water', 'internet', 'phone', 'utility'],
        'Healthcare': ['hospital', 'pharmacy', 'doctor', 'medical', 'health'],
        'Education': ['school', 'university', 'course', 'tuition', 'books']
      };
      self.categorizeTransactions = function(transactions) {
        return transactions.map(function(txn) {
          if (!txn.category || txn.category === 'Uncategorized') {
            txn.category = self.detectCategory(txn.merchant, txn.description);
          }
          return txn;
        });
      };
      self.detectCategory = function(merchant, description) {
        var text = (merchant + ' ' + description).toLowerCase();
        for (var category in categoryRules) {
          var keywords = categoryRules[category];
          for (var i = 0; i < keywords.length; i++) {
            if (text.indexOf(keywords[i]) !== -1) {
              return category;
            }
          }
        }
        return 'Miscellaneous';
      };
    }]);
})();