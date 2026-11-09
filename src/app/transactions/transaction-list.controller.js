(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', ['TransactionService', '$scope', '$location', function(TransactionService, $scope, $location) {
    const vm = this;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.filters = {
      startDate: null,
      endDate: null,
      cardIds: [],
      merchants: [],
      categories: [],
      minAmount: null,
      maxAmount: null
    };
    vm.currentPage = 1;
    vm.itemsPerPage = 20;
    function loadTransactions() {
      vm.loading = true;
      TransactionService.getTransactions(vm.filters).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions';
        vm.loading = false;
      });
    }
    vm.applyFilters = function() {
      loadTransactions();
    };
    vm.viewTransactionDetail = function(transactionId) {
      $location.path('/transactions/' + transactionId);
    };
    loadTransactions();
  }]);
})();