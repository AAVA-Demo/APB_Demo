(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .service('AnalyticsService', ['$q', 'TransactionProcessingService', 'AnalyticsEngineService', AnalyticsService]);
  function AnalyticsService($q, TransactionProcessingService, AnalyticsEngineService) {
    var vm = this;
    var analyticsCache = null;
    vm.getSpendingAnalytics = function() {
      if (analyticsCache) {
        return $q.resolve(analyticsCache);
      }
      return TransactionProcessingService.getTransactions({categorized: true})
        .then(function(transactions) {
          var categorySpending = AnalyticsEngineService.calculateCategorySpending(transactions);
          var monthlyTrends = AnalyticsEngineService.calculateMonthlyTrends(transactions);
          analyticsCache = {
            categorySpending: categorySpending,
            monthlyTrends: monthlyTrends
          };
          return analyticsCache;
        })
        .catch(function(error) {
          return $q.reject(error);
        });
    };
    vm.clearCache = function() {
      analyticsCache = null;
    };
  }
})();