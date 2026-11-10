(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsDashboardController', ['AnalyticsService', '$scope', function(AnalyticsService, $scope) {
      var vm = this;
      vm.insights = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.chartData = null;
      vm.trendChartData = null;
      vm.loadInsights = function() {
        vm.loading = true;
        AnalyticsService.getSpendingInsights().then(function(insights) {
          vm.insights = insights;
          vm.prepareChartData();
          vm.prepareTrendChartData();
          vm.loading = false;
        }, function(error) {
          vm.error = 'Failed to load analytics';
          vm.loading = false;
        });
      };
      vm.prepareChartData = function() {
        if (!vm.insights || !vm.insights.categories) return;
        vm.chartData = {
          labels: vm.insights.categories.map(function(c) { return c.categoryName; }),
          datasets: [{
            data: vm.insights.categories.map(function(c) { return c.totalAmount; }),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
          }]
        };
      };
      vm.prepareTrendChartData = function() {
        if (!vm.insights || !vm.insights.monthlyTrends) return;
        vm.trendChartData = {
          labels: vm.insights.monthlyTrends.map(function(t) { return t.month; }),
          datasets: [{
            label: 'Monthly Spend',
            data: vm.insights.monthlyTrends.map(function(t) { return t.totalSpend; }),
            borderColor: '#36A2EB',
            fill: false
          }]
        };
      };
      vm.filterByCategory = function(category) {
        vm.selectedCategory = category;
      };
      vm.loadInsights();
    }]);
})();