(function() {
  'use strict';
  angular.module('cc.analytics')
    .service('CategorizationService', ['SPENDING_CATEGORIES', CategorizationService]);
  function CategorizationService(SPENDING_CATEGORIES) {
    var categoryRules = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
      'Fuel': ['gas', 'fuel', 'petrol', 'diesel', 'station'],
      'Shopping': ['store', 'shop', 'retail', 'mall', 'market'],
      'Travel': ['airline', 'hotel', 'travel', 'flight', 'booking'],
      'Entertainment': ['movie', 'cinema', 'theatre', 'entertainment', 'concert'],
      'Utilities': ['electric', 'water', 'utility', 'bill', 'internet'],
      'Healthcare': ['hospital', 'pharmacy', 'medical', 'doctor', 'clinic'],
      'Education': ['school', 'university', 'education', 'tuition', 'book']
    };
    this.categorizeTransactions = function(transactions) {
      return transactions.map(function(transaction) {
        if (!transaction.category || transaction.category === 'Miscellaneous') {
          transaction.category = categorizeByMerchant(transaction.merchantName || transaction.description || '');
        }
        return transaction;
      });
    };
    function categorizeByMerchant(merchantName) {
      var lowerMerchant = merchantName.toLowerCase();
      for (var category in categoryRules) {
        var keywords = categoryRules[category];
        for (var i = 0; i < keywords.length; i++) {
          if (lowerMerchant.indexOf(keywords[i]) !== -1) {
            return category;
          }
        }
      }
      return 'Miscellaneous';
    }
  }
})();