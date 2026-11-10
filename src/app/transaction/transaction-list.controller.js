(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', TransactionListController);
  TransactionListController.$inject = ['TransactionService', '$scope', '$state'];
  function TransactionListController(TransactionService, $scope, $state) {
    var vm = this;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.pageNumber = 1;
    vm.pageSize = 20;
    vm.totalCount = 0;
    vm.selectTransaction = selectTransaction;
    vm.loadMore = loadMore;
    activate();
    function activate() {
      loadTransactions();
    }
    function loadTransactions() {
      vm.loading = true;
      TransactionService.getTransactions(vm.pageNumber, vm.pageSize).then(function(response) {
        vm.transactions = vm.transactions.concat(response.transactions);
        vm.totalCount = response.totalCount;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions';
        vm.loading = false;
      });
    }
    function selectTransaction(transactionId) {
      $state.go('transactionDetail', { id: transactionId });
    }
    function loadMore() {
      vm.pageNumber++;
      loadTransactions();
    }
  }
})();