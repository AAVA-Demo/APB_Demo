(function() {
  'use strict';
  angular.module('cc.analytics')
    .service('AnalyticsService', ['$q', 'TransactionDataFactory', 'CategorizationService', AnalyticsService]);
  function AnalyticsService($q, TransactionDataFactory, CategorizationService) {
    var cache = null;
    var cacheTime = null;
    var CACHE_DURATION = 300000;
    this.getSpendingAnalytics = function(months) {
      var now = Date.now();
      if (cache && cacheTime && (now - cacheTime < CACHE_DURATION)) {
        return $q.resolve(cache);
      }
      return TransactionDataFactory.getTransactionHistory(months)
        .then(function(transactions) {
          var categorizedTransactions = CategorizationService.categorizeTransactions(transactions);
          var monthlyTrends = aggregateMonthlyTrends(categorizedTransactions);
          var categoryBreakdown = aggregateCategoryBreakdown(categorizedTransactions);
          var totalSpend = categorizedTransactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
          var data = {
            monthlyTrends: monthlyTrends,
            categoryBreakdown: categoryBreakdown,
            totalSpend: totalSpend,
            dateRange: {
              startDate: new Date(new Date().setMonth(new Date().getMonth() - months)),
              endDate: new Date()
            }
          };
          cache = data;
          cacheTime = now;
          return data;
        });
    };
    function aggregateMonthlyTrends(transactions) {
      var monthMap = {};
      transactions.forEach(function(t) {
        var date = new Date(t.transactionDate);
        var key = date.getFullYear() + '-' + (date.getMonth() + 1);
        if (!monthMap[key]) {
          monthMap[key] = { month: date.toLocaleString('default', { month: 'short' }), year: date.getFullYear(), totalSpend: 0, transactionCount: 0 };
        }
        monthMap[key].totalSpend += t.amount;
        monthMap[key].transactionCount++;
      });
      return Object.values(monthMap).sort(function(a, b) { return a.year - b.year || a.month.localeCompare(b.month); });
    }
    function aggregateCategoryBreakdown(transactions) {
      var categoryMap = {};
      var total = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
      transactions.forEach(function(t) {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = { category: t.category, totalAmount: 0, transactionCount: 0 };
        }
        categoryMap[t.category].totalAmount += t.amount;
        categoryMap[t.category].transactionCount++;
      });
      return Object.values(categoryMap).map(function(c) {
        c.percentage = total > 0 ? (c.totalAmount / total * 100).toFixed(2) : 0;
        return c;
      });
    }
  }
})();