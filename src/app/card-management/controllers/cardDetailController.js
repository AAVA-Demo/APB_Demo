(function() {
  'use strict';
  angular.module('cardManagementModule').controller('CardDetailController', ['$scope', '$routeParams', 'CreditCardService', 'TransactionService', function($scope, $routeParams, CreditCardService, TransactionService) {
    var vm = this;
    vm.card = null;
    vm.spendData = null;
    vm.loading = true;
    vm.error = null;
    var cardId = $routeParams.cardId;
    function loadCardDetails() {
      vm.loading = true;
      vm.error = null;
      CreditCardService.getCardDetails([cardId])
        .then(function(cards) {
          if (cards && cards.length > 0) {
            vm.card = cards[0];
            return TransactionService.getCardWiseSpending(cardId);
          } else {
            throw new Error('Card not found');
          }
        })
        .then(function(spendData) {
          vm.spendData = spendData;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
    }
    loadCardDetails();
  }]);
})();