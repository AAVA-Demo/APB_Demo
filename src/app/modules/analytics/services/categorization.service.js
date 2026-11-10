(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('CategorizationService', [function() {
      const CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      const categoryKeywords = {
        'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
        'Fuel': ['gas', 'fuel', 'petrol', 'shell', 'exxon'],
        'Shopping': ['store', 'shop', 'mall', 'amazon', 'walmart', 'target'],
        'Travel': ['airline', 'hotel', 'uber', 'lyft', 'taxi', 'flight'],
        'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game'],
        'Utilities': ['electric', 'water', 'internet', 'phone', 'utility'],
        'Healthcare': ['hospital', 'pharmacy', 'doctor', 'clinic', 'medical'],
        'Education': ['school', 'university', 'course', 'book', 'tuition']
      };
      this.categorizeTransactions = function(transactions) {
        return transactions.map(txn => {
          if (txn.category && CATEGORIES.includes(txn.category)) {
            return txn;
          }
          let assignedCategory = 'Miscellaneous';
          const merchant = (txn.merchant || '').toLowerCase();
          for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => merchant.includes(keyword))) {
              assignedCategory = category;
              break;
            }
          }
          return Object.assign({}, txn, {category: assignedCategory});
        });
      };
      this.getCategories = function() {
        return CATEGORIES;
      };
    }]);
})();