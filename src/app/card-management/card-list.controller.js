(function() {
  'use strict';
  angular.module('creditCardApp').controller('CardListController', ['CreditCardApiService', 'TransactionService', '$scope', function(CreditCardApiService, TransactionService, $scope) {
    const vm = this;
    vm.cards = [];
    vm.transactions = [];
    vm.selectedCard = null;
    vm.loading = true;
    vm.init = function() {
      CreditCardApiService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      });
      TransactionService.getTransactions().then(function(transactions) {
        vm.transactions = transactions;
      });
    };
    vm.selectCard = function(card) {
      vm.selectedCard = card;
      TransactionService.getTransactions(card.cardId).then(function(transactions) {
        vm.transactions = transactions;
      });
    };
    vm.init();
  }]);
})();