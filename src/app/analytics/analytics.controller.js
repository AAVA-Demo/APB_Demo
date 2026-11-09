(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.loading = true;
    vm.analyticsData = {};
    vm.dateRange = {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 11)),
      endDate: new Date()
    };
    function init() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      AnalyticsService.getSpendingInsights(vm.dateRange).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data.';
        vm.loading = false;
      });
    }
    init();
  }]);
})();