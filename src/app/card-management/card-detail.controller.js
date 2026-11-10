(function() {
  'use strict';
  angular.module('app.cardManagement')
    .controller('CardDetailController', CardDetailController);
  CardDetailController.$inject = ['CardService', '$scope', '$stateParams', '$state'];
  function CardDetailController(CardService, $scope, $stateParams, $state) {
    var vm = this;
    vm.card = null;
    vm.spendAnalysis = null;
    vm.loading = true;
    vm.error = null;
    vm.goBack = goBack;
    activate();
    function activate() {
      var cardId = $stateParams.cardId;
      if (!cardId) {
        vm.error = 'Invalid card ID';
        vm.loading = false;
        return;
      }
      CardService.getCardDetails(cardId)
        .then(function(card) {
          vm.card = card;
          return CardService.getCardSpend(cardId);
        })
        .then(function(spend) {
          vm.spendAnalysis = spend;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
    }
    function goBack() {
      $state.go('cardList');
    }
  }
})();