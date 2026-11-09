(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'TransactionService', 'AnalyticsEngine', function($scope, TransactionService, AnalyticsEngine) {
      var vm = this;
      vm.categorySpending = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.drillDownTransactions = [];
      vm.dateRange = { months: 12 };

      function loadAnalytics() {
        vm.loading = true;
        vm.error = null;
        var endDate = new Date();
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - vm.dateRange.months);
        var startStr = startDate.toISOString().split('T')[0];
        var endStr = endDate.toISOString().split('T')[0];
        TransactionService.getTransactions(startStr, endStr)
          .then(function(transactions) {
            vm.categorySpending = AnalyticsEngine.aggregateByCategory(transactions);
            vm.monthlyTrends = AnalyticsEngine.aggregateByMonth(transactions);
            vm.allTransactions = transactions;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data.';
            vm.loading = false;
          });
      }

      vm.drillDown = function(category) {
        vm.selectedCategory = category;
        vm.drillDownTransactions = vm.allTransactions.filter(function(txn) {
          return txn.category === category;
        });
      };

      vm.clearDrillDown = function() {
        vm.selectedCategory = null;
        vm.drillDownTransactions = [];
      };

      loadAnalytics();
    }]);
})();