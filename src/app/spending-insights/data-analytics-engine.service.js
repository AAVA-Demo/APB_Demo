(function() {
  'use strict';
  angular.module('spendingInsightsModule')
    .factory('DataAnalyticsEngineService', ['$q', 'TransactionService', 'CategoryClassificationService', function($q, TransactionService, CategoryClassificationService) {
      return {
        getInsights: function(period) {
          return TransactionService.getTransactions('user-001').then(function(transactions) {
            var categoryMap = {};
            var monthMap = {};
            transactions.forEach(function(txn) {
              var category = CategoryClassificationService.classify(txn);
              if (!categoryMap[category]) {
                categoryMap[category] = { category: category, totalSpend: 0, transactionCount: 0 };
              }
              categoryMap[category].totalSpend += txn.amount;
              categoryMap[category].transactionCount += 1;
              var month = txn.transactionDate.toISOString().slice(0, 7);
              if (!monthMap[month]) {
                monthMap[month] = { month: month, totalSpend: 0 };
              }
              monthMap[month].totalSpend += txn.amount;
            });
            var totalSpend = Object.values(categoryMap).reduce(function(sum, cat) { return sum + cat.totalSpend; }, 0);
            Object.values(categoryMap).forEach(function(cat) {
              cat.percentageOfTotal = ((cat.totalSpend / totalSpend) * 100).toFixed(1);
            });
            return {
              categoryInsights: Object.values(categoryMap),
              monthlyTrends: Object.values(monthMap).sort(function(a, b) { return a.month.localeCompare(b.month); })
            };
          });
        }
      };
    }]);
})();