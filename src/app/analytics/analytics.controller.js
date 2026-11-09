(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsDashboardController', ['AnalyticsService', 'TransactionCategorizerFactory', '$scope', '$filter', AnalyticsDashboardController]);
  function AnalyticsDashboardController(AnalyticsService, TransactionCategorizerFactory, $scope, $filter) {
    var vm = this;
    vm.transactions = [];
    vm.analyticsSummary = null;
    vm.loading = true;
    vm.error = false;
    vm.selectedCategories = [];
    vm.availableCategories = TransactionCategorizerFactory.getCategories();
    vm.filteredTransactions = [];
    vm.toggleCategory = toggleCategory;
    vm.isCategorySelected = isCategorySelected;
    vm.drillDown = drillDown;
    init();
    function init() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      vm.error = false;
      AnalyticsService.getTransactionData(null, 12).then(function(transactions) {
        vm.transactions = transactions;
        vm.analyticsSummary = AnalyticsService.getAnalyticsSummary(transactions);
        vm.filteredTransactions = transactions;
        vm.loading = false;
        $scope.$broadcast('analyticsDataLoaded', vm.analyticsSummary);
      }).catch(function() {
        vm.error = true;
        vm.loading = false;
      });
    }
    function toggleCategory(category) {
      var index = vm.selectedCategories.indexOf(category);
      if (index > -1) {
        vm.selectedCategories.splice(index, 1);
      } else {
        vm.selectedCategories.push(category);
      }
      applyFilters();
    }
    function isCategorySelected(category) {
      return vm.selectedCategories.indexOf(category) > -1;
    }
    function applyFilters() {
      if (vm.selectedCategories.length === 0) {
        vm.filteredTransactions = vm.transactions;
      } else {
        vm.filteredTransactions = vm.transactions.filter(function(txn) {
          return vm.selectedCategories.indexOf(txn.category) > -1;
        });
      }
      var filteredSummary = AnalyticsService.getAnalyticsSummary(vm.filteredTransactions);
      $scope.$broadcast('analyticsDataLoaded', filteredSummary);
    }
    function drillDown(category) {
      vm.selectedCategories = [category];
      applyFilters();
    }
  }
})();