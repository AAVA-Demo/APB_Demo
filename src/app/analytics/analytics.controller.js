(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['AnalyticsService', '$scope', function(AnalyticsService, $scope) {
    const vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.filters = {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
      endDate: new Date(),
      cardIds: [],
      categories: []
    };
    function loadAnalytics() {
      vm.loading = true;
      AnalyticsService.getAnalyticsData(vm.filters).then(function(data) {
        vm.analyticsData = data;
        vm.categoryChartData = {
          labels: data.categorySpending.map(function(c) { return c.category; }),
          data: [data.categorySpending.map(function(c) { return c.totalAmount; })],
          series: ['Spending by Category']
        };
        vm.trendChartData = {
          labels: data.monthlyTrends.map(function(m) { return m.month; }),
          data: [data.monthlyTrends.map(function(m) { return m.totalSpend; })],
          series: ['Monthly Spend Trend']
        };
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics';
        vm.loading = false;
      });
    }
    vm.applyFilters = function() {
      loadAnalytics();
    };
    loadAnalytics();
  }]);
})();