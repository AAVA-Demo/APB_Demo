(function() {
  'use strict';
  angular.module('ccTransactionModule').controller('TransactionListController', ['$scope', '$filter', 'TransactionService', 'TransactionSyncService', function($scope, $filter, TransactionService, TransactionSyncService) {
    var vm = this;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.filter = {
      cardId: null,
      category: null,
      searchTerm: '',
      page: 1,
      pageSize: 10
    };
    vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    vm.init = function() {
      vm.loadTransactions();
      TransactionSyncService.startSync();
    };
    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getTransactions(vm.filter).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions';
        vm.loading = false;
      });
    };
    vm.updateFilter = function() {
      vm.filter.page = 1;
      vm.loadTransactions();
    };
    vm.clearFilter = function() {
      vm.filter = {
        cardId: null,
        category: null,
        searchTerm: '',
        page: 1,
        pageSize: 10
      };
      vm.loadTransactions();
    };
    $scope.$on('transaction:updated', function() {
      vm.loadTransactions();
    });
    $scope.$on('$destroy', function() {
      TransactionSyncService.stopSync();
    });
    vm.init();
  }]);
})();