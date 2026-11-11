(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'TransactionService', 'AnalyticsService', function($scope, $filter, TransactionService, AnalyticsService) {
      var vm = this;
      vm.transactions = [];
      vm.categoryData = [];
      vm.monthlyTrends = [];
      vm.loading = true;
      vm.error = null;
      vm.startDate = null;
      vm.endDate = null;
      vm.selectedCategory = null;
      vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      function loadTransactions() {
        vm.loading = true;
        vm.error = null;
        TransactionService.getTransactions(vm.startDate, vm.endDate, vm.selectedCategory)
          .then(function(transactions) {
            vm.transactions = transactions;
            vm.categoryData = AnalyticsService.aggregateByCategory(transactions);
            vm.monthlyTrends = AnalyticsService.aggregateByMonth(transactions);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction data. Please try again.';
            vm.loading = false;
          });
      }
      vm.applyFilters = function() {
        TransactionService.clearCache();
        loadTransactions();
      };
      vm.clearFilters = function() {
        vm.startDate = null;
        vm.endDate = null;
        vm.selectedCategory = null;
        vm.applyFilters();
      };
      vm.getFilteredTransactions = function() {
        return $filter('orderBy')(vm.transactions, '-transactionDate');
      };
      loadTransactions();
    }]);
})();