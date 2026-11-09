(function() {
  'use strict';
  angular.module('spendingAnalytics')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', AnalyticsController]);
  function AnalyticsController($scope, AnalyticsService) {
    var vm = this;
    vm.categorySpending = [];
    vm.monthlyTrends = [];
    vm.loading = true;
    vm.error = null;
    vm.init = function() {
      vm.loading = true;
      AnalyticsService.getSpendingAnalytics()
        .then(function(analyticsData) {
          vm.categorySpending = analyticsData.categorySpending;
          vm.monthlyTrends = analyticsData.monthlyTrends;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    };
    vm.init();
  }
})();