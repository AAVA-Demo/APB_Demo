(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', function(AnalyticsService, $scope) {
      const vm = this;
      vm.analyticsData = {};
      vm.loading = true;
      vm.error = null;
      vm.timeRange = {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        endDate: new Date()
      };

      vm.loadAnalytics = function() {
        vm.loading = true;
        const userId = 'user123';
        AnalyticsService.getSpendingAnalytics(userId, vm.timeRange)
          .then(function(data) {
            vm.analyticsData = data;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            console.error('Analytics load error:', error);
          });
      };

      vm.updateTimeRange = function(months) {
        vm.timeRange.startDate = new Date(new Date().setMonth(new Date().getMonth() - months));
        vm.timeRange.endDate = new Date();
        vm.loadAnalytics();
      };

      vm.loadAnalytics();
    }]);
})();