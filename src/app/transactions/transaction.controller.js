(function() {
  'use strict';
  angular.module('app.transactions').controller('TransactionController', ['TransactionService', 'AuthService', '$scope', function(TransactionService, AuthService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.transactions = [];
    vm.paginatedData = null;
    vm.filter = {
      cardId: null,
      startDate: null,
      endDate: null,
      minAmount: null,
      maxAmount: null,
      searchText: '',
      category: null
    };
    vm.selectedTransaction = null;
    vm.init = function() {
      var userId = AuthService.getUserId();
      vm.loadTransactions(userId);
    };
    vm.loadTransactions = function(userId) {
      vm.loading = true;
      TransactionService.loadTransactions(userId, vm.filter).then(function(data) {
        vm.paginatedData = data;
        vm.transactions = data.transactions;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load transactions';
        vm.loading = false;
      });
    };
    vm.applyFilter = function() {
      var userId = AuthService.getUserId();
      TransactionService.filterTransactions(vm.filter).then(function(data) {
        vm.paginatedData = data;
        vm.transactions = data.transactions;
      });
    };
    vm.searchTransactions = function() {
      vm.applyFilter();
    };
    vm.viewDetail = function(transaction) {
      vm.selectedTransaction = transaction;
    };
    vm.closeDetail = function() {
      vm.selectedTransaction = null;
    };
    vm.init();
  }]);
})();