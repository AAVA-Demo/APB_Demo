(function() {
  'use strict';
  angular.module('analytics')
    .service('AnalyticsService', ['TransactionAPIFactory', 'CategoryEngineService', '$q', function(TransactionAPIFactory, CategoryEngineService, $q) {
      var self = this;
      self.getSpendingAnalytics = function(userId, dateRange) {
        return TransactionAPIFactory.getTransactions(userId, dateRange)
          .then(function(transactions) {
            var categorized = CategoryEngineService.categorizeTransactions(transactions);
            var monthlyTrends = self.aggregateByMonth(categorized);
            var categoryBreakdown = self.aggregateByCategory(categorized);
            return {
              userId: userId,
              monthlyTrends: monthlyTrends,
              categoryBreakdown: categoryBreakdown,
              dateRange: dateRange
            };
          });
      };
      self.aggregateByMonth = function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var month = new Date(txn.date).toISOString().substring(0, 7);
          if (!monthMap[month]) {
            monthMap[month] = { month: month, totalSpend: 0, transactionCount: 0 };
          }
          monthMap[month].totalSpend += txn.amount;
          monthMap[month].transactionCount++;
        });
        return Object.values(monthMap).sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
      };
      self.aggregateByCategory = function(transactions) {
        var categoryMap = {};
        var total = 0;
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = { category: txn.category, totalSpend: 0 };
          }
          categoryMap[txn.category].totalSpend += txn.amount;
          total += txn.amount;
        });
        return Object.values(categoryMap).map(function(cat) {
          cat.percentage = total > 0 ? (cat.totalSpend / total * 100).toFixed(2) : 0;
          return cat;
        });
      };
    }]);
})();