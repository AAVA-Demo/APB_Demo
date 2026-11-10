(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['$scope', '$timeout', 'TransactionDataService', 'CategoryClassificationService', 'AnalyticsAggregationService', function($scope, $timeout, TransactionDataService, CategoryClassificationService, AnalyticsAggregationService) {
    var vm = this;
    vm.loading = true;
    vm.transactions = [];
    vm.categoryData = [];
    vm.cardData = [];
    vm.monthlyData = [];
    vm.selectedCategories = [];
    vm.categories = CategoryClassificationService.getCategories();
    vm.error = null;
    var loadStartTime = Date.now();
    TransactionDataService.getHistoricalTransactions().then(function(transactions) {
      return CategoryClassificationService.ensureCategorization(transactions);
    }).then(function(categorizedTransactions) {
      vm.transactions = categorizedTransactions;
      vm.categoryData = AnalyticsAggregationService.aggregateByCategory(categorizedTransactions);
      vm.cardData = AnalyticsAggregationService.aggregateByCard(categorizedTransactions);
      vm.monthlyData = AnalyticsAggregationService.aggregateByMonth(categorizedTransactions);
      vm.loading = false;
      var loadTime = Date.now() - loadStartTime;
      if (loadTime > 1500) {
        console.warn('Analytics load time exceeded 1.5 seconds: ' + loadTime + 'ms');
      }
    }).catch(function(error) {
      vm.error = 'Failed to load analytics data. Please try again.';
      vm.loading = false;
    });
    vm.applyFilter = function() {
      var filterStartTime = Date.now();
      var filtered = vm.transactions;
      if (vm.selectedCategories.length > 0) {
        filtered = filtered.filter(function(txn) {
          return vm.selectedCategories.indexOf(txn.category) !== -1;
        });
      }
      vm.categoryData = AnalyticsAggregationService.aggregateByCategory(filtered);
      vm.cardData = AnalyticsAggregationService.aggregateByCard(filtered);
      vm.monthlyData = AnalyticsAggregationService.aggregateByMonth(filtered);
      var filterTime = Date.now() - filterStartTime;
      if (filterTime > 1500) {
        console.warn('Filter operation exceeded 1.5 seconds: ' + filterTime + 'ms');
      }
    };
  }]);
})();