(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', 'CategorizationService', function($scope, $filter, AnalyticsService, CategorizationService) {
      const vm = this;
      vm.analytics = {};
      vm.loading = true;
      vm.error = null;
      vm.activeView = 'category';
      vm.dateRange = {
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        endDate: new Date()
      };
      function loadAnalytics() {
        vm.loading = true;
        AnalyticsService.getSpendingAnalytics(vm.dateRange).then(function(data) {
          vm.analytics = data;
          vm.categoryChartData = data.categorySpending;
          vm.trendChartData = data.monthlyTrends;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load analytics data';
          vm.loading = false;
        });
      }
      loadAnalytics();
      vm.setView = function(view) {
        vm.activeView = view;
      };
      vm.refresh = function() {
        loadAnalytics();
      };
    }]);
})();