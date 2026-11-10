(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['$scope', 'TransactionDataService', 'AnalyticsEngineFactory', function($scope, TransactionDataService, AnalyticsEngineFactory) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.transactions = [];
      vm.analyticsSummary = null;
      vm.selectedCategories = [];
      vm.dateRange = {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
      };
      vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      vm.init = function() {
        vm.selectedCategories = vm.categories.slice();
        vm.loadTransactions();
      };
      vm.loadTransactions = function() {
        vm.loading = true;
        vm.error = null;
        TransactionDataService.getTransactions(vm.dateRange, vm.selectedCategories)
          .then(function(transactions) {
            vm.transactions = transactions;
            vm.analyticsSummary = AnalyticsEngineFactory.aggregateByCategory(transactions);
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data. Please try again.';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.filterChanged = function(categories) {
        vm.selectedCategories = categories;
        vm.loadTransactions();
      };
      vm.drillDown = function(category) {
        vm.selectedCategories = [category];
        vm.loadTransactions();
      };
      vm.init();
    }]);
})();