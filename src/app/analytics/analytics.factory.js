(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('AnalyticsEngineFactory', [function() {
      return {
        aggregateByCategory: function(transactions) {
          var categoryMap = {};
          var monthMap = {};
          transactions.forEach(function(txn) {
            if (!categoryMap[txn.category]) {
              categoryMap[txn.category] = { category: txn.category, totalSpend: 0, transactionCount: 0 };
            }
            categoryMap[txn.category].totalSpend += txn.amount;
            categoryMap[txn.category].transactionCount++;
            var monthKey = new Date(txn.transactionDate).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthMap[monthKey]) {
              monthMap[monthKey] = { month: monthKey, totalSpend: 0, categoryData: {} };
            }
            monthMap[monthKey].totalSpend += txn.amount;
            if (!monthMap[monthKey].categoryData[txn.category]) {
              monthMap[monthKey].categoryData[txn.category] = 0;
            }
            monthMap[monthKey].categoryData[txn.category] += txn.amount;
          });
          return {
            categoryBreakdown: Object.values(categoryMap),
            monthlyTrends: Object.values(monthMap),
            dateRange: {
              startDate: transactions.length > 0 ? new Date(Math.min.apply(null, transactions.map(function(t) { return new Date(t.transactionDate); }))) : null,
              endDate: transactions.length > 0 ? new Date(Math.max.apply(null, transactions.map(function(t) { return new Date(t.transactionDate); }))) : null
            }
          };
        }
      };
    }]);
})();