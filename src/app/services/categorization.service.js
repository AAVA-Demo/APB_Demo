(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategorizationService', [function() {
      var categoryKeywords = {
        'Food & Dining': ['restaurant', 'cafe', 'starbucks', 'mcdonald', 'food', 'dining'],
        'Fuel': ['shell', 'exxon', 'chevron', 'gas', 'fuel', 'petrol'],
        'Shopping': ['amazon', 'walmart', 'target', 'mall', 'store', 'shopping'],
        'Travel': ['airline', 'hotel', 'uber', 'lyft', 'travel', 'flight'],
        'Entertainment': ['netflix', 'spotify', 'movie', 'theater', 'entertainment'],
        'Utilities': ['electric', 'water', 'internet', 'utility', 'bill'],
        'Healthcare': ['pharmacy', 'hospital', 'doctor', 'medical', 'health'],
        'Education': ['school', 'university', 'course', 'education', 'tuition'],
        'Miscellaneous': []
      };
      this.categorize = function(transactions) {
        return transactions.map(function(txn) {
          if (!txn.category || txn.category === 'Uncategorized') {
            txn.category = detectCategory(txn.merchantName || txn.description || '');
          }
          return txn;
        });
      };
      function detectCategory(text) {
        var lowerText = text.toLowerCase();
        for (var category in categoryKeywords) {
          var keywords = categoryKeywords[category];
          for (var i = 0; i < keywords.length; i++) {
            if (lowerText.indexOf(keywords[i]) > -1) {
              return category;
            }
          }
        }
        return 'Miscellaneous';
      }
    }]);
})();