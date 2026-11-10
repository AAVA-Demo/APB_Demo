(function() {
  'use strict';
  angular.module('transactionModule').controller('TransactionController', ['$scope', '$uibModal', '$timeout', 'TransactionService', 'PaginationFactory', function($scope, $uibModal, $timeout, TransactionService, PaginationFactory) {
    const vm = this;
    vm.transactions = [];
    vm.loading = true;
    vm.errorMessage = '';
    vm.filters = { cardId: '', searchTerm: '', dateRange: '' };
    vm.pagination = {};
    vm.currentPage = 1;
    let searchTimeout = null;
    vm.loadTransactions = function() {
      vm.loading = true;
      vm.errorMessage = '';
      TransactionService.getTransactions(vm.currentPage, vm.filters).then(function(data) {
        vm.transactions = data.transactions || [];
        vm.pagination = PaginationFactory.calculatePagination(data.totalCount, data.page, data.pageSize);
        vm.loading = false;
      }).catch(function(error) {
        vm.errorMessage = 'Failed to load transactions. Showing cached data.';
        TransactionService.getMockTransactions(vm.currentPage, vm.filters).then(function(mockData) {
          vm.transactions = mockData.transactions;
          vm.pagination = PaginationFactory.calculatePagination(mockData.totalCount, mockData.page, mockData.pageSize);
          vm.loading = false;
        });
      });
    };
    vm.onSearchChange = function() {
      if (searchTimeout) {
        $timeout.cancel(searchTimeout);
      }
      searchTimeout = $timeout(function() {
        vm.currentPage = 1;
        vm.loadTransactions();
      }, 300);
    };
    vm.onFilterChange = function() {
      vm.currentPage = 1;
      vm.loadTransactions();
    };
    vm.changePage = function(page) {
      vm.currentPage = page;
      vm.loadTransactions();
    };
    vm.openTransactionDetail = function(transaction) {
      $uibModal.open({
        templateUrl: 'src/app/transactions/transaction-detail.html',
        controller: 'TransactionDetailController',
        controllerAs: 'vm',
        resolve: {
          transaction: function() { return transaction; }
        }
      });
    };
    vm.loadTransactions();
  }]);
})();