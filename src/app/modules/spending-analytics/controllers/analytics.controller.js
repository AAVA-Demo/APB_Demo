(function() {
  'use strict';
  angular.module('spendingAnalytics').controller('AnalyticsController', ['AnalyticsService', 'CategoryService', '$scope', function(AnalyticsService, CategoryService, $scope) {
    const vm = this;
    vm.analytics = null;
    vm.loading = true;
    vm.error = null;
    vm.categories = CategoryService.getCategories();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    vm.startDate = startDate.toISOString().substring(0, 10);
    vm.endDate = endDate.toISOString().substring(0, 10);
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingAnalytics(vm.startDate, vm.endDate).then(data => {
        vm.analytics = data;
        vm.loading = false;
      }).catch(err => {
        vm.error = 'Failed to load analytics. Please try again.';
        vm.loading = false;
      });
    };
    vm.retry = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics();
  }]);
})();