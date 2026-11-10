(function() {
  'use strict';
  angular.module('creditCard.transactions').controller('TransactionController', ['TransactionService', 'CreditCardService', '$scope', '$routeParams', '$location', function(TransactionService, CreditCardService, $scope, $routeParams, $location) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.transactions = [];
    vm.filteredTransactions = [];
    vm.searchTerm = '';
    vm.selectedTransaction = null;
    vm.sortColumn = 'date';
    vm.sortReverse = true;
    vm.init = function() {
      if ($routeParams.transactionId) {
        vm.loadTransactionDetail($routeParams.transactionId);
      } else {
        vm.loadTransactions();
      }
    };
    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getMockTransactions().then(function(data) {
        vm.transactions = data;
        vm.filteredTransactions = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions. Please try again.';
        vm.loading = false;
      });
    };
    vm.loadTransactionDetail = function(transactionId) {
      vm.loading = true;
      TransactionService.getMockTransactions().then(function(data) {
        vm.selectedTransaction = data.find(function(txn) {
          return txn.transactionId === transactionId;
        });
        if (!vm.selectedTransaction) {
          vm.error = 'Transaction not found.';
        }
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transaction details.';
        vm.loading = false;
      });
    };
    vm.viewDetail = function(transaction) {
      $location.path('/transactions/' + transaction.transactionId);
    };
    vm.backToList = function() {
      $location.path('/transactions');
    };
    vm.applySearch = function() {
      if (!vm.searchTerm) {
        vm.filteredTransactions = vm.transactions;
        return;
      }
      var term = vm.searchTerm.toLowerCase();
      vm.filteredTransactions = vm.transactions.filter(function(txn) {
        return (txn.merchant && txn.merchant.toLowerCase().indexOf(term) !== -1) ||
               (txn.category && txn.category.toLowerCase().indexOf(term) !== -1) ||
               (txn.description && txn.description.toLowerCase().indexOf(term) !== -1) ||
               (txn.amount && txn.amount.toString().indexOf(term) !== -1);
      });
    };
    vm.sortBy = function(column) {
      if (vm.sortColumn === column) {
        vm.sortReverse = !vm.sortReverse;
      } else {
        vm.sortColumn = column;
        vm.sortReverse = false;
      }
    };
    vm.formatCurrency = function(amount) {
      return '₹' + (amount || 0).toLocaleString('en-IN');
    };
    vm.formatDate = function(date) {
      return new Date(date).toLocaleDateString('en-IN');
    };
    $scope.$watch('vm.searchTerm', function() {
      vm.applySearch();
    });
    vm.init();
  }]);
})();