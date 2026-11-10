(function() {
  'use strict';
  angular.module('app.analytics').controller('AnalyticsController', ['$scope', 'TransactionDataService', 'CategorizationService', 'AnalyticsService', function($scope, TransactionDataService, CategorizationService, AnalyticsService) {
    var vm = this;
    vm.categorySpend = [];
    vm.monthlyTrends = [];
    vm.selectedCategory = null;
    vm.filteredTransactions = [];
    vm.loading = true;
    vm.error = null;

    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      var last12Months = new Date();
      last12Months.setMonth(last12Months.getMonth() - 12);
      TransactionDataService.getTransactions(userId, last12Months).then(function(transactions) {
        return CategorizationService.categorize(transactions);
      }).then(function(categorizedTransactions) {
        vm.transactions = categorizedTransactions;
        vm.categorySpend = AnalyticsService.aggregateByCategory(categorizedTransactions);
        vm.monthlyTrends = AnalyticsService.calculateMonthlyTrends(categorizedTransactions);
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
        $scope.$apply();
      });
    }

    vm.onCategoryClick = function(category) {
      vm.selectedCategory = category;
      vm.filteredTransactions = vm.transactions.filter(function(t) {
        return t.category === category;
      });
    };

    vm.clearCategoryFilter = function() {
      vm.selectedCategory = null;
      vm.filteredTransactions = [];
    };

    vm.$onInit = function() {
      loadAnalytics();
    };
  }]);
})();