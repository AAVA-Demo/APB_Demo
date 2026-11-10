(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['AnalyticsService', '$scope', '$filter', function(AnalyticsService, $scope, $filter) {
    var vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.periodMonths = 12;
    vm.selectedCategory = null;
    vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    vm.loadAnalytics = function() {
      vm.loading = true;
      vm.error = null;
      AnalyticsService.getSpendingInsights(vm.periodMonths).then(function(data) {
        vm.analyticsData = data;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    };
    vm.applyFilter = function() {
      vm.loadAnalytics();
    };
    vm.loadAnalytics();
  }]);
})();