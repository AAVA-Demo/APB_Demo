(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AnalyticsService', ['$q', 'TransactionCategorizationFactory', 'DataAggregationService', function($q, TransactionCategorizationFactory, DataAggregationService) {
      var self = this;
      self.getSpendingInsights = function() {
        var deferred = $q.defer();
        TransactionCategorizationFactory.getCategorizedTransactions().then(function(transactions) {
          var aggregated = DataAggregationService.aggregateByMonthAndCategory(transactions);
          deferred.resolve(aggregated);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();