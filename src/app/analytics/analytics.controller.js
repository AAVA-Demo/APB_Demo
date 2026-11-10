(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      var vm = this;
      vm.analytics = { categorySpending: [], monthlyTrends: [], selectedPeriod: '', filters: {} };
      vm.loading = true;
      vm.error = null;
      vm.chartData = { category: null, trend: null };
      AnalyticsService.getSpendingInsights().then(function(data) {
        vm.analytics = data;
        vm.loading = false;
        vm.prepareChartData();
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
      vm.prepareChartData = function() {
        vm.chartData.category = {
          labels: vm.analytics.categorySpending.map(function(c) { return c.category; }),
          data: vm.analytics.categorySpending.map(function(c) { return c.totalAmount; }),
          type: 'pie'
        };
        vm.chartData.trend = {
          labels: vm.analytics.monthlyTrends.map(function(m) { return m.month; }),
          data: vm.analytics.monthlyTrends.map(function(m) { return m.totalSpend; }),
          type: 'line'
        };
      };
      vm.applyFilter = function(filter) {
        vm.analytics.filters = filter;
      };
    }]);
})();