(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .factory('AnalyticsEngineService', [function() {
      function aggregateByCategory(transactions) {
        var categoryMap = {};
        var total = 0;
        transactions.forEach(function(t) {
          var cat = t.category || 'Miscellaneous';
          if (!categoryMap[cat]) {
            categoryMap[cat] = {category: cat, totalSpend: 0, transactionCount: 0};
          }
          categoryMap[cat].totalSpend += t.amount;
          categoryMap[cat].transactionCount++;
          total += t.amount;
        });
        var result = [];
        for (var cat in categoryMap) {
          var item = categoryMap[cat];
          item.percentage = total > 0 ? (item.totalSpend / total) * 100 : 0;
          result.push(item);
        }
        return result;
      }
      function aggregateByMonth(transactions) {
        var monthMap = {};
        transactions.forEach(function(t) {
          var date = new Date(t.transactionDate);
          var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
          }
          monthMap[monthKey].totalSpend += t.amount;
          var cat = t.category || 'Miscellaneous';
          if (!monthMap[monthKey].categoryBreakdown[cat]) {
            monthMap[monthKey].categoryBreakdown[cat] = 0;
          }
          monthMap[monthKey].categoryBreakdown[cat] += t.amount;
        });
        var result = [];
        for (var month in monthMap) {
          result.push(monthMap[month]);
        }
        result.sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
        return result;
      }
      return {
        aggregateByCategory: aggregateByCategory,
        aggregateByMonth: aggregateByMonth
      };
    }]);
})();