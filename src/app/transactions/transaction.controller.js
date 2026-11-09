(function() {
  'use strict';
  angular.module('app.transactions').controller('TransactionController', ['TransactionService', 'CardDataService', '$scope', '$location', function(TransactionService, CardDataService, $scope, $location) {
    var vm = this;
    vm.transactions = [];
    vm.cards = [];
    vm.loading = true;
    vm.filters = {};
    vm.currentPage = 1;
    vm.applyFilter = applyFilter;
    vm.viewDetail = viewDetail;
    function init() {
      CardDataService.getAllCards().then(function(cards) {
        vm.cards = cards;
        return loadTransactions();
      }).catch(function(error) {
        vm.error = 'Failed to load transactions.';
        vm.loading = false;
      });
    }
    function loadTransactions() {
      vm.loading = true;
      TransactionService.getTransactions(vm.filters, vm.currentPage).then(function(data) {
        vm.transactions = data.map(function(txn) {
          var card = vm.cards.find(function(c) { return c.cardId === txn.cardId; });
          txn.cardName = card ? card.cardType : 'Unknown';
          return txn;
        });
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load transactions.';
        vm.loading = false;
      });
    }
    function applyFilter() {
      vm.currentPage = 1;
      loadTransactions();
    }
    function viewDetail(transactionId) {
      $location.path('/transactions/' + transactionId);
    }
    init();
  }]);
})();