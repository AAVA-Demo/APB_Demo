(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', function(AnalyticsService, $scope) {
      var vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.dateRange = AnalyticsService.getLastDateRange();
      vm.updateDateRange = function(newDateRange) {
        vm.dateRange = newDateRange;
        loadAnalytics();
      };
      function loadAnalytics() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getAnalytics(vm.dateRange).then(function(data) {
          vm.analyticsData = data;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
      }
      loadAnalytics();
    }]);
})();