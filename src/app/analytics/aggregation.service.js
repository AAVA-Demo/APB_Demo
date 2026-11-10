(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('AggregationService', ['CategoryService', function(CategoryService) {
      this.computeTrendsAndTotals = function(transactions) {
        const monthlyTrends = {};
        transactions.forEach(function(txn) {
          const month = new Date(txn.date).toISOString().substring(0, 7);
          if (!monthlyTrends[month]) {
            monthlyTrends[month] = 0;
          }
          monthlyTrends[month] += txn.amount;
        });
        const trends = [];
        const sortedMonths = Object.keys(monthlyTrends).sort();
        sortedMonths.slice(-12).forEach(function(month) {
          trends.push({
            month: month,
            totalSpend: monthlyTrends[month]
          });
        });
        const categoryBreakdown = CategoryService.getCategoryBreakdown(transactions);
        return {
          monthlyTrends: trends,
          categoryBreakdown: categoryBreakdown
        };
      };
    }]);
})();