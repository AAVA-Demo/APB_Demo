(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('DataAnalyticsService', ['$filter', function($filter) {
      this.calculateTrends = function(transactions, timeRange) {
        var categorySpending = {};
        var monthlyTrends = {};
        var totalSpend = 0;
        transactions.forEach(function(txn) {
          totalSpend += txn.amount;
          if (!categorySpending[txn.category]) {
            categorySpending[txn.category] = { category: txn.category, totalAmount: 0, transactionCount: 0 };
          }
          categorySpending[txn.category].totalAmount += txn.amount;
          categorySpending[txn.category].transactionCount++;
          var txnDate = new Date(txn.transactionDate);
          var monthKey = txnDate.getFullYear() + '-' + String(txnDate.getMonth() + 1).padStart(2, '0');
          if (!monthlyTrends[monthKey]) {
            monthlyTrends[monthKey] = { month: monthKey, totalSpend: 0, categoryBreakdown: {} };
          }
          monthlyTrends[monthKey].totalSpend += txn.amount;
          if (!monthlyTrends[monthKey].categoryBreakdown[txn.category]) {
            monthlyTrends[monthKey].categoryBreakdown[txn.category] = { category: txn.category, totalAmount: 0, transactionCount: 0 };
          }
          monthlyTrends[monthKey].categoryBreakdown[txn.category].totalAmount += txn.amount;
          monthlyTrends[monthKey].categoryBreakdown[txn.category].transactionCount++;
        });
        var categorySpendingArray = Object.keys(categorySpending).map(function(key) {
          var cat = categorySpending[key];
          cat.percentage = totalSpend > 0 ? (cat.totalAmount / totalSpend * 100).toFixed(2) : 0;
          return cat;
        });
        var monthlyTrendsArray = Object.keys(monthlyTrends).sort().map(function(key) {
          var trend = monthlyTrends[key];
          trend.categoryBreakdown = Object.keys(trend.categoryBreakdown).map(function(catKey) {
            var cat = trend.categoryBreakdown[catKey];
            cat.percentage = trend.totalSpend > 0 ? (cat.totalAmount / trend.totalSpend * 100).toFixed(2) : 0;
            return cat;
          });
          return trend;
        });
        return {
          userId: 'user123',
          timeRange: timeRange,
          categorySpending: categorySpendingArray,
          monthlyTrends: monthlyTrendsArray,
          totalSpend: totalSpend
        };
      };
    }]);
})();