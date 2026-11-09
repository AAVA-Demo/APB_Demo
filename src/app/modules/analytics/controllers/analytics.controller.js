(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', 'ChartConfigFactory', function($scope, $filter, AnalyticsService, ChartConfigFactory) {
      var vm = this;
      vm.dateRange = {
        from: moment().subtract(12, 'months').toDate(),
        to: moment().toDate()
      };
      vm.analyticsData = null;
      vm.monthlyTrendsConfig = null;
      vm.cardWiseConfig = null;
      vm.categoryWiseConfig = null;
      vm.loading = false;
      vm.error = null;
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingAnalytics(vm.dateRange)
          .then(function(data) {
            vm.analyticsData = data;
            vm.monthlyTrendsConfig = ChartConfigFactory.generateChartConfig(data.monthlyTrends, 'line');
            vm.cardWiseConfig = ChartConfigFactory.generateChartConfig(data.cardWiseSpending, 'bar');
            vm.categoryWiseConfig = ChartConfigFactory.generateChartConfig(data.categoryWiseSpending, 'doughnut');
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
          });
      };
      vm.applyDateRange = function() {
        vm.loadAnalytics();
      };
      vm.loadAnalytics();
    }]);
})();