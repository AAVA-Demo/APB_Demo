(function() {
  'use strict';
  angular.module('analytics')
    .service('AnalyticsService', ['$q', 'TransactionDataService', 'DataAggregationFactory', function($q, TransactionDataService, DataAggregationFactory) {
      this.getSpendingAnalytics = function(dateRange) {
        return TransactionDataService.fetchTransactions(dateRange)
          .then(function(transactions) {
            return DataAggregationFactory.aggregateData(transactions);
          });
      };
    }]);
})();