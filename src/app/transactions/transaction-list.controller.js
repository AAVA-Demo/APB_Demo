(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionListController', ['$scope', '$timeout', 'TransactionService', 'CreditCardService', TransactionListController]);
  function TransactionListController($scope, $timeout, TransactionService, CreditCardService) {
    var vm = this;
    vm.transactions = [];
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.pagination = { currentPage: 1, pageSize: 20, totalRecords: 0, totalPages: 0 };
    vm.filterCriteria = { startDate: null, endDate: null, cardIds: [], merchant: '', minAmount: null, maxAmount: null };
    var filterTimeout;
    vm.init = function() {
      CreditCardService.getCreditCards().then(function(cards) {
        vm.cards = cards;
        vm.loadTransactions();
      });
    };
    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getTransactions(vm.filterCriteria, vm.pagination).then(function(result) {
        vm.transactions = result.transactions;
        vm.pagination.totalRecords = result.totalCount;
        vm.pagination.totalPages = Math.ceil(result.totalCount / vm.pagination.pageSize);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions.';
        vm.loading = false;
      });
    };
    vm.applyFilter = function() {
      if (filterTimeout) $timeout.cancel(filterTimeout);
      filterTimeout = $timeout(function() {
        vm.pagination.currentPage = 1;
        vm.loadTransactions();
      }, 300);
    };
    vm.changePage = function(page) {
      if (page < 1 || page > vm.pagination.totalPages) return;
      vm.pagination.currentPage = page;
      vm.loadTransactions();
    };
    vm.init();
  }
})();