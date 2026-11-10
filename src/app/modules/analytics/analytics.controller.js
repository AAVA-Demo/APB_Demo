(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsDashboardController', ['AnalyticsService', '$scope', '$filter', AnalyticsDashboardController]);
  function AnalyticsDashboardController(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.analytics = null;
    vm.loading = true;
    vm.error = null;
    vm.dateRange = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    };
    vm.init = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      AnalyticsService.getSpendingAnalytics(userId, vm.dateRange)
        .then(function(data) {
          vm.analytics = data;
          vm.loading = false;
          $scope.$apply();
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
          toastr.error('Unable to fetch analytics', 'Error');
          $scope.$apply();
        });
    };
    vm.updateDateRange = function() {
      vm.loadAnalytics();
    };
    vm.init();
  }
})();