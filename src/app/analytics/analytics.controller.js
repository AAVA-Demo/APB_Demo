(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['TransactionDataFactory', 'CategoryClassificationService', function(TransactionDataFactory, CategoryClassificationService) {
      const vm = this;
      vm.categoryData = [];
      vm.transactions = [];
      vm.loading = true;
      vm.selectedCategory = null;
      vm.filterByCategory = function(category) {
        vm.selectedCategory = category === vm.selectedCategory ? null : category;
      };
      vm.getFilteredTransactions = function() {
        if (!vm.selectedCategory) return vm.transactions;
        return vm.transactions.filter(t => t.category === vm.selectedCategory);
      };
      TransactionDataFactory.getTransactions().then(function(transactions) {
        vm.transactions = transactions;
        vm.categoryData = CategoryClassificationService.groupByCategory(transactions);
        vm.loading = false;
      }).catch(function(error) {
        console.error('Error loading transactions:', error);
        vm.loading = false;
      });
    }]);
})();