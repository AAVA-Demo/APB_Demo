(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('AnalyticsDataFactory', [function() {
      return {
        transformCategoryData: function(categoryBreakdown) {
          if (!categoryBreakdown || !categoryBreakdown.length) return null;
          return {
            labels: categoryBreakdown.map(function(c) { return c.category; }),
            data: categoryBreakdown.map(function(c) { return c.amount; }),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
          };
        },
        transformTrendData: function(monthlyTrends) {
          if (!monthlyTrends || !monthlyTrends.length) return null;
          return {
            labels: monthlyTrends.map(function(m) { return m.monthYear; }),
            data: monthlyTrends.map(function(m) { return m.totalAmount || m.amount; })
          };
        }
      };
    }]);
})();