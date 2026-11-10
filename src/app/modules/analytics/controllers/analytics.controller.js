(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', 'DateRangeService', function($scope, $filter, AnalyticsService, DateRangeService) {
      var vm = this;
      vm.analyticsData = null;
      vm.filteredData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategories = [];
      vm.dateRange = DateRangeService.getLast12Months();
      function loadAnalytics() {
        vm.loading = true;
        AnalyticsService.getSpendingAnalytics(vm.dateRange)
          .then(function(data) {
            vm.analyticsData = data;
            vm.filteredData = data;
            vm.selectedCategories = data.categories.map(function(c) { return c.category; });
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
            $scope.$apply();
          });
      }
      vm.filterByCategory = function(selectedCategories) {
        if (!vm.analyticsData) return;
        vm.filteredData = {
          categories: vm.analyticsData.categories.filter(function(c) {
            return selectedCategories.indexOf(c.category) !== -1;
          }),
          monthlyTrends: vm.analyticsData.monthlyTrends,
          dateRange: vm.analyticsData.dateRange
        };
      };
      loadAnalytics();
    }]);
})();