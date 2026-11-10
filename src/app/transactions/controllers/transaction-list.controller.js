(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', ['$scope', 'TransactionService', function($scope, TransactionService) {
    const vm = this;
    vm.transactions = [];
    vm.selectedTransaction = null;
    vm.loading = true;
    vm.filter = {
      cardIds: [],
      startDate: new Date(new Date().setDate(new Date().getDate() - 90)),
      endDate: new Date(),
      minAmount: null,
      maxAmount: null
    };
    vm.init = function() {
      vm.loadTransactions();
    };
    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getTransactions(vm.filter).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.loading = false;
        console.error('Error loading transactions:', error);
        $scope.$apply();
      });
    };
    vm.selectTransaction = function(transaction) {
      vm.selectedTransaction = transaction;
    };
    vm.closeDetails = function() {
      vm.selectedTransaction = null;
    };
    vm.getCategoryColor = function(category) {
      const colors = {
        'Food & Dining': '#e74c3c',
        'Fuel': '#f39c12',
        'Shopping': '#9b59b6',
        'Travel': '#3498db',
        'Entertainment': '#1abc9c',
        'Utilities': '#34495e',
        'Healthcare': '#e67e22',
        'Education': '#16a085',
        'Miscellaneous': '#95a5a6'
      };
      return colors[category] || '#95a5a6';
    };
    vm.init();
  }]);
})();