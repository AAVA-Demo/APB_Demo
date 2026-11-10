(function() {
  'use strict';
  angular.module('analytics')
    .service('CategorizationService', [function() {
      var CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var rules = {
        'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
        'Fuel': ['gas', 'fuel', 'petrol', 'shell', 'exxon'],
        'Shopping': ['amazon', 'walmart', 'target', 'store', 'shop'],
        'Travel': ['airline', 'hotel', 'uber', 'lyft', 'travel', 'flight'],
        'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'concert'],
        'Utilities': ['electric', 'water', 'internet', 'phone', 'utility'],
        'Healthcare': ['hospital', 'pharmacy', 'doctor', 'clinic', 'medical'],
        'Education': ['school', 'university', 'course', 'tuition', 'book']
      };
      this.categorize = function(transaction) {
        var merchant = (transaction.merchantName || '').toLowerCase();
        var desc = (transaction.description || '').toLowerCase();
        for (var category in rules) {
          var keywords = rules[category];
          for (var i = 0; i < keywords.length; i++) {
            if (merchant.indexOf(keywords[i]) !== -1 || desc.indexOf(keywords[i]) !== -1) {
              return category;
            }
          }
        }
        return 'Miscellaneous';
      };
    }]);
})();