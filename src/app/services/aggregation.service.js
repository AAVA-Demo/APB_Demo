(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AggregationService', [function() {
      var service = {
        aggregateByCategory: aggregateByCategory,
        aggregateByMonth: aggregateByMonth
      };
      return service;
      function aggregateByCategory(transactions) {
        var categoryMap = {};
        var totalAmount = 0;
        transactions.forEach(function(txn) {
          var category = txn.category || 'Miscellaneous';
          if (!categoryMap[category]) {
            categoryMap[category] = { amount: 0, count: 0 };
          }
          categoryMap[category].amount += txn.amount || 0;
          categoryMap[category].count++;
          totalAmount += txn.amount || 0;
        });
        var result = [];
        for (var cat in categoryMap) {
          result.push({
            categoryName: cat,
            amount: categoryMap[cat].amount,
            percentage: totalAmount > 0 ? ((categoryMap[cat].amount / totalAmount) * 100).toFixed(2) : 0,
            transactionCount: categoryMap[cat].count
          });
        }
        return result;
      }
      function aggregateByMonth(transactions) {
        var monthMap = {};
        transactions.forEach(function(txn) {
          if (txn.date) {
            var date = new Date(txn.date);
            var monthKey = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
            if (!monthMap[monthKey]) {
              monthMap[monthKey] = 0;
            }
            monthMap[monthKey] += txn.amount || 0;
          }
        });
        var result = [];
        for (var month in monthMap) {
          result.push({
            month: month,
            amount: monthMap[month]
          });
        }
        result.sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
        return result;
      }
    }]);
})();