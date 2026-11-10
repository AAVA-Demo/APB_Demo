(function() {
  'use strict';
  angular.module('creditCard.analyticsModule').controller('AnalyticsController', ['$scope', 'AnalyticsService', 'DataAggregationService', function($scope, AnalyticsService, DataAggregationService) {
    const vm = this;
    vm.transactions = [];
    vm.monthlyTrends = [];
    vm.categoryTotals = [];
    vm.isLoading = true;
    vm.error = null;
    vm.activeTab = 'trends';
    vm.selectedCategory = null;
    
    function loadAnalytics() {
      vm.isLoading = true;
      vm.error = null;
      
      AnalyticsService.getTransactions(12).then(function(transactions) {
        vm.transactions = transactions;
        const aggregated = DataAggregationService.categorizeAndAggregate(transactions);
        vm.monthlyTrends = aggregated.monthlyTrends;
        vm.categoryTotals = aggregated.categoryTotals;
        vm.isLoading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.isLoading = false;
      });
    }
    
    vm.setTab = function(tab) {
      vm.activeTab = tab;
    };
    
    vm.filterByCategory = function(category) {
      vm.selectedCategory = category;
      const filtered = DataAggregationService.filterByCategory(vm.transactions, category);
      const aggregated = DataAggregationService.categorizeAndAggregate(filtered);
      vm.monthlyTrends = aggregated.monthlyTrends;
    };
    
    vm.clearFilter = function() {
      vm.selectedCategory = null;
      const aggregated = DataAggregationService.categorizeAndAggregate(vm.transactions);
      vm.monthlyTrends = aggregated.monthlyTrends;
      vm.categoryTotals = aggregated.categoryTotals;
    };
    
    vm.refresh = function() {
      AnalyticsService.clearCache();
      loadAnalytics();
    };
    
    vm.init = function() {
      loadAnalytics();
    };
    
    vm.init();
  }]);
})();