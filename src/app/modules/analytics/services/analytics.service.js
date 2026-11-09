(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('AnalyticsService', ['$q', '$filter', 'TransactionApiService', function($q, $filter, TransactionApiService) {
      var cachedAnalytics = null;
      var cacheTimestamp = null;
      var CACHE_DURATION = 300000;
      this.getSpendingAnalytics = function(userId, dateRange) {
        if (cachedAnalytics && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
          return $q.resolve(cachedAnalytics);
        }
        return TransactionApiService.fetchTransactions(userId, dateRange.startDate, dateRange.endDate).then(function(transactions) {
          var categorySpending = {};
          var monthlyTrends = {};
          var totalSpend = 0;
          transactions.forEach(function(txn) {
            var amount = txn.amount || 0;
            var category = txn.category || 'Miscellaneous';
            var date = new Date(txn.date);
            var monthKey = date.getFullYear() + '-' + (date.getMonth() + 1);
            categorySpending[category] = (categorySpending[category] || 0) + amount;
            monthlyTrends[monthKey] = (monthlyTrends[monthKey] || 0) + amount;
            totalSpend += amount;
          });
          var categoryArray = Object.keys(categorySpending).map(function(cat) {
            return {
              category: cat,
              amount: categorySpending[cat],
              percentage: totalSpend > 0 ? (categorySpending[cat] / totalSpend * 100).toFixed(2) : 0
            };
          });
          var monthlyArray = Object.keys(monthlyTrends).sort().map(function(month) {
            return {
              month: month,
              totalSpend: monthlyTrends[month]
            };
          });
          var analyticsSummary = {
            categorySpending: categoryArray,
            monthlyTrends: monthlyArray,
            dateRange: dateRange,
            totalSpend: totalSpend
          };
          cachedAnalytics = analyticsSummary;
          cacheTimestamp = Date.now();
          return analyticsSummary;
        });
      };
      this.getTransactionsByCategory = function(userId, category) {
        return TransactionApiService.fetchTransactions(userId, null, null).then(function(transactions) {
          return transactions.filter(function(txn) {
            return txn.category === category;
          });
        });
      };
    }]);
})();