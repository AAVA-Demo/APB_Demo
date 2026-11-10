(function() {
  'use strict';
  angular.module('analytics')
    .controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
      var vm = this;
      vm.categorySpending = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        AnalyticsService.getSpendingInsights('user123', {months: 12}).then(function(insights) {
          vm.categorySpending = insights.categorySpending;
          vm.monthlyTrends = insights.monthlyTrends;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
      };
      vm.init();
    }]);
})();