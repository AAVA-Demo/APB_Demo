(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsController', ['$scope', 'TransactionService', 'CategorizationService', 'TrendAnalysisService', 'AuthService', function($scope, TransactionService, CategorizationService, TrendAnalysisService, AuthService) {
    const vm = this;
    vm.transactions = [];
    vm.categoryData = [];
    vm.trendData = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedCategory = null;
    vm.filteredTransactions = [];
    const userId = AuthService.getUserId();
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      TransactionService.getTransactions(userId, 12).then(function(transactions) {
        vm.transactions = transactions;
        vm.categoryData = CategorizationService.aggregateByCategory(transactions);
        vm.trendData = TrendAnalysisService.computeMonthlyTrends(transactions);
        vm.filteredTransactions = transactions;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    }
    loadAnalytics();
    vm.filterByCategory = function(category) {
      vm.selectedCategory = category;
      if (category) {
        vm.filteredTransactions = vm.transactions.filter(t => t.category === category);
      } else {
        vm.filteredTransactions = vm.transactions;
      }
    };
    vm.clearFilter = function() {
      vm.selectedCategory = null;
      vm.filteredTransactions = vm.transactions;
    };
    $scope.$on('category-selected', function(event, category) {
      vm.filterByCategory(category);
      $scope.$apply();
    });
  }]);
})();