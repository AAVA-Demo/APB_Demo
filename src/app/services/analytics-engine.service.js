(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsEngineService', ['$q', AnalyticsEngineService]);
  function AnalyticsEngineService($q) {
    var self = this;
    self.computeCategorySpending = computeCategorySpending;
    self.computeMonthlyTrends = computeMonthlyTrends;
    function computeCategorySpending(transactions) {
      try {
        var categoryMap = {};
        var totalAmount = 0;
        transactions.forEach(function(txn) {
          var cat = txn.category || 'Miscellaneous';
          if (!categoryMap[cat]) {
            categoryMap[cat] = {category: cat, totalAmount: 0, transactionCount: 0};
          }
          categoryMap[cat].totalAmount += txn.amount;
          categoryMap[cat].transactionCount += 1;
          totalAmount += txn.amount;
        });
        var result = [];
        for (var cat in categoryMap) {
          categoryMap[cat].percentage = totalAmount > 0 ? (categoryMap[cat].totalAmount / totalAmount * 100).toFixed(2) : 0;
          result.push(categoryMap[cat]);
        }
        return $q.resolve(result);
      } catch (error) {
        return $q.reject(error);
      }
    }
    function computeMonthlyTrends(transactions) {
      try {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var month = new Date(txn.date).toISOString().substring(0, 7);
          if (!monthMap[month]) {
            monthMap[month] = {month: month, totalSpend: 0, categoryBreakdown: {}};
          }
          monthMap[month].totalSpend += txn.amount;
          var cat = txn.category || 'Miscellaneous';
          if (!monthMap[month].categoryBreakdown[cat]) {
            monthMap[month].categoryBreakdown[cat] = {category: cat, totalAmount: 0, transactionCount: 0};
          }
          monthMap[month].categoryBreakdown[cat].totalAmount += txn.amount;
          monthMap[month].categoryBreakdown[cat].transactionCount += 1;
        });
        var result = [];
        for (var month in monthMap) {
          var breakdown = [];
          for (var cat in monthMap[month].categoryBreakdown) {
            breakdown.push(monthMap[month].categoryBreakdown[cat]);
          }
          monthMap[month].categoryBreakdown = breakdown;
          result.push(monthMap[month]);
        }
        result.sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
        return $q.resolve(result);
      } catch (error) {
        return $q.reject(error);
      }
    }
  }
})();