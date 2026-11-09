(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionCategorizerFactory', [TransactionCategorizerFactory]);
  function TransactionCategorizerFactory() {
    var categoryMap = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger', 'starbucks', 'mcdonald'],
      'Fuel': ['gas', 'fuel', 'petrol', 'shell', 'bp', 'exxon', 'chevron'],
      'Shopping': ['amazon', 'walmart', 'target', 'mall', 'store', 'shop', 'retail'],
      'Travel': ['airline', 'hotel', 'uber', 'lyft', 'taxi', 'flight', 'booking'],
      'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'theatre'],
      'Utilities': ['electric', 'water', 'internet', 'phone', 'utility', 'bill'],
      'Healthcare': ['hospital', 'pharmacy', 'doctor', 'medical', 'health', 'clinic'],
      'Education': ['school', 'university', 'college', 'tuition', 'book', 'education'],
      'Miscellaneous': []
    };
    return {
      categorize: categorize,
      getCategories: getCategories
    };
    function categorize(transaction) {
      if (transaction.category && transaction.category !== 'Uncategorized') {
        return transaction.category;
      }
      var merchant = (transaction.merchant || '').toLowerCase();
      for (var category in categoryMap) {
        if (category === 'Miscellaneous') continue;
        var keywords = categoryMap[category];
        for (var i = 0; i < keywords.length; i++) {
          if (merchant.indexOf(keywords[i]) !== -1) {
            return category;
          }
        }
      }
      return 'Miscellaneous';
    }
    function getCategories() {
      return Object.keys(categoryMap);
    }
  }
})();