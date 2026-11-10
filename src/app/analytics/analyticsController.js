(function() {
  'use strict';
  angular.module('creditCardApp').controller('AnalyticsController', ['$scope', '$filter', 'transactionDataService', 'analyticsEngineService', 'categoryService', function($scope, $filter, transactionDataService, analyticsEngineService, categoryService) {
    var vm = this;
    vm.loading = true;
    vm.analytics = null;
    vm.transactions = [];
    vm.error = null;
    vm.dateRange = {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
      endDate: new Date()
    };
    vm.searchText = '';
    vm.selectedCategory = '';
    vm.categories = categoryService.getCategories();
    vm.init = function() {
      vm.loading = true;
      var startDate = $filter('date')(vm.dateRange.startDate, 'yyyy-MM-dd');
      var endDate = $filter('date')(vm.dateRange.endDate, 'yyyy-MM-dd');
      transactionDataService.getTransactions(startDate, endDate).then(function(transactions) {
        vm.transactions = transactions;
        vm.analytics = analyticsEngineService.processTransactions(transactions);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    };
    vm.applyFilters = function() {
      vm.init();
    };
    vm.getFilteredTransactions = function() {
      var filtered = vm.transactions;
      if (vm.searchText) {
        filtered = $filter('filter')(filtered, vm.searchText);
      }
      if (vm.selectedCategory) {
        filtered = filtered.filter(function(txn) { return txn.category === vm.selectedCategory; });
      }
      return filtered;
    };
    vm.init();
  }]);
})();