(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$q', function($q) {
      var self = this;
      self.aggregateByCategory = function(transactions) {
        var categoryMap = {};
        var total = 0;
        transactions.forEach(function(txn) {
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = {category: txn.category, totalAmount: 0, transactionCount: 0};
          }
          categoryMap[txn.category].totalAmount += txn.amount;
          categoryMap[txn.category].transactionCount++;
          total += txn.amount;
        });
        var result = Object.keys(categoryMap).map(function(key) {
          var cat = categoryMap[key];
          cat.percentage = total > 0 ? (cat.totalAmount / total * 100).toFixed(2) : 0;
          return cat;
        });
        return result;
      };
      self.aggregateByMonth = function(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          var date = new Date(txn.transactionDate);
          var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
          }
          monthMap[monthKey].totalSpend += txn.amount;
          if (!monthMap[monthKey].categoryBreakdown[txn.category]) {
            monthMap[monthKey].categoryBreakdown[txn.category] = 0;
          }
          monthMap[monthKey].categoryBreakdown[txn.category] += txn.amount;
        });
        var result = Object.keys(monthMap).map(function(key) {
          var month = monthMap[key];
          month.categoryBreakdown = Object.keys(month.categoryBreakdown).map(function(cat) {
            return {category: cat, amount: month.categoryBreakdown[cat]};
          });
          return month;
        }).sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
        return result;
      };
    }]);
})();