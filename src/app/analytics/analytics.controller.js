(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['$scope', 'AnalyticsService', 'FilterFactory', function($scope, AnalyticsService, FilterFactory) {
    const vm = this;
    vm.analyticsData = { categoryBreakdown: [], monthlyTrends: [], cardWiseSpend: [] };
    vm.filters = FilterFactory.getDefaultFilters();
    vm.loading = true;
    vm.errorMessage = '';
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.errorMessage = '';
      AnalyticsService.getSpendingData(vm.filters).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.errorMessage = 'Failed to load analytics. Showing sample data.';
        AnalyticsService.getMockAnalytics().then(function(mockData) {
          vm.analyticsData = mockData;
          vm.loading = false;
        });
      });
    };
    vm.applyFilters = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics();
  }]);
})();