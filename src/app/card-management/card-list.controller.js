(function() {
  'use strict';
  angular.module('app.cardManagement').controller('CardListController', ['$state', 'CardManagementService', 'AuthService', function($state, CardManagementService, AuthService) {
    const vm = this;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    vm.selectedCard = null;
    const userId = AuthService.getUserId();
    function loadCards() {
      vm.loading = true;
      vm.error = null;
      CardManagementService.getAllCards(userId).then(function(cards) {
        vm.cards = cards;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load credit cards. Please try again.';
        vm.loading = false;
      });
    }
    loadCards();
    vm.selectCard = function(card) {
      vm.selectedCard = card;
      $state.go('cardDetail', {cardId: card.cardId});
    };
    vm.getCardIcon = function(cardType) {
      const icons = {
        'Visa': 'glyphicon-credit-card',
        'MasterCard': 'glyphicon-credit-card',
        'Amex': 'glyphicon-credit-card'
      };
      return icons[cardType] || 'glyphicon-credit-card';
    };
  }]);
})();