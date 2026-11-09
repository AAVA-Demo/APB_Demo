(function() {
  'use strict';
  angular.module('creditCardApp').service('categorizationService', ['$http', '$q', function($http, $q) {
    const categoryMap = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'dining'],
      'Fuel': ['gas', 'fuel', 'petrol'],
      'Shopping': ['store', 'shop', 'retail', 'amazon'],
      'Travel': ['airline', 'hotel', 'travel', 'uber'],
      'Entertainment': ['movie', 'theater', 'concert', 'netflix'],
      'Utilities': ['electric', 'water', 'internet', 'utility'],
      'Healthcare': ['hospital', 'pharmacy', 'doctor', 'medical'],
      'Education': ['school', 'university', 'course', 'book'],
      'Miscellaneous': []
    };
    this.categorizeTransactions = function(transactions) {
      return transactions.map(function(txn) {
        if (!txn.category || txn.category === '') {
          txn.category = detectCategory(txn.merchant || txn.description || '');
        }
        return txn;
      });
    };
    function detectCategory(text) {
      const lowerText = text.toLowerCase();
      for (const category in categoryMap) {
        if (categoryMap[category].some(keyword => lowerText.includes(keyword))) {
          return category;
        }
      }
      return 'Miscellaneous';
    }
  }]);
})();