(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('CategorizationFactory', [function() {
      var categoryMappings = {
        'Food & Dining': ['restaurant', 'food', 'dining', 'cafe', 'coffee', 'pizza', 'burger'],
        'Fuel': ['gas', 'fuel', 'petrol', 'shell', 'exxon', 'chevron'],
        'Shopping': ['store', 'shop', 'retail', 'amazon', 'walmart', 'target'],
        'Travel': ['airline', 'hotel', 'travel', 'flight', 'booking', 'uber', 'lyft'],
        'Entertainment': ['movie', 'cinema', 'theatre', 'concert', 'netflix', 'spotify'],
        'Utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'utility'],
        'Healthcare': ['hospital', 'pharmacy', 'medical', 'doctor', 'clinic', 'health'],
        'Education': ['school', 'university', 'college', 'tuition', 'books', 'education'],
        'Miscellaneous': []
      };
      function categorizeTransaction(transaction) {
        var merchant = (transaction.merchant || '').toLowerCase();
        var description = (transaction.description || '').toLowerCase();
        for (var category in categoryMappings) {
          var keywords = categoryMappings[category];
          for (var i = 0; i < keywords.length; i++) {
            if (merchant.indexOf(keywords[i]) !== -1 || description.indexOf(keywords[i]) !== -1) {
              return category;
            }
          }
        }
        return 'Miscellaneous';
      }
      return {
        categorizeTransactions: function(transactions) {
          return transactions.map(function(txn) {
            if (!txn.category) {
              txn.category = categorizeTransaction(txn);
            }
            return txn;
          });
        }
      };
    }]);
})();