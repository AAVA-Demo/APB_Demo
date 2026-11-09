(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionsController', ['$scope', 'TransactionService', 'CategoryAnalyticsService', function($scope, TransactionService, CategoryAnalyticsService) {
      const vm = this;
      vm.loading = true;
      vm.error = null;
      vm.transactions = [];
      vm.filteredTransactions = [];
      vm.categoryData = [];
      vm.selectedCategory = 'All';
      vm.categories = ['All', 'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      vm.currentPage = 1;
      vm.pageSize = 20;
      vm.init = function() {
        const promises = [
          TransactionService.getTransactions(),
          CategoryAnalyticsService.getCategorySpending()
        ];
        Promise.all(promises)
          .then(function(results) {
            vm.transactions = results[0];
            vm.categoryData = results[1];
            vm.filteredTransactions = vm.transactions;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction data. Please try again.';
            vm.loading = false;
            console.error('Error loading transactions:', error);
            $scope.$apply();
          });
      };
      vm.filterByCategory = function(category) {
        vm.selectedCategory = category;
        if (category === 'All') {
          vm.filteredTransactions = vm.transactions;
        } else {
          vm.filteredTransactions = vm.transactions.filter(function(txn) {
            return txn.category === category;
          });
        }
        vm.currentPage = 1;
      };
      vm.formatCurrency = function(amount) {
        return '$' + (amount || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      };
      vm.formatDate = function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      };
      vm.getPaginatedTransactions = function() {
        const start = (vm.currentPage - 1) * vm.pageSize;
        const end = start + vm.pageSize;
        return vm.filteredTransactions.slice(start, end);
      };
      vm.getTotalPages = function() {
        return Math.ceil(vm.filteredTransactions.length / vm.pageSize);
      };
      vm.nextPage = function() {
        if (vm.currentPage < vm.getTotalPages()) {
          vm.currentPage++;
        }
      };
      vm.prevPage = function() {
        if (vm.currentPage > 1) {
          vm.currentPage--;
        }
      };
      vm.init();
    }]);
})();