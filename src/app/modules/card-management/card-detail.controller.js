(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', ['CardService', 'TransactionService', '$stateParams', function(CardService, TransactionService, $stateParams) {
      const vm = this;
      vm.card = null;
      vm.spending = null;
      vm.loading = true;
      vm.cardId = $stateParams.cardId;
      vm.loadCardDetails = function() {
        CardService.getCardDetails(vm.cardId).then(function(cardData) {
          vm.card = cardData;
          return TransactionService.getCardSpending(vm.cardId);
        }).then(function(spendingData) {
          vm.spending = spendingData;
          vm.loading = false;
        }).catch(function(error) {
          console.error('Error loading card details:', error);
          vm.loading = false;
        });
      };
      vm.loadCardDetails();
    }]);
})();