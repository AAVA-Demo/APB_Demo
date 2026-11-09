(function() {
  'use strict';
  angular.module('spendingAnalyticsModule')
    .factory('AnalyticsProcessingService', ['$q', 'TransactionDataService', 'CategoryClassificationService', function($q, TransactionDataService, CategoryClassificationService) {
      return {
        getAnalytics: function() {
          return TransactionDataService.getTransactions('user-001').then(function(transactions) {
            var categorized = CategoryClassificationService.classifyTransactions(transactions);
            var categoryMap = {};
            var monthMap = {};
            categorized.forEach(function(txn) {
              if (!categoryMap[txn.category]) {
                categoryMap[txn.category] = { category: txn.category, totalAmount: 0, transactionCount: 0 };
              }
              categoryMap[txn.category].totalAmount += txn.amount;
              categoryMap[txn.category].transactionCount += 1;
              var month = txn.transactionDate.toISOString().slice(0, 7);
              if (!monthMap[month]) {
                monthMap[month] = { month: month, totalSpending: 0 };
              }
              monthMap[month].totalSpending += txn.amount;
            });
            var totalSpend = Object.values(categoryMap).reduce(function(sum, cat) { return sum + cat.totalAmount; }, 0);
            Object.values(categoryMap).forEach(function(cat) {
              cat.percentage = ((cat.totalAmount / totalSpend) * 100).toFixed(1);
            });
            return {
              categoryData: Object.values(categoryMap),
              monthlyTrends: Object.values(monthMap).sort(function(a, b) { return a.month.localeCompare(b.month); })
            };
          });
        }
      };
    }]);
})();