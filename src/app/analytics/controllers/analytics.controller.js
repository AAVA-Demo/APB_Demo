(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.categorySpending = [];
      vm.monthlyTrends = [];
      vm.pieChartData = [];
      vm.pieChartLabels = [];
      vm.lineChartData = [];
      vm.lineChartLabels = [];
      vm.lineChartSeries = ['Monthly Spend'];
      vm.dateRange = {
        from: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        to: new Date()
      };
      vm.loadAnalytics = function() {
        vm.loading = true;
        AnalyticsService.getSpendingAnalytics(vm.dateRange)
          .then(function(data) {
            vm.categorySpending = data.categorySpending;
            vm.monthlyTrends = data.monthlyTrends;
            vm.preparePieChart();
            vm.prepareLineChart();
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
          });
      };
      vm.preparePieChart = function() {
        vm.pieChartLabels = vm.categorySpending.map(function(item) { return item.category; });
        vm.pieChartData = vm.categorySpending.map(function(item) { return item.totalAmount; });
      };
      vm.prepareLineChart = function() {
        vm.lineChartLabels = vm.monthlyTrends.map(function(item) { return item.month; });
        vm.lineChartData = [vm.monthlyTrends.map(function(item) { return item.totalSpend; })];
      };
      vm.loadAnalytics();
    }]);
})();