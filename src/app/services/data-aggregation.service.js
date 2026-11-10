(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DataAggregationService', ['$filter', function($filter) {
      var self = this;
      self.aggregateByMonthAndCategory = function(transactions) {
        var categoryTotals = {};
        var monthlyData = {};
        transactions.forEach(function(t) {
          if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = {categoryName: t.category, totalAmount: 0, transactionCount: 0};
          }
          categoryTotals[t.category].totalAmount += t.amount;
          categoryTotals[t.category].transactionCount++;
          var monthKey = $filter('date')(t.date, 'yyyy-MM');
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
          }
          monthlyData[monthKey].totalSpend += t.amount;
          if (!monthlyData[monthKey].categoryBreakdown[t.category]) {
            monthlyData[monthKey].categoryBreakdown[t.category] = 0;
          }
          monthlyData[monthKey].categoryBreakdown[t.category] += t.amount;
        });
        var totalAmount = Object.keys(categoryTotals).reduce(function(sum, key) {
          return sum + categoryTotals[key].totalAmount;
        }, 0);
        Object.keys(categoryTotals).forEach(function(key) {
          categoryTotals[key].percentageOfTotal = totalAmount > 0 ? (categoryTotals[key].totalAmount / totalAmount * 100).toFixed(2) : 0;
        });
        var monthlyTrends = Object.keys(monthlyData).sort().map(function(key) {
          return monthlyData[key];
        });
        return {
          categories: Object.keys(categoryTotals).map(function(key) { return categoryTotals[key]; }),
          monthlyTrends: monthlyTrends
        };
      };
    }]);
})();