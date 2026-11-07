(function() {
  'use strict';
  angular.module('app.analytics').service('AnalyticsService', ['DataAggregationService', function(DataAggregationService) {
    this.getSpendingAnalytics = function(filters) {
      return DataAggregationService.aggregateTransactions(filters);
    };
  }]);
})();