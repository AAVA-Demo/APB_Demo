(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsService', ['TransactionDataFactory', 'AnalyticsEngineService', '$q', function(TransactionDataFactory, AnalyticsEngineService, $q) {
    this.getAnalyticsData = function(filters) {
      return TransactionDataFactory.fetchTransactions(filters).then(function(transactions) {
        const categorySpending = AnalyticsEngineService.aggregateByCategory(transactions);
        const monthlyTrends = AnalyticsEngineService.aggregateByMonth(transactions);
        const totalSpend = transactions.reduce(function(sum, txn) { return sum + txn.amount; }, 0);
        return {
          categorySpending: categorySpending,
          monthlyTrends: monthlyTrends,
          totalSpend: totalSpend,
          dateRange: { startDate: filters.startDate, endDate: filters.endDate }
        };
      });
    };
  }]);
})();