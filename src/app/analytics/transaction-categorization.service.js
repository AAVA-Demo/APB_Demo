(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('TransactionCategorizationService', [function() {
      const categoryRules = {
        'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
        'Fuel': ['gas', 'fuel', 'petrol', 'shell', 'bp', 'exxon'],
        'Shopping': ['amazon', 'walmart', 'target', 'mall', 'store'],
        'Travel': ['airline', 'hotel', 'uber', 'lyft', 'taxi', 'flight'],
        'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game'],
        'Utilities': ['electric', 'water', 'internet', 'phone', 'utility'],
        'Healthcare': ['hospital', 'doctor', 'pharmacy', 'medical', 'clinic'],
        'Education': ['school', 'university', 'course', 'tuition', 'books'],
        'Miscellaneous': []
      };
      this.categorizeTransaction = function(transaction) {
        const merchant = (transaction.merchant || '').toLowerCase();
        for (const category in categoryRules) {
          const keywords = categoryRules[category];
          for (let i = 0; i < keywords.length; i++) {
            if (merchant.indexOf(keywords[i]) !== -1) {
              return category;
            }
          }
        }
        return 'Miscellaneous';
      };
    }]);
})();