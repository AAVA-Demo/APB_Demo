(function() {
  'use strict';
  angular.module('app.transactions').controller('TransactionListController', ['TransactionService', '$scope', '$stateParams', '$state', function(TransactionService, $scope, $stateParams, $state) {
    var vm = this;
    vm.loading = true;
    vm.transactions = [];
    vm.pagination = {};
    vm.currentPage = parseInt($stateParams.page) || 1;
    vm.pageSize = 50;
    vm.filters = {cardId: 'all'};
    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getTransactions(vm.currentPage, vm.pageSize, vm.filters).then(function(response) {
        vm.transactions = response.transactions;
        vm.pagination = response.pagination;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        vm.error = 'Failed to load transactions';
      });
    };
    vm.onPageChange = function(page) {
      vm.currentPage = page;
      $state.go('transactions', {page: page}, {notify: false});
      vm.loadTransactions();
    };
    vm.viewDetail = function(transactionId) {
      $state.go('transactionDetail', {transactionId: transactionId});
    };
    vm.loadTransactions();
  }]);
})();