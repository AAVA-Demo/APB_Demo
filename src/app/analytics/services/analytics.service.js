(function() {
  'use strict';
  angular.module('analyticsModule').service('AnalyticsService', ['$q', 'CategorizationService', 'AnalyticsEngineService', function($q, CategorizationService, AnalyticsEngineService) {
    this.getSpendingAnalytics = function(months) {
      const deferred = $q.defer();
      const dateRange = { months: months || 12 };
      CategorizationService.getCategorizedTransactions(dateRange).then(function(transactions) {
        const analyticsData = AnalyticsEngineService.aggregateSpending(transactions);
        deferred.resolve(analyticsData);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  }]);
})();