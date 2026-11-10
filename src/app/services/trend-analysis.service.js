(function() {
  'use strict';
  angular.module('creditCardApp').factory('TrendAnalysisService', ['CategorizationService', function(CategorizationService) {
    return {
      computeMonthlyTrends: function(transactions) {
        if (!transactions || transactions.length === 0) {
          return [];
        }
        const monthMap = {};
        transactions.forEach(t => {
          const date = new Date(t.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = [];
          }
          monthMap[monthKey].push(t);
        });
        const trends = Object.keys(monthMap).sort().map(monthKey => {
          const monthTransactions = monthMap[monthKey];
          const totalSpend = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
          const categoryBreakdown = CategorizationService.aggregateByCategory(monthTransactions);
          return {
            month: monthKey,
            totalSpend: totalSpend,
            categoryBreakdown: categoryBreakdown
          };
        });
        return trends;
      }
    };
  }]);
})();