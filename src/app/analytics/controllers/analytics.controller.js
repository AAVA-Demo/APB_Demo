(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
      const vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.dateRange = { startDate: null, endDate: null };
      vm.loadAnalytics = function() {
        vm.loading = true;
        const range = vm.dateRange.startDate && vm.dateRange.endDate ? vm.dateRange : AnalyticsService.getDefaultDateRange();
        AnalyticsService.getSpendingAnalytics(range.startDate, range.endDate)
          .then(function(data) {
            vm.analyticsData = data;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load analytics data.';
            vm.loading = false;
            console.error('Analytics error:', err);
          });
      };
      vm.onCategoryDrillDown = function(category) {
        vm.selectedCategory = category;
      };
      vm.clearCategoryFilter = function() {
        vm.selectedCategory = null;
      };
      $scope.$watch('vm.dateRange', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.startDate && newVal.endDate) {
          vm.loadAnalytics();
        }
      }, true);
      vm.loadAnalytics();
    }]);
})();