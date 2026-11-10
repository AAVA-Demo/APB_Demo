(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategorizationService', ['CATEGORY_CONSTANTS', function(CATEGORY_CONSTANTS) {
      var self = this;
      self.categorize = function(transactions) {
        var categorized = {};
        CATEGORY_CONSTANTS.forEach(function(cat) {
          categorized[cat] = {
            categoryName: cat,
            totalSpend: 0,
            transactionCount: 0,
            transactions: []
          };
        });
        transactions.forEach(function(txn) {
          var category = txn.category || 'Miscellaneous';
          if (!categorized[category]) {
            category = 'Miscellaneous';
          }
          categorized[category].totalSpend += txn.amount;
          categorized[category].transactionCount++;
          categorized[category].transactions.push(txn);
        });
        var totalSpend = 0;
        Object.keys(categorized).forEach(function(key) {
          totalSpend += categorized[key].totalSpend;
        });
        Object.keys(categorized).forEach(function(key) {
          categorized[key].percentageOfTotal = totalSpend > 0 ? ((categorized[key].totalSpend / totalSpend) * 100).toFixed(2) : 0;
        });
        return {
          categories: Object.keys(categorized).map(function(key) { return categorized[key]; }),
          totalSpend: totalSpend
        };
      };
    }]);
})();