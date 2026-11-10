(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsEngineService', ['CategoryService', function(CategoryService) {
      return {
        aggregateByCategory: function(transactions) {
          var categoryMap = {};
          transactions.forEach(function(txn) {
            if (!categoryMap[txn.category]) {
              categoryMap[txn.category] = { category: txn.category, totalSpend: 0, transactionCount: 0 };
            }
            categoryMap[txn.category].totalSpend += txn.amount;
            categoryMap[txn.category].transactionCount++;
          });
          var totalSpend = transactions.reduce(function(sum, txn) { return sum + txn.amount; }, 0);
          var result = Object.keys(categoryMap).map(function(key) {
            var item = categoryMap[key];
            item.percentageOfTotal = totalSpend > 0 ? ((item.totalSpend / totalSpend) * 100).toFixed(2) : 0;
            return item;
          });
          return result;
        },
        filterByCategory: function(transactions, selectedCategories) {
          if (!selectedCategories || selectedCategories.length === 0) return transactions;
          return transactions.filter(function(txn) {
            return selectedCategories.indexOf(txn.category) !== -1;
          });
        }
      };
    }]);
})();