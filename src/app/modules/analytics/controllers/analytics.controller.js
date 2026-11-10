(function() {
  'use strict';
  angular.module('analytics')
    .controller('AnalyticsController', ['$scope', '$timeout', 'AnalyticsService', 'CategoryFilterService', 'NotificationService', function($scope, $timeout, AnalyticsService, CategoryFilterService, NotificationService) {
      var vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.categories = CategoryFilterService.getCategories();
      var sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      vm.dateRange = {
        startDate: sixMonthsAgo.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
      var debounceTimer = null;
      function loadAnalytics() {
        vm.loading = true;
        AnalyticsService.getSpendingAnalytics(vm.dateRange)
          .then(function(data) {
            vm.analyticsData = data;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
            NotificationService.error(vm.error);
          });
      }
      loadAnalytics();
      vm.updateDateRange = function() {
        if (debounceTimer) {
          $timeout.cancel(debounceTimer);
        }
        debounceTimer = $timeout(function() {
          loadAnalytics();
        }, 300);
      };
      vm.retry = function() {
        loadAnalytics();
      };
    }]);
})();