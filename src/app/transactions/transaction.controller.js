(function() {
  'use strict';
  angular.module('app.transactions')
    .controller('TransactionController', ['$scope', '$state', '$stateParams', '$timeout', 'TransactionService', 'TransactionFilterFactory', 'AuthService', function($scope, $state, $stateParams, $timeout, TransactionService, TransactionFilterFactory, AuthService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.transactions = [];
      vm.selectedTransaction = null;
      vm.filters = TransactionFilterFactory.getFilters();
      vm.searchTerm = '';
      vm.currentPage = 1;
      vm.pageSize = 20;
      vm.totalCount = 0;
      var searchTimeout;
      vm.loadTransactions = function() {
        vm.loading = true;
        vm.error = null;
        var userId = AuthService.getUserId();
        TransactionService.getTransactions(userId, vm.filters, vm.currentPage, vm.pageSize)
          .then(function(response) {
            vm.transactions = response.transactions;
            vm.totalCount = response.totalCount;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transactions';
            vm.loading = false;
            console.error(error);
          });
      };
      vm.applyFilters = function() {
        TransactionFilterFactory.setFilters(vm.filters);
        vm.currentPage = 1;
        vm.loadTransactions();
      };
      vm.onSearchChange = function() {
        if (searchTimeout) {
          $timeout.cancel(searchTimeout);
        }
        searchTimeout = $timeout(function() {
          vm.filters.searchTerm = vm.searchTerm;
          vm.applyFilters();
        }, 500);
      };
      vm.viewDetail = function(transactionId) {
        $state.go('transactionDetail', { transactionId: transactionId });
      };
      vm.loadTransactionDetail = function(transactionId) {
        vm.loading = true;
        TransactionService.getTransactionDetail(transactionId)
          .then(function(transaction) {
            vm.selectedTransaction = transaction;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load transaction detail';
            vm.loading = false;
            console.error(error);
          });
      };
      if ($stateParams.transactionId) {
        vm.loadTransactionDetail($stateParams.transactionId);
      } else {
        vm.loadTransactions();
      }
    }]);
})();