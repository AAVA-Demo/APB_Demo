(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsController', ['AnalyticsService', 'AuthService', '$scope', function(AnalyticsService, AuthService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.analyticsData = null;
    vm.error = null;
    vm.dateRange = {start: null, end: null};
    vm.init = function() {
      var userId = AuthService.getUserId();
      var endDate = new Date();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      vm.dateRange = {start: startDate, end: endDate};
      vm.loadAnalytics(userId);
    };
    vm.loadAnalytics = function(userId) {
      vm.loading = true;
      AnalyticsService.getSpendingData(userId, vm.dateRange).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load analytics data';
        vm.loading = false;
      });
    };
    vm.refresh = function() {
      var userId = AuthService.getUserId();
      vm.loadAnalytics(userId);
    };
    vm.init();
  }]);
})();