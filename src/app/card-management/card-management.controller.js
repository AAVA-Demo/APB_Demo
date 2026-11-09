(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardManagementController', ['CardManagementService', '$scope', '$state', '$stateParams', CardManagementController]);
  function CardManagementController(CardManagementService, $scope, $state, $stateParams) {
    var vm = this;
    vm.cards = [];
    vm.selectedCard = null;
    vm.cardDetails = null;
    vm.spendSummary = null;
    vm.loading = true;
    vm.error = false;
    vm.selectCard = selectCard;
    vm.backToList = backToList;
    init();
    function init() {
      loadCards();
      if ($stateParams.cardId) {
        loadCardDetails($stateParams.cardId);
      }
    }
    function loadCards() {
      vm.loading = true;
      vm.error = false;
      CardManagementService.getAllCards().then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      }).catch(function() {
        vm.error = true;
        vm.loading = false;
      });
    }
    function selectCard(card) {
      vm.selectedCard = card;
      $state.go('cardDetails', { cardId: card.cardId });
    }
    function loadCardDetails(cardId) {
      vm.loading = true;
      CardManagementService.getCardDetails(cardId).then(function(card) {
        vm.cardDetails = card;
        vm.selectedCard = card;
        return CardManagementService.getCardSpendSummary(cardId);
      }).then(function(summary) {
        vm.spendSummary = summary;
        vm.loading = false;
      }).catch(function() {
        vm.error = true;
        vm.loading = false;
      });
    }
    function backToList() {
      vm.selectedCard = null;
      vm.cardDetails = null;
      vm.spendSummary = null;
      $state.go('cards');
    }
  }
})();