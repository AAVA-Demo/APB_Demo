(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AnalyticsProcessorFactory', [function() {
      return {
        processAnalytics: function(transactions) {
          var categorySpending = {};
          var monthlyTrends = {};
          var totalSpend = 0;
          transactions.forEach(function(t) {
            totalSpend += t.amount;
            if (!categorySpending[t.category]) {
              categorySpending[t.category] = {category: t.category, totalSpend: 0, transactionCount: 0, percentage: 0};
            }
            categorySpending[t.category].totalSpend += t.amount;
            categorySpending[t.category].transactionCount++;
            var monthKey = t.date.substring(0, 7);
            if (!monthlyTrends[monthKey]) {
              monthlyTrends[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
            }
            monthlyTrends[monthKey].totalSpend += t.amount;
            if (!monthlyTrends[monthKey].categoryBreakdown[t.category]) {
              monthlyTrends[monthKey].categoryBreakdown[t.category] = 0;
            }
            monthlyTrends[monthKey].categoryBreakdown[t.category] += t.amount;
          });
          Object.keys(categorySpending).forEach(function(cat) {
            categorySpending[cat].percentage = totalSpend > 0 ? (categorySpending[cat].totalSpend / totalSpend * 100).toFixed(2) : 0;
          });
          var categoryArray = Object.values(categorySpending).sort(function(a, b) {
            return b.totalSpend - a.totalSpend;
          });
          var monthlyArray = Object.values(monthlyTrends).sort(function(a, b) {
            return a.month.localeCompare(b.month);
          });
          return {
            categorySpending: categoryArray,
            monthlyTrends: monthlyArray
          };
        }
      };
    }]);
})();