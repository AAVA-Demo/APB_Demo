(function() {
  'use strict';
  angular.module('analytics')
    .controller('AnalyticsController', ['AnalyticsService', 'AuthService', '$scope', '$filter', function(AnalyticsService, AuthService, $scope, $filter) {
      var vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.selectedMonth = null;
      var userId = AuthService.getUserId();
      var dateRange = {
        start: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        end: new Date()
      };
      AnalyticsService.getSpendingAnalytics(userId, dateRange)
        .then(function(data) {
          vm.analyticsData = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
      vm.filterByCategory = function(category) {
        vm.selectedCategory = category;
      };
      vm.filterByMonth = function(month) {
        vm.selectedMonth = month;
      };
    }]);
})();