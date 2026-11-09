(function() {
  'use strict';
  angular.module('creditcard.transactions')
    .controller('TransactionController', ['TransactionService', '$scope', '$filter', TransactionController]);
  function TransactionController(TransactionService, $scope, $filter) {
    var vm = this;
    vm.transactions = [];
    vm.filteredTransactions = [];
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.filter = {
      cardId: '',
      startDate: null,
      endDate: null,
      category: ''
    };
    vm.applyFilter = applyFilter;
    vm.clearFilter = clearFilter;
    activate();
    function activate() {
      loadTransactions();
    }
    function loadTransactions() {
      vm.loading = true;
      vm.error = null;
      TransactionService.getTransactions()
        .then(function(data) {
          vm.transactions = data;
          vm.filteredTransactions = data;
          extractCards(data);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load transactions. Please try again.';
          vm.loading = false;
        });
    }
    function extractCards(transactions) {
      var cardMap = {};
      transactions.forEach(function(t) {
        if (!cardMap[t.cardId]) {
          cardMap[t.cardId] = true;
        }
      });
      vm.cards = Object.keys(cardMap);
    }
    function applyFilter() {
      vm.filteredTransactions = TransactionService.applyFilter(vm.transactions, vm.filter);
    }
    function clearFilter() {
      vm.filter = {
        cardId: '',
        startDate: null,
        endDate: null,
        category: ''
      };
      vm.filteredTransactions = vm.transactions;
    }
  }
})();