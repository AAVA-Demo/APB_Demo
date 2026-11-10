(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      var cachedData = null;

      self.getSpendingInsights = function(userId, dateRange) {
        var url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analyticsSpending}?userId=${userId}&startMonth=${dateRange.startMonth}&endMonth=${dateRange.endMonth}`;
        return $http.get(url).then(function(response) {
          var transactions = response.data;
          var aggregated = self.aggregateTransactions(transactions, dateRange);
          cachedData = aggregated;
          return aggregated;
        });
      };

      self.aggregateTransactions = function(transactions, dateRange) {
        var categoryMap = {};
        var monthlyMap = {};
        var totalSpend = 0;

        transactions.forEach(txn => {
          totalSpend += txn.amount;
          if (!categoryMap[txn.category]) {
            categoryMap[txn.category] = { totalAmount: 0, transactionCount: 0 };
          }
          categoryMap[txn.category].totalAmount += txn.amount;
          categoryMap[txn.category].transactionCount += 1;

          var month = txn.transactionDate.slice(0, 7);
          if (!monthlyMap[month]) {
            monthlyMap[month] = { totalSpend: 0, categoryBreakdown: {} };
          }
          monthlyMap[month].totalSpend += txn.amount;
          if (!monthlyMap[month].categoryBreakdown[txn.category]) {
            monthlyMap[month].categoryBreakdown[txn.category] = 0;
          }
          monthlyMap[month].categoryBreakdown[txn.category] += txn.amount;
        });

        var categorySpending = Object.keys(categoryMap).map(cat => ({
          category: cat,
          totalAmount: categoryMap[cat].totalAmount,
          percentage: totalSpend > 0 ? ((categoryMap[cat].totalAmount / totalSpend) * 100).toFixed(2) : 0,
          transactionCount: categoryMap[cat].transactionCount
        }));

        var monthlyTrends = Object.keys(monthlyMap).sort().map(month => ({
          month: month,
          totalSpend: monthlyMap[month].totalSpend,
          categoryBreakdown: monthlyMap[month].categoryBreakdown
        }));

        return {
          userId: userId,
          dateRange: dateRange,
          categorySpending: categorySpending,
          monthlyTrends: monthlyTrends
        };
      };
    }]);
})();