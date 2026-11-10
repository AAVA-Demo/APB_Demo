(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsDashboardController', ['TransactionService', 'AnalyticsEngineService', 'CategoryService', 'AuthService', '$scope', function(TransactionService, AnalyticsEngineService, CategoryService, AuthService, $scope) {
      var vm = this;
      vm.transactions = [];
      vm.aggregatedData = [];
      vm.loading = true;
      vm.error = null;
      vm.categories = CategoryService.getAllCategories();
      vm.selectedCategories = [];
      vm.chartData = null;
      AuthService.validateUser()
        .then(function(user) {
          return TransactionService.getTransactions(null, null);
        })
        .then(function(transactions) {
          vm.transactions = transactions;
          vm.aggregatedData = AnalyticsEngineService.aggregateByCategory(transactions);
          vm.updateChart();
          vm.loading = false;
          $scope.$apply();
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
          $scope.$apply();
        });
      vm.applyFilter = function() {
        var filtered = AnalyticsEngineService.filterByCategory(vm.transactions, vm.selectedCategories);
        vm.aggregatedData = AnalyticsEngineService.aggregateByCategory(filtered);
        vm.updateChart();
      };
      vm.updateChart = function() {
        vm.chartData = {
          labels: vm.aggregatedData.map(function(d) { return d.category; }),
          datasets: [{
            label: 'Spending by Category',
            data: vm.aggregatedData.map(function(d) { return d.totalSpend; }),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
          }]
        };
      };
      $scope.$watchCollection('vm.selectedCategories', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          vm.applyFilter();
        }
      });
    }]);
})();