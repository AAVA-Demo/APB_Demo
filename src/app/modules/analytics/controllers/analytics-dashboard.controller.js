(function() {
  'use strict';
  angular.module('creditCardApp.analytics').controller('AnalyticsDashboardController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.dateRange = {
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
    vm.init = function() {
      vm.loadAnalyticsData();
    };
    vm.loadAnalyticsData = function() {
      var userId = 'user123';
      AnalyticsService.getAnalyticsData(userId, vm.dateRange).then(function(analyticsData) {
        vm.analyticsData = analyticsData;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    };
    vm.applyFilter = function() {
      vm.loading = true;
      vm.loadAnalyticsData();
    };
    vm.init();
  }]);
  AnalyticsDashboardController.$inject = ['AnalyticsService', '$scope', '$filter'];
})();