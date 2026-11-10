(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['$scope', 'AnalyticsApiService', 'TransactionDataFactory', 'CategoryService', 'AggregationService', 'ReportingService', function($scope, AnalyticsApiService, TransactionDataFactory, CategoryService, AggregationService, ReportingService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.monthlyTrends = [];
      vm.categoryBreakdown = [];
      vm.init = function() {
        AnalyticsApiService.getTransactions().then(function(transactions) {
          TransactionDataFactory.setData(transactions);
          const categorized = CategoryService.categorizeTransactions(transactions);
          const aggregated = AggregationService.computeTrendsAndTotals(categorized);
          vm.monthlyTrends = aggregated.monthlyTrends;
          vm.categoryBreakdown = aggregated.categoryBreakdown;
          vm.loading = false;
          $scope.$broadcast('analyticsDataReady', aggregated);
        }).catch(function(err) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
      };
      vm.exportData = function() {
        ReportingService.generateReport('CSV', {
          monthlyTrends: vm.monthlyTrends,
          categoryBreakdown: vm.categoryBreakdown
        });
      };
      vm.init();
    }]);
})();