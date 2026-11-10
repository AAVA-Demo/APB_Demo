(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsDashboardController', ['$scope', 'TransactionDataService', 'CategoryAggregationService', function($scope, TransactionDataService, CategoryAggregationService) {
    var vm = this;
    vm.transactions = [];
    vm.aggregatedData = null;
    vm.loading = true;
    vm.error = null;
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.error = null;
      TransactionDataService.getTransactions(12).then(function(data) {
        vm.transactions = data;
        vm.aggregatedData = CategoryAggregationService.aggregateByCategory(data);
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
        console.error('Analytics load error:', err);
      });
    };
    vm.loadAnalytics();
  }]);
})();