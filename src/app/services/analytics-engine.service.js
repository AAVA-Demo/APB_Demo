(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsEngineService', ['TransactionService', '$q', function(TransactionService, $q) {
      this.getSpendingAnalytics = function(userId, dateRange) {
        return TransactionService.fetchTransactions(userId, dateRange).then(function(transactions) {
          var categoryMap = {};
          var monthMap = {};
          var total = 0;
          transactions.forEach(function(t) {
            total += t.amount;
            if (!categoryMap[t.category]) categoryMap[t.category] = { category: t.category, totalAmount: 0, transactionCount: 0 };
            categoryMap[t.category].totalAmount += t.amount;
            categoryMap[t.category].transactionCount++;
            var month = formatMonth(t.date);
            if (!monthMap[month]) monthMap[month] = { month: month, totalSpend: 0 };
            monthMap[month].totalSpend += t.amount;
          });
          var categorySpending = Object.values(categoryMap).map(function(c) {
            c.percentageOfTotal = total > 0 ? (c.totalAmount / total * 100).toFixed(2) : 0;
            return c;
          });
          var monthlyTrend = Object.values(monthMap).sort(function(a, b) { return a.month.localeCompare(b.month); });
          return { categorySpending: categorySpending, monthlyTrend: monthlyTrend };
        });
      };
      this.getInsights = function(userId, dateRange) {
        return TransactionService.fetchTransactions(userId, dateRange || { months: 12 }).then(function(transactions) {
          var categoryMap = {};
          var monthMap = {};
          var total = 0;
          transactions.forEach(function(t) {
            total += t.amount;
            if (!categoryMap[t.category]) categoryMap[t.category] = { category: t.category, totalSpend: 0, transactionCount: 0 };
            categoryMap[t.category].totalSpend += t.amount;
            categoryMap[t.category].transactionCount++;
            var month = formatMonth(t.date);
            if (!monthMap[month]) monthMap[month] = { month: month, totalSpend: 0, categoryBreakdown: {} };
            monthMap[month].totalSpend += t.amount;
            if (!monthMap[month].categoryBreakdown[t.category]) monthMap[month].categoryBreakdown[t.category] = 0;
            monthMap[month].categoryBreakdown[t.category] += t.amount;
          });
          var categoryInsights = Object.values(categoryMap).map(function(c) {
            c.percentageOfTotal = total > 0 ? (c.totalSpend / total * 100).toFixed(2) : 0;
            return c;
          });
          var monthlyTrends = Object.keys(monthMap).sort().map(function(m) {
            return {
              month: m,
              totalSpend: monthMap[m].totalSpend,
              categoryBreakdown: Object.keys(monthMap[m].categoryBreakdown).map(function(cat) {
                return { category: cat, amount: monthMap[m].categoryBreakdown[cat] };
              })
            };
          });
          return { categoryInsights: categoryInsights, monthlyTrends: monthlyTrends };
        });
      };
      function formatMonth(date) {
        var d = new Date(date);
        var year = d.getFullYear();
        var month = ('0' + (d.getMonth() + 1)).slice(-2);
        return year + '-' + month;
      }
    }]);
})();