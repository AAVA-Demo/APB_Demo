(function() {
  'use strict';
  angular.module('analytics.module')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', function($scope, AnalyticsService) {
      const vm = this;
      vm.spendingData = null;
      vm.trendData = null;
      vm.loading = true;
      vm.error = null;
      vm.filters = {
        month: new Date().toISOString().substring(0, 7),
        fromMonth: '2024-07',
        toMonth: '2024-12'
      };
      vm.init = function() {
        vm.fetchSpendingData();
        vm.fetchTrendData();
      };
      vm.fetchSpendingData = function() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingInsights(vm.filters).then(function(data) {
          vm.spendingData = data;
          vm.loading = false;
          $scope.$broadcast('spendingDataUpdated', data);
        }).catch(function(err) {
          vm.error = 'Failed to load spending insights. Please try again.';
          vm.loading = false;
        });
      };
      vm.fetchTrendData = function() {
        AnalyticsService.getMonthlyTrends(vm.filters).then(function(data) {
          vm.trendData = data;
          $scope.$broadcast('trendDataUpdated', data);
        }).catch(function(err) {
          console.error('Failed to load trend data', err);
        });
      };
      vm.applyFilters = function() {
        vm.fetchSpendingData();
        vm.fetchTrendData();
      };
      vm.init();
    }]);
})();