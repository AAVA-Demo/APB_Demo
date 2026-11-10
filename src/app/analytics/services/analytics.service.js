(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['TransactionService', '$q', function(TransactionService, $q) {
      var self = this;
      self.getSpendingAnalytics = function(dateRange, filterCategory) {
        return TransactionService.getTransactions(dateRange)
          .then(function(transactions) {
            if (filterCategory) {
              transactions = transactions.filter(function(t) { return t.category === filterCategory; });
            }
            var categorySpending = self.aggregateByCategory(transactions);
            var monthlyTrends = self.aggregateByMonth(transactions);
            return {
              categorySpending: categorySpending,
              monthlyTrends: monthlyTrends
            };
          });
      };
      self.aggregateByCategory = function(transactions) {
        var categoryMap = {};
        var total = 0;
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = { category: txn.category, totalAmount: 0, transactionCount: 0 };
          }
          categoryMap[txn.category].totalAmount += txn.amount;
          categoryMap[txn.category].transactionCount++;
          total += txn.amount;
        });
        var result = [];
        Object.keys(categoryMap).forEach(function(key) {
          var item = categoryMap[key];
          item.percentage = total > 0 ? ((item.totalAmount / total) * 100).toFixed(2) : 0;
          result.push(item);
        });
        return result;
      };
      self.aggregateByMonth = function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var date = new Date(txn.transactionDate);
          var monthKey = date.getFullYear() + '-' + (date.getMonth() + 1);
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = { month: monthKey, totalSpend: 0, categoryBreakdown: {} };
          }
          monthMap[monthKey].totalSpend += txn.amount;
          if (!monthMap[monthKey].categoryBreakdown[txn.category]) {
            monthMap[monthKey].categoryBreakdown[txn.category] = 0;
          }
          monthMap[monthKey].categoryBreakdown[txn.category] += txn.amount;
        });
        var result = [];
        Object.keys(monthMap).sort().forEach(function(key) {
          result.push(monthMap[key]);
        });
        return result;
      };
    }]);
})();