(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('AnalyticsService', ['$http', '$q', 'CategorizationService', 'TransactionDataFactory', function($http, $q, CategorizationService, TransactionDataFactory) {
      this.getSpendingAnalytics = function(dateRange) {
        const deferred = $q.defer();
        TransactionDataFactory.getTransactions(dateRange).then(function(transactions) {
          const categorizedTransactions = CategorizationService.categorizeTransactions(transactions);
          const categoryMap = new Map();
          const monthMap = new Map();
          categorizedTransactions.forEach(txn => {
            if (!categoryMap.has(txn.category)) {
              categoryMap.set(txn.category, {category: txn.category, totalAmount: 0, transactionCount: 0});
            }
            const catData = categoryMap.get(txn.category);
            catData.totalAmount += txn.amount;
            catData.transactionCount += 1;
            const month = txn.date.slice(0, 7);
            if (!monthMap.has(month)) {
              monthMap.set(month, {month: month, totalSpend: 0, categoryBreakdown: new Map()});
            }
            const monthData = monthMap.get(month);
            monthData.totalSpend += txn.amount;
            if (!monthData.categoryBreakdown.has(txn.category)) {
              monthData.categoryBreakdown.set(txn.category, {category: txn.category, totalAmount: 0, transactionCount: 0});
            }
            const catBreakdown = monthData.categoryBreakdown.get(txn.category);
            catBreakdown.totalAmount += txn.amount;
            catBreakdown.transactionCount += 1;
          });
          const totalSpend = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.totalAmount, 0);
          const categorySpending = Array.from(categoryMap.values()).map(cat => ({
            category: cat.category,
            totalAmount: cat.totalAmount,
            transactionCount: cat.transactionCount,
            percentageOfTotal: totalSpend > 0 ? (cat.totalAmount / totalSpend * 100) : 0
          }));
          const monthlyTrends = Array.from(monthMap.values()).map(month => ({
            month: month.month,
            totalSpend: month.totalSpend,
            categoryBreakdown: Array.from(month.categoryBreakdown.values())
          })).sort((a, b) => a.month.localeCompare(b.month));
          const analytics = {
            userId: 'current-user',
            dateRange: dateRange,
            categorySpending: categorySpending,
            monthlyTrends: monthlyTrends,
            totalTransactions: categorizedTransactions.length,
            lastUpdated: new Date()
          };
          deferred.resolve(analytics);
        }).catch(deferred.reject);
        return deferred.promise;
      };
    }]);
})();