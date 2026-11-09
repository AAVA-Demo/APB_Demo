(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategoryClassificationService', [function() {
      this.groupByCategory = function(transactions) {
        const categoryMap = {};
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        transactions.forEach(function(t) {
          if (!categoryMap[t.category]) {
            categoryMap[t.category] = { category: t.category, totalAmount: 0, transactionCount: 0, percentage: 0 };
          }
          categoryMap[t.category].totalAmount += t.amount;
          categoryMap[t.category].transactionCount++;
        });
        const result = Object.values(categoryMap);
        result.forEach(function(c) {
          c.percentage = total > 0 ? ((c.totalAmount / total) * 100).toFixed(2) : 0;
        });
        return result;
      };
    }]);
})();