(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .controller('AnalyticsController', ['TransactionService', 'CategoryService', 'AnalyticsDataService', '$scope', AnalyticsController]);
  function AnalyticsController(TransactionService, CategoryService, AnalyticsDataService, $scope) {
    const vm = this;
    vm.transactions = [];
    vm.categorySummaries = [];
    vm.monthlyTrends = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedCategory = null;
    vm.filterByCategory = filterByCategory;
    vm.clearFilter = clearFilter;
    init();
    function init() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      TransactionService.fetchTransactions(12)
        .then(function(transactions) {
          vm.transactions = transactions;
          const categorized = CategoryService.classifyTransactions(transactions);
          vm.categorySummaries = AnalyticsDataService.aggregateByCategory(categorized);
          vm.monthlyTrends = AnalyticsDataService.calculateMonthlyTrends(categorized);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data.';
          vm.loading = false;
        });
    }
    function filterByCategory(category) {
      vm.selectedCategory = category;
      const filtered = vm.transactions.filter(function(t) { return t.category === category; });
      vm.categorySummaries = AnalyticsDataService.aggregateByCategory(filtered);
    }
    function clearFilter() {
      vm.selectedCategory = null;
      loadAnalytics();
    }
  }
})();