(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .service('dataAnalyticsService', ['$q', 'transactionDataService', 'categoryClassificationFactory', function($q, transactionDataService, categoryClassificationFactory) {
      var self = this;
      self.getSpendingAnalytics = function(dateRange) {
        return transactionDataService.getTransactions(dateRange.start, dateRange.end).then(function(transactions) {
          var categorized = categoryClassificationFactory.categorize(transactions);
          var categoryMap = {};
          var monthlyMap = {};
          var totalSpend = 0;
          categorized.forEach(function(txn) {
            totalSpend += txn.amount;
            if (!categoryMap[txn.category]) {
              categoryMap[txn.category] = {categoryName: txn.category, totalSpend: 0, transactionCount: 0};
            }
            categoryMap[txn.category].totalSpend += txn.amount;
            categoryMap[txn.category].transactionCount++;
            var monthKey = txn.date.getFullYear() + '-' + String(txn.date.getMonth() + 1).padStart(2, '0');
            if (!monthlyMap[monthKey]) {
              monthlyMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: {}};
            }
            monthlyMap[monthKey].totalSpend += txn.amount;
            if (!monthlyMap[monthKey].categoryBreakdown[txn.category]) {
              monthlyMap[monthKey].categoryBreakdown[txn.category] = 0;
            }
            monthlyMap[monthKey].categoryBreakdown[txn.category] += txn.amount;
          });
          var categories = Object.values(categoryMap).map(function(cat) {
            cat.percentageOfTotal = totalSpend > 0 ? ((cat.totalSpend / totalSpend) * 100).toFixed(2) : 0;
            return cat;
          });
          var monthlyTrends = Object.values(monthlyMap);
          return {
            categories: categories,
            monthlyTrends: monthlyTrends,
            transactions: categorized,
            totalSpend: totalSpend
          };
        });
      };
    }]);
})();