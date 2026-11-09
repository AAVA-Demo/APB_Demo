(function() {
  'use strict';
  angular.module('creditCard.analytics').controller('AnalyticsController', ['$scope', '$filter', 'AnalyticsService', function($scope, $filter, AnalyticsService) {
    var vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.selectedCategory = null;
    vm.dateRange = {start: new Date('2026-09-01'), end: new Date('2026-11-30')};
    vm.init = function() {
      AnalyticsService.loadAnalytics(vm.dateRange).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
        $scope.$apply();
      }, function(error) {
        vm.error = 'Failed to load analytics data';
        vm.loading = false;
        $scope.$apply();
      });
    };
    vm.onCategoryClick = function(category) {
      vm.selectedCategory = category;
    };
    vm.clearSelection = function() {
      vm.selectedCategory = null;
    };
    vm.init();
  }]);
})();