(function() {
  'use strict';
  angular.module('app.analytics')
    .service('AnalyticsService', ['TransactionFactory', 'CategorizationService', 'AggregationService', '$q', function(TransactionFactory, CategorizationService, AggregationService, $q) {
      var insightCache = null;
      var service = {
        getSpendingInsights: getSpendingInsights
      };
      return service;
      function getSpendingInsights(startDate, endDate) {
        return TransactionFactory.getTransactions(startDate, endDate)
          .then(function(transactions) {
            var categorizedTxns = CategorizationService.categorizeTransactions(transactions);
            var categorySpending = AggregationService.aggregateByCategory(categorizedTxns);
            var monthlyTrends = AggregationService.aggregateByMonth(categorizedTxns);
            var totalSpend = categorySpending.reduce(function(sum, cat) {
              return sum + cat.amount;
            }, 0);
            insightCache = {
              categorySpending: categorySpending,
              monthlyTrends: monthlyTrends,
              totalSpend: totalSpend,
              period: 'Last 12 Months'
            };
            return insightCache;
          });
      }
    }]);
})();