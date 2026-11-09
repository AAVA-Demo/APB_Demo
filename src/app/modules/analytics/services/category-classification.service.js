(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('categoryClassificationService', CategoryClassificationService);
  CategoryClassificationService.$inject = [];
  function CategoryClassificationService() {
    var service = this;
    var categoryRules = {
      'Food & Dining': ['restaurant', 'cafe', 'food', 'swiggy', 'zomato', 'dominos', 'pizza', 'mcdonald'],
      'Fuel': ['petrol', 'diesel', 'fuel', 'gas', 'hp', 'bharat petroleum', 'indian oil'],
      'Shopping': ['amazon', 'flipkart', 'mall', 'store', 'shop', 'retail', 'myntra', 'ajio'],
      'Travel': ['airline', 'flight', 'hotel', 'uber', 'ola', 'railway', 'irctc', 'makemytrip'],
      'Entertainment': ['movie', 'cinema', 'theatre', 'netflix', 'prime', 'hotstar', 'spotify'],
      'Utilities': ['electricity', 'water', 'gas', 'internet', 'mobile', 'recharge', 'bill'],
      'Healthcare': ['hospital', 'clinic', 'pharmacy', 'medical', 'doctor', 'apollo', 'fortis'],
      'Education': ['school', 'college', 'university', 'course', 'tuition', 'books', 'education']
    };
    service.categorizeTransactions = function(transactions) {
      var categorized = [];
      angular.forEach(transactions, function(txn) {
        var category = service.classifyTransaction(txn);
        txn.category = category;
        categorized.push(txn);
      });
      return categorized;
    };
    service.classifyTransaction = function(txn) {
      var merchantLower = (txn.merchantName || '').toLowerCase();
      var typeLower = (txn.transactionType || '').toLowerCase();
      var searchText = merchantLower + ' ' + typeLower;
      for (var category in categoryRules) {
        var keywords = categoryRules[category];
        for (var i = 0; i < keywords.length; i++) {
          if (searchText.indexOf(keywords[i]) !== -1) {
            return category;
          }
        }
      }
      return 'Miscellaneous';
    };
  }
})();