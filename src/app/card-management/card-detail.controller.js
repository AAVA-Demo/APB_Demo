(function() {
  'use strict';
  angular.module('creditCardManagementModule').controller('CardDetailController', ['CardManagementService', 'TransactionService', '$routeParams', '$scope', function(CardManagementService, TransactionService, $routeParams, $scope) {
    var vm = this;
    vm.card = null;
    vm.spending = null;
    vm.transactions = [];
    vm.loading = true;
    vm.error = null;
    vm.loadCardDetail = function() {
      vm.loading = true;
      vm.error = null;
      var cardId = $routeParams.cardId;
      CardManagementService.getCardById(cardId).then(function(card) {
        vm.card = card;
        return TransactionService.getCardSpending(cardId);
      }).then(function(spending) {
        vm.spending = spending;
        return TransactionService.getCardTransactions($routeParams.cardId);
      }).then(function(transactions) {
        vm.transactions = transactions;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load card details. Please try again.';
        vm.loading = false;
      });
    };
    vm.loadCardDetail();
  }]);
})();