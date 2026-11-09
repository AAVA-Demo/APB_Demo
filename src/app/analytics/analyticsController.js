(function() {
  'use strict';
  angular.module('creditCardApp').controller('analyticsController', ['transactionDataService', 'categorizationService', 'analyticsEngineService', '$scope', '$filter', function(transactionDataService, categorizationService, analyticsEngineService, $scope, $filter) {
    const vm = this;
    vm.analyticsData = null;
    vm.loading = true;
    vm.error = null;
    vm.rawTransactions = [];
    vm.filters = {
      startDate: null,
      endDate: null,
      category: 'All'
    };
    vm.categories = ['All', 'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    vm.init = function() {
      loadAnalyticsData();
    };
    function loadAnalyticsData() {
      vm.loading = true;
      vm.error = null;
      transactionDataService.getTransactions(12).then(function(transactions) {
        vm.rawTransactions = categorizationService.categorizeTransactions(transactions);
        vm.analyticsData = analyticsEngineService.computeAnalytics(vm.rawTransactions);
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        console.error('Error loading analytics data:', error);
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
        $scope.$apply();
      });
    }
    vm.applyFilters = function() {
      if (vm.rawTransactions.length > 0) {
        vm.analyticsData = analyticsEngineService.recomputeAnalytics(vm.rawTransactions, vm.filters);
      }
    };
    vm.resetFilters = function() {
      vm.filters = {
        startDate: null,
        endDate: null,
        category: 'All'
      };
      vm.applyFilters();
    };
    vm.init();
  }]);
})();