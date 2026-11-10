(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['SpendingAnalyticsService', 'ChartService', '$scope', function(SpendingAnalyticsService, ChartService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.categoryData = null;
    vm.trendData = null;
    vm.cardComparisonData = null;
    vm.timePeriod = {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date()
    };
    vm.applyTimePeriod = applyTimePeriod;
    
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      var request = {
        userId: userId,
        startDate: vm.timePeriod.startDate,
        endDate: vm.timePeriod.endDate
      };
      SpendingAnalyticsService.getSpendingAnalytics(request).then(function(data) {
        vm.categoryData = ChartService.prepareCategoryChartData(data.categorySpending);
        vm.trendData = ChartService.prepareTrendChartData(data.monthlyTrend);
        vm.cardComparisonData = ChartService.prepareCardComparisonData(data.cardSpending);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    }
    
    function applyTimePeriod() {
      loadAnalytics();
    }
    
    loadAnalytics();
    
    $scope.$watch('vm.timePeriod', function(newVal, oldVal) {
      if (newVal !== oldVal && newVal.startDate && newVal.endDate) {
        loadAnalytics();
      }
    }, true);
  }]);
})();