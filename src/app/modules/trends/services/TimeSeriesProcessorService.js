(function() {
  'use strict';
  angular.module('creditCard.trends')
    .service('TimeSeriesProcessorService', [function() {
      this.aggregateByMonth = function(transactions) {
        const monthMap = {};
        transactions.forEach(function(t) {
          const date = new Date(t.transactionDate);
          const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = { month: monthKey, totalSpend: 0, transactionCount: 0 };
          }
          monthMap[monthKey].totalSpend += t.amount;
          monthMap[monthKey].transactionCount++;
        });
        return Object.values(monthMap).sort(function(a, b) {
          return a.month.localeCompare(b.month);
        });
      };
    }]);
})();