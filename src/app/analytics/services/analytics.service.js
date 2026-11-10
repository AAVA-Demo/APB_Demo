(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['TransactionDataFactory', 'CategoryMappingService', '$q', function(TransactionDataFactory, CategoryMappingService, $q) {
      const self = this;
      self.getDefaultDateRange = function() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        return { startDate: startDate, endDate: endDate };
      };
      self.getSpendingAnalytics = function(startDate, endDate) {
        return TransactionDataFactory.fetchTransactions(startDate, endDate)
          .then(function(transactions) {
            const categoryMap = new Map();
            const monthlyMap = new Map();
            let totalSpend = 0;
            transactions.forEach(function(txn) {
              const category = txn.category || 'Miscellaneous';
              const amount = txn.amount || 0;
              totalSpend += amount;
              if (!categoryMap.has(category)) {
                categoryMap.set(category, { category: category, totalSpend: 0, transactionCount: 0 });
              }
              const catData = categoryMap.get(category);
              catData.totalSpend += amount;
              catData.transactionCount++;
              const month = new Date(txn.transactionDate).toISOString().substring(0, 7);
              if (!monthlyMap.has(month)) {
                monthlyMap.set(month, { month: month, totalSpend: 0, categoryBreakdown: {} });
              }
              const monthData = monthlyMap.get(month);
              monthData.totalSpend += amount;
              if (!monthData.categoryBreakdown[category]) {
                monthData.categoryBreakdown[category] = 0;
              }
              monthData.categoryBreakdown[category] += amount;
            });
            const categorySpendSummary = Array.from(categoryMap.values()).map(function(cat) {
              cat.percentOfTotal = totalSpend > 0 ? ((cat.totalSpend / totalSpend) * 100).toFixed(2) : 0;
              return cat;
            });
            const monthlyTrend = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
            return {
              dateRange: { startDate: startDate, endDate: endDate },
              categorySpendSummary: categorySpendSummary,
              monthlyTrend: monthlyTrend,
              totalSpend: totalSpend
            };
          });
      };
      self.filterByCategory = function(transactions, category) {
        return transactions.filter(txn => txn.category === category);
      };
    }]);
})();